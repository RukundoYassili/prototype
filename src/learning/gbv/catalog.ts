import { gbvCatalog as foundationCatalog } from "./catalog.generated";
import { gbvContinuationCatalog } from "./catalog-04-10.generated";
export const gbvCatalog = [
  ...foundationCatalog,
  ...gbvContinuationCatalog,
].sort((a, b) => a.number - b.number);
export const findGbvChapter = (slug?: string) =>
  gbvCatalog.find((chapter) => chapter.slug === slug);
