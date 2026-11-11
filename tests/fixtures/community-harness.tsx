// Development test entry only. Never imported by src/main.tsx or production routes.
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import {
  CommunityPage,
  CommunityDetailPage,
} from "../../src/community/CommunityPages";
import CommunitySection from "../../src/community/CommunitySection";
import {
  communityEntries,
  type CommunityEntry,
} from "../../src/community/content";
import { communityPhotos } from "../../src/community/photos";
import {
  createCommunityRepository,
  isPublishable,
  upcomingActivities,
  activityState,
} from "../../src/community/repository";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "../../src/system/tokens.css";
import "../../src/system/components.css";
import "../../src/styles.css";
import "../../src/site.css";
import "../../src/support/support.css";

const base = {
  ...communityEntries[0],
  demo: false,
  status: "published" as const,
  template: false,
  mediaApproved: true,
  topics: ["Connection"],
  publishedAt: "2026-11-11T10:00:00+02:00",
  relatedSlugs: ["fixture-album"],
  sections: [
    {
      title: "About this test fixture",
      text: "Automated test content. Not a real outreach account.",
    },
  ],
};
const video = {
  durationSeconds: 92,
  language: "English",
  captions: [
    { src: "/tests/fixtures/captions.vtt", language: "en", label: "English" },
  ],
  transcript:
    "This is a test fixture transcript about connection. It is not a participant account.",
};
const records: CommunityEntry[] = [
  {
    ...base,
    kind: "news",
    slug: "fixture-story",
    title: "Test fixture: shared perspectives",
    featured: true,
  },
  {
    ...base,
    kind: "videos",
    slug: "fixture-local-video",
    title: "Test fixture: local video",
    video: {
      ...video,
      source: { provider: "local", src: "/tests/fixtures/clip.webm" },
    },
  },
  {
    ...base,
    kind: "videos",
    slug: "fixture-youtube",
    title: "Test fixture: YouTube video",
    video: { ...video, source: { provider: "youtube", id: "abcdefghijk" } },
  },
  {
    ...base,
    kind: "albums",
    slug: "fixture-album",
    title: "Test fixture: photo album",
    photos: communityPhotos,
  },
  {
    ...base,
    kind: "events",
    slug: "fixture-event",
    title: "Test fixture: upcoming gathering",
    audience: "Test audience",
    schedule: {
      startsAt: "2099-11-11T14:00:00+02:00",
      timeZone: "Africa/Kigali",
      location: "Test venue",
      format: "In person",
      registrationUrl: "https://example.org/register",
    },
  },
  {
    ...base,
    kind: "workshops",
    slug: "fixture-workshop",
    title: "Test fixture: upcoming workshop",
    audience: "Test audience",
    schedule: {
      startsAt: "2099-11-10T14:00:00+02:00",
      timeZone: "Africa/Kigali",
      location: "Test venue",
      format: "Online",
    },
  },
  {
    ...base,
    kind: "events",
    slug: "fixture-past",
    title: "Test fixture: past gathering",
    audience: "Test audience",
    schedule: {
      startsAt: "2020-11-11T14:00:00+02:00",
      timeZone: "Africa/Kigali",
      location: "Test venue",
      format: "In person",
      registrationUrl: "https://example.org/register",
    },
  },
  {
    ...base,
    kind: "events",
    slug: "fixture-cancelled",
    title: "Test fixture: cancelled gathering",
    audience: "Test audience",
    schedule: {
      startsAt: "2099-11-11T14:00:00+02:00",
      timeZone: "Africa/Kigali",
      location: "Test venue",
      format: "In person",
      cancelled: true,
      registrationUrl: "https://example.org/register",
    },
  },
  {
    ...base,
    kind: "news",
    slug: "fixture-draft",
    title: "Hidden draft test fixture",
    status: "draft",
  },
  {
    ...base,
    kind: "news",
    slug: "fixture-unapproved",
    title: "Unapproved test fixture",
    mediaApproved: false,
  },
  ...communityEntries.filter((entry) => entry.template),
];
const repository = createCommunityRepository(records, true);
Object.assign(window, {
  communityTest: {
    records,
    createCommunityRepository,
    isPublishable,
    upcomingActivities,
    activityState,
  },
});
function Harness() {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ padding: 12, background: "#fff2c3" }}>
        TEST FIXTURES ONLY — not public content{" "}
        <button onClick={() => navigate("/community")}>Open fixture hub</button>
        <button onClick={() => navigate("/fixture-home")}>
          Open fixture homepage
        </button>
      </div>
      <Routes>
        <Route
          path="/community"
          element={
            <main>
              <CommunityPage repository={repository} />
            </main>
          }
        />
        <Route
          path="/community/:slug"
          element={
            <main>
              <CommunityDetailPage repository={repository} />
            </main>
          }
        />
        <Route
          path="/fixture-home"
          element={<CommunitySection repository={repository} />}
        />
        <Route
          path="*"
          element={
            <main>
              <CommunityPage repository={repository} />
            </main>
          }
        />
      </Routes>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Harness />
    </BrowserRouter>
  </React.StrictMode>,
);
