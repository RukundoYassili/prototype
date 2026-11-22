import AwarenessPage from "./awareness/AwarenessPage";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import App from "./App";
import { DemoProvider } from "./services/DemoContext";
import { ServiceLayout } from "./services/Shared";
import { NotFound, ResourcesPage } from "./services/Pages";
import { BlogPage, BlogPostPage } from "./blog/BlogPages";
import { CommunityPage, CommunityDetailPage } from "./community/CommunityPages";
import { KnowledgeHubPage, DonatePage } from "./support/InformationPages";
import {
  SupportLayout,
  SupportAboutPage,
  SupportPage,
  TopicPage,
  UrgentHelpPage,
} from "./support/SupportPages";
import "./services/services.css";
import { updateSeo } from "./seo-head";
import AiAssistant from "./AiAssistant";
import MediaDashboard from "./media/MediaDashboard";

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
const AlcoholDrugsPage = lazy(() =>
  import("./learning/alcohol-drugs/AlcoholPages").then((m) => ({
    default: m.AlcoholDrugsPage,
  })),
);
const AlcoholChapterPage = lazy(() =>
  import("./learning/alcohol-drugs/AlcoholPages").then((m) => ({
    default: m.AlcoholChapterPage,
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
    updateSeo(pathname);
    if (!hash)
      (
        document.getElementById("service-main") ||
        document.getElementById("main-content")
      )?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}
function InDevelopment() {
  return (
    <section
      className="mx-auto max-w-4xl px-6 py-20 sm:py-28"
      aria-labelledby="development-title"
    >
      <div className="rounded-3xl border border-[#dce8d7] bg-[#edf5ec] p-8 sm:p-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#286340]">
          VUGA NDAKUMVA
        </p>
        <h1
          id="development-title"
          className="text-4xl font-medium text-[#17351f]"
        >
          In development
        </h1>
        <p className="mt-4 text-base leading-7 text-[#405b46]">
          This section is in development.
        </p>
      </div>
    </section>
  );
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
            <Route path="/staff/media" element={<MediaDashboard />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route
              path="/mental-health"
              element={<TopicPage id="mental-health" />}
            />
            <Route
              path="/alcohol-and-drugs"
              element={
                <Suspense fallback={chapterLoading}>
                  <AlcoholDrugsPage />
                </Suspense>
              }
            />
            <Route
              path="/alcohol-and-drugs/:slug"
              element={
                <Suspense fallback={chapterLoading}>
                  <AlcoholChapterPage />
                </Suspense>
              }
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
            <Route path="/expertise" element={<InDevelopment />} />
            <Route path="/stories" element={<InDevelopment />} />
            <Route path="/contact" element={<InDevelopment />} />
            <Route path="/privacy" element={<InDevelopment />} />
            <Route path="/terms" element={<InDevelopment />} />
            <Route path="/services" element={<InDevelopment />} />
            <Route path="/services/:slug" element={<InDevelopment />} />
            <Route path="/professionals/:slug" element={<InDevelopment />} />
            <Route path="/dashboard" element={<InDevelopment />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/admin-preview" element={<InDevelopment />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <AiAssistant />
      </DemoProvider>
    </BrowserRouter>
  );
}
