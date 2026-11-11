import { mentalHealthChapters as suppliedChapters } from "./chapters.generated";
import { continuationChapters } from "./chapters-03-07.generated";
import { laterChapters } from "./chapters-08-10.generated";
// Extend this collection with future chapter modules; all readers and links follow it.
export const mentalHealthChapters = [
  ...suppliedChapters,
  ...continuationChapters,
  ...laterChapters,
].sort((a, b) => a.number - b.number);
export const chapterPath = (slug: string) => `/why-mental-health/${slug}`;
export const findMentalHealthChapter = (slug?: string) =>
  mentalHealthChapters.find((chapter) => chapter.slug === slug);
