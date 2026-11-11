import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Eye,
  FileText,
  HeartHandshake,
  Layers3,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  chapterPath,
  findMentalHealthChapter,
  mentalHealthChapters,
} from "./chapters";
import { mentalHealthCatalog } from "./catalog";
import { visualStories, learningDiagrams } from "./visuals";
import {
  LearningLibraryProvider,
  type LearningLibraryConfiguration,
} from "./library";
import {
  ChapterCard,
  LearningChapterPage,
  useChapterRouteFocus,
} from "./LearningPages";
import { AboutIllustration } from "../support/aboutIllustrations";
import { MentalHealthCover, mentalHealthCovers } from "./mental-health-covers";
import "./mental-health-library.css";

const library: LearningLibraryConfiguration = {
  id: "mental-health",
  label: "Why Mental Health",
  seriesLabel: "THE MENTAL HEALTH LEARNING SERIES",
  educationLabel: "MENTAL HEALTH EDUCATION",
  basePath: "/why-mental-health",
  chapters: mentalHealthChapters,
  catalog: mentalHealthCatalog,
  findChapter: findMentalHealthChapter,
  visuals: {
    stories: visualStories,
    diagrams: learningDiagrams,
    imageBasePath: "/images/learning",
  },
  support: { path: "/urgent-help", label: "Urgent help information" },
  referenceReview: {
    path: "/learning/mental-health/reference-review-08-10.json",
    note: "Selected references and published Rwanda contacts for Chapters 8–10 were checked on 11 November 2026. The review record explains the scope and source discrepancies. Published contacts do not confirm current availability, eligibility or confidentiality. This check does not replace clinical, safeguarding, accessibility, translation or publication review; original lessons and draft notices remain unchanged.",
  },
};
export function WhyMentalHealthPage() {
  return (
    <LearningLibraryProvider library={library}>
      <MentalHealthLibrary />
    </LearningLibraryProvider>
  );
}
export function MentalHealthChapterPage() {
  return (
    <LearningLibraryProvider library={library}>
      <LearningChapterPage />
    </LearningLibraryProvider>
  );
}
function MentalHealthLibrary() {
  useChapterRouteFocus();
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
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
    <div className="support-page mh-library mh-library-illustrated">
      <header className="mh-library-hero">
        <div>
          <span className="support-eyebrow">
            WHY MENTAL HEALTH · LEARNING CENTER
          </span>
          <h1>
            Understand mental health.
            <br />
            <span>One chapter at a time.</span>
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
          <AboutIllustration name="reading" priority />
          <figcaption>Make room to learn, at your own pace.</figcaption>
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
          <strong>Educational drafts · November 2026</strong>
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
          <h2 id="mh-library-title">A topic for your next step.</h2>
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
              ref={searchInput}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a topic or chapter…"
            />
          </label>
        </div>
        <p className="mh-cover-note" id="mh-cover-note">
          <strong>Illustrative fictional scenes · AI-generated.</strong> The
          covers introduce ideas, not diagnoses or real participants. All
          chapter content is retained from the supplied VUGA NDAKUMVA
          educational drafts.
        </p>
        <div className="mh-chapter-grid">
          {filteredChapters.map((chapter) => (
            <ChapterCard
              key={chapter.slug}
              chapter={chapter}
              cover={
                mentalHealthCovers[chapter.slug] ? (
                  <MentalHealthCover chapterSlug={chapter.slug} />
                ) : undefined
              }
            />
          ))}
        </div>
        {filteredChapters.length === 0 && (
          <div className="mh-search-empty">
            <Search size={28} aria-hidden="true" />
            <h3>No chapters found</h3>
            <p>Try a broader topic, such as emotions, stress, or wellbeing.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                searchInput.current?.focus();
              }}
            >
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
            More Mental Health chapters are on the way. Return to a useful idea,
            revisit a visual example, or download a chapter to read offline.
            Every chapter is here when you need it.
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
