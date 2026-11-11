import type { ResourceTopic } from "../support/content";

export interface BlogSection {
  id: string;
  title: string;
  paragraphs: string[];
  points?: string[];
}
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  topic: ResourceTopic;
  image: string;
  position: string;
  thumbnailPosition?: string;
  introduction: string;
  sections: BlogSection[];
  takeaway: string;
  sources: { title: string; url: string; note?: string }[];
}

export const blogTopics: { id: ResourceTopic; label: string }[] = [
  { id: "mental-health", label: "Mental health" },
  { id: "alcohol-and-drugs", label: "Alcohol & drugs" },
  { id: "understand-gbv", label: "Understanding GBV" },
  { id: "supporters", label: "Supporting others" },
];
export const topicLabel = (topic: ResourceTopic) =>
  blogTopics.find((item) => item.id === topic)!.label;
export const topicPath = (topic: ResourceTopic) =>
  topic === "supporters" ? "/support#help-someone" : `/${topic}`;

const mentalSource = {
  title: "WHO: mental health",
  url: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
};
const stressSource = {
  title: "WHO: understanding stress",
  url: "https://www.who.int/news-room/questions-and-answers/item/stress",
};
const gbvSource = {
  title: "UNHCR Rwanda: GBV support information",
  url: "https://help.unhcr.org/rwanda/services/sgbv/",
  note: "Includes information about Isange and the possibility of reporting to law enforcement.",
};

