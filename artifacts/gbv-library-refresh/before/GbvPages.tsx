import { BookOpen, FileText, ShieldCheck } from "lucide-react";
import { TopicPage } from "../../support/SupportPages";
import { ChapterCard, LearningChapterPage } from "../LearningPages";
import {
  LearningLibraryProvider,
  type LearningLibraryConfiguration,
} from "../library";
import { gbvChapters } from "./chapters";
import { gbvCatalog } from "./catalog";
import { gbvStories, gbvDiagrams } from "./visuals";
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
    stories: gbvStories,
    diagrams: gbvDiagrams,
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
      <div className="support-section-heading">
        <span className="support-eyebrow">THE GBV LEARNING SERIES</span>
        <h2 id="gbv-library-title">
          Understand more.
          <br />
          Choose your own pace.
        </h2>
        <p>
          Ten complete chapters on gender-based violence, with detailed
          fictional examples and optional reflection. Begin with the foundations
          or choose a topic that matters to you.
        </p>
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
      <div className="mh-chapter-grid">
        {gbvChapters.map((chapter) => (
          <ChapterCard key={chapter.slug} chapter={chapter} />
        ))}
      </div>
      <p className="support-photo-note">
        Teaching scenes in Chapters 1–3 are AI-generated fictional
        illustrations. Chapter-card photography is illustrative and does not
        identify survivors or service users, or promise a particular outcome.
        Original examples and source PDFs are retained in full. Chapters 1–10
        are available; further chapters will continue the series.
      </p>
    </section>
  );
}
export function UnderstandGbvPage() {
  return (
    <LearningLibraryProvider library={library}>
      <TopicPage id="understand-gbv" chapters={<GbvChapters />} />
    </LearningLibraryProvider>
  );
}
export function GbvChapterPage() {
  return (
    <LearningLibraryProvider library={library}>
      <LearningChapterPage />
    </LearningLibraryProvider>
  );
}
