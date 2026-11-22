import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import "./content-studio.css";
import { BlockEditor, type ContentBlock } from "./BlockEditor";
import { DraftPreview } from "./DraftPreview";

type User = { id: string; username: string; role: "admin" | "staff" };
type Entry = {
  id: string;
  groupId?: string;
  type: string;
  title: string;
  summary: string;
  language: string;
  topic: string;
  status: string;
  updatedAt: string;
  owner: string;
  ownerId?: string;
  revision?: number;
  body?: string;
  reviewNote?: string;
  imported?: boolean;
  hasPublished?: boolean;
  details?: Record<string, string>;
  blocks?: ContentBlock[];
};
type Staff = {
  id: string;
  username: string;
  role: "admin" | "staff";
  disabled: number;
  editorialRoles: string[];
};
type Revision = {
  revision: number;
  actorId: string;
  createdAt: string;
  title: string;
  summary: string;
};
type Activity = {
  action: string;
  actorName: string;
  revision: number;
  createdAt: string;
  metadata?: { note?: string; restoredRevision?: number };
};
type ApiError = Error & { status?: number };
const types: Record<string, string> = {
  article: "Article",
  chapter: "Learning chapter",
  resource: "Resource",
  community: "Community update",
  support: "Support listing",
};
const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};
type DetailField = {
  key: string;
  label: string;
  kind?: "date" | "textarea" | "url";
};
const commonDetails: DetailField[] = [
  { key: "author", label: "Content author" },
  { key: "contentOwner", label: "Content owner" },
  { key: "nextReview", label: "Next review date", kind: "date" },
  { key: "sourcesText", label: "Sources and references", kind: "textarea" },
  { key: "seoTitle", label: "Search title" },
  { key: "seoDescription", label: "Search description", kind: "textarea" },
];
const typeDetails: Record<string, DetailField[]> = {
  article: [],
  chapter: [
    { key: "seriesTitle", label: "Learning series" },
    { key: "chapterNumber", label: "Chapter number" },
    { key: "downloadUrl", label: "Download link", kind: "url" },
  ],
  resource: [
    { key: "externalUrl", label: "Resource link", kind: "url" },
    { key: "downloadUrl", label: "Download link", kind: "url" },
    { key: "verificationDate", label: "Verification date", kind: "date" },
  ],
  community: [
    { key: "eventDate", label: "Event date", kind: "date" },
    { key: "endDate", label: "End date", kind: "date" },
    { key: "timeZone", label: "Time zone" },
    { key: "location", label: "Location" },
    { key: "format", label: "Event format" },
    { key: "externalUrl", label: "Event or video link", kind: "url" },
  ],
  support: [
    { key: "provider", label: "Provider" },
    { key: "contact", label: "Contact information", kind: "textarea" },
    { key: "location", label: "Location" },
    { key: "availability", label: "Availability", kind: "textarea" },
    { key: "verificationDate", label: "Verification date", kind: "date" },
    { key: "externalUrl", label: "Provider link", kind: "url" },
  ],
};

