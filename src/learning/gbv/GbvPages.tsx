import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { TopicPage } from "../../support/SupportPages";
import {
  ChapterCard,
  LearningChapterPage,
  useChapterRouteFocus,
} from "../LearningPages";
import {
  LearningLibraryProvider,
  type LearningLibraryConfiguration,
} from "../library";
import { gbvChapters } from "./chapters";
import { gbvCatalog } from "./catalog";
import { gbvPresentations } from "./series-presentation";
import { seriesGbvStories, seriesGbvDiagrams } from "./series-visuals";
import {
  GbvIllustration,
  gbvCovers,
  gbvHero,
  gbvSupporterArt,
} from "./GbvIllustration";
import "./gbv.css";

const library: LearningLibraryConfiguration = {
  id: "gbv",
  label: "Understand GBV",
  seriesLabel: "THE GBV LEARNING SERIES",
  educationLabel: "GBV EDUCATION",
  basePath: "/understand-gbv",
  chapters: gbvChapters,
  catalog: gbvCatalog,
  findChapter: (slug) => gbvChapters.find((chapter) => chapter.slug === slug),
  visuals: {
    stories: seriesGbvStories,
    diagrams: seriesGbvDiagrams,
    imageBasePath: "/images/learning/gbv",
  },
  support: { path: "/urgent-help", label: "Urgent help information" },
  referenceReview: {
    path: "/learning/gbv/reference-review-04-10.json",
    note: "Chapters 1–3 have a source check dated 9 November 2026. Key Rwanda referral listings and WHO care guidance for Chapters 4–10 were checked on 11 November 2026; the review record explains its scope and links needing manual review. A published number does not confirm availability, confidentiality or eligibility. This check is not specialist, safeguarding, legal, clinical or publication approval. The source lessons remain unchanged.",
  },
};

function GbvChapters() {
  return (
    <section
      className="mh-library-chapters gbv-library"
      id="gbv-chapters"
      aria-labelledby="gbv-library-title"
    >
      <div className="gbv-library-intro">
        <div className="support-section-heading">
          <span className="support-eyebrow">THE GBV LEARNING SERIES</span>
          <h2 id="gbv-library-title">
            Understand more.
            <br />
            Choose your own pace.
          </h2>
        </div>
        <div className="gbv-library-description">
          <p>
            Ten complete chapters on gender-based violence, with detailed
            fictional examples and optional reflection. Begin with the
            foundations or choose a topic that matters to you.
          </p>
          <Link
            className="support-text-link"
            to={`${library.basePath}/${gbvChapters[0].slug}`}
          >
            Start with the foundations{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="gbv-library-meta">
        <span>
          <BookOpen size={17} aria-hidden="true" />
          {gbvChapters.length} chapters ·{" "}
          {gbvChapters.reduce(
            (count, chapter) => count + chapter.sections.length,
            0,
          )}{" "}
          sections
        </span>
        <span>
          <ShieldCheck size={17} aria-hidden="true" />
          Private reflection · Nothing to submit
        </span>
      </div>
      <div className="mh-draft-note">
        <FileText size={22} aria-hidden="true" />
        <div>
          <strong>Educational drafts · November 2026</strong>
          <p>
            These original VUGA NDAKUMVA drafts are not approved for
            publication. GBV-specialist, safeguarding, legal, clinical,
            accessibility and Rwanda referral review remain required. You may
            skip any lesson or activity.
          </p>
        </div>
      </div>
      <details className="gbv-chapter-index">
        <summary>
          <BookOpen size={18} aria-hidden="true" /> Browse chapter titles{" "}
          <span className="gbv-index-count">{gbvChapters.length} chapters</span>
          <ArrowDown size={17} aria-hidden="true" />
        </summary>
        <nav aria-label="Browse all GBV chapters">
          {gbvChapters.map((chapter) => (
            <Link key={chapter.slug} to={`${library.basePath}/${chapter.slug}`}>
              <span>{String(chapter.number).padStart(2, "0")}</span>
              {chapter.title}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </details>
      <div className="mh-chapter-grid">
        {gbvChapters.map((chapter) => (
          <ChapterCard
            key={chapter.slug}
            chapter={chapter}
            cover={
              gbvCovers[chapter.slug] ? (
                <GbvIllustration artwork={gbvCovers[chapter.slug]} />
              ) : undefined
            }
          />
        ))}
      </div>
      <p className="support-photo-note">
        Teaching scenes throughout this series are AI-generated fictional
        illustrations. The hero and chapter covers are also AI-generated
        fictional illustrations; they do not identify survivors or service
        users, or promise a particular outcome. Original examples and source
        PDFs are retained in full. Chapters 1–10 are available; further chapters
        will continue the series.
      </p>
    </section>
  );
}
export function UnderstandGbvPage() {
  useChapterRouteFocus();
  return (
    <LearningLibraryProvider library={library}>
      <TopicPage
        id="understand-gbv"
        chapters={<GbvChapters />}
        heroVisual={
          <figure>
            <GbvIllustration artwork={gbvHero} priority />
            <figcaption>
              Room for your choices. Space to be heard.
              <br />
              AI-generated fictional illustration.
            </figcaption>
          </figure>
        }
        heroActions={
          <div className="gbv-hero-actions">
            <a href="#gbv-chapters" className="support-button">
              Explore the chapters <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a href="#support-options" className="support-text-link">
              Explore support options{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        }
        heroNote={
          <p className="gbv-hero-safety">
            Quick exit changes this page. It does not erase browsing history or
            stop device monitoring.{" "}
            <Link to="/urgent-help">Urgent help information</Link>
          </p>
        }
        supporterVisual={
          <figure className="gbv-supporter-art">
            <GbvIllustration artwork={gbvSupporterArt} compact />
            <figcaption>
              AI-generated fictional illustration of listening.
            </figcaption>
          </figure>
        }
      />
    </LearningLibraryProvider>
  );
}
export function GbvChapterPage() {
  const { slug } = useParams();
  return (
    <LearningLibraryProvider library={library}>
      <LearningChapterPage
        presentation={slug ? gbvPresentations[slug] : undefined}
      />
    </LearningLibraryProvider>
  );
}
