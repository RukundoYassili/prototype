export type ChapterBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
      revealAnswers?: boolean;
    }
  | {
      type: "questions";
      items: { question: string; answer: string; answerLabel?: string }[];
    }
  | { type: "heading"; text: string; id?: string }
  | { type: "example"; id: string; title: string; blocks: ChapterBlock[] }
  | { type: "subsection"; id: string; title: string; blocks: ChapterBlock[] }
  | { type: "disclosure"; title: string; blocks: ChapterBlock[] }
  | { type: "references"; numbers: number[]; sourceText: string };

export interface ChapterSection {
  number: string;
  id: string;
  title: string;
  blocks: ChapterBlock[];
}

export interface LearningChapter {
  number: number;
  slug: string;
  title: string;
  summary: string;
  timeLabel: string;
  studyTime: string;
  referenceHeading: string;
  editorialHeading: string;
  reflectionSection: string;
  image: string;
  position: string;
  originalFilename: string;
  version: string;
  date: string;
  language: string;
  author: string;
  pdfUrl: string;
  worksheetUrl: string;
  worksheetLabel?: string;
  sourcePages: number;
  frontMatter: string[];
  introductionBlocks?: ChapterBlock[];
  coverBlocks?: ChapterBlock[];
  afterGoals?: ChapterBlock[];
  goalsHeading?: string;
  editionText?: string;
  publicationStatus?: string;
  endMatterPlacement?: "inline" | "separate";
  goals: string[];
  goalBlocks?: ChapterBlock[];
  safetyNotices?: ChapterBlock[];
  sections: ChapterSection[];
  references: {
    number: number;
    /** Original bibliography marker; empty string for an unnumbered source. */
    label?: string;
    text: string;
    url?: string;
    checkedAt?: string;
  }[];
  referenceNotes: string[];
  editorialReview: ChapterBlock[];
  approval: ChapterBlock[];
}

// Compatibility for the existing Mental Health collection and importers.
export type MentalHealthChapter = LearningChapter;

export type ChapterCatalogEntry = Pick<
  LearningChapter,
  "number" | "slug" | "title" | "summary"
>;
