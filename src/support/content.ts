import type { Resource } from "../services/data";

export type TopicId = "mental-health" | "alcohol-and-drugs" | "understand-gbv";
export type ResourceTopic = TopicId | "supporters";
export interface SupportTopic {
  id: TopicId;
  title: string;
  label: string;
  summary: string;
  action: string;
  image: string;
  imagePosition: string;
  eyebrow: string;
  headline: string;
  intro: string;
  guidance: { title: string; text: string }[];
  options: string[];
  expect: string[];
  supporter: string;
  sourceIds: string[];
}
export interface OfficialResource {
  id: string;
  title: string;
  description: string;
  region: "Rwanda" | "International";
  topics: ResourceTopic[];
  url: string;
  checkedAt: string;
  phone?: string;
  caveat?: string;
}

export const officialResources: OfficialResource[] = [
  {
    id: "rbc",
    title: "Rwanda Biomedical Centre",
    region: "Rwanda",
    topics: ["mental-health", "alcohol-and-drugs"],
    description:
      "Contact the national health call centre for health-service information and to ask where to seek appropriate care.",
    url: "https://rbc.gov.rw/contact/",
    phone: "114",
    checkedAt: "2026-11-08",
    caveat:
      "Ask the service about available care, costs, opening hours, languages, and referral requirements. This is not a booking through this website.",
  },
  {
    id: "isange",
    title: "Isange One Stop Centres",
    region: "Rwanda",
    topics: ["understand-gbv"],
    description:
      "UNHCR Rwanda lists Isange centres as a route to specialist GBV support across Rwanda’s 30 districts.",
    url: "https://help.unhcr.org/rwanda/services/sgbv/",
    phone: "3029",
    checkedAt: "2026-11-08",
    caveat:
      "UNHCR notes that approaching an Isange centre may lead to a report to law enforcement. Ask about confidentiality and reporting before sharing details when it is safe to do so.",
  },
  {
    id: "rib",
    title: "RIB assistance and reporting information",
    region: "Rwanda",
    topics: ["understand-gbv"],
    description:
      "Official information about assistance from Isange and reporting domestic or gender-based violence. Reporting and seeking information are different steps.",
    url: "https://www.rib.gov.rw/updates/news/news-detail/rib-launches-its-service-charter-to-promote-transparency-and-accountability-in-service-delivery",
    checkedAt: "2026-11-08",
    caveat:
      "This is an investigation authority. Do not assume that information shared with it will remain confidential.",
  },
  {
    id: "emergency",
    title: "Government of Rwanda emergency information",
    region: "Rwanda",
    topics: ["mental-health", "alcohol-and-drugs", "understand-gbv"],
    description:
      "The official government page lists 112 for emergencies and 912 for an ambulance, alongside other public assistance numbers.",
    url: "https://www.gov.rw/emergency",
    checkedAt: "2026-11-08",
  },
  {
    id: "who-mental",
    title: "WHO: understanding mental health",
    region: "International",
    topics: ["mental-health", "supporters"],
    description:
      "An introduction to mental well-being, the circumstances that shape it, and approaches to support and care.",
    url: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
    checkedAt: "2026-11-08",
  },
  {
    id: "who-alcohol",
    title: "WHO: alcohol and health",
    region: "International",
    topics: ["alcohol-and-drugs", "supporters"],
    description:
      "Public-health information about alcohol, its effects, and the importance of access to treatment and support.",
    url: "https://www.who.int/news-room/fact-sheets/detail/alcohol",
    checkedAt: "2026-11-08",
  },
  {
    id: "who-drugs",
    title: "WHO: drugs and health",
    region: "International",
    topics: ["alcohol-and-drugs", "supporters"],
    description:
      "Public-health information about psychoactive substances, their effects, and approaches to prevention, treatment, and reducing harm.",
    url: "https://www.who.int/health-topics/drugs-psychoactive",
    checkedAt: "2026-11-08",
  },
  {
    id: "unhcr",
    title: "UNHCR Help: country information",
    region: "International",
    topics: ["understand-gbv"],
    description:
      "Country-specific information for refugees, asylum-seekers, and stateless people, including protection and support options where available.",
    url: "https://help.unhcr.org/",
    checkedAt: "2026-11-08",
    caveat:
      "Eligibility and services vary by country. This directory is not an emergency response service.",
  },
  {
    id: "who-countries",
    title: "WHO country information",
    region: "International",
    topics: ["mental-health", "alcohol-and-drugs"],
    description:
      "Find your country’s WHO office and health information. For care, contact your local health service and ask about referral options.",
    url: "https://www.who.int/countries",
    checkedAt: "2026-11-08",
    caveat:
      "WHO country offices are not appointment providers or emergency services. Local emergency numbers differ by country.",
  },
];

