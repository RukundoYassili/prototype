import { mentalHealthCatalog } from "../learning/catalog";
import { gbvCatalog } from "../learning/gbv/catalog";
import { findBlogPost } from "../blog/posts";
import { topics, type TopicId } from "../support/content";
import { communityEntries, type CommunityEntry } from "../community/content";
import { isPublishable } from "../community/repository";
import { mentalHealthCovers } from "../learning/mental-health-covers";
import { gbvCovers } from "../learning/gbv/GbvIllustration";
import { awarenessScenes, awarenessImageBase } from "./illustrations";

export type ResourceReference =
  | { kind: "mental-health" | "gbv"; slug: string }
  | { kind: "blog"; slug: string }
  | { kind: "topic"; id: TopicId };
export interface AwarenessResource {
  title: string;
  to: string;
  format: string;
  artwork?: { base: string; alt: string };
}
export interface TopicLesson {
  id: TopicId;
  title: string;
  intro: string;
  takeaways: string[];
  example: string;
  misconception: string;
  explanation: string;
  resource: ResourceReference;
  sourceId: string;
}
export interface AudienceAction {
  id: string;
  label: string;
  title: string;
  intro: string;
  actions: string[];
  resource: ResourceReference;
}
export interface ProgrammeDescription {
  title: string;
  text: string;
}
export interface AwarenessFaq {
  question: string;
  answer: string;
}

const lessons: TopicLesson[] = [
  {
    id: "mental-health",
    title: "Mental health belongs in everyday conversations.",
    intro:
      "Mental health is part of everyday life: how we feel, connect, learn, and manage demands. People can have different needs even when their circumstances look similar. You do not need a diagnosis or the perfect words to begin learning about well-being.",
    takeaways: [
      "Notice changes without rushing to label them. Stress can affect sleep, concentration, and how we feel; one sign alone does not tell you what someone is experiencing.",
      "Make a little room for a manageable routine, rest, or connection. Choose something that fits your circumstances rather than turning well-being into another task to get right.",
      "Ask for support when difficulties persist or disrupt daily life. A qualified health professional can help you explore what is happening and what care may be appropriate.",
    ],
    example:
      "A student feels overwhelmed by exams and becomes quieter than usual. A friend asks whether they would prefer company, help organising one task, or space. They agree to check in again, without trying to diagnose the problem.",
    misconception: "“If I ask for help, I have failed.”",
    explanation:
      "Seeking information or support is a reasonable response to difficulty. You can start with one question and decide what you feel ready to discuss. A conversation does not require you to explain everything at once.",
    resource: {
      kind: "mental-health",
      slug: "understanding-mental-health-and-wellbeing",
    },
    sourceId: "stress",
  },
  {
    id: "understand-gbv",
    title: "Safety begins with respect and choice.",
    intro:
      "Respect includes room to make choices, express boundaries, and be heard. Learning about consent and gender-based violence can help us question harmful behaviour without blaming the person affected. Nobody needs to tell a personal story to take part in this learning.",
    takeaways: [
      "Treat consent as a freely made choice, not something obtained through pressure. Ask, listen, and respect a boundary rather than assuming that silence means agreement.",
      "Learn to recognise controlling behaviour, including pressure around contact, money, or relationships. Use the GBV library to explore patterns; do not turn a short example into a judgement about an individual.",
      "When someone shares harm, listen without blame or demands for details. Ask what they need and offer information about specialist support while respecting their choices and safety.",
    ],
    example:
      "A friend says a partner expects access to every message. Their listener avoids confronting the partner or forwarding the conversation. They ask what would feel safe and whether the friend would like help exploring support options.",
    misconception: "“Being supportive means deciding what someone must do.”",
    explanation:
      "Support can begin with attention and practical options. Pressuring someone to disclose, leave, or report can remove their sense of choice. Specialist services can explain options and any confidentiality or reporting limits that apply.",
    resource: { kind: "gbv", slug: "understanding-gender-based-violence" },
    sourceId: "respect",
  },
  {
    id: "alcohol-and-drugs",
    title: "Understanding substance use, without blame.",
    intro:
      "Questions about alcohol or drugs deserve clear information and respectful language. Substance use can affect people and those around them in different ways. Awareness is a chance to understand concerns and support options, rather than assign someone an identity or make assumptions about their life.",
    takeaways: [
      "Talk about a specific concern rather than using a label. Describe what you have noticed and ask whether the person would like to talk, without an audience or pressure to respond.",
      "Listen to what matters to the person. Practical concerns might include relationships, work, costs, or health. You can acknowledge those concerns without claiming to know the cause or solution.",
      "Explore qualified support together if invited. Ask a health service what assessment involves and which options are available. This page does not assess dependence or provide treatment or withdrawal instructions.",
    ],
    example:
      "Someone is worried about a relative’s drinking. At a calm moment, they mention a missed commitment and ask how things have been. They offer to look at reliable information together, while recognising that they also need their own boundaries and support.",
    misconception: "“Shame will motivate someone to seek help.”",
    explanation:
      "Stigma can discourage people from approaching care. Respectful conversations leave more room for questions and informed choices. A supporter can offer practical help without taking responsibility for another person’s recovery or promising a particular outcome.",
    resource: { kind: "topic", id: "alcohol-and-drugs" },
    sourceId: "substances",
  },
];

