export type Category = "wellness" | "mental-health";
export type SessionFormat = "Online" | "In person";
export type Region = "Rwanda" | "International";
export type Language = "English" | "Kinyarwanda" | "French";
export interface Professional {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  specialties: string[];
  languages: Language[];
  formats: SessionFormat[];
  active: boolean;
}
export interface Service {
  id: string;
  title: string;
  category: Category;
  kind: "Session" | "Group" | "Plan";
  image: string;
  description: string;
  audience: string;
  benefits: string[];
  duration: number;
  priceRwf: number;
  priceUsd: number;
  formats: SessionFormat[];
  languages: Language[];
  professionalIds: string[];
  tags: string[];
  active: boolean;
}
export interface SessionSlot {
  id: string;
  serviceId: string;
  professionalId: string;
  format: SessionFormat;
  startsAt: string;
}
export interface DemoBooking {
  id: string;
  serviceId: string;
  professionalId: string;
  format: SessionFormat;
  startsAt: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  priceRwf: number;
  priceUsd: number;
  feedback?: { rating: number; comment: string };
}
export interface Resource {
  id: string;
  title: string;
  type: "Article" | "Guided practice" | "Worksheet";
  category: Category | "gbv" | "substance-use" | "supporters";
  minutes: number;
  image: string;
  description: string;
  content: string[];
  download?: string;
  topic?: import("../support/content").ResourceTopic;
  sources?: string[];
}
export interface Enquiry {
  id: string;
  subject: string;
  serviceId: string;
  status: "New" | "Resolved";
}

export const categoryLabel = (category: Category) =>
  category === "wellness" ? "Wellness" : "Mental health support";
