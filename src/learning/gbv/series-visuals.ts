import type { LearningDiagram, VisualStory } from "../visual-types";
import { gbvChapters } from "./chapters";
import { gbvSceneArtwork } from "./series-art";
import {
  illustratedGbvDiagrams,
  illustratedGbvStories,
} from "./chapter-01-presentation";

const illustration = {
  imageBasePath: "/images/learning/gbv/series",
  width: 1440,
  height: 1080,
  supportLabel: "A possible supportive response",
};
const slug = (number: number) =>
  gbvChapters.find((chapter) => chapter.number === number)!.slug;

// Supplemental scenes accompany, and never replace, the supplied source cases.
export const additionalGbvStories: VisualStory[] = [
  {
    id: "gbv-consent-study-group",
    chapterSlug: slug(4),
    sectionId: "gbv-section-4-9",
    sourceExampleId: "gbv-4-scenario-a",
    title: "A university study group",
    illustration,
    scenes: [
      {
        caption:
          "Pressure to share private photos does not create a freely chosen agreement.",
        alt: "Fictional illustration of a Black African university student aged 21 with a braided bun and mustard blouse, considering a phone turned away from view at a quiet campus study table beside a closed blue notebook.",
      },
      {
        caption:
          "A trusted safeguarding contact could discuss options through a channel the student considers safe.",
        alt: "Fictional illustration of the same student in her mustard blouse and braided bun, with the same blue notebook in a quiet campus room, speaking with a woman safeguarding adviser seated at equal level; the phone is face down.",
      },
    ],
    explanation:
      "The source case describes threats and pressure. No private image or threatening message is depicted; support should preserve choice and consider communication safety.",
    reflection:
      "What would make it possible for this student to make a real choice?",
  },
  {
    id: "gbv-household-restrictions",
    chapterSlug: slug(5),
    sectionId: "gbv-section-5-11",
    sourceExampleId: "gbv-5-scenario-a",
    title: "Financial restrictions in a household",
    illustration,
    scenes: [
      {
        caption:
          "Threats and confiscated wages can restrict access to work and everyday necessities.",
        alt: "Fictional illustration of a Black African woman around 35 with short twists, a teal cardigan and plum skirt, pausing beside a closed earnings notebook and work bag at a modest home table; no abusive person is shown.",
      },
      {
        caption:
          "A private conversation could explore the person's needs and trusted assistance without demanding confrontation.",
        alt: "Fictional illustration of the same woman with short twists, teal cardigan, plum skirt and work bag, considering options with a woman support worker at a quiet table, her earnings notebook closed beside her.",
      },
    ],
    explanation:
      "The source case links economic abuse, threats and coercive control. The worker does not direct the person to confront a partner or leave.",
    reflection:
      "How could a supporter ask about practical needs while respecting the person's choices?",
  },
  {
    id: "gbv-placement-support",
    chapterSlug: slug(6),
    sectionId: "gbv-section-6-13",
    sourceExampleId: "gbv-6-scenario-a",
    title: "A university placement",
    illustration,
    scenes: [
      {
        caption:
          "Control over an internship assessment can be misused to pressure a student.",
        alt: "Fictional illustration of a Black African adult student aged 22 with short natural curls, a pale blue shirt and dark trousers, considering a plain placement folder at a quiet workplace desk; no supervisor or abusive act is depicted.",
      },
      {
        caption:
          "Independent support could explain options and retaliation concerns without expecting the student to negotiate with the supervisor.",
        alt: "Fictional illustration of the same adult student with short curls, pale blue shirt and placement folder, speaking with an independent woman adviser in a private office, both seated at equal height with space between them.",
      },
    ],
    explanation:
      "The original example concerns abuse of authority. The illustration shows a possible conversation, not guaranteed protection or a required complaint.",
    reflection: "Why does independence matter in a support or reporting route?",
  },
  {
    id: "gbv-workplace-humiliation",
    chapterSlug: slug(7),
    sectionId: "gbv-section-7-14",
    title: "Humiliation at work",
    illustration,
    scenes: [
      {
        caption:
          "Repeated gender-based insults and threats can affect an employee's freedom to raise concerns.",
        alt: "Fictional illustration of a Black African woman around 32 with shoulder-length braids and a lavender blouse, sitting thoughtfully at an empty workplace meeting table with a closed notebook; no humiliation is reenacted.",
      },
      {
        caption:
          "A colleague could ask privately whether support is welcome and offer information without promising that reporting is risk-free.",
        alt: "Fictional illustration of the same woman with shoulder-length braids, lavender blouse and closed notebook, speaking privately with a woman colleague in the same quiet meeting room; the colleague listens without recording or taking over.",
      },
    ],
    explanation:
      "The source discussion highlights unequal power and retaliation. Asking whether support is wanted respects the employee's agency.",
    reflection:
      "What could a colleague offer without making promises they cannot keep?",
  },
  {
    id: "gbv-mobile-money-choice",
    chapterSlug: slug(8),
    sectionId: "gbv-section-8-10",
    sourceExampleId: "gbv-8-case-a",
    title: "Mobile-money control in a household",
    illustration,
    scenes: [
      {
        caption:
          "Taking mobile-money earnings through threats can restrict essential funds and business choices.",
        alt: "Fictional illustration of a Black African market trader around 38 with a braided bun and a rust blouse, pausing with her phone screen turned away beside a closed notebook in a quiet room by a produce stall.",
      },
      {
        caption:
          "A supporter could ask about safety and options without instructing the person to change a PIN on a monitored phone.",
        alt: "Fictional illustration of the same trader in her rust blouse with braided bun and closed notebook, speaking with a woman practical-support adviser in the same quiet room by the produce stall; the phone remains face down.",
      },
    ],
    explanation:
      "The example concerns threats and control, not the mere use of mobile money or a shared budget. No account change or PIN is shown.",
    reflection:
      "Why should safety come before instructions to change a device or account?",
  },
  {
    id: "gbv-campus-group-support",
    chapterSlug: slug(9),
    sectionId: "gbv-section-9-16",
    sourceExampleId: "gbv-9-case-1",
    title: "Campus group harassment",
    illustration,
    scenes: [
      {
        caption:
          "Harassment can spread when people repeat harmful material across group chats.",
        alt: "Fictional illustration of a Black African university student aged 20 with a natural hair puff, sage shirt and navy backpack, sitting thoughtfully on a campus bench with a phone turned away; no messages or private material are shown.",
      },
      {
        caption:
          "A trusted adviser could discuss the student's choices and available options without circulating the harmful material.",
        alt: "Fictional illustration of the same student with natural hair puff, sage shirt and navy backpack, speaking with a woman student adviser in a quiet campus room, her phone put away and no screenshots being collected.",
      },
    ],
    explanation:
      "The source case emphasizes the student's choices, safeguarding, reporting options and safe documentation. It does not call for public retaliation.",
    reflection: "How can a friend offer support without amplifying the harm?",
  },
  {
    id: "gbv-secondary-school-support",
    chapterSlug: slug(10),
    sectionId: "gbv-section-10-16",
    sourceExampleId: "gbv-10-scenario-a",
    title: "A secondary-school concern",
    illustration,
    scenes: [
      {
        caption:
          "Private messages and promised marks can raise concerns about power misuse and grooming.",
        alt: "Fictional non-graphic illustration of a Black African adolescent aged about 16 with short natural hair, a blue school sweater and a closed schoolbook, sitting thoughtfully in a school welfare room with a phone face down; no suspected offender is depicted.",
      },
      {
        caption:
          "A trained safeguarding contact could listen without blame and explain appropriate next steps while protecting privacy.",
        alt: "Fictional non-graphic illustration of the same adolescent with short natural hair, blue school sweater and closed schoolbook, in the same welfare room, speaking with a woman safeguarding contact seated at equal eye level and respectful distance.",
      },
    ],
    explanation:
      "No abuse or private messages are shown. The source calls for trained safeguarding support; the scene does not promise secrecy or a particular outcome.",
    reflection:
      "What could help a young person feel listened to without asking them to repeat private details?",
  },
];

