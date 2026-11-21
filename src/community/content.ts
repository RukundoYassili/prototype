import type { CommunityPhoto } from "./photos";
import { demoCommunityEntries } from "./demo-content";
import { cyanikaPhotos } from "./cyanikaOutreach";

export type CommunityKind =
  "news" | "events" | "workshops" | "videos" | "albums";
export type CommunityVideo = {
  source:
    { provider: "youtube"; id: string } | { provider: "local"; src: string };
  durationSeconds: number;
  language: string;
  captions: { src: string; language: string; label: string }[];
  transcript: string;
};

export type CommunitySchedule = {
  startsAt: string; // ISO date with a UTC offset, so the displayed instant is unambiguous.
  timeZone: string;
  location: string;
  format: "In person" | "Online" | "Hybrid";
  registrationUrl?: string;
  endsAt?: string;
  cancelled?: boolean;
};

type CommunityBase = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  imageDimensions?: { width: number; height: number };
  imageOrientation?: "portrait" | "landscape";
  position: string;
  template: boolean;
  illustrative: boolean;
  publishedAt?: string;
  audience?: string;
  schedule?: CommunitySchedule;
  completed?: { date?: string; dateLabel: string; location: string };
  visitPhotos?: CommunityPhoto[];
  sections: { title: string; text: string; points?: string[] }[];
  status: "draft" | "published";
  mediaApproved: boolean;
  featured?: boolean;
  demo?: boolean;
  topics: string[];
  relatedSlugs?: string[];
  resources?: { title: string; href: string }[];
};
export type CommunityEntry = CommunityBase &
  (
    | { kind: "news" | "events" | "workshops"; video?: never; photos?: never }
    | { kind: "videos"; video: CommunityVideo; photos?: never }
    | { kind: "albums"; photos: CommunityPhoto[]; video?: never }
  );

export const communityKinds: {
  id: CommunityKind;
  label: string;
  singular: string;
  description: string;
}[] = [
  {
    id: "news",
    label: "Stories",
    singular: "Community news",
    description: "Stories, reflections, and outreach updates.",
  },
  {
    id: "events",
    label: "Events",
    singular: "Community event",
    description: "Gatherings that bring us closer together.",
  },
  {
    id: "workshops",
    label: "Workshops",
    singular: "Workshop",
    description: "Space to listen, learn, and share ideas.",
  },
  {
    id: "videos",
    label: "Videos",
    singular: "Community video",
    description: "Conversations and learning, at your pace.",
  },
  {
    id: "albums",
    label: "Photo albums",
    singular: "Photo album",
    description: "Moments from our community.",
  },
];

export const communityKindLabel = (kind: CommunityKind) =>
  communityKinds.find((item) => item.id === kind)!.singular;

