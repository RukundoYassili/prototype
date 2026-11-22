import { blogPosts } from "./blog/posts";
import { mentalHealthCatalog } from "./learning/catalog";
import { alcoholCatalog } from "./learning/alcohol-drugs/catalog.generated";
import { gbvCatalog } from "./learning/gbv/catalog";
import { communityRepository } from "./community/repository";

export const siteUrl = "https://vugandakumva.digital";
export const siteName = "VUGA NDAKUMVA";
export const defaultDescription =
  "Clear, compassionate information about mental health, gender-based violence, alcohol and drugs, and ways to find appropriate support.";
export const socialImage = `${siteUrl}/images/about/listening-together-960.webp`;

export interface SeoPage {
  path: string;
  title: string;
  description: string;
  indexable: boolean;
  type?: "article" | "website";
  image?: string;
}

const page = (
  path: string,
  title: string,
  description: string,
  indexable = true,
): SeoPage => ({
  path,
  title,
  description,
  indexable,
});

const staticPages: SeoPage[] = [
  page("/staff/media", "Staff media library — VUGA NDAKUMVA", "Staff image management.", false),
  page(
    "/",
    "VUGA NDAKUMVA — Speak, I Can Hear",
    "Explore compassionate information about mental health, gender-based violence, alcohol and drugs, and support in Rwanda.",
  ),
  page(
    "/about",
    "About Us — VUGA NDAKUMVA",
    "Learn about Vuga Ndakumva's story, mission, values, and the team working for awareness and support in Rwanda.",
  ),
  page(
    "/awareness",
    "Mental Health and GBV Awareness — VUGA NDAKUMVA",
    "Explore awareness resources, supportive conversations, and community learning about mental health, safety, and substance use.",
  ),
  page(
    "/knowledge-hub",
    "Knowledge Hub — VUGA NDAKUMVA",
    "Find educational resources on mental health, gender-based violence, alcohol and drugs, and supporting others.",
  ),
  page(
    "/mental-health",
    "Mental Health Support and Information — VUGA NDAKUMVA",
    "Explore mental health information, common challenges, and ways to find appropriate support.",
  ),
  page(
    "/why-mental-health",
    "Mental Health Learning Library — VUGA NDAKUMVA",
    "Explore mental health chapters on emotions, stress, anxiety, well-being, and ways to find support.",
  ),
  page(
    "/understand-gbv",
    "Understanding Gender-Based Violence — VUGA NDAKUMVA",
    "Learn about gender-based violence, consent, safety, prevention, and survivor-centred support.",
  ),
  page(
    "/alcohol-and-drugs",
    "Alcohol and Drugs: Information and Support — VUGA NDAKUMVA",
    "Understand alcohol and other drugs, their effects, health risks, and respectful pathways to support.",
  ),
  page(
    "/support",
    "Find Support — VUGA NDAKUMVA",
    "Explore independent support options and questions to ask when seeking help for yourself or someone else.",
  ),
  page(
    "/urgent-help",
    "Urgent Help and Safety Information — VUGA NDAKUMVA",
    "Find urgent-help information and independent services in Rwanda and other locations.",
  ),
  page(
    "/resources",
    "Mental Health Resources and Worksheets — VUGA NDAKUMVA",
    "Explore practical guides, worksheets, and resources on mental health, safety, and supporting others.",
  ),
  page(
    "/blog",
    "Articles and Perspectives — VUGA NDAKUMVA",
    "Read thoughtful articles about mental health, substance use, gender-based violence, and supporting others.",
  ),
  page(
    "/community",
    "Community — VUGA NDAKUMVA",
    "Explore community stories, activities, and updates from Vuga Ndakumva.",
    communityRepository.list().length > 0,
  ),
  page(
    "/donate",
    "Donate — VUGA NDAKUMVA",
    "Giving information is in development.",
    false,
  ),
  ...[
    "contact",
    "privacy",
    "terms",
    "services",
    "dashboard",
    "expertise",
    "stories",
    "admin-preview",
  ].map((name) =>
    page(
      `/${name}`,
      `In development — ${siteName}`,
      "This section of Vuga Ndakumva is in development.",
      false,
    ),
  ),
];

const chapters = [
  ...mentalHealthCatalog.map((chapter) => ({
    ...chapter,
    prefix: "/why-mental-health",
  })),
  ...gbvCatalog.map((chapter) => ({ ...chapter, prefix: "/understand-gbv" })),
  ...alcoholCatalog.map((chapter) => ({
    ...chapter,
    prefix: "/alcohol-and-drugs",
  })),
].map(({ prefix, slug, title, summary }): SeoPage => ({
  path: `${prefix}/${slug}`,
  title: `${title} — ${siteName}`,
  description: summary,
  indexable: true,
  type: "article",
}));

const articles: SeoPage[] = blogPosts.map((post) => ({
  path: `/blog/${post.slug}`,
  title: `${post.title} — ${siteName}`,
  description: post.excerpt,
  image: `${siteUrl}/images/${post.image}.webp`,
  indexable: true,
  type: "article",
}));
const communityPages: SeoPage[] = communityRepository.list().map((entry) => ({
  path: `/community/${entry.slug}`,
  title: `${entry.title} — ${siteName}`,
  description: entry.summary,
  indexable: true,
  type: "article",
}));

export const seoPages: SeoPage[] = [
  ...staticPages,
  ...chapters,
  ...articles,
  ...communityPages,
];
export function seoForPath(pathname: string): SeoPage {
  const normalized =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const missingKind = ["/why-mental-health/", "/understand-gbv/", "/alcohol-and-drugs/"].some((prefix) => normalized.startsWith(prefix))
    ? "Chapter"
    : normalized.startsWith("/blog/")
      ? "Article"
      : normalized.startsWith("/community/")
        ? "Community update"
        : "Page";
  return (
    seoPages.find((item) => item.path === normalized) ||
    page(
      normalized,
      `${missingKind} not found — ${siteName}`,
      "This page could not be found.",
      false,
    )
  );
}