export const topics: SupportTopic[] = [
  {
    id: "mental-health",
    title: "Mental Health",
    label: "Mental health",
    summary:
      "Understand stress, anxiety, low mood, and the support available to you.",
    action: "Explore mental health",
    image: "mental-health-counseling",
    imagePosition: "60% 36%",
    eyebrow: "ROOM TO BE HEARD",
    headline: "You don’t have to figure it out alone.",
    intro:
      "Mental health is part of everyday life. Whether you are feeling overwhelmed, grieving, or finding things difficult, you can explore support without having a diagnosis or knowing exactly what to say.",
    guidance: [
      {
        title: "Make sense of what you’re feeling",
        text: "Stress, ongoing worry, low mood, and grief can affect daily life in different ways. Information can help you describe your experience; it cannot tell you whether you have a condition.",
      },
      {
        title: "Understand your options",
        text: "A supportive conversation, community connection, counseling, or a health-service assessment may be a place to begin. A qualified professional can discuss what may suit your circumstances.",
      },
      {
        title: "Take one manageable step",
        text: "You can start by asking a trusted person to help you find information, or by asking a health service what a first conversation involves. You decide what you are ready to explore.",
      },
    ],
    options: [
      "Counseling and psychosocial support",
      "Assessment and referrals through health services",
      "Appropriately facilitated community or peer support",
    ],
    expect: [
      "Ask about the professional’s role, qualifications, languages, costs, and accessibility.",
      "Ask how information is handled and when confidentiality may have limits.",
      "Discuss your goals and available options; ask questions before agreeing to a next step.",
    ],
    supporter:
      "Listen without rushing to fix things. Ask what would be useful, offer practical help if wanted, and respect their decisions. You can care about someone while also setting your own limits.",
    sourceIds: ["rbc", "who-mental", "who-countries"],
  },
  {
    id: "alcohol-and-drugs",
    title: "Alcohol & Drugs",
    label: "Alcohol & drugs",
    summary:
      "Clear, judgment-free information about substance use, safer choices, and recovery support.",
    action: "Explore alcohol & drugs",
    image: "mental-health-group",
    imagePosition: "50% 40%",
    eyebrow: "UNDERSTANDING, WITHOUT JUDGMENT",
    headline: "A different next step is possible.",
    intro:
      "Questions about alcohol or drugs deserve a compassionate response. Explore the effects of substances, concerns about dependence, and pathways to professional or community support at your own pace.",
    guidance: [
      {
        title: "Understand substance use",
        text: "Alcohol and other drugs can affect physical health, feelings, relationships, and everyday responsibilities. The effects vary by substance and person; seeking information does not require a label.",
      },
      {
        title: "Talk about concerns early",
        text: "If use is becoming hard to control or is causing concern, a qualified health professional can discuss your situation and possible support. This website cannot assess dependence or recommend treatment.",
      },
      {
        title: "Find appropriate care",
        text: "Ask a health service about assessment, medically supported withdrawal where needed, rehabilitation referrals, and recovery support. Withdrawal can require medical care; this site does not provide detox instructions.",
      },
    ],
    options: [
      "Health-service assessment and treatment information",
      "Referral to appropriate addiction or rehabilitation services",
      "Peer-led recovery support alongside professional care where appropriate",
    ],
    expect: [
      "Ask about the service’s qualifications, treatment approach, costs, and follow-up.",
      "Discuss privacy, consent, and any reporting requirements before sharing personal details.",
      "A professional should explain options and preparation for any recommended care.",
    ],
    supporter:
      "Choose a calm moment, describe your concerns without blame, and ask what help would feel useful. Avoid making promises you cannot keep. Look after your safety and seek professional guidance when needed.",
    sourceIds: ["rbc", "who-alcohol", "who-drugs", "who-countries"],
  },
  {
    id: "understand-gbv",
    title: "GBV",
    label: "Gender-based violence",
    summary:
      "Understand abuse, recognize controlling behaviour, and explore specialist support.",
    action: "Explore GBV support",
    image: "mental-health-connection",
    imagePosition: "50% 44%",
    eyebrow: "YOUR SAFETY. YOUR CHOICES.",
    headline: "You deserve safety and respect.",
    intro:
      "Gender-based violence can include physical, sexual, emotional, economic, or technology-facilitated harm. Abuse is not your fault. You can explore information without sharing your story here.",
    guidance: [
      {
        title: "Recognize harmful behaviour",
        text: "Threats, coercion, unwanted sexual contact, control over money, isolation, and online harassment can be forms of abuse. You do not need to be certain of a label before asking a specialist about your options.",
      },
      {
        title: "Explore support safely",
        text: "Use a device and contact method that feel safe for you. If someone monitors your device, consider another way to access support. Quick exit changes this page, but does not erase browsing or device history.",
      },
      {
        title: "Understand choices and limits",
        text: "Specialist services may offer health care, psychosocial support, legal information, or protection referrals. Ask what is confidential and what may be reported; these limits vary by service and circumstances.",
      },
    ],
    options: [
      "Specialist GBV assistance through Isange in Rwanda",
      "Health care and psychosocial support",
      "Information about legal, protection, and practical assistance",
    ],
    expect: [
      "Ask whether it is safe to make contact, how they will respond, and what information they need.",
      "Ask about confidentiality and reporting. UNHCR notes that Isange contact may result in a law-enforcement report.",
      "Ask about available options and eligibility without assuming every service or accommodation is available.",
    ],
    supporter:
      "Listen, believe their experience, and avoid blame. Ask what support they want, respect their choices, and do not confront the person causing harm on their behalf. Consider safe contact methods before sending messages.",
    sourceIds: ["isange", "rib", "unhcr"],
  },
];