export const languages: Language[] = ["English", "Kinyarwanda", "French"];
export const professionals: Professional[] = [
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    role: "Yoga & movement guide",
    image: "professional",
    bio: "A sample profile illustrating a welcoming introduction to movement and everyday routines.",
    specialties: ["Gentle yoga", "Mindful movement", "Personal routines"],
    languages: ["English", "Kinyarwanda"],
    formats: ["Online", "In person"],
    active: true,
  },
  {
    id: "samira-n",
    name: "Samira N.",
    role: "Meditation & group facilitator",
    image: "mindfulness",
    bio: "A demonstration facilitator profile for quiet practices, group connection, and inclusive participation.",
    specialties: ["Guided meditation", "Group sessions", "Everyday calm"],
    languages: ["English", "French", "Kinyarwanda"],
    formats: ["Online", "In person"],
    active: true,
  },
  {
    id: "jordan-reed",
    name: "Jordan Reed",
    role: "Counseling professional · sample role",
    image: "kindness",
    bio: "This fictional profile shows how a counseling provider could present their approach. No professional credentials have been verified and no counseling is delivered here.",
    specialties: [
      "Introductory conversations",
      "Support preferences",
      "Stress-management education",
    ],
    languages: ["English", "French"],
    formats: ["Online", "In person"],
    active: true,
  },
  {
    id: "chris-taylor",
    name: "Chris Taylor",
    role: "Emotional & peer-support facilitator",
    image: "event",
    bio: "A fictional facilitator profile demonstrating supportive listening and clearly explained group participation.",
    specialties: [
      "Peer connection",
      "Support conversations",
      "Group workshops",
    ],
    languages: ["English", "Kinyarwanda"],
    formats: ["Online", "In person"],
    active: true,
  },
];
const base = {
  active: true,
  formats: ["Online", "In person"] as SessionFormat[],
};
export const services: Service[] = [
  {
    ...base,
    id: "gentle-yoga",
    title: "Yoga, at your own pace",
    category: "wellness",
    kind: "Session",
    image: "hero-yoga",
    description:
      "Make space to move, stretch, and reconnect in a welcoming guided session.",
    audience:
      "Adults looking for a gentle introduction to yoga or a flexible practice.",
    benefits: [
      "Explore comfortable movement",
      "Discuss your pace and preferences",
      "Build a routine that fits your day",
    ],
    duration: 60,
    priceRwf: 18000,
    priceUsd: 20,
    languages: ["English", "Kinyarwanda"],
    professionalIds: ["alex-morgan", "samira-n"],
    tags: ["Move with ease", "Build a routine"],
  },
  {
    ...base,
    id: "guided-meditation",
    title: "A moment of guided calm",
    category: "wellness",
    kind: "Session",
    image: "hero-meditation",
    description:
      "A free introduction to pausing, noticing, and making room for the present.",
    audience:
      "Adults curious about a quiet, guided practice. No prior experience needed.",
    benefits: [
      "Explore a short quiet practice",
      "Choose what feels comfortable",
      "Make room for reflection",
    ],
    duration: 30,
    priceRwf: 0,
    priceUsd: 0,
    languages: ["English", "Kinyarwanda", "French"],
    professionalIds: ["samira-n"],
    tags: ["Find everyday calm", "Build a routine"],
  },
  {
    ...base,
    id: "personalized-wellness",
    title: "Your personal wellness plan",
    category: "wellness",
    kind: "Plan",
    image: "environment",
    description:
      "Shape a simple, realistic routine around your goals, interests, and everyday life.",
    audience:
      "Adults seeking structure for personal wellness habits, rather than medical treatment.",
    benefits: [
      "Clarify your everyday goals",
      "Explore practical routines",
      "Create a flexible starting plan",
    ],
    duration: 45,
    priceRwf: 25000,
    priceUsd: 30,
    languages: ["English", "Kinyarwanda"],
    professionalIds: ["alex-morgan"],
    tags: ["Build a routine", "Find everyday calm"],
  },
  {
    ...base,
    id: "group-wellness",
    title: "Better, together",
    category: "wellness",
    kind: "Group",
    image: "hero-movement",
    description:
      "Join a small-group wellness session with shared movement and conversation.",
    audience: "Adults who enjoy learning and participating with others.",
    benefits: [
      "Share a welcoming group space",
      "Try simple guided movement",
      "Take part at your own pace",
    ],
    duration: 75,
    priceRwf: 12000,
    priceUsd: 15,
    languages: ["English", "Kinyarwanda", "French"],
    professionalIds: ["samira-n", "alex-morgan"],
    tags: ["Connect with others", "Move with ease"],
  },
  {
    ...base,
    id: "counseling-consultation",
    title: "A first counseling conversation",
    category: "mental-health",
    kind: "Session",
    image: "kindness",
    description:
      "Explore what you are looking for in support and what a counseling relationship might involve.",
    audience:
      "Adults exploring routine counseling options. Not an emergency service.",
    benefits: [
      "Discuss what support could look like",
      "Ask questions about the process",
      "Explore preferences and next steps",
    ],
    duration: 50,
    priceRwf: 30000,
    priceUsd: 40,
    languages: ["English", "French"],
    professionalIds: ["jordan-reed"],
    tags: ["Talk to someone", "Find everyday calm"],
  },
  {
    ...base,
    id: "emotional-support",
    title: "Space to be heard",
    category: "mental-health",
    kind: "Session",
    image: "hero",
    description:
      "An introductory support conversation, with room to talk about what matters to you.",
    audience:
      "Adults seeking a routine listening and support conversation, not diagnosis or crisis response.",
    benefits: [
      "Explain your support preferences",
      "Explore what would feel helpful",
      "Learn how future sessions might work",
    ],
    duration: 45,
    priceRwf: 20000,
    priceUsd: 25,
    languages: ["English", "Kinyarwanda"],
    professionalIds: ["chris-taylor"],
    tags: ["Talk to someone", "Connect with others"],
  },
  {
    ...base,
    id: "peer-support",
    title: "A circle of shared support",
    category: "mental-health",
    kind: "Group",
    image: "event",
    description:
      "A free, facilitated introduction to respectful peer connection and shared experiences.",
    audience:
      "Adults interested in non-clinical peer support. Sharing is optional.",
    benefits: [
      "Learn group boundaries",
      "Connect through shared interests",
      "Participate without pressure to share",
    ],
    duration: 60,
    priceRwf: 0,
    priceUsd: 0,
    languages: ["English", "Kinyarwanda"],
    professionalIds: ["chris-taylor"],
    tags: ["Connect with others", "Talk to someone"],
  },
  {
    ...base,
    id: "stress-workshop",
    title: "Everyday stress, explored",
    category: "mental-health",
    kind: "Group",
    image: "hero-nature",
    description:
      "An educational group workshop about everyday pressures, preferences, and supportive routines.",
    audience:
      "Adults looking for general wellbeing education rather than clinical assessment.",
    benefits: [
      "Reflect on everyday pressures",
      "Explore supportive routines",
      "Identify questions for further support",
    ],
    duration: 90,
    priceRwf: 15000,
    priceUsd: 18,
    languages: ["English", "French", "Kinyarwanda"],
    professionalIds: ["jordan-reed", "chris-taylor"],
    tags: ["Find everyday calm", "Build a routine"],
  },
];