const audiences: AudienceAction[] = [
  {
    id: "myself",
    label: "For myself",
    title: "Start with one manageable step.",
    intro:
      "You can explore information at your own pace. Choose what is useful today and leave the rest for another time.",
    actions: [
      "Choose one topic on this page that answers a question you already have.",
      "Think of a person or service you could approach if you wanted more support.",
      "Prepare one question about care, cost, language, or privacy before contacting a service.",
    ],
    resource: { kind: "blog", slug: "your-first-support-conversation" },
  },
  {
    id: "supporter",
    label: "For a friend or family member",
    title: "Offer attention before advice.",
    intro:
      "You do not need every answer to be a thoughtful supporter. Make room for the other person’s preferences and your own limits.",
    actions: [
      "Ask whether this is a comfortable time and place for a conversation.",
      "Listen without asking them to prove or explain every detail.",
      "Offer one practical option, such as finding information together, and let them choose.",
    ],
    resource: {
      kind: "blog",
      slug: "listening-without-having-all-the-answers",
    },
  },
  {
    id: "young-people",
    label: "For young people",
    title: "Your questions deserve to be heard.",
    intro:
      "Learning about feelings, boundaries, and support is something you can do without sharing personal experiences with a group.",
    actions: [
      "Choose a trusted adult you could approach, such as a caregiver, teacher, or qualified health worker.",
      "Practise a simple opening: ‘I have a question and would like someone to listen.’",
      "Ask how information will be handled before sharing something private; adults may need to involve others to help keep you safe.",
    ],
    resource: {
      kind: "mental-health",
      slug: "recognizing-emotions-and-responding-to-them",
    },
  },
  {
    id: "groups",
    label: "For schools and community groups",
    title: "Make learning welcoming and optional.",
    intro:
      "A good discussion gives people choices about participation. Plan the support pathway as carefully as the activity itself.",
    actions: [
      "Use fictional examples, accessible language, and an option to pause or leave an activity.",
      "Explain group boundaries and never ask participants to disclose personal experiences.",
      "Have a trained safeguarding lead check the material and independently verify referral information before a session.",
    ],
    resource: { kind: "gbv", slug: "understanding-gender-based-violence" },
  },
  {
    id: "workplaces",
    label: "For workplaces",
    title: "Turn a conversation into practical change.",
    intro:
      "Awareness can open a discussion, but people also need clear procedures and an environment where concerns are taken seriously.",
    actions: [
      "Ask staff which communication formats and learning arrangements are accessible to them.",
      "Review workload, respectful behaviour, and independent routes for raising concerns with the responsible team.",
      "Explain available support and confidentiality limits without asking employees to share health information in a group.",
    ],
    resource: { kind: "blog", slug: "a-little-space-in-a-demanding-day" },
  },
];

const programmes: ProgrammeDescription[] = [
  {
    title: "Community conversations",
    text: "A learning format for exploring stigma, supportive language, and everyday connection. A facilitator can use fictional situations and open questions, with room to listen or pass. Any local session needs confirmed arrangements and a checked support pathway.",
  },
  {
    title: "School and youth learning",
    text: "An approach to discussing feelings, consent, and respectful relationships using age-appropriate material. Schools and youth organisations should arrange safeguarding review, accessible participation, and a trusted adult contact before delivering activities.",
  },
  {
    title: "Workplace learning",
    text: "A starting point for discussions about respect, well-being, and support at work. Pair education with accountable policies and clear routes for concerns. These descriptions outline learning possibilities; they do not announce a scheduled or delivered programme.",
  },
];

const conversations = [
  {
    title: "Checking in",
    words:
      "“You’ve seemed quieter lately. Would you like to talk, or would another time suit you better?”",
    text: "Choose a setting where the person can decline comfortably. A gentle invitation leaves room for an answer you did not expect.",
    reflection:
      "Could the person comfortably say ‘not today’ to this invitation?",
  },
  {
    title: "Listening respectfully",
    words: "“Thank you for telling me. What would feel helpful right now?”",
    text: "Let the person set the pace. Avoid comparisons, blame, or asking for details just to satisfy curiosity. You can listen without promising to fix everything.",
    reflection:
      "Am I listening to understand, or preparing advice before they finish?",
  },
  {
    title: "Offering practical help",
    words:
      "“Would you like us to look at support information together, or would you prefer to read it yourself?”",
    text: "Offer a specific choice and follow their lead. Ask before sharing a link or contacting anyone; messages may not be private on a shared device.",
    reflection:
      "Have I checked which kind of help and contact would feel comfortable?",
  },
];

