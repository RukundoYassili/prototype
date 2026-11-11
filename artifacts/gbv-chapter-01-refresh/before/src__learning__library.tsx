import { createContext, useContext, type ReactNode } from "react";
import type { ChapterCatalogEntry, LearningChapter } from "./types";
import type { LearningDiagram, VisualStory } from "./visual-types";

export interface LearningLibraryConfiguration {
  id: string;
  label: string;
  seriesLabel: string;
  educationLabel: string;
  basePath: string;
  chapters: LearningChapter[];
  catalog: ChapterCatalogEntry[];
  findChapter: (slug?: string) => LearningChapter | undefined;
  visuals: {
    stories: VisualStory[];
    diagrams: LearningDiagram[];
    imageBasePath: string;
  };
  support: { path: string; label: string };
  referenceReview?: { path: string; note: string };
}

const LibraryContext = createContext<LearningLibraryConfiguration | null>(null);
export function LearningLibraryProvider({
  library,
  children,
}: {
  library: LearningLibraryConfiguration;
  children: ReactNode;
}) {
  return (
    <LibraryContext.Provider value={library}>
      {children}
    </LibraryContext.Provider>
  );
}
export function useLearningLibrary() {
  const library = useContext(LibraryContext);
  if (!library)
    throw new Error(
      "A learning reader needs its subject library configuration.",
    );
  return library;
}