export default function ContentStudio() {
  const [user, setUser] = useState<User | null>(null);
  const [csrf, setCsrf] = useState("");
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [available, setAvailable] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [type, setType] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [dirty, setDirty] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [history, setHistory] = useState<Revision[]>([]);
  const [historyError, setHistoryError] = useState("");
  const [activity, setActivity] = useState<Activity[]>([]);
  const [activityError, setActivityError] = useState("");

  const api = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const headers = new Headers(init.headers);
      if (csrf) headers.set("X-CSRF-Token", csrf);
      const response = await fetch(`/api/media${path}`, {
        ...init,
        headers,
        credentials: "same-origin",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const err: ApiError = new Error(
          data.error || "The request could not be completed.",
        );
        err.status = response.status;
        throw err;
      }
      return data;
    },
    [csrf],
  );
  const refresh = useCallback(async () => {
    try {
      const [data, permissions] = await Promise.all([
        api("/editorial/items"),
        api("/editorial/roles"),
      ]);
      setEntries(data.items);
      setHasMore(Boolean(data.hasMore));
      setRoles(permissions.roles);
      setAvailable(true);
      if (user?.role === "admin") {
        const accounts = await api("/editorial/users");
        setStaff(accounts.users);
      }
    } catch (e) {
      setAvailable(false);
      setEntries([]);
      setHasMore(false);
      setError(
        (e as ApiError).status === 403
          ? "Your account does not yet have editorial access. Ask an administrator to assign it."
          : "The content service is temporarily unavailable. Your media library is still available.",
      );
    }
  }, [api, user]);
  useEffect(() => {
    api("/session")
      .then((data) => {
        setUser(data.user);
        setCsrf(data.csrf);
      })
      .catch((e: ApiError) => {
        if (e.status !== 401)
          setError("We could not check your session. Please try again.");
      })
      .finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    if (user) void refresh();
  }, [user, refresh]);
  useEffect(() => {
    const target = document.getElementById(
      creating ? "create-heading" : selectedId ? "editor-heading" : "",
    );
    if (target) {
      target.scrollIntoView({ block: "start" });
      target.focus({ preventScroll: true });
    }
  }, [creating, selectedId]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const send = async (action: () => Promise<void>) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };
  const json = (method: string, data: object): RequestInit => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const values = (event: FormEvent<HTMLFormElement>) =>
    new FormData(event.currentTarget);
  const day = (date: Date) => {
    const pieces = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Kigali",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const get = (part: string) =>
      pieces.find((piece) => piece.type === part)?.value || "";
    return `${get("year")}-${get("month")}-${get("day")}`;
  };
  const today = day(new Date());
  const nextMonth = day(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const languages = [...new Set(entries.map((item) => item.language))].sort();
  const owners = [
    ...new Set(entries.map((item) => item.details?.contentOwner || item.owner)),
  ].sort();
  const overdue = entries.filter(
    (item) => item.details?.nextReview && item.details.nextReview < today,
  ).length;
  const visible = entries.filter(
    (item) =>
      (filter === "all" ||
        (filter === "published"
          ? !!item.hasPublished
          : item.status === filter)) &&
      (type === "all" || item.type === type) &&
      (languageFilter === "all" || item.language === languageFilter) &&
      (ownerFilter === "all" ||
        (item.details?.contentOwner || item.owner) === ownerFilter) &&
      (reviewFilter === "all" ||
        (reviewFilter === "overdue" &&
          !!item.details?.nextReview &&
          item.details.nextReview < today) ||
        (reviewFilter === "soon" &&
          !!item.details?.nextReview &&
          item.details.nextReview >= today &&
          item.details.nextReview <= nextMonth) ||
        (reviewFilter === "unset" && !item.details?.nextReview)) &&
      `${item.title} ${item.topic} ${item.language} ${item.owner}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const count = (status: string) =>
    entries.filter((item) =>
      status === "published" ? item.hasPublished : item.status === status,
    ).length;
  const selected = entries.find((item) => item.id === selectedId);
  const canEdit = Boolean(
    selected &&
    !selected.imported &&
    roles.includes("author") &&
    (user?.role === "admin" || selected.ownerId === user?.id),
  );
  useEffect(() => {
    setDirty(false);
    setBlocks(selected?.blocks || []);
    setPreviewOpen(false);
    setTranslating(false);
  }, [selectedId, selected?.revision]);
  useEffect(() => {
    let active = true;
    setHistory([]);
    setHistoryError("");
    setActivity([]);
    setActivityError("");
    if (selectedId)
      api(`/editorial/items/${selectedId}/history`)
        .then((data) => {
          if (active) setHistory(data.history);
        })
        .catch(() => {
          if (active)
            setHistoryError("Revision history is temporarily unavailable.");
        });
    if (selectedId)
      api(`/editorial/items/${selectedId}/activity`)
        .then((data) => {
          if (active) setActivity(data.activity);
        })
        .catch(() => {
          if (active)
            setActivityError("Review activity is temporarily unavailable.");
        });
    return () => {
      active = false;
    };
  }, [api, selectedId, selected?.revision, selected?.status]);
  const canLeaveDraft = () =>
    !dirty || window.confirm("Discard unsaved changes?");
  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = values(event);
    const form = event.currentTarget;
    void send(async () => {
      const session = await api(
        "/login",
        json("POST", {
          username: data.get("username"),
          password: data.get("password"),
        }),
      );
      setUser(session.user);
      setCsrf(session.csrf);
      form.reset();
    });
  };
  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = values(event);
    void send(async () => {
      await api("/editorial/items", json("POST", Object.fromEntries(data)));
      setDirty(false);
      setCreating(false);
      setNotice("Draft created. It is not visible on the website.");
      await refresh();
    });
  };
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const data = values(event);
    const details = Object.fromEntries(
      [...data.entries()]
        .filter(([key]) => key.startsWith("detail_"))
        .map(([key, value]) => [key.slice(7), String(value)]),
    );
    const draft = {
      title: data.get("title"),
      summary: data.get("summary"),
      language: data.get("language"),
      topic: data.get("topic"),
      body: data.get("body"),
      revision: selected.revision,
      details,
      blocks,
    };
    void send(async () => {
      await api(`/editorial/items/${selected.id}`, json("PUT", draft));
      setNotice("Draft saved. Any earlier approval has been cleared.");
      await refresh();
    });
  };
  const createTranslation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const data = values(event);
    void send(async () => {
      const result = await api(
        `/editorial/items/${selected.id}/translations`,
        json("POST", Object.fromEntries(data)),
      );
      setDirty(false);
      setTranslating(false);
      await refresh();
      setSelectedId(result.id);
      setNotice("The language version was created as a private draft.");
    });
  };
  const review = (action: string, note = "") => {
    if (!selected) return;
    void send(async () => {
      await api(
        `/editorial/items/${selected.id}/review`,
        json("POST", { action, revision: selected.revision, note }),
      );
      setNotice(
        action === "submit"
          ? "Draft submitted for review."
          : action === "approve"
            ? "This revision has been approved."
            : "Draft returned with feedback.",
      );
      await refresh();
    });
  };
  const restore = (targetRevision: number) => {
    if (
      !selected ||
      (dirty &&
        !window.confirm(
          "Discard unsaved changes and restore this revision as a new draft?",
        )) ||
      (!dirty && !window.confirm("Restore this revision as a new draft?"))
    )
      return;
    void send(async () => {
      await api(
        `/editorial/items/${selected.id}/restore`,
        json("POST", { revision: selected.revision, targetRevision }),
      );
      setDirty(false);
      setNotice("The earlier revision was restored as a new private draft.");
      await refresh();
    });
  };
  const updateRoles = async (member: Staff, role: string, checked: boolean) => {
    const next = checked
      ? [...member.editorialRoles, role]
      : member.editorialRoles.filter((value) => value !== role);
    setBusy(true);
    setError("");
    setNotice("");
    setStaff((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, editorialRoles: next } : item,
      ),
    );
    try {
      await api(
        `/editorial/users/${member.id}/roles`,
        json("PUT", { roles: next }),
      );
      await refresh();
      setNotice(`Editorial access updated for ${member.username}.`);
    } catch (e) {
      setStaff((current) =>
        current.map((item) => (item.id === member.id ? member : item)),
      );
      setError(
        e instanceof Error
          ? e.message
          : "The access change could not be saved.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (checking)
    return (
      <main id="main-content" tabIndex={-1} className="studio-shell">
        <p className="studio-loading" role="status">
          Opening Content Studio…
        </p>
      </main>
    );
  if (!user)
    return (
      <main id="main-content" tabIndex={-1} className="studio-login">
        <div className="studio-login-panel">
          <div className="studio-mark" aria-hidden="true">
            V<span>.</span>
          </div>
          <p className="studio-eyebrow">VUGA NDAKUMVA · STAFF</p>
          <h1>Good content starts with care.</h1>
          <p className="studio-login-copy">
            A thoughtful space to prepare, review, and share the stories and
            resources that matter.
          </p>
          <div className="studio-login-note">
            <ShieldCheck size={20} />
            <span>For authorized team members</span>
          </div>
        </div>
        <div className="studio-login-form">
          <div>
            <a className="studio-back" href="/">
              ← Back to website
            </a>
            <p className="studio-eyebrow">CONTENT STUDIO</p>
            <h2>Welcome back</h2>
            <p>Sign in with your existing staff account.</p>
            {error && (
              <p className="studio-alert" role="alert">
                {error}
              </p>
            )}
            <form onSubmit={signIn}>
              <label>
                Username
                <input name="username" autoComplete="username" required />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
              <button className="studio-primary" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"} <ArrowRight size={17} />
              </button>
            </form>
            <p className="studio-help">
              Need access? Ask your administrator to create an individual
              account.
            </p>
          </div>
        </div>
      </main>
    );

  return (
    <main id="main-content" tabIndex={-1} className="studio-shell">
      <aside className="studio-sidebar">
        <a className="studio-brand" href="/staff/content">
          <span className="studio-mark">
            V<span>.</span>
          </span>
          <span>
            <strong>Vuga Ndakumva</strong>
            <small>CONTENT STUDIO</small>
          </span>
        </a>
        <p className="studio-nav-label">WORKSPACE</p>
        <nav aria-label="Staff workspace">
          <a className="active" href="/staff/content" aria-current="page">
            <LayoutDashboard size={18} /> Overview
          </a>
          <a href="#content-library">
            <FileText size={18} /> Content library
          </a>
          <a href="/staff/media">
            <Image size={18} /> Media library
          </a>
          {user.role === "admin" && (
            <a href="/staff/media#staff-accounts">
              <Users size={18} /> Staff accounts
            </a>
          )}
        </nav>
        <div className="studio-sidebar-bottom">
          <div className="studio-person">
            <span>{user.username.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{user.username}</strong>
              <small>
                {user.role === "admin" ? "Administrator" : "Staff member"}
              </small>
            </div>
          </div>
          <button
            className="studio-signout"
            disabled={busy}
            onClick={() => {
              if (canLeaveDraft())
                void send(async () => {
                  await api("/logout", { method: "POST" });
                  setDirty(false);
                  setUser(null);
                  setCsrf("");
                  setEntries([]);
                });
            }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <div className="studio-main">
        <header className="studio-topbar">
          <span>
            Workspace <span className="studio-slash">/</span> Overview
          </span>
          <a href="/" target="_blank" rel="noreferrer">
            View website <ArrowDownLeft size={15} />
          </a>
        </header>
        <div className="studio-inner">
          <div className="studio-heading">
            <div>
              <p className="studio-eyebrow">YOUR EDITORIAL WORKSPACE</p>
              <h1>Welcome back, {user.username}.</h1>
              <p>Everything you need to move meaningful content forward.</p>
            </div>
            <button
              className="studio-primary"
              disabled={!available || busy || !roles.includes("author")}
              onClick={() => {
                if (canLeaveDraft()) {
                  setCreating(true);
                  setSelectedId("");
                }
              }}
            >
              <Plus size={18} /> Create content
            </button>
          </div>
          {error && (
            <div className="studio-alert" role="alert">
              {error}{" "}
              {!available && (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    void refresh();
                  }}
                >
                  Try again
                </button>
              )}
            </div>
          )}
          {notice && (
            <div className="studio-success" role="status">
              {notice}
            </div>
          )}
          <section aria-label="Content overview" className="studio-stats">
            <Stat
              label="Drafts"
              value={available ? count("draft") : "—"}
              description="In preparation"
              icon={<FileText />}
            />
            <Stat
              label="In review"
              value={available ? count("in_review") : "—"}
              description="Awaiting a decision"
              icon={<Clock3 />}
            />
            <Stat
              label="Approved"
              value={available ? count("approved") : "—"}
              description="Ready for publishing"
              icon={<CheckCircle2 />}
            />
            <Stat
              label="Published"
              value={available ? count("published") : "—"}
              description="Shared with readers"
              icon={<BookOpen />}
            />
          </section>
          <div className="studio-workspace">
            <section className="studio-library" id="content-library">
              <div className="studio-section-heading">
                <div>
                  <p className="studio-eyebrow">YOUR CONTENT</p>
                  <h2>Content library</h2>
                  <p>Find and follow your team's work.</p>
                </div>
                <span className="studio-count">
                  {available
                    ? `${visible.length} ${visible.length === 1 ? "item" : "items"}`
                    : "Unavailable"}
                </span>
              </div>
              {hasMore && (
                <p className="studio-alert" role="status">
                  Only the 500 most recently changed items are shown. Search and
                  totals apply to those items.
                </p>
              )}
              <div className="studio-filters">
                <label className="studio-search">
                  <Search size={17} />
                  <span className="studio-sr-only">Search content</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search content"
                  />
                </label>
                <label>
                  <span className="studio-sr-only">Filter by status</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All statuses</option>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="studio-sr-only">Filter by language</span>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                  >
                    <option value="all">All languages</option>
                    {languages.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="studio-sr-only">Filter by owner</span>
                  <select
                    value={ownerFilter}
                    onChange={(e) => setOwnerFilter(e.target.value)}
                  >
                    <option value="all">All owners</option>
                    {owners.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="studio-sr-only">Filter by review date</span>
                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                  >
                    <option value="all">All review dates</option>
                    <option value="overdue">Overdue</option>
                    <option value="soon">Due in 30 days</option>
                    <option value="unset">No review date</option>
                  </select>
                </label>
                <label>
                  <span className="studio-sr-only">Filter by content type</span>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="all">All types</option>
                    {Object.entries(types).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {!available ? (
                <div className="studio-empty">
                  <span>
                    <ShieldCheck />
                  </span>
                  <h3>Content is unavailable</h3>
                  <p>
                    The content service needs to be connected before items can
                    appear here.
                  </p>
                </div>
              ) : visible.length === 0 ? (
                <div className="studio-empty">
                  <span>
                    <FileText />
                  </span>
                  <h3>
                    {entries.length
                      ? "No matching content"
                      : "A fresh place to begin"}
                  </h3>
                  <p>
                    {entries.length
                      ? "Try a different search or filter."
                      : "Your drafts and published content will appear here."}
                  </p>
                </div>
              ) : (
                <div className="studio-list">
                  {visible.map((item) => (
                    <article key={item.id} className="studio-row">
                      <div className="studio-file-icon">
                        <FileText size={19} />
                      </div>
                      <div className="studio-row-content">
                        <strong>{item.title}</strong>
                        <p>
                          {types[item.type] || item.type} · {item.language} ·{" "}
                          {item.owner}
                        </p>
                      </div>
                      <span
                        className={`studio-status studio-status-${item.status}`}
                      >
                        {statusLabels[item.status] || item.status}
                        {item.hasPublished && item.status !== "published"
                          ? " · live version"
                          : ""}
                      </span>
                      <time dateTime={item.updatedAt}>
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </time>
                      <button
                        className="studio-row-open"
                        type="button"
                        onClick={() => {
                          if (canLeaveDraft()) {
                            setSelectedId(item.id);
                            setCreating(false);
                          }
                        }}
                      >
                        Open
                        <span className="studio-sr-only"> {item.title}</span>
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
            <aside className="studio-aside">
              <div className="studio-side-card">
                <p className="studio-eyebrow">YOUR MEDIA</p>
                <h2>Every image tells a story.</h2>
                <p>
                  Manage the photographs you already use in your outreach
                  galleries.
                </p>
                <a href="/staff/media">
                  Open media library <ArrowRight size={16} />
                </a>
                <div className="studio-side-art" aria-hidden="true">
                  <Image size={36} />
                  <span>01 / 02</span>
                </div>
              </div>
              <div className="studio-guidance">
                <ShieldCheck size={21} />
                <div>
                  <h3>Publish with confidence</h3>
                  <p>
                    Drafts stay private while your team reviews them. Check
                    sources and permissions before sharing.
                  </p>
                </div>
              </div>
              {available && (
                <div className="studio-guidance">
                  <Clock3 size={21} />
                  <div>
                    <h3>Review reminders</h3>
                    <p>
                      {overdue
                        ? `${overdue} ${overdue === 1 ? "item is" : "items are"} past its review date.`
                        : "No review dates are overdue."}
                    </p>
                    <button
                      type="button"
                      className="studio-row-open"
                      onClick={() => {
                        setReviewFilter("overdue");
                        document
                          .getElementById("content-library")
                          ?.scrollIntoView();
                      }}
                    >
                      See overdue items
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </div>
          {creating && (
            <section className="studio-create" aria-labelledby="create-heading">
              <div>
                <p className="studio-eyebrow">NEW CONTENT</p>
                <h2 id="create-heading" tabIndex={-1}>
                  Start a draft
                </h2>
                <p>Add the basic information for this private draft.</p>
              </div>
              <form onSubmit={create} onChange={() => setDirty(true)}>
                <label>
                  Content type
                  <select name="type" required>
                    {Object.entries(types).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Title
                  <input name="title" maxLength={160} required />
                </label>
                <label>
                  Summary
                  <textarea name="summary" maxLength={1000} required />
                </label>
                <label>
                  Language
                  <input
                    name="language"
                    defaultValue="English"
                    maxLength={40}
                    required
                  />
                </label>
                <label>
                  Topic
                  <input name="topic" maxLength={80} required />
                </label>
                <div className="studio-create-actions">
                  <button className="studio-primary" disabled={busy}>
                    Create draft
                  </button>
                  <button
                    type="button"
                    className="studio-secondary"
                    onClick={() => {
                      if (canLeaveDraft()) {
                        setDirty(false);
                        setCreating(false);
                      }
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}
          {selected && (
            <section className="studio-create" aria-labelledby="editor-heading">
              <div className="studio-section-heading">
                <div>
                  <p className="studio-eyebrow">
                    {types[selected.type]} · {statusLabels[selected.status]}
                  </p>
                  <h2 id="editor-heading" tabIndex={-1}>
                    {selected.title}
                  </h2>
                  <p>Revision {selected.revision}. This content is private.</p>
                </div>
                <button
                  type="button"
                  className="studio-secondary"
                  onClick={() => {
                    if (canLeaveDraft()) setSelectedId("");
                  }}
                >
                  Close
                </button>
              </div>
              {selected.imported && (
                <p className="studio-feedback">
                  Imported source content is read-only until its structure and
                  review status are verified. The existing public page remains
                  unchanged.
                </p>
              )}
              {selected.reviewNote && (
                <p className="studio-feedback">
                  <strong>Review feedback:</strong> {selected.reviewNote}
                </p>
              )}
              {!selected.imported && (
                <form
                  key={`${selected.id}-${selected.revision}`}
                  onSubmit={save}
                  onChange={() => setDirty(true)}
                >
                  <label>
                    Title
                    <input
                      name="title"
                      defaultValue={selected.title}
                      maxLength={160}
                      readOnly={!canEdit}
                      required
                    />
                  </label>
                  <label>
                    Summary
                    <textarea
                      name="summary"
                      defaultValue={selected.summary}
                      maxLength={1000}
                      readOnly={!canEdit}
                      required
                    />
                  </label>
                  <label>
                    Language
                    <input
                      name="language"
                      defaultValue={selected.language}
                      maxLength={40}
                      readOnly={!canEdit}
                      required
                    />
                  </label>
                  <label>
                    Topic
                    <input
                      name="topic"
                      defaultValue={selected.topic}
                      maxLength={80}
                      readOnly={!canEdit}
                      required
                    />
                  </label>
                  <label className="studio-full-field">
                    Draft text
                    <textarea
                      name="body"
                      defaultValue={selected.body || ""}
                      maxLength={20000}
                      readOnly={!canEdit}
                    />
                  </label>
                  <BlockEditor
                    blocks={blocks}
                    onChange={(value) => {
                      setBlocks(value);
                      setDirty(true);
                    }}
                    readOnly={!canEdit}
                    api={api}
                  />
                  <h3 className="studio-full-field">Content details</h3>
                  {[
                    ...commonDetails,
                    ...(typeDetails[selected.type] || []),
                  ].map((field) => (
                    <label key={field.key}>
                      {field.label}
                      {field.kind === "textarea" ? (
                        <textarea
                          name={`detail_${field.key}`}
                          defaultValue={selected.details?.[field.key] || ""}
                          maxLength={2000}
                          readOnly={!canEdit}
                        />
                      ) : (
                        <input
                          name={`detail_${field.key}`}
                          type={field.kind === "date" ? "date" : "text"}
                          placeholder={
                            field.kind === "url"
                              ? "https:// or /path"
                              : undefined
                          }
                          defaultValue={selected.details?.[field.key] || ""}
                          maxLength={2000}
                          readOnly={!canEdit}
                        />
                      )}
                    </label>
                  ))}
                  <div className="studio-create-actions">
                    <button
                      type="button"
                      className="studio-secondary"
                      disabled={busy || dirty}
                      onClick={() => setPreviewOpen(true)}
                    >
                      Preview draft
                    </button>
                    {canEdit && (
                      <button className="studio-primary" disabled={busy}>
                        Save draft
                      </button>
                    )}
                    {canEdit && selected.status === "draft" && (
                      <button
                        type="button"
                        className="studio-secondary"
                        disabled={busy || dirty}
                        onClick={() => review("submit")}
                      >
                        Submit for review
                      </button>
                    )}
                    {dirty && <span>Save changes before submitting.</span>}
                  </div>
                </form>
              )}
              {!selected.imported &&
                roles.includes("reviewer") &&
                selected.status === "in_review" && (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      const data = values(event);
                      review("return", String(data.get("note") || ""));
                    }}
                  >
                    <label className="studio-full-field">
                      Feedback when returning
                      <textarea name="note" maxLength={2000} required />
                    </label>
                    <div className="studio-create-actions">
                      <button
                        type="button"
                        className="studio-primary"
                        disabled={busy || dirty}
                        onClick={() => review("approve")}
                      >
                        Approve revision
                      </button>
                      <button
                        className="studio-secondary"
                        disabled={busy || dirty}
                      >
                        Return for changes
                      </button>
                    </div>
                  </form>
                )}
              {!selected.imported && (
                <section
                  className="studio-history"
                  aria-labelledby="versions-heading"
                >
                  <h3 id="versions-heading">Language versions</h3>
                  <p>
                    Each language has its own draft and review. Text is not
                    translated automatically.
                  </p>
                  {entries
                    .filter(
                      (item) =>
                        item.groupId &&
                        item.groupId === selected.groupId &&
                        item.id !== selected.id,
                    )
                    .map((item) => (
                      <button
                        type="button"
                        className="studio-secondary"
                        key={item.id}
                        onClick={() => {
                          if (canLeaveDraft()) setSelectedId(item.id);
                        }}
                      >
                        {item.language} · {statusLabels[item.status]}
                      </button>
                    ))}
                  {canEdit && !translating && (
                    <button
                      type="button"
                      className="studio-secondary"
                      disabled={dirty || busy}
                      onClick={() => setTranslating(true)}
                    >
                      Add language version
                    </button>
                  )}
                  {translating && (
                    <form
                      onSubmit={createTranslation}
                      onChange={() => setDirty(true)}
                    >
                      <label>
                        Language name
                        <input name="language" maxLength={40} required />
                      </label>
                      <label>
                        Translated title
                        <input name="title" maxLength={160} required />
                      </label>
                      <label>
                        Translated summary
                        <textarea name="summary" maxLength={1000} required />
                      </label>
                      <div className="studio-create-actions">
                        <button className="studio-primary" disabled={busy}>
                          Create language draft
                        </button>
                        <button
                          type="button"
                          className="studio-secondary"
                          onClick={() => {
                            if (canLeaveDraft()) {
                              setTranslating(false);
                              setDirty(false);
                            }
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </section>
              )}
              <details className="studio-history">
                <summary>Previous revisions</summary>
                {historyError && <p role="status">{historyError}</p>}
                {history.map((version) => (
                  <div className="studio-history-row" key={version.revision}>
                    <div>
                      <strong>Revision {version.revision}</strong>
                      <p>
                        {version.title} ·{" "}
                        {new Date(version.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {canEdit && version.revision !== selected.revision && (
                      <button
                        type="button"
                        className="studio-secondary"
                        disabled={busy}
                        onClick={() => restore(version.revision)}
                      >
                        Restore
                      </button>
                    )}
                  </div>
                ))}
              </details>
              <details className="studio-history">
                <summary>Review and activity</summary>
                {activityError && <p role="status">{activityError}</p>}
                {activity.map((event, index) => (
                  <div
                    className="studio-history-row"
                    key={`${event.action}-${event.revision}-${index}`}
                  >
                    <div>
                      <strong>
                        {(
                          {
                            "draft.created": "Draft created",
                            "draft.updated": "Draft updated",
                            "draft.restored": "Earlier revision restored",
                            "review.submit": "Submitted for review",
                            "review.approve": "Revision approved",
                            "review.return": "Returned for changes",
                            "content.published": "Revision published",
                            "source.imported": "Source imported",
                          } as Record<string, string>
                        )[event.action] || event.action}
                      </strong>
                      <p>
                        {event.actorName} · Revision {event.revision} ·{" "}
                        {new Date(event.createdAt).toLocaleDateString()}
                      </p>
                      {event.metadata?.note && (
                        <p>Feedback: {event.metadata.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </details>
              {previewOpen && (
                <DraftPreview
                  draft={selected}
                  onClose={() => setPreviewOpen(false)}
                />
              )}
              <p className="studio-help">
                Publishing to the website is not connected yet.
              </p>
            </section>
          )}
          {available && user.role === "admin" && (
            <section
              className="studio-create studio-access"
              id="editorial-access"
              aria-labelledby="access-heading"
            >
              <p className="studio-eyebrow">TEAM PERMISSIONS</p>
              <h2 id="access-heading">Editorial access</h2>
              <p>
                Choose the editorial roles for each staff member. Administrators
                retain full access.
              </p>
              {staff.filter((member) => member.role === "staff").length ===
              0 ? (
                <p>
                  No staff accounts yet. Create one in the{" "}
                  <a href="/staff/media#staff-accounts">media library</a>.
                </p>
              ) : (
                staff
                  .filter((member) => member.role === "staff")
                  .map((member) => (
                    <fieldset
                      key={member.id}
                      disabled={busy || Boolean(member.disabled)}
                    >
                      <legend>
                        {member.username}
                        {member.disabled ? " (disabled)" : ""}
                      </legend>
                      {["author", "reviewer", "publisher"].map((role) => (
                        <label key={role}>
                          <input
                            type="checkbox"
                            checked={member.editorialRoles.includes(role)}
                            onChange={(e) =>
                              void updateRoles(member, role, e.target.checked)
                            }
                          />{" "}
                          {role[0].toUpperCase() + role.slice(1)}
                        </label>
                      ))}
                    </fieldset>
                  ))
              )}
            </section>
          )}
          <footer className="studio-footer">
            Vuga Ndakumva <span>·</span> A place for stories, learning, and
            care.
          </footer>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="studio-stat">
      <div>
        <span>{label}</span>
        <span className="studio-stat-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
      <small>{description}</small>
    </article>
  );
}