const faqs: AwarenessFaq[] = [
  {
    question: "What is awareness for?",
    answer:
      "Awareness helps us understand a topic, question misconceptions, and choose a useful next step. It can support respectful conversations, but it does not replace professional care, safeguarding procedures, or changes that make environments safer.",
  },
  {
    question: "How can I support someone without being an expert?",
    answer:
      "Ask whether they want to talk, listen without judgement, and offer practical information if welcomed. Be honest about your limits. Avoid diagnosing, investigating, or taking over decisions. You can also seek support for yourself.",
  },
  {
    question: "Can I take part without sharing my experience?",
    answer:
      "Yes. This page uses fictional examples and optional reflection. There are no answers to submit. In a group, you should be able to listen, pass, or pause without being asked to explain why.",
  },
  {
    question: "Can schools and workplaces use this material?",
    answer:
      "Use it as a discussion starting point, with suitable attribution. Before a session, have the responsible professional review age suitability, accessibility, safeguarding, and local referral arrangements. The page is educational material, not a certified training programme.",
  },
  {
    question: "Where can I learn more?",
    answer:
      "The resources below connect to existing chapters, topic information, and articles. The Knowledge Hub brings the wider collection together. Some library material is explicitly marked as a draft awaiting specialist review; check the status shown on each resource.",
  },
  {
    question: "Where can I find support?",
    answer:
      "Visit Get Support for information about independent services and questions to ask them. Urgent Help provides location-specific assistance information. This website does not monitor requests, provide emergency response, or arrange real appointments through its demonstration tools.",
  },
];

export const awarenessSources = [
  {
    id: "stress",
    title: "WHO: understanding stress",
    url: "https://www.who.int/news-room/questions-and-answers/item/stress",
  },
  {
    id: "respect",
    title: "WHO: listening and support after violence",
    url: "https://www.who.int/news-room/commentaries/detail/health-workers-listening-when-women-need-it-most",
  },
  {
    id: "substances",
    title:
      "UK Department of Health and Social Care: respectful alcohol support",
    url: "https://www.gov.uk/guidance/clinical-guidelines-for-alcohol-treatment/2-principles-of-care",
  },
];

const resourceReferences: ResourceReference[] = [
  { kind: "mental-health", slug: "understanding-mental-health-and-wellbeing" },
  {
    kind: "mental-health",
    slug: "recognizing-emotions-and-responding-to-them",
  },
  { kind: "gbv", slug: "understanding-gender-based-violence" },
  { kind: "gbv", slug: "types-and-forms-of-gender-based-violence" },
  { kind: "topic", id: "alcohol-and-drugs" },
  { kind: "blog", slug: "listening-without-having-all-the-answers" },
];

export function resolveAwarenessResource(
  ref: ResourceReference,
): AwarenessResource {
  if (ref.kind === "topic") {
    const item = topics.find((item) => item.id === ref.id);
    if (item)
      return {
        title: item.title,
        to: `/${item.id}`,
        format: "Topic guide",
        artwork: {
          base: awarenessImageBase(awarenessScenes[ref.id]),
          alt: awarenessScenes[ref.id].alt,
        },
      };
  } else if (ref.kind === "blog") {
    const item = findBlogPost(ref.slug);
    if (item)
      return {
        title: item.title,
        to: `/blog/${item.slug}`,
        format: "Article",
        artwork: {
          base: "/images/about/listening-together",
          alt: "Illustration of people listening to one another.",
        },
      };
  } else {
    const item = (
      ref.kind === "mental-health" ? mentalHealthCatalog : gbvCatalog
    ).find((item) => item.slug === ref.slug);
    if (item) {
      const cover = (
        ref.kind === "mental-health" ? mentalHealthCovers : gbvCovers
      )[ref.slug];
      return {
        title: item.title,
        to: `/${ref.kind === "mental-health" ? "why-mental-health" : "understand-gbv"}/${item.slug}`,
        format: "Learning chapter",
        artwork: cover
          ? {
              base: `/images/learning/${ref.kind === "mental-health" ? "mental-health-covers" : "gbv-covers"}/${cover.file}`,
              alt: cover.alt,
            }
          : undefined,
      };
    }
  }
  throw new Error(`Unknown Awareness resource: ${JSON.stringify(ref)}`);
}

// Local content boundary. A future CMS adapter can return this same contract.
export function loadAwarenessContent(
  entries: readonly CommunityEntry[] = communityEntries,
) {
  return {
    lessons,
    audiences,
    programmes,
    conversations,
    faqs,
    sources: awarenessSources,
    resources: resourceReferences.map(resolveAwarenessResource),
    activities: entries.filter(
      (entry) =>
        isPublishable(entry) &&
        !entry.demo &&
        !entry.illustrative &&
        Boolean(entry.publishedAt),
    ),
    review: {
      checkedAt: "2026-11-11",
      label:
        "Educational draft. Sources checked; independent clinical, legal, and safeguarding review has not been completed.",
    },
  };
}
export type AwarenessContent = ReturnType<typeof loadAwarenessContent>;
