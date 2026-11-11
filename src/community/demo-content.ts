import type { CommunityEntry } from "./content";
import { communityPhotos } from "./photos";

// Replaceable demonstration content, deliberately separate from real editorial records.
// These stories and schedules are fictional; photographs are illustrative stock.
const common = {
  status: "published" as const,
  template: false,
  mediaApproved: true,
  demo: true,
  illustrative: true,
  position: "50% 42%",
  publishedAt: "2026-11-11T10:00:00+02:00",
  resources: [
    { title: "Learn about mental wellbeing", href: "/why-mental-health" },
    { title: "Guides & worksheets", href: "/resources" },
  ],
};

export const demoCommunityEntries: CommunityEntry[] = [
  {
    ...common,
    slug: "community-outreach-update",
    kind: "news",
    featured: true,
    title: "Small conversations. Stronger connections.",
    summary:
      "Sometimes, belonging begins with a simple question: how are you, really? A glimpse of the conversations we want to make space for.",
    image: "mental-health-group",
    imageAlt:
      "Illustrative photograph of people listening during a group conversation",
    topics: ["Connection", "Mental wellbeing"],
    relatedSlugs: ["moments-of-connection", "community-photo-journal"],
    sections: [
      {
        title: "A little room to be heard",
        text: "Imagine a small circle of people, a quiet room, and the freedom to listen without being asked to share. This fictional community story shows how an outreach update could introduce a welcoming space for conversation.",
      },
      {
        title: "Connection in everyday moments",
        text: "A thoughtful question, an unhurried conversation, a moment of shared learning. This sample story focuses on small gestures of care, rather than making claims about participants or programme outcomes.",
      },
      {
        title: "The story continues",
        text: "Replace this demo with your own approved outreach story, photographs, and confirmed next steps. The linked film and photo journal show how different community formats can sit together.",
      },
    ],
  },
  {
    ...common,
    slug: "moments-of-connection",
    kind: "videos",
    title: "A place to listen. A moment to connect.",
    summary:
      "A short, silent photo film about listening, togetherness, and making room for one another.",
    image: "mental-health-listening",
    imageAlt: "Illustrative photograph of an attentive conversation",
    topics: ["Connection"],
    relatedSlugs: ["community-photo-journal", "community-outreach-update"],
    video: {
      source: { provider: "local", src: "/community-demo/connection.mp4" },
      durationSeconds: 12,
      language: "No spoken dialogue · English captions",
      captions: [
        {
          src: "/community-demo/connection.en.vtt",
          language: "en",
          label: "English descriptions",
        },
      ],
      transcript:
        "Demo photo film. No audio or spoken dialogue.\n\n0–4 seconds: An illustrative photograph of people listening in a group. A place to listen.\n4–8 seconds: An illustrative photograph of hands joined together. Connection takes many forms.\n8–12 seconds: An illustrative photograph of two people in conversation. Every conversation can begin with care.\n\nThese are stock photographs, not footage of our outreach participants.",
    },
    sections: [
      {
        title: "Room for your own story",
        text: "This demonstration photo film uses existing illustrative images. Replace it with an approved community recording, matching captions, and its transcript when your footage is ready.",
      },
    ],
  },
  {
    ...common,
    slug: "a-moment-to-pause",
    kind: "videos",
    title: "Take a moment. Notice the little things.",
    summary:
      "Five quiet seconds with the natural world. A simple preview of a short community video.",
    image: "/community-demo/flowers-poster.webp",
    imageAlt: "A close-up of flowers in a sunlit garden",
    topics: ["Everyday moments"],
    relatedSlugs: ["moments-of-connection"],
    video: {
      source: { provider: "local", src: "/community-demo/flowers.webm" },
      durationSeconds: 5,
      language: "No spoken dialogue · English captions",
      captions: [
        {
          src: "/community-demo/flowers.en.vtt",
          language: "en",
          label: "English descriptions",
        },
      ],
      transcript:
        "Demo nature clip. No spoken dialogue. A close-up of flowers in a garden, with soft green foliage in the background. This sample is provided by MDN under CC0; it is not an outreach recording.",
    },
    sections: [
      {
        title: "A little pause in your day",
        text: "This short sample demonstrates the video player. There is no exercise to complete and no information to submit. Replace this sample with your own approved film whenever you are ready.",
      },
    ],
  },
  {
    ...common,
    slug: "community-photo-journal",
    kind: "albums",
    title: "People. Conversations. Connection.",
    summary:
      "A photo journal of the moments that make a community feel welcoming. Explore three illustrative perspectives.",
    image: "mental-health-connection",
    imageAlt: "Illustrative photograph of a group joining hands",
    topics: ["Connection"],
    photos: communityPhotos,
    relatedSlugs: ["community-outreach-update", "moments-of-connection"],
    sections: [
      {
        title: "Moments worth keeping",
        text: "This demo album brings together three existing stock photographs. The people shown are not identified as participants, clients, or members of this organisation. Replace the photographs and captions with approved images from your own activities.",
      },
    ],
  },
  {
    ...common,
    slug: "community-voices",
    kind: "news",
    title: "Being there starts with listening.",
    summary:
      "You do not need to have every answer to make space for someone. A sample reflection on everyday connection.",
    image: "mental-health-counseling",
    imageAlt:
      "Illustrative photograph of two people sitting in a welcoming room",
    topics: ["Mental wellbeing", "Connection"],
    relatedSlugs: ["listening-with-care", "moments-of-connection"],
    sections: [
      {
        title: "An unhurried conversation",
        text: "This is a sample editorial reflection, not a participant’s account. It illustrates how the community page can hold shorter pieces alongside outreach updates, videos, and photo journals.",
      },
      {
        title: "Find your next read",
        text: "Explore the mental health library or the guides and worksheets for more educational material at your own pace.",
      },
    ],
  },
  {
    ...common,
    slug: "community-connection-day",
    kind: "events",
    title: "An afternoon of connection.",
    summary:
      "A sample community gathering with room for conversation, shared learning, and time together.",
    image: "mental-health-connection",
    imageAlt: "Illustrative photograph of people joining hands",
    topics: ["Connection"],
    audience: "Sample audience: community members and friends",
    schedule: {
      startsAt: "2026-12-12T14:00:00+02:00",
      endsAt: "2026-12-12T16:00:00+02:00",
      timeZone: "Africa/Kigali",
      location: "Sample venue · Kigali",
      format: "In person",
    },
    sections: [
      {
        title: "What the afternoon could look like",
        text: "A welcome, a shared conversation, and an opportunity to explore useful resources. This fictional programme is a demonstration of an event page, not an announcement.",
      },
      {
        title: "Before you make plans",
        text: "The date, venue, and audience are sample details. This activity is not scheduled and registration is not available. Replace this record with confirmed information before announcing an event.",
      },
    ],
  },
  {
    ...common,
    slug: "listening-with-care",
    kind: "workshops",
    title: "Listening with care.",
    summary:
      "A sample workshop exploring thoughtful questions, respectful listening, and making space for others.",
    image: "mental-health-learning",
    imageAlt: "Illustrative photograph of a welcoming learning workspace",
    topics: ["Mental wellbeing"],
    audience: "Sample audience: adults interested in everyday support",
    schedule: {
      startsAt: "2026-12-19T10:00:00+02:00",
      endsAt: "2026-12-19T11:30:00+02:00",
      timeZone: "Africa/Kigali",
      location: "Sample online session",
      format: "Online",
    },
    sections: [
      {
        title: "A space for shared learning",
        text: "This fictional workshop outline demonstrates how to introduce a session. An opening conversation, an optional reflection, and useful reading could help participants explore a theme without being asked to disclose personal experiences.",
      },
      {
        title: "Sample details only",
        text: "This is not a confirmed workshop. The date and format are demonstration details and no places or registrations are available.",
      },
    ],
  },
];