// Keep legacy templates for explicit development previews. Add approved content
// to editorialEntries below using the same slug when replacing a template.
const templateEntries: (Omit<
  CommunityBase,
  "status" | "mediaApproved" | "topics"
> & { kind: "news" | "events" | "workshops" })[] = [
  {
    slug: "community-outreach-update",
    kind: "news",
    title: "Stories from our outreach",
    summary:
      "A home for updates from community visits, shared conversations, and the people who make connection possible.",
    image: "africa-group-reading",
    imageAlt:
      "Illustrative photograph of three friends reading together",
    position: "50% 42%",
    template: true,
    illustrative: true,
    sections: [
      {
        title: "The story",
        text: "Our next outreach story will appear here when the update and its details are ready to share.",
      },
      {
        title: "The conversations",
        text: "This space will introduce the focus of the outreach, the setting, and the ideas explored together.",
      },
      {
        title: "Looking ahead",
        text: "Confirmed next steps and related community activities will be included with the published update.",
      },
    ],
  },
  {
    slug: "community-voices",
    kind: "news",
    title: "Voices from the community",
    summary:
      "A space for community reflections, shared learning, and stories told with care and permission.",
    image: "africa-friends-table",
    imageAlt:
      "Illustrative photograph of two people in an attentive conversation",
    position: "43% 38%",
    template: true,
    illustrative: true,
    sections: [
      {
        title: "A space for shared perspectives",
        text: "Community reflections will be added here once the content is ready and the people involved have agreed to what may be shared.",
      },
      {
        title: "Stories shared with care",
        text: "Each reflection will be shared with care and permission, respecting the choices of the people involved.",
      },
      {
        title: "Continue the conversation",
        text: "Related reading and opportunities to connect will accompany each confirmed story.",
      },
    ],
  },
  {
    slug: "community-connection-day",
    kind: "events",
    title: "Community connection day",
    summary:
      "An event template for an outreach gathering, with room for the date, venue, activities, and ways to take part.",
    image: "africa-hands",
    imageAlt: "Illustrative photograph of people joining hands in a group",
    position: "50% 44%",
    template: true,
    illustrative: true,
    sections: [
      {
        title: "About the gathering",
        text: "The purpose, program, and confirmed location of the gathering will be shared here.",
      },
      {
        title: "What to expect",
        text: "The event announcement will describe the activities and practical arrangements before participation opens.",
        points: [
          "Confirmed date, time, and location",
          "Who the gathering is for and how to take part",
          "Language, access, and any participation requirements",
        ],
      },
      {
        title: "Taking part",
        text: "Registration details and practical information will be published with the confirmed event announcement.",
      },
    ],
  },
  {
    slug: "community-conversations",
    kind: "events",
    title: "Community conversations",
    summary:
      "A gathering template for meaningful conversations about connection, support, and the things that matter locally.",
    image: "africa-group-reading",
    imageAlt:
      "Illustrative photograph of three friends reading together",
    position: "50% 42%",
    template: true,
    illustrative: true,
    sections: [
      {
        title: "The conversation",
        text: "The confirmed theme and purpose of this gathering will be introduced here, alongside information about who it is for.",
      },
      {
        title: "Before you attend",
        text: "Date, format, venue, languages, and accessibility arrangements will be added with the announcement. No attendance details have been confirmed yet.",
      },
      {
        title: "Participation",
        text: "Information about taking part and who to contact will be published with the final event details.",
      },
    ],
  },
  {
    slug: "listening-with-care",
    kind: "workshops",
    title: "Listening with care",
    summary:
      "A workshop template focused on thoughtful listening, respectful conversations, and supporting others without judgment.",
    image: "africa-friends-table",
    imageAlt:
      "Illustrative photograph of two people listening and talking together",
    position: "43% 38%",
    template: true,
    illustrative: true,
    sections: [
      {
        title: "Workshop focus",
        text: "A proposed theme for a workshop about listening and connection. The confirmed topic, intended audience, and facilitator information will be added before a session is announced.",
      },
      {
        title: "Session outline",
        text: "The final outline will explain what participants can explore and how the session is structured.",
        points: [
          "A clear introduction to the topic",
          "Discussion or practical learning activities",
          "Time for questions and relevant resources",
        ],
      },
      {
        title: "Practical details",
        text: "Date, duration, format, venue, cost, access arrangements, and registration details are awaiting confirmation. This is a content template, not a scheduled session.",
      },
    ],
  },
  {
    slug: "healthy-boundaries",
    kind: "workshops",
    title: "Understanding healthy boundaries",
    summary:
      "A workshop template for exploring respect, personal boundaries, and the choices that support healthier connections.",
    image: "africa-reading",
    imageAlt: "Illustrative photograph of a woman reading at a table",
    position: "63% 43%",
    template: true,
    illustrative: true,
    sections: [
      {
        title: "Workshop focus",
        text: "A proposed learning theme about boundaries and respectful connection. The exact focus and intended audience will be confirmed with the workshop announcement.",
      },
      {
        title: "Learning together",
        text: "The finished workshop outline will describe the topics, activities, and available resources. The confirmed facilitator and intended audience will be introduced with the session details.",
      },
      {
        title: "Joining a session",
        text: "No session date or registration has been announced. Confirmed scheduling, participation, and accessibility information will be published here when available.",
      },
    ],
  },
];

