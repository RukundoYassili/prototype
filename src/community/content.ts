export type CommunityKind = "news" | "events" | "workshops";

export type CommunitySchedule = {
  startsAt: string; // ISO date with a UTC offset, so the displayed instant is unambiguous.
  timeZone: string;
  location: string;
  format: "In person" | "Online" | "Hybrid";
  registrationUrl?: string;
};

export type CommunityEntry = {
  slug: string;
  kind: CommunityKind;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  position: string;
  template: boolean;
  illustrative: boolean;
  publishedAt?: string;
  audience?: string;
  schedule?: CommunitySchedule;
  sections: { title: string; text: string; points?: string[] }[];
};

export const communityKinds: {
  id: CommunityKind;
  label: string;
  singular: string;
  description: string;
}[] = [
  {
    id: "news",
    label: "News",
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
];

export const communityKindLabel = (kind: CommunityKind) =>
  communityKinds.find((item) => item.id === kind)!.singular;

// Content templates requested for the community launch. Replace these records
// with confirmed content, then set template: false. Never invent dates or quotes.
export const communityEntries: CommunityEntry[] = [
  {
    slug: "community-outreach-update",
    kind: "news",
    title: "Stories from our outreach",
    summary:
      "A home for updates from community visits, shared conversations, and the people who make connection possible.",
    image: "mental-health-group",
    imageAlt:
      "Illustrative photograph of a small group listening to one another",
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
    image: "mental-health-listening",
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
    image: "mental-health-connection",
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
    image: "mental-health-group",
    imageAlt:
      "Illustrative photograph of a group conversation in a welcoming room",
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
    image: "mental-health-listening",
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
    image: "mental-health-learning",
    imageAlt: "Illustrative photograph of a mental health learning workspace",
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

export const findCommunityEntry = (slug?: string) =>
  communityEntries.find((entry) => entry.slug === slug);

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
