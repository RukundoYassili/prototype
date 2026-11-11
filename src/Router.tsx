import {
  ContactPage,
  ExpertisePage,
  PolicyPage,
  StoriesPage,
} from "./PublicPages";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import App from "./App";
import { DemoProvider } from "./services/DemoContext";
import { ServiceLayout } from "./services/Shared";
import {
  DashboardPage,
  NotFound,
  ProfessionalPage,
  ResourcesPage,
  ServiceDetail,
  ServicesPage,
} from "./services/Pages";
import AdminPage from "./services/AdminPage";
import BookingDialog from "./services/BookingDialog";
import { BlogPage, BlogPostPage } from "./blog/BlogPages";
import { findBlogPost } from "./blog/posts";
import { CommunityPage, CommunityDetailPage } from "./community/CommunityPages";
import { findCommunityEntry } from "./community/content";
import { findMentalHealthChapter } from "./learning/catalog";
import { findGbvChapter } from "./learning/gbv/catalog";
import {
  AwarenessPage,
  KnowledgeHubPage,
  DonatePage,
} from "./support/InformationPages";
import {
  SupportLayout,
  SupportAboutPage,
  SupportPage,
  TopicPage,
  UrgentHelpPage,
} from "./support/SupportPages";
import "./services/services.css";

const WhyMentalHealthPage = lazy(() =>
  import("./learning/MentalHealthPages").then((module) => ({
    default: module.WhyMentalHealthPage,
  })),
);
const MentalHealthChapterPage = lazy(() =>
  import("./learning/MentalHealthPages").then((module) => ({
    default: module.MentalHealthChapterPage,
  })),
);
const chapterLoading = (
  <div className="support-page" role="status">
    <p>Loading the learning series…</p>
  </div>
);
const UnderstandGbvPage = lazy(() =>
  import("./learning/gbv/GbvPages").then((module) => ({
    default: module.UnderstandGbvPage,
  })),
);
const GbvChapterPage = lazy(() =>
  import("./learning/gbv/GbvPages").then((module) => ({
    default: module.GbvChapterPage,
  })),
);

function NavigationReset() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1));
        target?.scrollIntoView();
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      });
    } else window.scrollTo({ top: 0, behavior: "instant" });
    const blogPost = pathname.startsWith("/blog/")
      ? findBlogPost(pathname.slice(6))
      : undefined;
    const communityEntry = pathname.startsWith("/community/")
      ? findCommunityEntry(pathname.slice(11))
      : undefined;
    const informationTitles: Record<string, string> = {
      "/awareness": "Awareness",
      "/why-mental-health": "Why Mental Health",
      "/knowledge-hub": "Knowledge Hub",
      "/donate": "Donate",
    };
    const mentalHealthChapter = pathname.startsWith("/understand-gbv/")
      ? findGbvChapter(pathname.slice("/understand-gbv/".length))
      : pathname.startsWith("/why-mental-health/")
        ? findMentalHealthChapter(pathname.slice("/why-mental-health/".length))
        : undefined;
    document.title =
      pathname.startsWith("/why-mental-health/") ||
      pathname.startsWith("/understand-gbv/")
        ? `${mentalHealthChapter?.title || "Chapter not found"} — BetterHelp`
        : informationTitles[pathname]
          ? `${informationTitles[pathname]} — BetterHelp`
          : pathname === "/community"
            ? "Community — BetterHelp"
            : pathname.startsWith("/community/")
              ? `${communityEntry?.title || "Community update not found"} — BetterHelp`
              : pathname === "/"
                ? "BetterHelp — Understanding. Connection. Support."
                : pathname === "/blog"
                  ? "Blog — BetterHelp"
                  : pathname.startsWith("/blog/")
                    ? `${blogPost?.title || "Article not found"} — BetterHelp`
                    : `${pathname === "/support" ? "Get support" : pathname === "/mental-health" ? "Mental health" : pathname === "/alcohol-and-drugs" ? "Alcohol & drugs" : pathname === "/understand-gbv" ? "Understand GBV" : pathname === "/urgent-help" ? "Urgent help" : pathname.startsWith("/services") ? "Services" : pathname.startsWith("/professionals") ? "Sample professional" : pathname === "/dashboard" ? "My space" : pathname === "/resources" ? "Resources" : pathname === "/admin-preview" ? "Admin preview" : pathname === "/expertise" ? "Expertise" : pathname === "/stories" ? "Illustrative stories" : pathname === "/about" ? "About" : pathname === "/contact" ? "Contact" : pathname === "/privacy" ? "Privacy" : pathname === "/terms" ? "Terms" : "Page not found"} — BetterHelp`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        mentalHealthChapter?.summary ||
          communityEntry?.summary ||
          (pathname === "/knowledge-hub"
            ? "Explore the Knowledge Hub: mental health, understanding GBV, alcohol and drugs, thoughtful articles, guides, and worksheets."
            : pathname === "/awareness"
              ? "Awareness, community learning, and clear conversations about mental health, personal safety, and substance use."
              : pathname === "/why-mental-health"
                ? "Explore the VUGA NDAKUMVA Mental Health learning series: full chapters on mental health, wellbeing, recognizing emotions, and responding to them."
                : pathname === "/donate"
                  ? "Learn about the purpose behind our community work and the current availability of official giving options."
                  : "") ||
          (pathname === "/community"
            ? "Community news, outreach stories, events, and workshops. Explore ways to connect, learn, and grow with the BetterHelp community."
            : "") ||
          blogPost?.excerpt ||
          (pathname === "/blog"
            ? "Thoughtful articles about mental health, alcohol and drugs, understanding GBV, and supporting others. Explore the BetterHelp journal at your own pace."
            : "Clear, compassionate information about mental health, gender-based violence, alcohol and drugs, and ways to find appropriate support."),
      );
    if (!hash)
      (
        document.getElementById("service-main") ||
        document.getElementById("main-content")
      )?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}
export default function Router() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <NavigationReset />
        <Routes>
          <Route path="/" element={<App />} />
          <Route element={<SupportLayout />}>
            <Route path="/awareness" element={<AwarenessPage />} />
            <Route
              path="/why-mental-health"
              element={
                <Suspense fallback={chapterLoading}>
                  <WhyMentalHealthPage />
                </Suspense>
              }
            />
            <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
            <Route
              path="/why-mental-health/:slug"
              element={
                <Suspense fallback={chapterLoading}>
                  <MentalHealthChapterPage />
                </Suspense>
              }
            />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:slug" element={<CommunityDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route
              path="/mental-health"
              element={<TopicPage id="mental-health" />}
            />
            <Route
              path="/alcohol-and-drugs"
              element={<TopicPage id="alcohol-and-drugs" />}
            />
            <Route
              path="/understand-gbv"
              element={
                <Suspense fallback={chapterLoading}>
                  <UnderstandGbvPage />
                </Suspense>
              }
            />
            <Route
              path="/understand-gbv/:slug"
              element={
                <Suspense fallback={chapterLoading}>
                  <GbvChapterPage />
                </Suspense>
              }
            />
            <Route path="/urgent-help" element={<UrgentHelpPage />} />
            <Route path="/about" element={<SupportAboutPage />} />
          </Route>
          <Route element={<ServiceLayout />}>
            <Route path="/expertise" element={<ExpertisePage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PolicyPage kind="privacy" />} />
            <Route path="/terms" element={<PolicyPage kind="terms" />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/professionals/:slug" element={<ProfessionalPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/admin-preview" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <BookingDialog />
      </DemoProvider>
    </BrowserRouter>
  );
}
