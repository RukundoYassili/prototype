// Read-only source inventory. This does not import or publish website content.
import { mentalHealthChapters } from "../src/learning/chapters";
import { gbvChapters } from "../src/learning/gbv/chapters";
import { alcoholChapters } from "../src/learning/alcohol-drugs/chapters.generated";
import { blogPosts } from "../src/blog/posts";
import { communityEntries } from "../src/community/content";
import { resources } from "../src/services/data";
import { officialResources } from "../src/support/content";
import type { ChapterBlock, LearningChapter } from "../src/learning/types";

function blockCounts(
  blocks: ChapterBlock[],
  counts: Record<string, number> = {},
) {
  for (const block of blocks) {
    counts[block.type] = (counts[block.type] || 0) + 1;
    if ("blocks" in block && Array.isArray(block.blocks))
      blockCounts(block.blocks, counts);
  }
  return counts;
}
function chapterReport(prefix: string, chapter: LearningChapter) {
  const blocks = [
    ...(chapter.introductionBlocks || []),
    ...(chapter.coverBlocks || []),
    ...(chapter.afterGoals || []),
    ...(chapter.goalBlocks || []),
    ...(chapter.safetyNotices || []),
    ...chapter.sections.flatMap((section) => section.blocks),
    ...chapter.editorialReview,
    ...chapter.approval,
  ];
  return {
    path: `${prefix}/${chapter.slug}`,
    number: chapter.number,
    title: chapter.title,
    sections: chapter.sections.length,
    blocks: blockCounts(blocks),
    references: chapter.references.length,
    pdf: chapter.pdfUrl,
    worksheet: chapter.worksheetUrl,
    publicationStatus: chapter.publicationStatus || null,
    hasReviewNotice: JSON.stringify(chapter).toLowerCase().includes("review"),
  };
}
const groups = [
  ...mentalHealthChapters.map((chapter) =>
    chapterReport("/why-mental-health", chapter),
  ),
  ...gbvChapters.map((chapter) => chapterReport("/understand-gbv", chapter)),
  ...alcoholChapters.map((chapter) =>
    chapterReport("/alcohol-and-drugs", chapter),
  ),
];
const report = {
  generatedAt: new Date().toISOString(),
  note: "Source inventory, not an approval or publication decision.",
  counts: {
    articles: blogPosts.length,
    chapters: groups.length,
    communityEntries: communityEntries.length,
    resources: resources.length,
    supportListings: officialResources.length,
  },
  chapters: groups,
  articles: blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    title: post.title,
    sections: post.sections.length,
    sources: post.sources.length,
  })),
  community: communityEntries.map((entry) => ({
    path: `/community/${entry.slug}`,
    title: entry.title,
    kind: entry.kind,
    status: entry.status,
    template: entry.template,
    mediaApproved: entry.mediaApproved,
    demo: !!entry.demo,
  })),
  support: officialResources.map((entry) => ({
    id: entry.id,
    title: entry.title,
    checkedAt: entry.checkedAt,
  })),
};
process.stdout.write(JSON.stringify(report, null, 2) + "\n");