// Local editorial collection; a future CMS adapter will supply this contract.
// Replace demo records with approved material here when ready.
const editorialEntries: CommunityEntry[] = [
  {
    kind: "events",
    slug: "cyanika-technical-secondary-school-outreach",
    title: "School outreach at Cyanika Technical Secondary School",
    summary: "Our team visited Cyanika Technical Secondary School to share learning and encourage conversation about mental health.",
    image: "/community-outreach/cyanika/photo-11.jpg",
    imageAlt: "A speaker addresses students at Cyanika Technical Secondary School",
    imageDimensions: { width: 1008, height: 756 },
    imageOrientation: "landscape",
    position: "50% 50%",
    template: false,
    illustrative: false,
    status: "published",
    mediaApproved: true,
    completed: { date: "2026-11-17", dateLabel: "Tuesday, 17 November 2026", location: "Cyanika Technical Secondary School" },
    audience: "Students",
    topics: ["School outreach", "Mental health"],
    sections: [
      { title: "Bringing the conversation to Cyanika", text: "On Tuesday, 17 November 2026, Vuga Ndakumva visited Cyanika Technical Secondary School, bringing students together for a conversation about mental health and well-being." },
      { title: "Learning and listening together", text: "During the visit, members of the team spoke with students and used presentations to share information. Students also had opportunities to speak and take part in the conversation." },
      { title: "Continuing the conversation", text: "The visit was part of our school outreach: creating space to learn, listen and connect. Explore the photographs below to see moments from the visit." },
    ],
    resources: [{ title: "Mental health", href: "/mental-health" }, { title: "Guides & worksheets", href: "/resources" }],
    visitPhotos: cyanikaPhotos,
  },
  {
    kind: "events",
    slug: "saint-aloys-rwamagana-outreach",
    title: "School outreach at Saint Aloys Rwamagana",
    summary: "Students gathered with our team for a conversation about mental health, gender-based violence, alcohol and drugs.",
    image: "/images/community/outreach/saint-aloys-original.jpg",
    imageAlt: "A speaker addresses students in blue uniforms at Saint Aloys Rwamagana",
    imageDimensions: { width: 576, height: 1024 },
    imageOrientation: "portrait",
    position: "50% 43%",
    template: false,
    illustrative: false,
    status: "published",
    mediaApproved: true,
    completed: { date: "2026-11-11", dateLabel: "Wednesday, 11 November 2026", location: "Saint Aloys Rwamagana" },
    audience: "Students",
    topics: ["School outreach", "Mental health", "Gender-based violence", "Alcohol and drugs"],
    sections: [
      { title: "A conversation that starts with listening", text: "On Wednesday, 11 November 2026, Vuga Ndakumva visited Saint Aloys Rwamagana to speak with students about issues that can affect their well-being and their communities. Our team shared information and invited students into the conversation." },
      { title: "Mental health and respectful relationships", text: "The team spoke about mental health and the importance of recognizing when someone may need support. The outreach also addressed gender-based violence, encouraging awareness of safety, respect and the importance of seeking help." },
      { title: "Understanding alcohol and drugs", text: "Students also learned about alcohol and drugs and the ways substance use can affect health and everyday life. The session encouraged informed conversations and helped point students toward reliable information and support." },
    ],
    resources: [{ title: "Mental health", href: "/mental-health" }, { title: "Understanding GBV", href: "/understand-gbv" }, { title: "Alcohol and drugs", href: "/alcohol-and-drugs" }],
  },
  {
    kind: "events",
    slug: "gs-nyagasambu-outreach",
    title: "School outreach at GS Nyagasambu",
    summary: "Our team visited GS Nyagasambu to share information about well-being, safety, alcohol and drugs.",
    image: "/images/community/outreach/gs-nyagasambu-original.jpg",
    imageAlt: "A speaker addresses a group gathered in a classroom at GS Nyagasambu",
    imageDimensions: { width: 1280, height: 720 },
    imageOrientation: "landscape",
    position: "50% 50%",
    template: false,
    illustrative: false,
    status: "published",
    mediaApproved: true,
    completed: { date: "2026-11-10", dateLabel: "Tuesday, 10 November 2026", location: "GS Nyagasambu" },
    audience: "Students",
    topics: ["School outreach", "Mental health", "Gender-based violence", "Alcohol and drugs"],
    sections: [
      { title: "Bringing learning into the school community", text: "On Tuesday, 10 November 2026, Vuga Ndakumva visited GS Nyagasambu to share information with students and open a conversation about well-being. Our team spoke about topics that can be difficult to discuss, with an emphasis on listening and understanding." },
      { title: "Speaking about mental health and GBV", text: "The outreach covered mental health and gender-based violence, highlighting the value of understanding these issues, treating others with respect and knowing that support can be sought when it is needed." },
      { title: "Making informed choices", text: "The team also discussed alcohol and drugs, sharing information about their effects and encouraging students to seek reliable information and support. The visit was an opportunity to bring these important conversations into the school community." },
    ],
    resources: [{ title: "Mental health", href: "/mental-health" }, { title: "Understanding GBV", href: "/understand-gbv" }, { title: "Alcohol and drugs", href: "/alcohol-and-drugs" }],
  },
];
export const SHOW_COMMUNITY_DEMOS = false;
const activeEntries = [
  ...editorialEntries,
  ...(SHOW_COMMUNITY_DEMOS
    ? demoCommunityEntries.filter(
        (demo) => !editorialEntries.some((entry) => entry.slug === demo.slug),
      )
    : []),
];

export const communityEntries: CommunityEntry[] = [
  ...activeEntries,
  ...templateEntries
    .filter(
      (template) =>
        !activeEntries.some((entry) => entry.slug === template.slug),
    )
    .map((entry): CommunityEntry => ({
      ...entry,
      status: "draft",
      mediaApproved: false,
      topics: [],
    })),
];

export function communityDate(value: string, timeZone = "Africa/Kigali") {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(new Date(value));
}

export function communityTime(schedule: CommunitySchedule) {
  return `${new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: schedule.timeZone }).format(new Date(schedule.startsAt))} · ${schedule.timeZone}`;
}