const baseSeriesStories: VisualStory[] = [
  ...illustratedGbvStories.map((story) =>
    story.chapterSlug === slug(1)
      ? story
      : {
          ...story,
          illustration,
          explanation: story.explanation.replace(/photograph/g, "illustration"),
          scenes: story.scenes.map((scene, index) => ({
            ...scene,
            caption: scene.caption.replace(
              /the photo depicts/g,
              "the illustration depicts",
            ),
            alt: `Fictional editorial illustration. ${scene.alt.replace("Fictional ", "").replace("no abuse or private meeting depicted", "adults visible through the office window")}${story.id === "gbv-work-transport" && index === 0 ? " Thought bubbles show money restrictions and a bus stop." : ""}`,
          })) as VisualStory["scenes"],
        },
  ),
  ...additionalGbvStories,
];

export const seriesGbvStories: VisualStory[] = baseSeriesStories.map(
  (story) => {
    const artwork = gbvSceneArtwork[story.id];
    if (!artwork || artwork.sectionId !== story.sectionId) return story;
    return {
      ...story,
      illustration: {
        ...illustration,
        imageBasePath: `/images/learning/gbv/chapter-${String(artwork.chapter).padStart(2, "0")}`,
      },
      scenes: story.scenes.map((scene, index) => ({
        ...scene,
        alt: artwork.alts[index],
      })) as VisualStory["scenes"],
    };
  },
);