const dayStart = () => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
};
export function seedSlots(): SessionSlot[] {
  return services.flatMap((service, index) =>
    service.professionalIds.flatMap((professionalId) =>
      service.formats.flatMap((format) =>
        (index === 7 ? [9, 11, 14] : [1, 4, 11]).map((offset, i) => ({
          id: `${service.id}-${professionalId}-${format}-${i}`,
          serviceId: service.id,
          professionalId,
          format,
          startsAt: new Date(
            dayStart() +
              offset * 86400000 +
              (8 + i * 3 + (format === "In person" ? 1 : 0)) * 3600000,
          ).toISOString(),
        })),
      ),
    ),
  );
}
export function seedBookings(): DemoBooking[] {
  return [
    {
      id: "demo-upcoming",
      serviceId: "guided-meditation",
      professionalId: "samira-n",
      format: "Online",
      startsAt: new Date(
        dayStart() + 3 * 86400000 + 11 * 3600000,
      ).toISOString(),
      status: "Upcoming",
      priceRwf: 0,
      priceUsd: 0,
    },
    {
      id: "demo-completed",
      serviceId: "gentle-yoga",
      professionalId: "alex-morgan",
      format: "Online",
      startsAt: new Date(dayStart() - 3 * 86400000 + 8 * 3600000).toISOString(),
      status: "Completed",
      priceRwf: 18000,
      priceUsd: 20,
    },
    {
      id: "demo-cancelled",
      serviceId: "peer-support",
      professionalId: "chris-taylor",
      format: "In person",
      startsAt: new Date(dayStart() - 5 * 86400000 + 8 * 3600000).toISOString(),
      status: "Cancelled",
      priceRwf: 0,
      priceUsd: 0,
    },
  ];
}
export const resources: Resource[] = [
  {
    id: "choose-your-support",
    title: "Finding the right kind of support",
    type: "Article",
    category: "mental-health",
    minutes: 4,
    image: "kindness",
    description: "Questions to consider before an introductory conversation.",
    content: [
      "Different services offer different kinds of support. Read the service description and ask what the provider can and cannot offer.",
      "You might ask about qualifications, languages, session format, privacy, fees, and what happens if a service is not a good fit.",
      "This preview does not assess needs or verify providers. For personal clinical questions, speak with an appropriately qualified professional.",
    ],
  },
  {
    id: "gentle-first-step",
    title: "Your first group session",
    type: "Article",
    category: "wellness",
    minutes: 3,
    image: "event",
    description: "A practical introduction to joining a welcoming group.",
    content: [
      "Check the format, start time, location, and any preparation notes before attending.",
      "Ask about accessibility or participation needs beforehand. You can ask what is optional and what group boundaries apply.",
      "Choose a comfortable place and leave yourself a little time to arrive. Participation should feel respectful and voluntary.",
    ],
  },
  {
    id: "quiet-moment",
    title: "A moment to notice",
    type: "Guided practice",
    category: "wellness",
    minutes: 2,
    image: "environment",
    description: "A short, optional reflection for an everyday pause.",
    content: [
      "Find a place where you feel comfortable. There is no need to change your breathing or close your eyes.",
      "Notice a few details around you: a color, a sound, or the feel of your seat. Skip anything that does not feel comfortable.",
      "Consider one small thing that would support your next hour. This is a general reflection, not treatment or a substitute for care.",
    ],
  },
  {
    id: "weekly-wellness",
    title: "My week, with a little more space",
    type: "Worksheet",
    category: "wellness",
    minutes: 5,
    image: "hands",
    description: "A printable planning sheet for flexible personal routines.",
    content: [
      "Use the worksheet to note what matters this week, a small intention, and a realistic time to revisit it.",
      "Keep your completed worksheet somewhere private. This website does not collect your answers.",
    ],
    download: "/worksheets/weekly-wellness.txt",
  },
  {
    id: "support-preferences",
    title: "What support feels right for me?",
    type: "Worksheet",
    category: "mental-health",
    minutes: 5,
    image: "mindfulness",
    description: "Optional prompts to prepare questions and preferences.",
    content: [
      "Reflect on the format, language, and practical arrangements that would help you feel comfortable.",
      "You can keep your answers private or choose which questions to bring to a future conversation. Do not enter sensitive health information into this demo.",
    ],
    download: "/worksheets/support-preferences.txt",
  },
  {
    id: "connection",
    title: "Making room for connection",
    type: "Guided practice",
    category: "mental-health",
    minutes: 3,
    image: "hero-nature",
    description: "A short reflection on everyday sources of support.",
    content: [
      "Think of a person, place, or activity that helps you feel connected. You do not need to share their name.",
      "Consider a small, comfortable way to connect this week, if you would like to.",
      "There is no right answer or score. This is a general reflection; routine support and urgent assistance are different services.",
    ],
  },
];
