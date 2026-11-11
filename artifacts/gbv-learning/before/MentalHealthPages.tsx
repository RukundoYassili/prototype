import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Clock3,
  Download,
  Eye,
  FileText,
  HeartHandshake,
  Layers3,
  Printer,
  Search,
  Compass,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  chapterPath,
  findMentalHealthChapter,
  mentalHealthChapters,
} from "./chapters";
import type { ChapterBlock, MentalHealthChapter } from "./types";
import {
  BlockVisuals,
  SectionVisuals,
  VisualStory,
  sectionStories,
} from "./LearningVisuals";
import type { VisualStory as Story } from "./visuals";
import "./mental-health.css";

const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Kigali",
  }).format(new Date(date));

function useChapterRouteFocus() {
  const { hash } = useLocation();
  useEffect(() => {
    // The reading module may arrive after the global route scroll effect.
    const frame = requestAnimationFrame(() => {
      const target = hash
        ? document.getElementById(hash.slice(1))
        : document.getElementById("service-main");
      if (hash) target?.scrollIntoView();
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
}

function Text({ text }: { text: string }) {
  const { pathname } = useLocation();
  return (
    <>
      {text.split(/(\[\d+(?:(?:,\s*|[-–])\d+)*\])/).map((part, index) =>
        /^\[\d/.test(part) ? (
          <span className="mh-inline-citations" key={index}>
            [
            {part
              .slice(1, -1)
              .split(/(\d+)/)
              .map((number, i) =>
                /^\d+$/.test(number) ? (
                  <Link
                    key={i}
                    to={`${pathname}#reference-${number}`}
                    aria-label={`Reference ${number}`}
                  >
                    {number}
                  </Link>
                ) : (
                  <span key={i}>{number}</span>
                ),
              )}
            ]
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

function LabelledText({ text }: { text: string }) {
  const separator = text.indexOf(":");
  return separator > 0 && separator < 50 ? (
    <>
      <strong>{text.slice(0, separator + 1)}</strong>
      <Text text={text.slice(separator + 1)} />
    </>
  ) : (
    <Text text={text} />
  );
}

function Blocks({
  blocks,
  tableLabel,
  stories = [],
  references = [],
  chapterSlug,
}: {
  blocks: ChapterBlock[];
  tableLabel: string;
  stories?: Story[];
  references?: MentalHealthChapter["references"];
  chapterSlug?: string;
}) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "heading" && block.text === "About this chapter")
          return <h2 key={index}>{block.text}</h2>;
        if (block.type === "heading")
          return (
            <h3 key={index} id={block.id}>
              {block.text}
            </h3>
          );
        if (block.type === "example" || block.type === "subsection")
          return (
            <div
              key={block.id}
              className={
                block.type === "example" ? "mh-example" : "mh-source-activity"
              }
            >
              <h3 id={block.id}>{block.title}</h3>
              <Blocks
                blocks={block.blocks}
                tableLabel={block.title}
                references={references}
                chapterSlug={chapterSlug}
              />
              {chapterSlug && (
                <BlockVisuals
                  chapterSlug={chapterSlug}
                  sourceBlockId={block.id}
                />
              )}
            </div>
          );
        if (block.type === "disclosure")
          return (
            <details key={index} className="mh-answer mh-source-answers">
              <summary>
                {block.title}
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <div>
                <Blocks
                  blocks={block.blocks}
                  tableLabel={tableLabel}
                  references={references}
                  chapterSlug={chapterSlug}
                />
              </div>
            </details>
          );
        if (block.type === "references")
          return (
            <div className="mh-references" key={index}>
              <ol>
                {block.numbers.map((number) => {
                  const reference = references.find(
                    (item) => item.number === number,
                  );
                  return reference ? (
                    <SourceReference
                      key={number}
                      reference={reference}
                      sourceText={block.sourceText}
                    />
                  ) : (
                    <li key={number}>{block.sourceText}</li>
                  );
                })}
              </ol>
            </div>
          );
        if (block.type === "list")
          return (
            <ul key={index} className="mh-content-list">
              {block.items.map((item) => (
                <li key={item}>
                  <LabelledText text={item} />
                </li>
              ))}
            </ul>
          );
        if (block.type === "table")
          return (
            <div className="mh-table-container" key={index}>
              <p className="mh-table-help">Scroll to read the full table.</p>
              <div
                className="mh-table-scroll"
                role="region"
                aria-label={`${tableLabel} table`}
                tabIndex={0}
              >
                <table>
                  <caption className="sr-only">{tableLabel}</caption>
                  <thead>
                    <tr>
                      {block.headers.map((heading) => (
                        <th key={heading} scope="col">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, col) =>
                          col === 0 ? (
                            <th key={col} scope="row">
                              {cell}
                            </th>
                          ) : (
                            <td key={col}>
                              {block.revealAnswers ? (
                                <details className="mh-table-answer">
                                  <summary>Show answer</summary>
                                  <p>
                                    <Text text={cell} />
                                  </p>
                                </details>
                              ) : (
                                <Text text={cell} />
                              )}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        if (block.type === "questions")
          return (
            <div className="mh-knowledge-check" key={index}>
              {block.items.map((item) => (
                <details className="mh-answer" key={item.question}>
                  <summary>
                    <span>{item.question}</span>
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <p>
                    <strong>Answer: </strong>
                    <Text text={item.answer} />
                  </p>
                </details>
              ))}
            </div>
          );
        const example = block.text.match(
          /^(Example (?:[A-Z]|\d+): .*?\.) (.+)$/,
        );
        const sourceStory = stories.find(
          (story) =>
            story.sourceExample && block.text.startsWith(story.sourceExample),
        );
        const sourceHeadingId = sourceStory
          ? `source-example-${sourceStory.id}`
          : undefined;
        return example ? (
          <div className="mh-example" key={index}>
            <h3 id={sourceHeadingId}>{example[1]}</h3>
            <p>
              <Text text={example[2]} />
            </p>
            {stories
              .filter(
                (story) =>
                  story.sourceExample &&
                  block.text.startsWith(story.sourceExample),
              )
              .map((story) => (
                <VisualStory
                  key={story.id}
                  story={story}
                  sourceHeadingId={sourceHeadingId}
                />
              ))}
          </div>
        ) : (
          <p key={index}>
            <LabelledText text={block.text} />
          </p>
        );
      })}
    </>
  );
}

function SourceReference({
  reference,
  sourceText,
}: {
  reference: MentalHealthChapter["references"][number];
  sourceText?: string;
}) {
  const raw = (
    sourceText || `${reference.text}${reference.url ? ` ${reference.url}` : ""}`
  ).replace(/^\[\d+\]\s*/, "");
  const index = reference.url ? raw.indexOf(reference.url) : -1;
  return (
    <li id={`reference-${reference.number}`}>
      <span className="mh-reference-number">[{reference.number}]</span>
      <div>
        <p>
          {index >= 0 && reference.url ? (
            <>
              <Text text={raw.slice(0, index)} />
              <a href={reference.url} target="_blank" rel="noopener noreferrer">
                {reference.url}
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <Text text={raw.slice(index + reference.url.length)} />
            </>
          ) : (
            <Text text={raw} />
          )}
        </p>
      </div>
    </li>
  );
}

function ChapterCard({ chapter }: { chapter: MentalHealthChapter }) {
  return (
    <article className="mh-chapter-card">
      <Link
        to={chapterPath(chapter.slug)}
        aria-label={`Read Chapter ${String(chapter.number).padStart(2, "0")}: ${chapter.title}`}
      >
        <div className="mh-card-photo">
          <img
            src={`/images/${chapter.image}.webp`}
            alt=""
            loading="lazy"
            width={2400}
            height={1600}
            style={{ objectPosition: chapter.position }}
          />
          <span>CHAPTER {String(chapter.number).padStart(2, "0")}</span>
        </div>
        <div className="mh-card-body">
          <div className="mh-card-meta">
            <BookOpen size={14} aria-hidden="true" />
            <span>{chapter.sections.length} sections</span>
            <span>English · Educational draft</span>
          </div>
          <h3>{chapter.title}</h3>
          <p>{chapter.summary}</p>
          <span className="mh-card-time">
            <Clock3 size={14} aria-hidden="true" />
            {chapter.studyTime}
          </span>
          <span className="mh-card-visuals">
            <Eye size={15} aria-hidden="true" />
            Visual examples · Optional reflection
          </span>
          <span className="mh-card-action">
            Read the full chapter
            <ArrowUpRight size={19} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function WhyMentalHealthPage() {
  useChapterRouteFocus();
  const [query, setQuery] = useState("");
  const filteredChapters = mentalHealthChapters.filter((chapter) =>
    [
      chapter.title,
      chapter.summary,
      ...chapter.sections.map((section) => section.title),
    ]
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const sectionCount = mentalHealthChapters.reduce(
    (total, chapter) => total + chapter.sections.length,
    0,
  );
  return (
    <div className="support-page mh-library">
      <header className="mh-library-hero">
        <div>
          <span className="support-eyebrow">
            VUGA NDAKUMVA · LEARNING CENTER
          </span>
          <h1>
            A little understanding.
            <br />
            <span>A meaningful step forward.</span>
          </h1>
          <p>
            Explore mental health through detailed lessons, visual examples, and
            optional reflection. Start with the fundamentals and continue at
            your own pace.
          </p>
          <Link className="support-button" to="#mental-health-chapters">
            Explore the chapters
            <ArrowDown size={18} aria-hidden="true" />
          </Link>
          <div className="mh-library-meta">
            <BookOpen size={15} aria-hidden="true" />
            <span>{mentalHealthChapters.length} chapters available</span>
            <span>English learning series</span>
          </div>
        </div>
        <figure>
          <img
            src="/images/mental-health-learning.webp"
            alt="Illustrative photograph of a mental health learning workspace"
            width={2400}
            height={1600}
            fetchPriority="high"
          />
          <figcaption>
            Illustrative photography. The learning content is from the supplied
            VUGA NDAKUMVA drafts.
          </figcaption>
        </figure>
      </header>
      <div
        className="mh-center-overview"
        aria-label="Inside the learning center"
      >
        <div>
          <BookOpen size={22} aria-hidden="true" />
          <span>
            <strong>{mentalHealthChapters.length} chapters</strong>One connected
            learning series
          </span>
        </div>
        <div>
          <Layers3 size={22} aria-hidden="true" />
          <span>
            <strong>{sectionCount} sections</strong>Explore one idea at a time
          </span>
        </div>
        <div>
          <Eye size={22} aria-hidden="true" />
          <span>
            <strong>Learn in different ways</strong>Stories, diagrams &
            reflection
          </span>
        </div>
      </div>
      <section className="mh-start-here" aria-labelledby="mh-start-title">
        <span className="mh-start-icon">
          <Compass size={28} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div>
          <span className="support-eyebrow">YOUR STARTING POINT</span>
          <h2 id="mh-start-title">New to mental health? Begin here.</h2>
          <p>
            Build a foundation with Chapter 01, or choose any topic below. There
            is no required order and no deadline.
          </p>
        </div>
        <Link
          className="support-button"
          to={chapterPath(mentalHealthChapters[0].slug)}
        >
          Start learning <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
      <div className="mh-draft-note">
        <FileText size={21} strokeWidth={1.5} aria-hidden="true" />
        <div>
          <strong>Educational drafts · Version 1.1 · 9 November 2026</strong>
          <p>
            The supplied chapters have not been clinically reviewed or approved
            for public release. They provide educational information rather than
            diagnosis or individual treatment.
          </p>
        </div>
      </div>
      <section
        className="mh-library-chapters"
        id="mental-health-chapters"
        aria-labelledby="mh-library-title"
      >
        <div className="support-section-heading">
          <span className="support-eyebrow">
            THE MENTAL HEALTH LEARNING SERIES
          </span>
          <h2 id="mh-library-title">
            Take your next step
            <br />
            in understanding.
          </h2>
          <p>
            Read each chapter in full, explore its examples, and return to the
            sections that matter to you. Reflection is optional; you do not need
            to share personal information.
          </p>
        </div>
        <div className="mh-library-toolbar">
          <div>
            <strong>Explore the library</strong>
            <span role="status" aria-live="polite">
              {filteredChapters.length} of {mentalHealthChapters.length}{" "}
              chapters
            </span>
          </div>
          <label className="mh-chapter-search">
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">Search chapters</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a topic or chapter…"
            />
          </label>
        </div>
        <div className="mh-chapter-grid">
          {filteredChapters.map((chapter) => (
            <ChapterCard key={chapter.slug} chapter={chapter} />
          ))}
        </div>
        {filteredChapters.length === 0 && (
          <div className="mh-search-empty">
            <Search size={28} aria-hidden="true" />
            <h3>No chapters found</h3>
            <p>Try a broader topic, such as emotions, stress, or wellbeing.</p>
            <button type="button" onClick={() => setQuery("")}>
              Show all chapters
            </button>
          </div>
        )}
      </section>
      <section
        className="mh-series-continuation"
        aria-labelledby="mh-more-title"
      >
        <span className="mh-continuation-icon">
          <Layers3 size={30} strokeWidth={1.35} aria-hidden="true" />
        </span>
        <div>
          <span className="support-eyebrow">THE SERIES CONTINUES</span>
          <h2 id="mh-more-title">Keep learning, at your own pace.</h2>
          <p>
            Return to a useful idea, revisit a visual example, or download a
            chapter to read offline. Every chapter is here when you need it.
          </p>
        </div>
        <BookOpen size={44} strokeWidth={1} aria-hidden="true" />
      </section>
      <div className="information-source">
        <BookOpen size={17} aria-hidden="true" />
        <p>
          The chapters include their original references and source notes.
          Additional background is available in the{" "}
          <a
            href="https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"
            target="_blank"
            rel="noopener noreferrer"
          >
            World Health Organization’s mental health overview
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          . Source citations are retained as printed.
        </p>
      </div>
      <aside className="mh-support-callout">
        <HeartHandshake size={34} strokeWidth={1.4} aria-hidden="true" />
        <div>
          <h2>Information is one place to begin.</h2>
          <p>
            When you want to explore support, find a pathway that makes sense
            for your circumstances.
          </p>
        </div>
        <Link to="/support" className="support-button">
          Find support
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}

function ChapterContents({
  chapter,
  activeId,
}: {
  chapter: MentalHealthChapter;
  activeId: string;
}) {
  const [wide, setWide] = useState(
    () => window.matchMedia("(min-width: 1101px)").matches,
  );
  const [open, setOpen] = useState(false);
  const contentsNav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!wide) return;
    const panel = contentsNav.current;
    const current = panel?.querySelector<HTMLElement>(
      'a[aria-current="location"]',
    );
    if (!panel || !current) return;
    const bounds = panel.getBoundingClientRect();
    const item = current.getBoundingClientRect();
    // Adjust only the index's own scroll position, never the document.
    if (item.top < bounds.top + 6) panel.scrollTop += item.top - bounds.top - 6;
    else if (item.bottom > bounds.bottom - 6)
      panel.scrollTop += item.bottom - bounds.bottom + 6;
  }, [activeId, wide, chapter.slug]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1101px)");
    const update = () => {
      setWide(query.matches);
      setOpen(false);
    };
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => setOpen(false), [chapter.slug]);
  const items = [
    {
      id: "learning-goals",
      number: "",
      title: chapter.goalsHeading || "Learning goals",
    },
    ...chapter.sections,
    ...(chapter.endMatterPlacement === "inline"
      ? []
      : [
          {
            id: "chapter-references",
            number: "",
            title: chapter.referenceHeading,
          },
          {
            id: "chapter-editorial-notes",
            number: "",
            title: "Source & editorial notes",
          },
        ]),
  ];
  return (
    <aside className="mh-contents">
      <h2>
        <BookOpen size={16} aria-hidden="true" /> In this chapter
      </h2>
      <button
        className="mh-contents-toggle"
        type="button"
        aria-expanded={wide || open}
        aria-controls="mh-chapter-contents"
        onClick={() => setOpen(!open)}
      >
        In this chapter
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <nav
        ref={contentsNav}
        id="mh-chapter-contents"
        aria-label="Chapter contents"
        hidden={!wide && !open}
      >
        {items.map((item) => (
          <Link
            key={item.id}
            to={`${chapterPath(chapter.slug)}#${item.id}`}
            aria-current={activeId === item.id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            <span>{item.number}</span>
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="mh-contents-support">
        <p>You can pause or skip an exercise at any time.</p>
        <Link to="/urgent-help">
          Urgent help information
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}

export function MentalHealthChapterPage() {
  useChapterRouteFocus();
  const { slug } = useParams();
  const chapter = findMentalHealthChapter(slug);
  const article = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState("learning-goals");
  useEffect(() => {
    if (!chapter) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top =
          (document.querySelector(".site-header")?.getBoundingClientRect()
            .height || 100) + 60;
        const sections = Array.from(
          article.current?.querySelectorAll<HTMLElement>(
            "[data-chapter-section]",
          ) || [],
        );
        const current = sections
          .filter((section) => section.getBoundingClientRect().top <= top)
          .at(-1);
        setActiveId(current?.id || "learning-goals");
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [chapter]);
  useEffect(() => {
    let saved: { element: HTMLDetailsElement; open: boolean }[] = [];
    const before = () => {
      if (saved.length) return;
      saved = Array.from(
        article.current?.querySelectorAll<HTMLDetailsElement>("details") || [],
      ).map((element) => ({ element, open: element.open }));
      saved.forEach(({ element }) => {
        element.open = true;
      });
    };
    const after = () => {
      saved.forEach(({ element, open }) => {
        element.open = open;
      });
      saved = [];
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      after();
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [chapter]);
  if (!chapter)
    return (
      <div className="support-page mh-missing">
        <BookOpen size={38} strokeWidth={1.3} aria-hidden="true" />
        <span className="support-eyebrow">
          THE MENTAL HEALTH LEARNING SERIES
        </span>
        <h1>This chapter isn’t available.</h1>
        <p>Explore the chapters currently available in the learning series.</p>
        <Link className="support-button" to="/why-mental-health">
          Back to the chapters
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    );
  const currentIndex = mentalHealthChapters.findIndex(
    (item) => item.slug === chapter.slug,
  );
  const previous = mentalHealthChapters[currentIndex - 1];
  const next = mentalHealthChapters[currentIndex + 1];
  const editorialStatus =
    chapter.publicationStatus ||
    chapter.frontMatter.find((text) => text.startsWith("Editorial status:"));
  const safety = chapter.frontMatter.find(
    (text) =>
      text.startsWith("Safety:") || text.startsWith("For immediate danger:"),
  );

  return (
    <div
      className={`support-page mh-reader${chapter.endMatterPlacement === "inline" ? " mh-continuation" : ""}`}
      key={chapter.slug}
    >
      <nav className="mh-breadcrumb" aria-label="Breadcrumb">
        <Link to="/why-mental-health">
          <ArrowLeft size={15} aria-hidden="true" />
          Why Mental Health
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">
          Chapter {String(chapter.number).padStart(2, "0")}
        </span>
      </nav>
      <header className="mh-reader-header">
        <span className="support-eyebrow">
          {chapter.author} · MENTAL HEALTH EDUCATION
        </span>
        <span className="mh-reader-chapter-number">
          CHAPTER {String(chapter.number).padStart(2, "0")}
        </span>
        <h1>{chapter.title}</h1>
        <div className="mh-reader-metadata">
          <span>
            <Clock3 size={15} aria-hidden="true" />
            {chapter.studyTime}
          </span>
          <span>{chapter.sections.length} sections</span>
          <span>{chapter.language}</span>
        </div>
        <p className="mh-reader-version">
          {chapter.editionText || (
            <>
              Version {chapter.version} · {dateLabel(chapter.date)} ·
              Educational draft
            </>
          )}
        </p>
        <div className="mh-reader-actions">
          <a href={chapter.pdfUrl} download>
            <Download size={16} aria-hidden="true" />
            Download source PDF<span>({chapter.sourcePages} pages)</span>
          </a>
          <button type="button" onClick={() => window.print()}>
            <Printer size={16} aria-hidden="true" />
            Print chapter
          </button>
        </div>
      </header>
      <div className="mh-draft-note mh-reader-draft">
        <FileText size={21} strokeWidth={1.5} aria-hidden="true" />
        <div>
          <p>
            {editorialStatus ||
              "Educational draft. This chapter has not been clinically approved for public release. It provides education, not diagnosis or individual treatment."}
          </p>
        </div>
      </div>
      <div className="mh-reader-layout">
        <ChapterContents chapter={chapter} activeId={activeId} />
        <article
          ref={article}
          className="mh-article"
          aria-label={`Chapter ${chapter.number}: ${chapter.title}`}
        >
          <section
            id="chapter-introduction"
            className="mh-chapter-introduction"
          >
            {!chapter.introductionBlocks?.some(
              (block) =>
                block.type === "heading" && block.text === "About this chapter",
            ) && <h2>About this chapter</h2>}
            {chapter.introductionBlocks ? (
              <Blocks
                blocks={chapter.introductionBlocks.filter(
                  (block) =>
                    !(
                      block.type === "paragraph" &&
                      block.text === editorialStatus
                    ),
                )}
                tableLabel="Chapter introduction"
                references={chapter.references}
                chapterSlug={chapter.slug}
              />
            ) : (
              chapter.frontMatter
                .filter(
                  (text) =>
                    !text.startsWith("Editorial status:") && text !== safety,
                )
                .map((text) => (
                  <p key={text}>
                    <LabelledText text={text} />
                  </p>
                ))
            )}
            {safety && (
              <div className="mh-source-safety">
                <p>
                  <LabelledText text={safety} />
                </p>
                <Link to="/urgent-help">
                  Urgent help information
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            )}
            <aside
              className="mh-learning-note"
              aria-label="Learning at your own pace"
            >
              <Eye size={22} strokeWidth={1.6} aria-hidden="true" />
              <div>
                <strong>Your pace. Your choice.</strong>
                <p>
                  Read, explore the visual examples, or skip an optional
                  practice. Keep reflections private. Nothing to submit, and no
                  personal responses are collected.
                </p>
                <p>
                  The photo scenes are AI-generated fictional examples, not real
                  participants or case histories. Diagrams and captions
                  accompany the original lessons.
                </p>
              </div>
            </aside>
          </section>
          <section
            id="learning-goals"
            data-chapter-section
            aria-labelledby="mh-learning-goals-title"
          >
            <span className="support-eyebrow">BEFORE YOU BEGIN</span>
            <h2 id="mh-learning-goals-title">
              {chapter.goalsHeading || "Learning goals"}
            </h2>
            <ul className="mh-content-list">
              {chapter.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
            {chapter.afterGoals && (
              <Blocks
                blocks={chapter.afterGoals}
                tableLabel="Before you begin"
                references={chapter.references}
                chapterSlug={chapter.slug}
              />
            )}
          </section>
          {chapter.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              data-chapter-section
              aria-labelledby={`${section.id}-title`}
              className={`${section.number === chapter.reflectionSection ? "mh-reflection" : ""} ${section.title === "Chapter summary" ? "mh-chapter-summary" : ""}`}
            >
              <h2 id={`${section.id}-title`}>
                {section.number && (
                  <span className="mh-section-number">{section.number}</span>
                )}
                {section.title}
              </h2>
              <Blocks
                blocks={section.blocks}
                tableLabel={`${section.number} ${section.title}`}
                stories={sectionStories(chapter.slug, section.id)}
                references={chapter.references}
                chapterSlug={chapter.slug}
              />
              <SectionVisuals
                chapterSlug={chapter.slug}
                sectionId={section.id}
              />
              {section.number === chapter.reflectionSection && (
                <a
                  className="mh-worksheet-download"
                  href={chapter.worksheetUrl}
                  download
                >
                  <Download size={16} aria-hidden="true" />
                  Download reflection prompts<span>TXT</span>
                </a>
              )}
            </section>
          ))}
          {chapter.endMatterPlacement !== "inline" && (
            <>
              <section
                id="chapter-references"
                data-chapter-section
                aria-labelledby="mh-references-title"
                className="mh-references"
              >
                <span className="support-eyebrow">
                  SOURCES IN THE SUPPLIED CHAPTER
                </span>
                <h2 id="mh-references-title">{chapter.referenceHeading}</h2>
                <ol>
                  {chapter.references.map((reference) => (
                    <li
                      key={reference.number}
                      id={`reference-${reference.number}`}
                    >
                      <span className="mh-reference-number">
                        [{reference.number}]
                      </span>
                      <div>
                        <p>{reference.text}</p>
                        {reference.url && (
                          <a
                            href={reference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {reference.url}
                            <ArrowUpRight size={13} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
                {chapter.referenceNotes.map((note) => (
                  <p key={note} className="mh-source-note">
                    {note}
                  </p>
                ))}
                {chapter.references[0]?.checkedAt && (
                  <p className="mh-reference-check">
                    Reference links checked{" "}
                    {dateLabel(chapter.references[0].checkedAt)}. Link checking
                    is not a clinical review of the chapter.
                  </p>
                )}
              </section>
              <section
                id="chapter-editorial-notes"
                data-chapter-section
                className="mh-editorial-section"
                aria-labelledby="mh-editorial-title"
              >
                <h2 id="mh-editorial-title">Source & editorial notes</h2>
                {chapter.editorialReview.length > 0 && (
                  <details className="mh-editorial-details">
                    <summary>
                      Section A. Review of the existing handbook
                      <ChevronDown size={18} aria-hidden="true" />
                    </summary>
                    <div>
                      <Blocks
                        blocks={chapter.editorialReview}
                        tableLabel="Review of the existing handbook"
                      />
                    </div>
                  </details>
                )}
                <details className="mh-editorial-details">
                  <summary>
                    {chapter.editorialHeading}
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <div>
                    <Blocks
                      blocks={chapter.approval}
                      tableLabel={chapter.editorialHeading}
                    />
                  </div>
                </details>
                <p className="mh-original-file">
                  Original document: {chapter.originalFilename}
                </p>
              </section>
            </>
          )}
          {chapter.endMatterPlacement === "inline" && (
            <p className="mh-original-file">
              Original document: {chapter.originalFilename}
            </p>
          )}
        </article>
      </div>
      <nav className="mh-chapter-pagination" aria-label="Chapter navigation">
        {previous ? (
          <Link to={chapterPath(previous.slug)}>
            <ArrowLeft size={20} aria-hidden="true" />
            <span>
              <small>PREVIOUS CHAPTER</small>
              <strong>{previous.title}</strong>
            </span>
          </Link>
        ) : (
          <Link to="/why-mental-health">
            <ArrowLeft size={20} aria-hidden="true" />
            <span>
              <small>THE LEARNING SERIES</small>
              <strong>Back to all chapters</strong>
            </span>
          </Link>
        )}
        {next ? (
          <Link to={chapterPath(next.slug)}>
            <span>
              <small>
                NEXT CHAPTER · {String(next.number).padStart(2, "0")}
              </small>
              <strong>{next.title}</strong>
            </span>
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        ) : (
          <Link to="/why-mental-health">
            <span>
              <small>THE SERIES CONTINUES</small>
              <strong>Explore the available chapters</strong>
            </span>
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        )}
      </nav>
    </div>
  );
}