export const blogPosts: BlogPost[] = [
  {
    slug: "your-first-support-conversation",
    title: "You don’t need the perfect words to ask for support.",
    excerpt:
      "A thoughtful place to begin: what to ask, what to expect, and how to take a first conversation at your own pace.",
    topic: "mental-health",
    image: "mental-health-listening",
    position: "43% 38%",
    thumbnailPosition: "14% 38%",
    introduction:
      "Starting a conversation about how you feel can bring up questions of its own. What should you say? How much do you need to explain? You can begin with uncertainty. A first conversation can simply be a chance to understand the options.",
    sections: [
      {
        id: "begin-simply",
        title: "Begin with what feels manageable.",
        paragraphs: [
          "You might start with an everyday observation: things have felt difficult lately, you are finding it hard to switch off, or you would like to understand what support involves. You do not have to turn your experience into a polished story.",
          "If it helps, write down one question beforehand. You can also ask the service how an introductory conversation works before deciding whether to arrange one. The practical details can matter as much as finding the words.",
        ],
      },
      {
        id: "ask-questions",
        title: "Make room for your questions, too.",
        paragraphs: [
          "Choosing support involves understanding what a service can offer and where its responsibilities end. You are allowed to ask for an explanation in language that makes sense to you.",
        ],
        points: [
          "What is your role, and what qualifications or registration do you hold?",
          "What are the fees, languages, formats, and accessibility arrangements?",
          "How is personal information handled, and when might confidentiality have limits?",
          "What happens if this service is not the right fit for me?",
        ],
      },
      {
        id: "your-own-pace",
        title: "You can take the process one step at a time.",
        paragraphs: [
          "Learning about a service and agreeing to care are different steps. Ask what you are being invited to agree to, whether there are alternatives, and what you can take time to consider. Let the service explain any rules or obligations that apply to your circumstances.",
          "Mental health is shaped by many personal and social circumstances. An article cannot assess your situation or choose care for you. A qualified professional can discuss the questions that are specific to your needs.",
        ],
      },
      {
        id: "next-small-step",
        title: "A beginning can be small.",
        paragraphs: [
          "Your next step might be reading a service description, checking its costs, or asking a trusted person to help you find information. You can leave a first conversation with another question rather than a complete plan.",
          "Our support pages offer information and links to independent organizations. They do not arrange real appointments or ask you to share your story on this website.",
        ],
      },
    ],
    takeaway:
      "One question is enough for a beginning. Your experience does not need to be neatly organized to deserve respect.",
    sources: [mentalSource],
  },
  {
    slug: "listening-without-having-all-the-answers",
    title: "Being there starts with listening, not having every answer.",
    excerpt:
      "Practical ways to offer a little space, respect someone’s choices, and understand your own limits.",
    topic: "supporters",
    image: "mental-health-counseling",
    position: "62% 38%",
    introduction:
      "When someone you care about is having a difficult time, it is natural to want to make things better. You do not need to solve every problem to offer a thoughtful response. Start by asking whether they would like to talk, and whether now is a safe time.",
    sections: [
      {
        id: "make-room",
        title: "Offer attention before advice.",
        paragraphs: [
          "Give the conversation room to unfold. A person may want to describe something, ask a practical question, or simply spend a little time with someone they trust. Try not to decide what the conversation is for before asking them.",
          "You can reflect back what you have understood and check whether you have heard it correctly. If you are unsure what to say, it is reasonable to acknowledge that rather than filling the silence with an explanation.",
        ],
      },
      {
        id: "ask-what-helps",
        title: "Ask what would actually help.",
        paragraphs: [
          "Practical support can be different from advice. Someone might welcome help finding service information or preparing questions; another person may prefer to do those things privately. Let them describe what feels useful.",
        ],
        points: [
          "Would you like me to listen, or help look at options?",
          "Is there a safe way and time for me to check in?",
          "Would practical help with an appointment be useful?",
          "Is there something you would prefer I did not do?",
        ],
      },
      {
        id: "respect-choices",
        title: "Respect choices and safe contact methods.",
        paragraphs: [
          "If someone talks about abuse, avoid taking over decisions or confronting another person on their behalf. Ask about safe ways to communicate before sending information that could put them at risk if seen.",
          "Specialist services have their own confidentiality and reporting rules. Do not promise outcomes or complete secrecy on their behalf. In Rwanda, UNHCR notes that contact with an Isange centre may lead to a report to law enforcement.",
        ],
      },
      {
        id: "your-limits",
        title: "Your limits matter, too.",
        paragraphs: [
          "Be clear about the time and practical support you can offer. Caring about someone does not mean being available at every moment or taking responsibility for professional decisions.",
          "If there is immediate danger, routine conversations are not an emergency response. Use official urgent-help information for the person’s location. This website cannot monitor a situation or respond to requests for help.",
        ],
      },
    ],
    takeaway:
      "A useful question can be simple: “What would feel helpful to you right now?”",
    sources: [mentalSource, gbvSource],
  },
  {
    slug: "alcohol-and-support-without-judgment",
    title: "Talking about alcohol, without labels or blame.",
    excerpt:
      "Understanding concerns, asking useful questions, and finding an appropriate place to begin.",
    topic: "alcohol-and-drugs",
    image: "mental-health-group",
    position: "50% 40%",
    introduction:
      "Questions about alcohol can be personal. You might be thinking about your own drinking, or wondering how to support someone else. You can look for information without deciding on a label first. A respectful conversation can focus on what is happening and what support is available.",
    sections: [
      {
        id: "notice-concerns",
        title: "Start with the concern, rather than a label.",
        paragraphs: [
          "You might have questions about the way drinking fits into daily life, relationships, or responsibilities. Describing a concern in your own words can help you prepare for a conversation. It is not a way to diagnose yourself or another person.",
          "WHO explains that alcohol can affect health and can cause dependence. People’s circumstances differ, so an online article cannot tell you what pattern of care, if any, is appropriate for your situation.",
        ],
      },
      {
        id: "professional-advice",
        title: "Make space for professional advice.",
        paragraphs: [
          "A qualified health professional can discuss alcohol use, assess concerns, and explain possible support. If physical dependence may be involved, stopping suddenly can be harmful. Seek medical advice about making changes safely; this page does not provide a detox plan.",
          "When asking about a service, check what assessment involves and whether further referral is needed. Ask about privacy, costs, language, and follow-up before sharing more information than you are comfortable giving.",
        ],
      },
      {
        id: "useful-questions",
        title: "Take a few practical questions with you.",
        paragraphs: [
          "You do not need to arrive with a treatment decision already made. A first conversation can help you understand what the service can do.",
        ],
        points: [
          "What kind of assessment or support do you offer?",
          "How do you decide whether medical supervision or a referral is needed?",
          "What continuing support is available after an initial appointment?",
          "Which parts of the process are voluntary, and what information is recorded?",
        ],
      },
      {
        id: "support-someone",
        title: "If you are concerned about someone else.",
        paragraphs: [
          "Choose a calm moment, ask whether they want to talk, and describe your concern without blame. Avoid treating a conversation as a test they must pass. Ask what help would be useful and be honest about the support you can offer.",
          "For a starting point, explore our alcohol and drug information and the linked official resources. Immediate medical danger needs local emergency assistance, not an appointment request through this website.",
        ],
      },
    ],
    takeaway:
      "Looking for information is a reasonable first step. Personal decisions about withdrawal or treatment belong in a conversation with a qualified health professional.",
    sources: [
      {
        title: "WHO: alcohol and health",
        url: "https://www.who.int/news-room/fact-sheets/detail/alcohol",
      },
      {
        title: "NHS: alcohol support",
        url: "https://www.nhs.uk/live-well/alcohol-advice/alcohol-support/",
        note: "Medical information about dependence and withdrawal. Service arrangements and contact numbers on this source are specific to the UK.",
      },
    ],
  },
  {
    slug: "understanding-gbv-and-your-options",
    title: "Understanding harm, without losing sight of your choices.",
    excerpt:
      "An introduction to GBV, specialist support, and the questions you can ask before making contact.",
    topic: "understand-gbv",
    image: "mental-health-connection",
    position: "50% 44%",
    introduction:
      "You do not need to feel certain about a label before looking for information about abuse. Gender-based violence can involve harm, threats, coercion, or restrictions on a person’s freedom. Your experience deserves to be taken seriously, and abuse is not your fault.",
    sections: [
      {
        id: "understanding-harm",
        title: "Information can help you name questions.",
        paragraphs: [
          "GBV can involve physical, sexual, and psychological harm. Harm may happen in public or in private. A short article cannot determine what has happened in an individual situation or provide a legal assessment.",
          "You can use information as a starting point for questions rather than as a checklist you must complete. Specialist services can explain the kinds of assistance they offer and the limits of their role.",
        ],
      },
      {
        id: "contact-safely",
        title: "Think about how you access information.",
        paragraphs: [
          "Before calling, messaging, or opening a website, consider whether your device or contact methods may be monitored. Another device or a different way of making contact may be safer, depending on your circumstances.",
          "The Quick exit button changes the page immediately, but it does not erase browsing history, downloads, or monitoring records. There is no form here asking you to describe an incident or identify another person.",
        ],
      },
      {
        id: "ask-before-sharing",
        title: "Ask about confidentiality before sharing.",
        paragraphs: [
          "Support can involve health, psychosocial, legal, or protection pathways. Do not assume that every service has the same rules about information or reporting. Ask for those rules to be explained before sharing identifying details when it is safe to do so.",
          "UNHCR Rwanda lists Isange One Stop Centres as a route to assistance across Rwanda. It also notes that approaching an Isange centre may result in a report to law enforcement. That distinction matters when considering your options.",
        ],
        points: [
          "What support is available for someone in my situation?",
          "What information do you need before explaining the options?",
          "What may be reported, and to whom?",
          "How will you contact me, and can I choose a safer contact method?",
        ],
      },
      {
        id: "supporting-a-survivor",
        title: "If someone has shared their experience with you.",
        paragraphs: [
          "Listen without blame, ask what support they want, and avoid making decisions for them. Do not confront the person causing harm on their behalf. Consider whether messages or calls could expose them to further risk.",
          "Our GBV page brings the information and official links together. For immediate danger, use local emergency services when safe. This website does not respond to emergencies or arrange protection services.",
        ],
      },
    ],
    takeaway:
      "Support should begin with clear information, respect, and an explanation of choices and limits.",
    sources: [gbvSource],
  },
  {
    slug: "a-little-space-in-a-demanding-day",
    title: "Making a little space in a demanding day.",
    excerpt:
      "Everyday reflection without another perfect routine to keep up with. Begin with what is possible today.",
    topic: "mental-health",
    image: "hero-nature",
    position: "50% 52%",
    introduction:
      "When life feels crowded, even advice about well-being can begin to sound like another task. A small pause does not have to become a project. It can be a moment to notice what is happening and ask what would make the next part of your day a little more manageable.",
    sections: [
      {
        id: "notice-your-day",
        title: "Begin with the day you actually have.",
        paragraphs: [
          "Stress can show up differently for different people. WHO notes that it can affect both mind and body, and that responses vary. There is no single routine that will feel right or be practical for everyone.",
          "Instead of designing an ideal day, consider what is within reach today. You might have a quiet moment, a person you can talk to, or an opportunity to reduce one non-essential task. It is also possible that today offers very little space, and that matters.",
        ],
      },
      {
        id: "small-questions",
        title: "Try a question, rather than a rule.",
        paragraphs: [
          "An optional reflection can be simple. You do not need to write your answers, share them, or keep a record. Skip any prompt that does not feel useful.",
        ],
        points: [
          "What is asking the most of me right now?",
          "Is there one task I could simplify, postpone, or ask for help with?",
          "Would a short conversation or a little time away from a screen be welcome?",
          "What would a realistic next hour look like?",
        ],
      },
      {
        id: "connection",
        title: "Leave room for connection.",
        paragraphs: [
          "Support does not always begin with a formal appointment. Sometimes the first step is letting a trusted person know that things feel difficult, or asking for help with a practical arrangement.",
          "That does not make friends or family responsible for providing professional care. You can appreciate everyday support while still asking a health professional about concerns that need individual attention.",
        ],
      },
      {
        id: "when-more-support",
        title: "A pause is not a substitute for care.",
        paragraphs: [
          "If distress continues or is affecting everyday life, consider speaking with an appropriate health professional. Personal circumstances, safety, and access to services can all influence what a useful next step looks like.",
          "Our mental health and resource pages offer further information at your own pace. There is no score, streak, or expectation to complete a routine here. The aim is understanding, rather than another standard to meet.",
        ],
      },
    ],
    takeaway:
      "A small step is allowed to stay small. You do not have to turn looking after yourself into another performance.",
    sources: [stressSource, mentalSource],
  },
  {
    slug: "finding-your-way-through-substance-use-information",
    title: "Finding your way through substance-use information.",
    excerpt:
      "How to look beyond judgments and promises when exploring information about drugs, care, and recovery.",
    topic: "alcohol-and-drugs",
    image: "mental-health-learning",
    position: "63% 43%",
    introduction:
      "Information about drugs can be difficult to navigate. Some pages use frightening language; others promise an easy answer. A useful starting point is to look for clear sources, understandable explanations, and an honest account of what a service can and cannot provide.",
    sections: [
      {
        id: "clear-language",
        title: "Look for explanations, rather than labels.",
        paragraphs: [
          "Psychoactive substances can affect mood, perception, and other mental processes. Their effects and risks differ. WHO distinguishes the effects of substances from the question of whether a person has developed a use disorder.",
          "A general article cannot assess dependence, identify a substance, or determine an appropriate treatment. Be cautious about information that claims to do those things from a short checklist or a single experience.",
        ],
      },
      {
        id: "check-source",
        title: "Ask where the information comes from.",
        paragraphs: [
          "Look for a named public-health source or a service that explains its professional role. Check the publication context, including which country the information is for. A service described in another country may not be available locally.",
          "A link to a respected organization is useful context, but it does not mean that organization endorses the website linking to it. Read the source itself and ask a local service about details that affect you.",
        ],
      },
      {
        id: "care-questions",
        title: "Understand the care pathway being offered.",
        paragraphs: [
          "If you are exploring a service, ask how assessment works, who provides care, and what further referrals may be needed. Different professional, rehabilitation, and peer-support settings have different roles.",
        ],
        points: [
          "Who delivers the support, and what is their role?",
          "What are the costs, eligibility rules, and follow-up arrangements?",
          "What privacy and reporting rules apply?",
          "How are medical concerns or withdrawal risks assessed?",
        ],
      },
      {
        id: "next-step",
        title: "Keep the next step grounded in your needs.",
        paragraphs: [
          "You can begin by asking a qualified health service where to find appropriate information. Do not use a blog post as instructions for detoxification, changing prescribed medication, or managing an overdose.",
          "Our alcohol and drug support page links to public information and a health-service contact route in Rwanda. For immediate medical danger, contact local emergency services. Routine support information is not emergency response.",
        ],
      },
    ],
    takeaway:
      "Clear information explains its sources and its limits. It does not need to judge you or promise a quick solution.",
    sources: [
      {
        title: "WHO: psychoactive drugs and health",
        url: "https://www.who.int/health-topics/drugs-psychoactive",
      },
    ],
  },
];

export const findBlogPost = (slug: string | undefined) =>
  blogPosts.find((post) => post.slug === slug);
export const readingMinutes = (post: BlogPost) =>
  Math.max(
    1,
    Math.ceil(
      [
        post.introduction,
        ...post.sections.flatMap((section) => [
          section.title,
          ...section.paragraphs,
          ...(section.points || []),
        ]),
        post.takeaway,
      ]
        .join(" ")
        .split(/\s+/).length / 200,
    ),
  );
