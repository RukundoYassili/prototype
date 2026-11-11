import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock3,
  Flower2,
  Search,
  X,
} from "lucide-react";
import type { CSSProperties } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  blogPosts,
  blogTopics,
  findBlogPost,
  readingMinutes,
  topicLabel,
  topicPath,
  type BlogPost,
} from "./posts";

export function BlogCard({
  post,
  variant = "standard",
}: {
  post: BlogPost;
  variant?: "standard" | "featured" | "compact";
}) {
  const { pathname, search, state } = useLocation();
  const Heading = variant === "featured" ? "h2" : "h3";
  return (
    <article className={`blog-card blog-card--${variant}`}>
      <Link
        className="blog-card-link"
        to={`/blog/${post.slug}`}
        state={{
          blogSearch:
            pathname === "/blog"
              ? search
              : typeof state?.blogSearch === "string"
                ? state.blogSearch
                : "",
        }}
        aria-label={`Read ${post.title}`}
      >
        <div className="blog-card-photo">
          <img
            src={`/images/${post.image}.webp`}
            style={
              {
                "--blog-image-position": post.position,
                "--blog-portrait-position":
                  post.thumbnailPosition || post.position,
              } as CSSProperties
            }
            alt=""
            loading="lazy"
          />
          {variant === "featured" && (
            <span className="blog-featured-badge">
              <Flower2 size={14} aria-hidden="true" />
              FEATURED READ
            </span>
          )}
        </div>
        <div className="blog-card-body">
          <div className="blog-meta">
            <span>{topicLabel(post.topic)}</span>
            <span className="blog-meta-dot" />
            <span>
              <Clock3 size={12} aria-hidden="true" />
              {readingMinutes(post)} min read
            </span>
          </div>
          <Heading>{post.title}</Heading>
          {variant !== "compact" && <p>{post.excerpt}</p>}
          <span className="blog-read-link">
            Read the article
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function BlogPreview() {
  return (
    <section
      className="support-section blog-home-section"
      aria-labelledby="blog-home-title"
    >
      <div className="support-section-heading support-heading-row">
        <div>
          <span className="support-eyebrow">FROM THE JOURNAL</span>
          <h2 id="blog-home-title">
            Thoughtful reads.
            <br />A little more clarity.
          </h2>
        </div>
        <Link to="/blog" className="support-text-link">
          View all articles
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <div className="blog-home-grid">
        {blogPosts.slice(0, 3).map((post) => (
          <BlogCard key={post.slug} post={post} variant="compact" />
        ))}
      </div>
    </section>
  );
}

export function BlogPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const topic = params.get("topic") || "all";
  const filtering = !!query.trim() || topic !== "all";
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(window.location.search);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: key === "q" });
  };
  const shown = blogPosts.filter(
    (post) =>
      (topic === "all" || post.topic === topic) &&
      [
        post.title,
        post.excerpt,
        topicLabel(post.topic),
        ...post.sections.flatMap((section) => [
          section.title,
          ...section.paragraphs,
          ...(section.points || []),
        ]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const featured = filtering ? undefined : shown[0];
  const gridPosts = featured ? shown.slice(1) : shown;
  return (
    <div className="support-page blog-page">
      <header className="blog-intro">
        <div>
          <span className="support-eyebrow">
            <Flower2 size={15} aria-hidden="true" />
            THE VUGA NDAKUMVA JOURNAL
          </span>
          <h1>
            Thoughtful reads.
            <br />
            <span>A little more clarity.</span>
          </h1>
        </div>
        <div className="blog-intro-note">
          <span>UNDERSTANDING, AT YOUR OWN PACE</span>
          <p>
            Ideas and information for understanding yourself, supporting others,
            and finding a way forward. Start with what matters to you.
          </p>
        </div>
      </header>
      <section className="blog-discovery" aria-label="Find articles">
        <div className="blog-search-row">
          <h2>Find your next read.</h2>
          <label className="blog-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search blog</span>
            <input
              id="blog-search"
              type="search"
              value={query}
              placeholder="Search articles, topics, questions…"
              aria-label="Search blog"
              onChange={(event) => update("q", event.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear blog search"
                onClick={() => {
                  update("q", "");
                  document.getElementById("blog-search")?.focus();
                }}
              >
                <X size={16} />
              </button>
            )}
          </label>
        </div>
        <div className="blog-filter-row">
          <div className="blog-topics" role="group" aria-label="Blog topics">
            <button
              type="button"
              aria-pressed={topic === "all"}
              onClick={() => update("topic", "all")}
            >
              All articles
            </button>
            {blogTopics.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={topic === item.id}
                onClick={() => update("topic", item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          {filtering && (
            <button
              type="button"
              className="blog-reset"
              onClick={() => setParams({})}
            >
              Clear all
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </section>
      <div className="blog-result-note" role="status" aria-live="polite">
        {shown.length} {shown.length === 1 ? "article" : "articles"} to explore
        {filtering && <span> · Filtered for you</span>}
      </div>
      {featured && <BlogCard post={featured} variant="featured" />}
      {shown.length ? (
        <section
          className="blog-articles"
          aria-labelledby="blog-articles-title"
        >
          <div className="blog-grid-heading">
            <h2 id="blog-articles-title">
              {featured ? "More to explore." : "From the journal."}
            </h2>
            <span>TAKE A MOMENT. FOLLOW YOUR CURIOSITY.</span>
          </div>
          <div className="blog-grid">
            {gridPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : (
        <section className="blog-empty" aria-labelledby="blog-empty-title">
          <BookOpen size={34} strokeWidth={1.3} aria-hidden="true" />
          <h2 id="blog-empty-title">A different search might help.</h2>
          <p>
            No articles match these choices. Try another phrase or explore all
            topics.
          </p>
          <button
            type="button"
            className="support-button"
            onClick={() => setParams({})}
          >
            Show all articles
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </section>
      )}
      <aside className="blog-library-callout">
        <div>
          <span className="support-eyebrow">
            LOOKING FOR SOMETHING PRACTICAL?
          </span>
          <h2>Keep a little guidance close.</h2>
          <p>
            Explore short practices, plain-language guides, and worksheets in
            our resource library.
          </p>
        </div>
        <Link to="/resources" className="support-button">
          Explore resources
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </aside>
      <p className="support-photo-note">
        General educational reading, not a diagnosis or personalized medical or
        legal advice. Photography is illustrative and does not identify service
        users.
      </p>
    </div>
  );
}

export function BlogPostPage() {
  const { slug } = useParams();
  const { state } = useLocation();
  const post = findBlogPost(slug);
  const backQuery =
    typeof state?.blogSearch === "string"
      ? new URLSearchParams(state.blogSearch).toString()
      : "";
  const backTo = `/blog${backQuery ? `?${backQuery}` : ""}`;
  if (!post)
    return (
      <div className="support-page blog-not-found">
        <BookOpen size={42} strokeWidth={1.2} aria-hidden="true" />
        <span className="support-eyebrow">THE JOURNAL</span>
        <h1>That article isn’t here.</h1>
        <p>
          It may have moved, or the address may be incomplete. There is more to
          explore in the journal.
        </p>
        <Link className="support-button" to="/blog">
          Back to the blog
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    );
  const related = blogPosts
    .filter((item) => item.slug !== post.slug)
    .sort(
      (a, b) => Number(b.topic === post.topic) - Number(a.topic === post.topic),
    )
    .slice(0, 2);
  return (
    <div className="support-page blog-reader">
      <Link className="blog-back" to={backTo}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to the blog
      </Link>
      <header className="blog-reader-header">
        <Link className="blog-topic-label" to={`/blog?topic=${post.topic}`}>
          {topicLabel(post.topic)}
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="blog-reader-meta">
          <span>
            <Clock3 size={15} aria-hidden="true" />
            {readingMinutes(post)} min read
          </span>
          <span>
            <BookOpen size={15} aria-hidden="true" />
            General educational reading
          </span>
        </div>
      </header>
      <figure className="blog-reader-cover">
        <img
          src={`/images/${post.image}.webp`}
          style={{ objectPosition: post.position }}
          alt=""
          fetchPriority="high"
        />
        <figcaption>
          Illustrative photography. People pictured are not identified as
          clients, survivors, or people using substances.
        </figcaption>
      </figure>
      <div className="blog-reading-layout">
        <aside className="blog-contents">
          <nav aria-label="Article contents">
            <span className="support-eyebrow">IN THIS ARTICLE</span>
            {post.sections.map((section, i) => (
              <Link
                to={`/blog/${post.slug}#${section.id}`}
                state={state}
                key={section.id}
              >
                <span>0{i + 1}</span>
                {section.title}
              </Link>
            ))}
            <Link to={`/blog/${post.slug}#article-sources`} state={state}>
              <span>↗</span>Sources & further reading
            </Link>
          </nav>
          <Link to={topicPath(post.topic)} className="blog-contents-support">
            Explore support options
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </aside>
        <article className="blog-prose" aria-label={post.title}>
          <p className="blog-lead">{post.introduction}</p>
          {post.sections.map((section) => (
            <section key={section.id} id={section.id} tabIndex={-1}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.points && (
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <aside
            className="blog-takeaway"
            aria-label="A thought to take with you"
          >
            <Flower2 size={28} strokeWidth={1.3} aria-hidden="true" />
            <div>
              <span className="support-eyebrow">
                A THOUGHT TO TAKE WITH YOU
              </span>
              <p>{post.takeaway}</p>
            </div>
          </aside>
          <section className="blog-sources" id="article-sources" tabIndex={-1}>
            <h2>Sources & further reading</h2>
            <p>
              These independent sources offer further context. Linking to an
              organization does not imply its endorsement of this website.
              Sources checked 8 November 2026.
            </p>
            <ul>
              {post.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  {source.note && <small>{source.note}</small>}
                </li>
              ))}
            </ul>
            <p className="blog-article-boundary">
              This is general information, not a diagnosis, treatment plan, or
              personalized medical or legal advice. Speak with an appropriately
              qualified professional about your circumstances. For immediate
              danger, use <Link to="/urgent-help">urgent-help information</Link>
              .
            </p>
          </section>
          <div className="blog-reader-end">
            <Link to={backTo} className="support-text-link">
              <ArrowLeft size={16} aria-hidden="true" />
              Back to all articles
            </Link>
            <Link to={topicPath(post.topic)} className="support-button">
              Explore related support
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </article>
      </div>
      <section className="blog-related" aria-labelledby="blog-related-title">
        <div className="blog-grid-heading">
          <div>
            <span className="support-eyebrow">KEEP EXPLORING</span>
            <h2 id="blog-related-title">A little more perspective.</h2>
          </div>
          <Link className="support-text-link" to="/blog">
            View the journal
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="blog-related-grid">
          {related.map((item) => (
            <BlogCard key={item.slug} post={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
