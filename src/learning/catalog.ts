import { chapterCatalog } from "./chapter-catalog.generated";
import { continuationCatalog } from "./chapter-catalog-03-07.generated";
import { laterCatalog } from "./chapter-catalog-08-10.generated";
export const mentalHealthCatalog = [
  ...chapterCatalog,
  ...continuationCatalog,
  ...laterCatalog,
].sort((a, b) => a.number - b.number);
export const findMentalHealthChapter = (slug?: string) =>
  mentalHealthCatalog.find((chapter) => chapter.slug === slug);
