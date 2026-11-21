import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  HeartHandshake,
  Images,
  Newspaper,
  Play,
  Presentation,
  Search,
  School,
  MessageCircleHeart,
  BookOpen,
  X,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  communityDate,
  communityKinds,
  communityKindLabel,
  communityTime,
  type CommunityEntry,
  type CommunityKind,
} from "./content";
import {
  activityState,
  communityImage,
  communityRepository,
  durationLabel,
  isActivity,
  upcomingActivities,
  type CommunityRepository,
} from "./repository";
import { CommunityAlbum, CommunityVideoPlayer } from "./CommunityMedia";
import { schoolOutreachPhotos } from "./schoolOutreach";
import "./community-page.css";
import "./community.css";
import "./community-hub.css";

const icons = {
  news: Newspaper,
  events: CalendarDays,
  workshops: Presentation,
  videos: Play,
  albums: Images,
};
function useTemplatePreview() {
  return false;
}

export function CommunityCard({
  entry,
  featured = false,
  compact = false,
}: {
  entry: CommunityEntry;
  featured?: boolean;
  compact?: boolean;
}) {
  const location = useLocation();
  const Icon = icons[entry.kind];
  const preview = useTemplatePreview();
  const returnSearch =
    location.pathname === "/community"
      ? location.search
      : location.state?.communitySearch || "";
  return (
    <article
      className={`community-entry community-entry-${entry.kind}${featured ? " community-featured-card" : ""}${compact ? " community-entry-compact" : ""}`}
    >
      <Link
        className="community-entry-link"
        to={`/community/${entry.slug}${preview ? "?preview=templates" : ""}`}
        state={{ communitySearch: returnSearch }}
        aria-label={`Explore ${entry.title}`}
      >
        <div className="community-entry-image">
          <img
            src={communityImage(entry)}
            alt={entry.imageAlt}
            width={1600}
            height={1000}
            loading={featured ? "eager" : "lazy"}
            style={{ objectPosition: entry.position }}
          />
          {entry.template && (
            <span className="community-template-badge">Content template</span>
          )}
          {entry.demo && (
            <span className="community-demo-badge">
              Demo{" "}
              {entry.kind === "videos"
                ? "film"
                : entry.kind === "albums"
                  ? "album"
                  : isActivity(entry)
                    ? "activity"
                    : "story"}
            </span>
          )}
          {isActivity(entry) && entry.schedule && (
            <span className="community-activity-date" aria-hidden="true">
              <strong>
                {new Intl.DateTimeFormat("en", {
                  day: "2-digit",
                  timeZone: entry.schedule.timeZone,
                }).format(new Date(entry.schedule.startsAt))}
              </strong>
              <span>
                {new Intl.DateTimeFormat("en", {
                  month: "short",
                  timeZone: entry.schedule.timeZone,
                }).format(new Date(entry.schedule.startsAt))}
              </span>
            </span>
          )}
          {entry.kind === "videos" && (
            <>
              <span className="community-video-play" aria-hidden="true">
                <Play size={26} fill="currentColor" />
              </span>
              <span className="community-video-badge">
                <Play size={16} aria-hidden="true" />{" "}
                {durationLabel(entry.video.durationSeconds)}
              </span>
            </>
          )}
        </div>
        <div className="community-entry-body">
          <span className="community-entry-kind">
            <Icon size={15} aria-hidden="true" />
            {communityKindLabel(entry.kind)}
          </span>
          <h3>{entry.title}</h3>
          <p>{entry.summary}</p>
          <div className="community-entry-meta">
            {entry.kind === "videos" ? (
              <span>
                {entry.topics[0] || "Community learning"} ·{" "}
                {entry.video.language}
              </span>
            ) : isActivity(entry) && entry.completed ? (
              <span>Past event · {entry.completed.dateLabel} · {entry.completed.location}</span>
            ) : isActivity(entry) && entry.schedule ? (
              <span>
                {entry.demo ? "Sample date" : activityState(entry)} ·{" "}
                {communityDate(
                  entry.schedule.startsAt,
                  entry.schedule.timeZone,
                )}{" "}
                · {entry.schedule.location}
              </span>
            ) : (
              <span>
                {entry.publishedAt
                  ? communityDate(entry.publishedAt)
                  : entry.template
                    ? "Confirmed details coming soon"
                    : entry.kind === "albums"
                      ? `${entry.photos.length} photographs`
                      : "Community story"}
              </span>
            )}
          </div>
          <span className="community-entry-action">
            {entry.template
              ? "Explore the template"
              : entry.kind === "videos"
                ? "Watch & learn"
                : entry.kind === "albums"
                  ? "View photo album"
                  : isActivity(entry)
                    ? entry.demo
                      ? "Preview activity"
                      : "View details"
                    : "Read the story"}
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

function Collection({
  id,
  eyebrow,
  title,
  entries,
}: {
  id: string;
  eyebrow: string;
  title: string;
  entries: CommunityEntry[];
}) {
  const [params] = useSearchParams();
  if (!entries.length) return null;
  const next = new URLSearchParams(params);
  // Mixed collections must not hide workshops or albums when browsing more.
  if (entries.every((entry) => entry.kind === entries[0].kind)) {
    next.set("type", entries[0].kind);
  } else {
    next.delete("type");
  }
  next.delete("q");
  next.delete("topic");
  return (
    <section
      className="community-hub-section"
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <div className="community-section-title">
        <div>
          <span className="support-eyebrow">{eyebrow}</span>
          <h2 id={`${id}-title`}>{title}</h2>
          {entries.every((entry) => entry.demo) && entries.some(isActivity) && (
            <p className="community-section-note">
              Sample activities · dates and venues are for demonstration.
            </p>
          )}
        </div>
        <Link className="community-work-link" to={`?${next}#community-updates`}>
          Explore more
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div
        className="community-entry-grid community-collection-grid"
        data-count={Math.min(entries.length, 3)}
      >
        {entries.slice(0, 3).map((entry) => (
          <CommunityCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </section>
  );
}

function DiscoveryResults({ entries }: { entries: CommunityEntry[] }) {
  const groups = [
    {
      title: "Stories, videos & photo albums",
      entries: entries.filter((entry) => !isActivity(entry)),
    },
    {
      title: "Upcoming events & workshops",
      entries: entries
        .filter(
          (entry) => isActivity(entry) && activityState(entry) === "Upcoming",
        )
        .sort(
          (a, b) =>
            Date.parse(a.schedule!.startsAt) - Date.parse(b.schedule!.startsAt),
        ),
    },
    {
      title: "Past events & workshops",
      entries: entries
        .filter(
          (entry) => isActivity(entry) && activityState(entry) === "Past event",
        )
        .sort(
          (a, b) =>
            (Date.parse(b.schedule?.startsAt || b.completed?.date || "") || 0) - (Date.parse(a.schedule?.startsAt || a.completed?.date || "") || 0),
        ),
    },
    {
      title: "Cancelled activities",
      entries: entries.filter(
        (entry) => isActivity(entry) && activityState(entry) === "Cancelled",
      ),
    },
    {
      title: "Activity templates · development preview",
      entries: entries.filter((entry) => isActivity(entry) && !entry.schedule && !entry.completed),
    },
  ];
  return (
    <>
      {groups
        .filter((group) => group.entries.length)
        .map((group) => (
          <div className="community-discovery-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="community-entry-grid">
              {group.entries.map((entry) => (
                <CommunityCard key={entry.slug} entry={entry} compact />
              ))}
            </div>
          </div>
        ))}
    </>
  );
}

export function CommunityPage({
  repository = communityRepository,
}: {
  repository?: CommunityRepository;
}) {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const preview = useTemplatePreview();
  const entries = repository.list();
  const templates = preview
    ? repository
        .list({ previewTemplates: true })
        .filter((entry) => entry.template)
    : [];
  const query = params.get("q") || "";
  const rawKind = params.get("type") || "all";
  const validKind =
    rawKind === "all" || communityKinds.some((item) => item.id === rawKind);
  const topic = params.get("topic") || "";
  const filtering = Boolean(query.trim() || rawKind !== "all" || topic);
  const shown = validKind
    ? repository.list({
        q: query,
        kind: rawKind as CommunityKind | "all",
        topic,
        previewTemplates: preview,
      })
    : [];
  const topics = [...new Set(entries.flatMap((entry) => entry.topics))].sort();
  const featured = entries.find((entry) => entry.featured);
  const update = (key: string, value: string) => {
    // Read the latest browser URL when filters change in quick succession.
    const next = new URLSearchParams(window.location.search);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    navigate(
      { search: next.toString() ? `?${next}` : "", hash: location.hash },
      { replace: key === "q" },
    );
  };
  const clear = () =>
    navigate({
      search: preview ? "?preview=templates" : "",
      hash: location.hash,
    });
  return (
    <div className="support-page community-page community-hub">
      <nav className="community-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Community</span>
      </nav>
      <header className="community-hub-intro community-hub-intro-with-photo">
        <div className="community-hub-intro-copy">
          <span className="support-eyebrow">
            <HeartHandshake size={17} aria-hidden="true" /> THE VUGA NDAKUMVA
            COMMUNITY
          </span>
          <h1>
            Together, we can build communities <span>that listen.</span>
          </h1>
          <p>
            Vuga Ndakumva connects with schools and communities to encourage
            learning, open conversations, and greater awareness of well-being.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <a className="support-button" href="#school-outreach">
              Explore our outreach <ArrowDown size={17} aria-hidden="true" />
            </a>
            <Link className="community-work-link" to="/about#our-team">
              Meet our team <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="community-hub-intro-visual">
          <img src="/images/community/outreach/school-conversation.webp" alt="A student speaks into a microphone during a school gathering" width={960} height={540} />
        </figure>
      </header>
      <section id="school-outreach" className="community-hub-section scroll-mt-32" aria-labelledby="school-outreach-title">
        <div className="max-w-3xl">
          <span className="support-eyebrow">OUR SCHOOL OUTREACH</span>
          <h2 id="school-outreach-title">Bringing conversations into schools.</h2>
          <p className="text-base leading-8 text-[#526951]">Schools are places where young people learn, build relationships, and grow. We connect with school communities to encourage learning and open conversations about well-being.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { Icon: BookOpen, title: "Learning together", text: "Making space to explore information about well-being and the challenges people may face." },
            { Icon: MessageCircleHeart, title: "Open conversations", text: "Encouraging respectful conversations where people can listen and share ideas." },
            { Icon: School, title: "Connecting with schools", text: "Building connections with school communities through outreach and shared learning." },
          ].map(({ Icon, title, text }) => (
            <article key={title} className="rounded-[22px] border border-[#dce7d5] bg-[#f5f8f0] p-6 sm:p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#356b45]"><Icon size={22} aria-hidden="true" /></span>
              <h3 className="mt-5 text-xl font-semibold text-[#203e2d]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#526951]">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <Collection id="community-past" eyebrow="RECENT SCHOOL VISITS" title="Outreach in our schools." entries={entries.filter((entry) => isActivity(entry) && activityState(entry) === "Past event")} />
      <section id="outreach-photos" className="community-hub-section" aria-labelledby="outreach-photos-title">
        <span className="support-eyebrow">MOMENTS FROM OUR COMMUNITY</span>
        <h2 id="outreach-photos-title">Our school outreach in pictures.</h2>
        <p className="max-w-2xl text-base leading-8 text-[#526951]">Explore moments of connection, listening, and learning from our school outreach.</p>
        <CommunityAlbum photos={schoolOutreachPhotos} title="School outreach photos" />
      </section>
      <section className="community-hub-section rounded-[24px] border border-[#dce7d5] bg-[#f4f7ed] p-7 sm:p-10" aria-labelledby="outreach-journey-title">
        <span className="support-eyebrow">OUR OUTREACH JOURNEY</span>
        <h2 id="outreach-journey-title">More connections ahead.</h2>
        <p className="max-w-2xl text-base leading-8 text-[#526951]">Upcoming school visits are in development. Confirmed details will be shared when they are ready.</p>
      </section>
      {entries.some((entry) => entry.demo) && (
        <aside className="community-demo-note" aria-label="Demo content">
          <span className="community-note-dot" aria-hidden="true" />
          <p>
            <strong>A preview of what’s possible.</strong> Demo stories,
            illustrative photos, sample films and dates — ready to replace with
            your community’s own.
          </p>
        </aside>
      )}
      <nav
        className="community-hub-links"
        aria-label="Explore community categories"
      >
        {communityKinds.map((kind) => {
          const Icon = icons[kind.id];
          const next = new URLSearchParams(params);
          next.set("type", kind.id);
          next.delete("q");
          next.delete("topic");
          return (
            <Link
              key={kind.id}
              to={kind.id === "videos" ? "/community#community-watch" : kind.id === "albums" ? "/community#outreach-photos" : `?${next}#community-updates`}
              aria-current={rawKind === kind.id ? "page" : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              {kind.label}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          );
        })}
      </nav>
      {!filtering && (
        <>
          {featured && (
            <section
              className="community-hub-section"
              aria-labelledby="community-featured-title"
            >
              <span className="support-eyebrow">IN FOCUS</span>
              <h2 id="community-featured-title">A story worth sharing.</h2>
              <CommunityCard entry={featured} featured />
            </section>
          )}
          <Collection
            id="community-watch"
            eyebrow="WATCH & LEARN"
            title="Watch our community in action."
            entries={entries.filter((entry) => entry.kind === "videos")}
          />
          {!entries.some((entry) => entry.kind === "videos") && (
            <section id="community-watch" className="community-hub-section" aria-labelledby="community-watch-title">
              <span className="support-eyebrow">WATCH & LEARN</span>
              <h2 id="community-watch-title">Watch our community in action.</h2>
              <div className="flex flex-wrap items-center gap-5 rounded-[22px] border border-[#dce7d5] bg-[#f5f8f0] p-6 sm:p-8">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#356b45]"><Play size={24} aria-hidden="true" /></span>
                <div>
                  <h3 className="text-xl font-semibold">Videos: In development</h3>
                  <p className="mt-2 text-sm leading-7 text-[#526951]">Outreach videos will appear here when links are available.</p>
                </div>
              </div>
            </section>
          )}
          <Collection
            id="community-upcoming"
            eyebrow="COME TOGETHER"
            title="Make room for connection."
            entries={upcomingActivities(entries)}
          />
          <Collection
            id="community-stories"
            eyebrow="PEOPLE & PERSPECTIVES"
            title="Moments that connect us."
            entries={entries.filter(
              (entry) => entry.kind === "news" || entry.kind === "albums",
            )}
          />
        </>
      )}
      {preview && templates.length > 0 && (
        <aside className="community-publishing-note">
          <p>
            <strong>Development preview · Content templates.</strong> These
            records are drafts. No dates, participant stories, or registrations
            are confirmed. Templates are excluded from the public collection.
          </p>
        </aside>
      )}
      <section
        className="community-updates community-hub-section"
        id="community-updates"
        aria-labelledby="community-updates-title"
      >
        <div className="community-updates-heading">
          <div>
            <span className="support-eyebrow">FIND YOUR CONNECTION</span>
            <h2 id="community-updates-title">Explore our community.</h2>
          </div>
          <label className="community-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search community</span>
            <input
              id="community-search"
              aria-label="Search community"
              type="search"
              placeholder="Search stories, videos, activities…"
              value={query}
              onChange={(event) => update("q", event.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear community search"
                onClick={() => {
                  update("q", "");
                  document.getElementById("community-search")?.focus();
                }}
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </label>
        </div>
        <div className="community-discovery">
          <div
            className="community-filter-tabs"
            role="group"
            aria-label="Community content type"
          >
            {[{ id: "all", label: "All updates" }, ...communityKinds].map(
              (item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={rawKind === item.id}
                  onClick={() => update("type", item.id)}
                >
                  {item.label}
                </button>
              ),
            )}
          </div>
          {filtering && (
            <button type="button" className="community-clear" onClick={clear}>
              Clear all
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
        {(topics.length > 0 || topic) && (
          <label className="community-topic-filter">
            Topic
            <select
              aria-label="Community topic"
              value={topic}
              onChange={(event) => update("topic", event.target.value)}
            >
              <option value="">All topics</option>
              {topic && !topics.includes(topic) && (
                <option value={topic}>{topic}</option>
              )}
              {topics.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        )}
        <p className="community-results" role="status" aria-live="polite">
          {shown.length} {shown.length === 1 ? "item" : "items"} to explore
          {filtering ? " · Filtered for you" : ""}
        </p>
        {shown.length > 0 ? (
          <DiscoveryResults entries={shown} />
        ) : (
          <div className="community-empty">
            <HeartHandshake size={36} strokeWidth={1.3} aria-hidden="true" />
            <span className="support-eyebrow">
              {filtering ? "KEEP EXPLORING" : "GOOD CONNECTIONS TAKE CARE"}
            </span>
            <h3>
              {filtering
                ? "A different search might help."
                : "In development"}
            </h3>
            <p>
              {filtering
                ? "Try another phrase or explore all community updates."
                : "We’re preparing community stories, videos, photo albums, and activities. They’ll appear here when the content and details are ready to share."}
            </p>
            {filtering ? (
              <button type="button" className="support-button" onClick={clear}>
                Show all updates
              </button>
            ) : (
              <Link className="support-button" to="/knowledge-hub">
                Explore the Knowledge Hub
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </section>
      <aside className="community-page-callout">
        <HeartHandshake size={38} strokeWidth={1.25} aria-hidden="true" />
        <div>
          <span className="support-eyebrow">CONNECT WITH OUR TEAM</span>
          <h2>Get to know the people behind our work.</h2>
          <p>
            Meet the team and learn about the purpose behind our school outreach.
            Contact information is in development.
          </p>
        </div>
        <div>
          <Link className="support-button" to="/about#our-team">
            Meet our team
            <ArrowUpRight size={17} />
          </Link>
          <Link className="community-work-link" to="/resources">
            Browse resources
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </aside>
    </div>
  );
}

export function CommunityDetailPage({
  repository = communityRepository,
}: {
  repository?: CommunityRepository;
}) {
  const { slug } = useParams();
  const location = useLocation();
  const preview = useTemplatePreview();
  const entry = repository.get(slug || "", preview);
  const saved =
    typeof location.state?.communitySearch === "string"
      ? new URLSearchParams(location.state.communitySearch)
      : new URLSearchParams();
  if (preview) saved.set("preview", "templates");
  const backTo = `/community${saved.size ? `?${saved}` : ""}`;
  if (!entry)
    return (
      <div className="support-page community-missing">
        <HeartHandshake size={40} />
        <span className="support-eyebrow">OUR COMMUNITY</span>
        <h1>This update isn’t here.</h1>
        <p>
          The address may be incomplete, or the update may not be published yet.
        </p>
        <Link className="support-button" to={backTo}>
          Back to community
          <ArrowLeft size={17} />
        </Link>
      </div>
    );
  const related = repository
    .list({ previewTemplates: preview })
    .filter((item) => item.slug !== entry.slug)
    .sort(
      (a, b) =>
        Number(entry.relatedSlugs?.includes(b.slug) || b.kind === entry.kind) -
        Number(entry.relatedSlugs?.includes(a.slug) || a.kind === entry.kind),
    )
    .slice(0, 3);
  const registration =
    !entry.template &&
    !entry.demo &&
    entry.schedule &&
    activityState(entry) === "Upcoming" &&
    /^https:\/\//.test(entry.schedule.registrationUrl || "")
      ? entry.schedule.registrationUrl
      : undefined;
  return (
    <div className="support-page community-detail">
      <Link className="community-back" to={backTo}>
        <ArrowLeft size={16} />
        Back to community
      </Link>
      <header className="community-detail-header">
        <Link
          className="community-entry-kind"
          to={`/community?type=${entry.kind}${preview ? "&preview=templates" : ""}`}
        >
          {communityKindLabel(entry.kind)}
        </Link>
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
        {entry.template && (
          <span className="community-detail-template">
            Content template · Confirmed details coming soon
          </span>
        )}
        {entry.topics.length > 0 && (
          <p className="community-topics">{entry.topics.join(" · ")}</p>
        )}
      </header>
      {entry.demo && (
        <aside className="community-demo-note" aria-label="Demo content">
          <p>
            <strong>Demonstration content.</strong>{" "}
            {isActivity(entry)
              ? "This activity, date and venue are examples. No event is confirmed and registration is unavailable."
              : "This sample story or media is illustrative. It does not document this organisation’s outreach participants or activities."}
          </p>
        </aside>
      )}
      {entry.kind === "videos" ? (
        <CommunityVideoPlayer
          key={entry.slug}
          title={entry.title}
          poster={communityImage(entry)}
          video={entry.video}
        />
      ) : entry.kind === "albums" ? (
        <CommunityAlbum
          key={entry.slug}
          title={entry.title}
          photos={entry.photos}
        />
      ) : (
        <figure className={`community-detail-photo${entry.completed ? ` community-detail-photo-completed community-detail-photo-${entry.imageOrientation || "landscape"}` : ""}`}>
          <img
            src={communityImage(entry)}
            alt={entry.imageAlt}
            width={entry.imageDimensions?.width || 1600}
            height={entry.imageDimensions?.height || 1000}
            style={{ objectPosition: entry.position }}
            fetchPriority="high"
          />
        </figure>
      )}
      <div className="community-detail-layout">
        <article className="community-detail-body">
          {entry.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              {section.points && (
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
        <aside
          className="community-practical"
          aria-labelledby="community-practical-title"
        >
          <h2 id="community-practical-title">
            {isActivity(entry)
              ? entry.demo
                ? "Sample activity details"
                : entry.completed ? "Visit details" : "Plan your visit"
              : "About this update"}
          </h2>
          <dl>
            {entry.publishedAt && (
              <div>
                <dt>Published</dt>
                <dd>{communityDate(entry.publishedAt)}</dd>
              </div>
            )}
            {entry.kind === "videos" && (
              <>
                <div>
                  <dt>Duration</dt>
                  <dd>{durationLabel(entry.video.durationSeconds)}</dd>
                </div>
                <div>
                  <dt>Language</dt>
                  <dd>{entry.video.language}</dd>
                </div>
              </>
            )}
            {isActivity(entry) && (
              <>
                <div>
                  <dt>Status</dt>
                  <dd>
                    {entry.demo
                      ? "Demo only · not a confirmed activity"
                      : activityState(entry)}
                  </dd>
                </div>
                <div>
                  <dt>{entry.completed ? "Visit date" : "Date & time"}</dt>
                  <dd>
                    {entry.completed ? entry.completed.dateLabel : entry.schedule ? (
                      <>
                        {communityDate(
                          entry.schedule.startsAt,
                          entry.schedule.timeZone,
                        )}
                        <br />
                        {communityTime(entry.schedule)}
                      </>
                    ) : (
                      "To be announced"
                    )}
                  </dd>
                </div>
                <div>
                  <dt>{entry.completed ? "School" : "Location & format"}</dt>
                  <dd>
                    {entry.completed ? entry.completed.location : entry.schedule
                      ? `${entry.schedule.location} · ${entry.schedule.format}`
                      : "To be announced"}
                  </dd>
                </div>
                <div>
                  <dt>Who it’s for</dt>
                  <dd>{entry.audience || "Audience to be confirmed"}</dd>
                </div>
                {!entry.completed && <div>
                  <dt>Participation</dt>
                  <dd>
                    {registration
                      ? "See the organiser’s registration details"
                      : "Not open for registration"}
                  </dd>
                </div>}
              </>
            )}
          </dl>
          {registration && (
            <a
              className="support-button"
              href={registration}
              target="_blank"
              rel="noopener noreferrer"
            >
              Registration details
              <ArrowUpRight size={16} />
            </a>
          )}
          {entry.template && (
            <p className="community-practical-note">
              This is a content template awaiting confirmed details. No
              participant accounts or open registrations have been published.
            </p>
          )}
          <h3>Keep learning</h3>
          {(entry.resources?.length
            ? entry.resources
            : [
                { title: "Mental health library", href: "/why-mental-health" },
                { title: "Guides & worksheets", href: "/resources" },
              ]
          ).map((resource) => (
            <Link
              className="community-work-link"
              key={resource.href}
              to={resource.href}
            >
              {resource.title}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </aside>
      </div>
      {entry.visitPhotos && entry.visitPhotos.length > 0 && (
        <section className="community-hub-section" aria-labelledby="visit-photos-title">
          <span className="support-eyebrow">MOMENTS FROM THE VISIT</span>
          <h2 id="visit-photos-title">Outreach in pictures.</h2>
          <CommunityAlbum photos={entry.visitPhotos} title="Cyanika outreach photos" initiallyVisible={6} />
        </section>
      )}
      {related.length > 0 && (
        <section
          className="community-related"
          aria-labelledby="community-related-title"
        >
          <div className="community-related-heading">
            <h2 id="community-related-title">More from our community.</h2>
            <Link className="community-work-link" to={backTo}>
              All community updates
              <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="community-entry-grid">
            {related.map((item) => (
              <CommunityCard key={item.slug} entry={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
