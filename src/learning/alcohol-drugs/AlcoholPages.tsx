import { ArrowDown, FileText } from "lucide-react";
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
import { alcoholChapters } from "./chapters.generated";
import { alcoholCatalog } from "./catalog.generated";
import { useParams } from "react-router-dom";
import { AlcoholArtwork, alcoholCoverAlt } from "./AlcoholArtwork";
import { alcoholStories, alcoholDiagrams } from "./visuals";
import "./alcohol-artwork.css";

const library: LearningLibraryConfiguration = {
  id: "alcohol-drugs",
  label: "Alcohol & Drugs",
  seriesLabel: "UNDERSTANDING ALCOHOL & DRUGS",
  educationLabel: "ALCOHOL & DRUGS EDUCATION",
  basePath: "/alcohol-and-drugs",
  chapters: alcoholChapters,
  catalog: alcoholCatalog,
  findChapter: (slug) =>
    alcoholChapters.find((chapter) => chapter.slug === slug),
  visuals: {
    stories: alcoholStories,
    diagrams: alcoholDiagrams,
    imageBasePath: "/images/learning/alcohol-drugs",
  },
  support: { path: "/urgent-help", label: "Urgent help information" },
};

function AlcoholLibrary() {
  return (
    <section
      className="mh-library-chapters ad-library"
      id="alcohol-chapters"
      aria-labelledby="alcohol-library-title"
    >
      <div className="support-section-heading">
        <span className="support-eyebrow">
          CATEGORY 01 · UNDERSTANDING ALCOHOL & DRUGS
        </span>
        <h2 id="alcohol-library-title">
          Clear information.
          <br />
          Learning without judgment.
        </h2>
        <p>
          Four complete chapters, with 63 sections, everyday examples,
          comparison tables, and optional learning activities. Start with the
          foundations or choose a topic at your own pace.
        </p>
      </div>
      <div className="mh-draft-note">
        <FileText size={22} aria-hidden="true" />
        <div>
          <strong>Educational drafts · November 2026</strong>
          <p>
            Clinical, safeguarding, accessibility, language and Rwanda referral
            review remain required before publication. These lessons do not
            diagnose or provide individual treatment advice. Activities are
            optional; nothing is submitted or scored.
          </p>
        </div>
      </div>
      <div className="mh-chapter-grid">
        {alcoholChapters.map((chapter) => (
          <div
            className={`alcohol-chapter-cover ad-chapter-${chapter.number}`}
            key={chapter.slug}
          >
            <ChapterCard
              chapter={chapter}
              cover={
                <AlcoholArtwork
                  file={`cover-0${chapter.number}`}
                  alt={alcoholCoverAlt[chapter.number - 1]}
                />
              }
            />
          </div>
        ))}
      </div>
      <p className="support-photo-note">
        AI-generated fictional illustrations show teaching examples, not real
        participants, diagnoses or recovery histories. Original source PDFs and
        complete learning activities are available in each chapter. More topics
        will continue this series.
      </p>
    </section>
  );
}

export function AlcoholDrugsPage() {
  useChapterRouteFocus();
  return (
    <LearningLibraryProvider library={library}>
      <TopicPage
        id="alcohol-and-drugs"
        chapters={<AlcoholLibrary />}
        heroVisual={
          <figure className="ad-landing-art">
            <AlcoholArtwork
              file="hero"
              priority
              alt="Fictional illustration of an adult reading an information booklet beside a trusted companion on a home veranda; an alcohol bottle and glass are set aside, with water near the reader."
            />
            <figcaption>
              Illustrative fictional example. AI-generated. Reflection and
              support can begin in everyday settings.
            </figcaption>
          </figure>
        }
        heroActions={
          <a href="#alcohol-chapters" className="support-button">
            Explore the chapters <ArrowDown size={18} aria-hidden="true" />
          </a>
        }
      />
    </LearningLibraryProvider>
  );
}

export function AlcoholChapterPage() {
  const { slug } = useParams();
  const chapter = alcoholChapters.find((item) => item.slug === slug);
  return (
    <LearningLibraryProvider library={library}>
      <LearningChapterPage
        presentation={
          chapter
            ? {
                chapterSlug: chapter.slug,
                className: `ad-reader ad-chapter-${chapter.number}`,
                visualDisclosure:
                  "AI-generated fictional illustrations accompany the source lessons. They do not show real participants, establish diagnoses or promise recovery. Paired scenes show a situation and one possible supportive response. ",
                headerVisual: (
                  <figure className="ad-reader-hero">
                    <AlcoholArtwork
                      file={`cover-0${chapter.number}`}
                      alt={alcoholCoverAlt[chapter.number - 1]}
                      priority
                    />
                    <figcaption>
                      Illustrative fictional example. AI-generated.{" "}
                      {chapter.number === 2
                        ? "The source case describes reported memory difficulties after drinking; appearance alone cannot identify their cause."
                        : "Circumstances, choices and care needs vary. No outcome is guaranteed."}
                    </figcaption>
                  </figure>
                ),
              }
            : undefined
        }
      />
    </LearningLibraryProvider>
  );
}