export const pathways = [
  {
    title: "I need emotional support",
    text: "Understand how you feel and what speaking with a professional can involve.",
    to: "/mental-health",
  },
  {
    title: "I am concerned about violence or abuse",
    text: "Explore specialist options for harm, threats, or controlling behaviour.",
    to: "/understand-gbv",
  },
  {
    title: "I need help with alcohol or drug use",
    text: "Find non-judgmental information and pathways to appropriate care.",
    to: "/alcohol-and-drugs",
  },
  {
    title: "I want to help someone",
    text: "Learn to listen, offer practical help, and respect another person’s choices.",
    to: "/support#help-someone",
  },
  {
    title: "I want information and practical resources",
    text: "Browse plain-language guides on well-being, relationships, and substances.",
    to: "/resources",
  },
];
export const supportCategories = [
  {
    title: "Mental health & emotional well-being",
    text: "Counseling, psychosocial support, and care for stress, low mood, and grief.",
    to: "/mental-health",
  },
  {
    title: "Gender-based violence support",
    text: "Specialist information about abuse, safety, and appropriate assistance.",
    to: "/understand-gbv",
  },
  {
    title: "Alcohol, drugs & harm reduction",
    text: "Understand substance use, professional care, and recovery pathways.",
    to: "/alcohol-and-drugs",
  },
  {
    title: "Health services & referrals",
    text: "Questions to ask about medical care, fees, appointments, and referrals.",
    to: "/support#health-referrals",
  },
  {
    title: "Legal & practical assistance",
    text: "Explore official information on reporting, rights, and protection options.",
    to: "/support#legal-practical",
  },
];
export const values = [
  {
    title: "Dignity & respect",
    text: "Your experiences deserve to be heard without blame, shame, or judgment.",
  },
  {
    title: "Choice & participation",
    text: "You decide what to explore and which steps to take. You do not need a diagnosis to seek help.",
  },
  {
    title: "Inclusion & accessibility",
    text: "We encourage clear information about languages, eligibility, and disability access before making contact.",
  },
  {
    title: "Privacy & transparency",
    text: "Understand what information is collected, how contact works, and the limits of confidentiality.",
  },
];
export const programs = [
  {
    title: "Awareness campaigns",
    text: "Challenging stigma through clear, compassionate conversations about mental health and substance use.",
  },
  {
    title: "Prevention education",
    text: "Learning about consent, boundaries, healthy relationships, and ways to cope.",
  },
  {
    title: "Workplace & partner learning",
    text: "Building understanding of safer environments and appropriate referral pathways.",
  },
];
export const resourceTopics: {
  id: ResourceTopic;
  title: string;
  text: string;
}[] = [
  {
    id: "mental-health",
    title: "Mental health",
    text: "Stress, anxiety, low mood, and how counseling works.",
  },
  {
    id: "understand-gbv",
    title: "Gender-based violence",
    text: "Recognizing abuse, consent, and relationship boundaries.",
  },
  {
    id: "alcohol-and-drugs",
    title: "Alcohol & drugs",
    text: "Substance use, dependence, and pathways to care.",
  },
  {
    id: "supporters",
    title: "Supporting someone",
    text: "Listening without judgment and understanding your limits.",
  },
];

export const supportArticles: Resource[] = [
  ...topics.map((topic) => ({
    id: `${topic.id}-guide`,
    title:
      topic.label === "Mental health"
        ? "Making sense of mental health support"
        : topic.id === "understand-gbv"
          ? "Understanding abuse and exploring support"
          : "Understanding substance use and support",
    type: "Article" as const,
    category: (topic.id === "understand-gbv"
      ? "gbv"
      : topic.id === "alcohol-and-drugs"
        ? "substance-use"
        : "mental-health") as Resource["category"],
    topic: topic.id,
    minutes: 4,
    image: topic.image,
    description: topic.summary,
    content: [
      ...topic.guidance.map((item) => `${item.title}. ${item.text}`),
      `Before you connect. ${topic.expect.join(" ")}`,
      `Supporting someone. ${topic.supporter}`,
    ],
    sources: topic.sourceIds,
  })),
  {
    id: "supporting-someone",
    title: "Being there for someone, without having all the answers",
    type: "Article",
    category: "supporters",
    topic: "supporters",
    minutes: 3,
    image: "mental-health-listening",
    description:
      "Practical ways to listen, respect choices, and understand your own limits.",
    content: [
      "Start by asking whether it is a good and safe time to talk. Listen without interrupting or asking someone to prove their experience.",
      "Ask what support would be useful. You might help find information or go with them to an appointment if they want. Let them make decisions about their next step.",
      "Avoid promising complete secrecy if someone may be in immediate danger. Be honest about your limits and seek appropriate professional support. If a device may be monitored, consider safe contact methods.",
    ],
    sources: ["who-mental", "isange"],
  },
];
