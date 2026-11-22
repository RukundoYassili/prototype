// Export original source objects for an isolated, private staging import.
// No source record is approved or made public by this export.
import { mentalHealthChapters } from "../src/learning/chapters";
import { gbvChapters } from "../src/learning/gbv/chapters";
import { alcoholChapters } from "../src/learning/alcohol-drugs/chapters.generated";
import { blogPosts } from "../src/blog/posts";
import { communityEntries } from "../src/community/content";
import { resources } from "../src/services/data";
import { officialResources } from "../src/support/content";
import type { LearningChapter } from "../src/learning/types";
import { writeFileSync } from "node:fs";

const clip = (value: string, max: number) =>
  value.trim().slice(0, max) || "Not specified";
const chapter = (prefix: string, item: LearningChapter) => ({
  sourceKey: `chapter:${prefix}:${item.slug}`,
  route: `${prefix}/${item.slug}`,
  type: "chapter",
  title: clip(item.title, 160),
  summary: clip(item.summary, 1000),
  language: clip(item.language || "English", 40),
  topic: clip(prefix.slice(1), 80),
  record: item,
});
const items = [
  ...blogPosts.map((item) => ({
    sourceKey: `article:${item.slug}`,
    route: `/blog/${item.slug}`,
    type: "article",
    title: clip(item.title, 160),
    summary: clip(item.excerpt, 1000),
    language: "English",
    topic: clip(item.topic, 80),
    record: item,
  })),
  ...mentalHealthChapters.map((item) => chapter("/why-mental-health", item)),
  ...gbvChapters.map((item) => chapter("/understand-gbv", item)),
  ...alcoholChapters.map((item) => chapter("/alcohol-and-drugs", item)),
  ...communityEntries.map((item) => ({
    sourceKey: `community:${item.slug}`,
    route: `/community/${item.slug}`,
    type: "community",
    title: clip(item.title, 160),
    summary: clip(item.summary, 1000),
    language: "English",
    topic: clip(item.topics[0] || item.kind, 80),
    record: item,
  })),
  ...resources.map((item) => ({
    sourceKey: `resource:${item.id}`,
    route: "/resources",
    type: "resource",
    title: clip(item.title, 160),
    summary: clip(item.description, 1000),
    language: "English",
    topic: clip(item.category, 80),
    record: item,
  })),
  ...officialResources.map((item) => ({
    sourceKey: `support:${item.id}`,
    route: null,
    type: "support",
    title: clip(item.title, 160),
    summary: clip(item.description, 1000),
    language: "English",
    topic: clip(item.topics[0] || item.region, 80),
    record: item,
  })),
];
if (new Set(items.map((item) => item.sourceKey)).size !== items.length)
  throw new Error("Duplicate source identifiers; do not import.");
const output = JSON.stringify({ format: 1, items }) + "\n";
if (process.argv[2])
  writeFileSync(process.argv[2], output, { encoding: "utf8", flag: "wx" });
else process.stdout.write(output);