const diagram = (
  number: number,
  section: number,
  data: Omit<LearningDiagram, "chapterSlug" | "sectionId">,
): LearningDiagram => ({
  chapterSlug: slug(number),
  sectionId: `gbv-section-${number}-${section}`,
  ...data,
});
export const seriesGbvDiagrams: LearningDiagram[] = [
  ...illustratedGbvDiagrams,
  diagram(4, 2, {
    id: "gbv-choice-and-capacity",
    title: "Room for a real choice",
    introduction: "Three distinctions from this lesson.",
    kind: "influences",
    steps: [
      {
        title: "Freedom to refuse",
        text: "The setting must permit a real refusal.",
        icon: "hand",
      },
      {
        title: "Capacity to decide",
        text: "A person who cannot understand or decide cannot provide consent.",
        icon: "person",
      },
      {
        title: "No assumption",
        text: "Silence, freezing or a lack of resistance does not prove agreement.",
        icon: "pause",
      },
    ],
    note: "Children have additional legal and safeguarding protections. This diagram does not replace legal assessment.",
    explanation:
      "The source distinguishes a spoken answer from a meaningful, freely chosen agreement.",
    reflection: "What conditions allow a person to say no?",
  }),
  diagram(5, 3, {
    id: "gbv-control-pattern",
    title: "Look at the pattern",
    introduction: "Context and freedom matter more than one isolated action.",
    kind: "influences",
    steps: [
      {
        title: "Monitoring",
        text: "Repeated demands may create surveillance and fear.",
        icon: "eye",
      },
      {
        title: "Isolation",
        text: "Restrictions may separate someone from trusted support.",
        icon: "people",
      },
      {
        title: "Restricted resources",
        text: "Taking wages or documents may reduce safe options.",
        icon: "home",
      },
      {
        title: "Consequences of refusal",
        text: "Consider threats, punishment and freedom to decline.",
        icon: "hand",
      },
    ],
    note: "Not every request or disagreement is abuse; context, patterns and fear matter.",
    explanation:
      "These examples come from the chapter's discussion of coercive control. They are not a diagnostic checklist.",
    reflection: "How does freedom to decline change the meaning of a request?",
  }),
  diagram(6, 2, {
    id: "gbv-meaningful-agreement",
    title: "What makes agreement meaningful?",
    introduction: "Consent in the terms used by this lesson.",
    kind: "influences",
    steps: [
      {
        title: "Freely given",
        text: "Not obtained through threats, fear or exploited authority.",
        icon: "hand",
      },
      {
        title: "Informed",
        text: "The person can understand and make a decision.",
        icon: "book",
      },
      {
        title: "Specific",
        text: "Agreement to one activity does not imply agreement to another.",
        icon: "message",
      },
      {
        title: "Ongoing",
        text: "Someone may change their mind.",
        icon: "pause",
      },
    ],
    note: "Children require separate safeguarding and legal assessment. Apparent agreement does not remove that need.",
    explanation:
      "The source states that silence, freezing or the absence of resistance is not by itself consent.",
    reflection: "Why is agreement to one activity not agreement to everything?",
  }),
  diagram(7, 2, {
    id: "gbv-conflict-and-abuse",
    title: "Disagreement and control",
    introduction: "Compare the space each interaction leaves for choice.",
    kind: "comparison",
    pairLabels: ["Respectful conflict", "Concerning patterns"],
    inlinePairLabels: true,
    steps: [
      {
        title:
          "Room to speak, say no, seek support and make independent choices.",
        text: "Fear, repeated degradation, punishment for disagreement or behavior designed to control.",
        icon: "message",
      },
    ],
    note: "The aim is to notice patterns, not label every difficult interaction.",
    explanation:
      "The chapter contrasts respectful discussion with coercion and reduced freedom.",
    reflection: "Can both people disagree without fear of punishment?",
  }),
  diagram(8, 4, {
    id: "gbv-financial-partnership",
    title: "Shared decisions or restricted choice?",
    introduction: "The arrangement alone does not tell the whole story.",
    kind: "comparison",
    pairLabels: ["Financial partnership", "Financial control"],
    inlinePairLabels: true,
    steps: [
      {
        title:
          "A voluntary budget, questions welcomed, concerns raised without fear, and access to necessities.",
        text: "Threats for asking questions, earnings taken without permission, prevented work or necessities used to force compliance.",
        icon: "home",
      },
    ],
    note: "Consider the power dynamic and freedom to disagree, not simply who pays the bills.",
    explanation:
      "These distinctions come from the source discussion of healthy collaboration and concerning control.",
    reflection: "What makes a shared financial decision voluntary?",
  }),
  diagram(9, 9, {
    id: "gbv-safety-before-technology",
    title: "Safety before technology",
    introduction: "The response sequence described in the source lesson.",
    kind: "sequence",
    steps: [
      {
        title: "Check safety",
        text: "Consider immediate physical and communication safety.",
        icon: "shield",
      },
      {
        title: "Ask what is wanted",
        text: "Listen to the person's priorities.",
        icon: "ear",
      },
      {
        title: "Consider monitoring",
        text: "Accounts or devices may be monitored.",
        icon: "eye",
      },
      {
        title: "Discuss options",
        text: "Offer practical choices without imposing them.",
        icon: "message",
      },
      {
        title: "Offer appropriate support",
        text: "Use verified GBV, legal, protection or cybersecurity support.",
        icon: "people",
      },
      {
        title: "Limit recording",
        text: "Record only what is necessary for a safe referral.",
        icon: "book",
      },
    ],
    note: "Do not pressure immediate reporting, blocking, password changes or confrontation, or request intimate images.",
    explanation:
      "This is educational guidance from the chapter, not an automated safety assessment or a guarantee that a device is safe.",
    reflection:
      "Why should the communication channel be considered before discussing account changes?",
  }),
  diagram(10, 8, {
    id: "gbv-child-first-response",
    title: "Listen, reassure, explain",
    introduction: "A calm first response using the chapter's own guidance.",
    kind: "influences",
    steps: [
      {
        title: "Listen",
        text: "Thank the child for telling you; use calm, simple language.",
        icon: "ear",
      },
      {
        title: "Reassure",
        text: "Affirm that the harm is not their fault.",
        icon: "heart",
      },
      {
        title: "Avoid repeated details",
        text: "Do not demand a detailed account or investigate yourself.",
        icon: "pause",
      },
      {
        title: "Explain next steps",
        text: "Explain safeguarding responsibilities in age-appropriate words.",
        icon: "message",
      },
    ],
    note: "Do not promise complete secrecy. Specialist interviews, examinations and evidence handling belong with trained professionals.",
    explanation:
      "The diagram accompanies the original helpful responses and cautions, which remain in full above.",
    reflection:
      "How can an adult explain privacy limits without blaming or alarming a child?",
  }),
];
