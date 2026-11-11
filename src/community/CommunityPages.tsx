import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  HeartHandshake,
  Newspaper,
  Presentation,
  Search,
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
  communityEntries,
  communityKindLabel,
  communityKinds,
  communityTime,
  findCommunityEntry,
  type CommunityEntry,
} from "./content";
import "./community-page.css";
import "./community.css";

const kindIcons = {
  news: Newspaper,
  events: CalendarDays,
  workshops: Presentation,
};

function CommunityCard({ entry }: { entry: CommunityEntry }) {
  const { pathname, search, state } = useLocation();
  const Icon = kindIcons[entry.kind];
  return (
    <article className={`community-entry community-entry-${entry.kind}`}>
      <Link
        to={`/community/${entry.slug}`}
        state={{
          communitySearch:
            pathname === "/community"
              ? search
              : typeof state?.communitySearch === "string"
                ? state.communitySearch
                : "",
        }}
        className="community-entry-link"
        aria-label={`Explore ${entry.title}`}
      >
        <div className="community-entry-image">
          <img
            src={`/images/${entry.image}.webp`}
            alt={entry.imageAlt}
            loading="lazy"
            width={2400}
            height={1600}
            style={{ objectPosition: entry.position }}
          />
          {entry.template && (
            <span className="community-template-badge">Content template</span>
          )}
        </div>
        <div className="community-entry-body">
          <span className="community-entry-kind">
            <Icon size={14} aria-hidden="true" />
            {communityKindLabel(entry.kind)}
          </span>
          <h3>{entry.title}</h3>
          <p>{entry.summary}</p>
          <div className="community-entry-meta">
            {entry.schedule ? (
              <>
                <CalendarDays size={14} aria-hidden="true" />
                <span>
                  {communityDate(
                    entry.schedule.startsAt,
                    entry.schedule.timeZone,
                  )}
                </span>
              </>
            ) : entry.kind === "news" ? (
              <span>
                {entry.publishedAt
                  ? communityDate(entry.publishedAt)
                  : "Story coming soon"}
              </span>
            ) : (
              <>
                <CalendarDays size={14} aria-hidden="true" />
                <span>Schedule to be announced</span>
              </>
            )}
          </div>
          <span className="community-entry-action">
            {entry.template
              ? "Explore the template"
              : entry.kind === "news"
                ? "Read the story"
                : "View details"}
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function CommunityPage() {
  const [params] = useSearchParams();
  const { hash, search } = useLocation();
  const navigate = useNavigate();
  const query = params.get("q") || "";
  const kind = params.get("type") || "all";
  const filtering = !!query.trim() || kind !== "all";
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    navigate(
      { search: next.toString() ? `?${next}` : "", hash },
      { replace: key === "q" },
    );
  };
  const clear = () => navigate({ search: "", hash });
  const shown = communityEntries.filter(
    (entry) =>
      (kind === "all" || kind === entry.kind) &&
      [
        entry.title,
        entry.summary,
        communityKindLabel(entry.kind),
        ...entry.sections.map((section) => section.title),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const hasTemplates = communityEntries.some((entry) => entry.template);

  return (
    <div className="support-page community-page">
      <nav className="community-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Community</span>
      </nav>
      <header className="community-page-hero">
        <div className="community-page-hero-copy">
          <span className="support-eyebrow">
            <HeartHandshake size={17} aria-hidden="true" /> THE BETTERHELP
            COMMUNITY
          </span>
          <h1>
            A place to connect.
            <br />
            <span>A community to grow.</span>
          </h1>
          <p>
            News, events, and workshops that bring our community closer. A space
            for shared stories, meaningful conversations, and learning together.
          </p>
          <Link
            className="support-button"
            to={{ search, hash: "#community-updates" }}
          >
            Explore our community
            <ArrowDown size={17} aria-hidden="true" />
          </Link>
        </div>
        <figure className="community-page-hero-photo">
          <img
            src="/images/mental-health-group.webp"
            alt="Illustrative photograph of people listening during a group conversation"
            width={2400}
            height={1600}
            fetchPriority="high"
          />
          <figcaption>
            <HeartHandshake size={18} aria-hidden="true" />
            <span>Listen. Learn. Belong.</span>
          </figcaption>
        </figure>
      </header>

      <nav
        className="community-channels"
        aria-label="Explore community categories"
      >
        {communityKinds.map((item) => {
          const Icon = kindIcons[item.id];
          return (
            <Link
              key={item.id}
              to={`?type=${item.id}#community-updates`}
              className={`community-channel community-channel-${item.id}`}
            >
              <span className="community-channel-icon">
                <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span>
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          );
        })}
      </nav>

      <section
        className="community-updates"
        id="community-updates"
        aria-labelledby="community-updates-title"
      >
        <div className="community-updates-heading">
          <div>
            <span className="support-eyebrow">
              WHAT’S HAPPENING IN OUR COMMUNITY
            </span>
            <h2 id="community-updates-title">
              Stories. Gatherings. Shared learning.
            </h2>
          </div>
          <label className="community-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search community</span>
            <input
              id="community-search"
              aria-label="Search community"
              type="search"
              placeholder="Search news, events, workshops…"
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
                  key={item.id}
                  type="button"
                  aria-pressed={kind === item.id}
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
        {hasTemplates && (
          <div className="community-publishing-note">
            <span className="community-note-dot" aria-hidden="true" />
            <p>
              Community announcements are on the way. These templates are
              awaiting confirmed stories, event dates, and workshop details.
            </p>
          </div>
        )}
        <p className="community-results" role="status" aria-live="polite">
          {shown.length} {shown.length === 1 ? "item" : "items"} to explore
          {filtering ? " · Filtered for you" : ""}
        </p>
        {shown.length ? (
          <div className="community-entry-grid">
            {shown.map((entry) => (
              <CommunityCard key={entry.slug} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="community-empty">
            <Search size={32} strokeWidth={1.3} aria-hidden="true" />
            <h3>A different search might help.</h3>
            <p>
              Try another phrase, choose a different category, or explore all
              community updates.
            </p>
            <button type="button" className="support-button" onClick={clear}>
              Show all updates
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>

      <aside className="community-page-callout">
        <HeartHandshake size={38} strokeWidth={1.25} aria-hidden="true" />
        <div>
          <span className="support-eyebrow">CONNECTION BEGINS WITH CARE</span>
          <h2>There’s more than one way to begin.</h2>
          <p>
            Explore our approach to community outreach, or find clear
            information and practical resources at your own pace.
          </p>
        </div>
        <div>
          <Link className="support-button" to="/#our-work">
            Explore our work
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <Link className="community-work-link" to="/resources">
            Browse resources
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </aside>
      <p className="support-photo-note">
        {communityEntries.some((entry) => entry.illustrative) &&
          "Includes illustrative photography, which does not depict our outreach participants. "}
        {hasTemplates &&
          "Content templates do not announce confirmed events or open registrations."}
      </p>
    </div>
  );
}

export function CommunityDetailPage() {
  const { slug } = useParams();
  const { state } = useLocation();
  const entry = findCommunityEntry(slug);
  const backQuery =
    typeof state?.communitySearch === "string"
      ? new URLSearchParams(state.communitySearch).toString()
      : "";
  const backTo = `/community${backQuery ? `?${backQuery}` : ""}`;
  if (!entry)
    return (
      <div className="support-page community-missing">
        <HeartHandshake size={40} strokeWidth={1.3} aria-hidden="true" />
        <span className="support-eyebrow">OUR COMMUNITY</span>
        <h1>This update isn’t here.</h1>
        <p>The address may be incomplete, or the update may have moved.</p>
        <Link className="support-button" to="/community">
          Back to community
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    );
  const Icon = kindIcons[entry.kind];
  const related = communityEntries
    .filter((item) => item.slug !== entry.slug)
    .sort(
      (a, b) => Number(b.kind === entry.kind) - Number(a.kind === entry.kind),
    )
    .slice(0, 3);
  const registrationUrl =
    !entry.template &&
    entry.schedule?.registrationUrl &&
    /^https:\/\//i.test(entry.schedule.registrationUrl)
      ? entry.schedule.registrationUrl
      : undefined;
  return (
    <div className="support-page community-detail">
      <Link className="community-back" to={backTo}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to community
      </Link>
      <header className="community-detail-header">
        <Link
          to={`/community?type=${entry.kind}`}
          className="community-entry-kind"
        >
          <Icon size={15} aria-hidden="true" />
          {communityKindLabel(entry.kind)}
        </Link>
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
        {entry.template && (
          <span className="community-detail-template">
            Content template · Confirmed details coming soon
          </span>
        )}
      </header>
      <figure className="community-detail-photo">
        <img
          src={`/images/${entry.image}.webp`}
          alt={entry.imageAlt}
          style={{ objectPosition: entry.position }}
          width={2400}
          height={1600}
          fetchPriority="high"
        />
        <figcaption>
          {entry.illustrative
            ? "Illustrative photography. Not a photograph of our outreach participants."
            : entry.imageAlt}
        </figcaption>
      </figure>
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
          <span className="community-practical-icon">
            <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h2 id="community-practical-title">
            {entry.kind === "news" ? "About this update" : "Plan your visit"}
          </h2>
          <dl>
            {entry.kind === "news" ? (
              <div>
                <dt>Published</dt>
                <dd>
                  {entry.publishedAt
                    ? communityDate(entry.publishedAt)
                    : "Story coming soon"}
                </dd>
              </div>
            ) : (
              <>
                <div>
                  <dt>Date & time</dt>
                  <dd>
                    {entry.schedule ? (
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
                  <dt>Location & format</dt>
                  <dd>
                    {entry.schedule ? (
                      <>
                        {entry.schedule.location}
                        <br />
                        {entry.schedule.format}
                      </>
                    ) : (
                      "To be announced"
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Who it’s for</dt>
                  <dd>{entry.audience || "Audience to be confirmed"}</dd>
                </div>
                <div>
                  <dt>Participation</dt>
                  <dd>
                    {registrationUrl
                      ? "See the organiser’s registration details"
                      : "Not open for registration"}
                  </dd>
                </div>
              </>
            )}
          </dl>
          {registrationUrl && (
            <a
              className="support-button"
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Registration details
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          {entry.template && (
            <p className="community-practical-note">
              {entry.kind === "news"
                ? "This story template is awaiting content. No participant accounts or quotations have been published."
                : "This is a content template. No date, venue, facilitator, or places have been confirmed."}
            </p>
          )}
          <Link className="community-work-link" to="/resources">
            Explore resources
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </aside>
      </div>
      <section
        className="community-related"
        aria-labelledby="community-related-title"
      >
        <div className="community-related-heading">
          <div>
            <span className="support-eyebrow">KEEP EXPLORING</span>
            <h2 id="community-related-title">More from our community.</h2>
          </div>
          <Link to={backTo} className="community-work-link">
            All community updates
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="community-entry-grid">
          {related.map((item) => (
            <CommunityCard key={item.slug} entry={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
