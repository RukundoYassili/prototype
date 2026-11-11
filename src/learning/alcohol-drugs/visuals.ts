import type { LearningDiagram, VisualStory } from "../visual-types";
import { alcoholCatalog } from "./catalog.generated";

const slug = (n: number) => alcoholCatalog[n - 1].slug;
const illustration = {
  imageBasePath: "/images/learning/alcohol-drugs",
  width: 768,
  height: 1024,
  supportLabel: "One possible supportive response",
};

// Supplemental teaching material. Original transcription and references are unchanged.
export const alcoholStories: VisualStory[] = [
  {
    id: "ad-jean-transport",
    chapterSlug: slug(1),
    sectionId: "ad-1-section-7",
    sourceExampleId: "ad-1-scenario-b",
    title: "Jean considers how to get home",
    illustration,
    scenes: [
      {
        alt: "Fictional Jean, aged 32, in a teal shirt beside a parked motorcycle after a gathering; an alcohol bottle and glass sit on the courtyard table.",
        caption:
          "Jean has been drinking and plans to ride home. Feeling alert after a short rest does not establish that he is fit to ride.",
      },
      {
        alt: "The same Jean and friend in the same courtyard consider a phone while the motorcycle stays parked and the helmet remains on the bike.",
        caption:
          "Jean could ask for help arranging non-driving transport. The motorcycle stays parked; this is a safety choice, not evidence that alcohol's effects have passed.",
      },
    ],
    explanation:
      "This illustrates Chapter 01, Scenario B. The pair shows a possible decision, not a test of impairment or a diagnosis. Transport options depend on the person's circumstances.",
    reflection:
      "What could a friend offer without relying on Jean's confidence as a measure of safe driving?",
  },
  {
    id: "ad-worker-assessment",
    chapterSlug: slug(2),
    sectionId: "ad-2-section-7",
    sourceExampleId: "ad-2-scenario-d",
    title: "Concerns deserve assessment",
    illustration,
    scenes: [
      {
        alt: "Fictional worker in an indigo shirt considers his work planner at home, with an alcohol bottle and glass set aside and a bed in the background.",
        caption:
          "The worker describes worsening sleep, health and family functioning after prolonged heavy drinking. These reported concerns matter; his appearance does not establish their cause.",
      },
      {
        alt: "The same worker, indigo shirt and blue planner, speaking with a healthcare professional in turquoise at a consultation table.",
        caption:
          "A qualified professional can assess his physical and psychological needs, including withdrawal risk. A conversation does not establish a diagnosis or promise immediate improvement.",
      },
    ],
    explanation:
      "Based on Chapter 02, Case D. Assessment considers the person's history and circumstances. A lesson cannot determine whether suddenly stopping is medically safe; prolonged heavy use may require supervised care.",
    reflection:
      "What questions could the worker bring to a professional rather than trying to answer through a picture or quiz?",
  },
  {
    id: "ad-mireille-medicines",
    chapterSlug: slug(3),
    sectionId: "ad-3-section-10",
    sourceExampleId: "ad-3-scenario-c",
    title: "Medicine advice belongs to the individual",
    illustration,
    scenes: [
      {
        alt: "Fictional Mireille with short twists and a terracotta blouse politely declines a relative's prescription packet at a home table.",
        caption:
          "Mireille has trouble sleeping. A medicine prescribed for her relative is not automatically suitable for her, even if it was prescribed legitimately.",
      },
      {
        alt: "The same Mireille, with the same twists and terracotta blouse, discussing her concerns with a pharmacist at a counter.",
        caption:
          "She could ask an appropriate healthcare professional about her symptoms and medicines. The scene shows a possible conversation, not a prescription or an instant solution to sleep difficulties.",
      },
    ],
    explanation:
      "Based on Chapter 03, Scenario C. Medicines can have important legitimate uses. Sharing a prescription or combining substances can create risks; individual advice is needed.",
    reflection:
      "How could the relative be supportive without offering their own prescription?",
  },
  {
    id: "ad-chantal-concerns",
    chapterSlug: slug(4),
    sectionId: "ad-4-section-11",
    sourceExampleId: "ad-4-scenario-c",
    title: "From concerns to an assessment conversation",
    illustration,
    scenes: [
      {
        alt: "Fictional Chantal with a braided low bun and plum cardigan considers her work planner at home, with an alcohol bottle and glass set to one side.",
        caption:
          "Chantal reports drinking more than intended despite trying to reduce, and missing work. These patterns are reasons to seek assessment; a single image cannot diagnose her.",
      },
      {
        alt: "The same Chantal, plum cardigan, ivory blouse and work planner, talking with a healthcare professional in sage at equal eye level.",
        caption:
          "An assessment could explore her concerns, goals and care options. Support is individual and may continue over time; this scene does not promise recovery or replace professional care.",
      },
    ],
    explanation:
      "Based on Chapter 04, Scenario C and its treatment section. Use, tolerance, physical dependence and substance use disorders are distinct. No diagnosis is assigned to Chantal, and no self-directed withdrawal plan is offered.",
    reflection:
      "How could someone offer practical support while leaving room for Chantal's choices and professional advice?",
  },
];

const who = {
  label: "WHO: Alcohol",
  url: "https://www.who.int/news-room/fact-sheets/detail/alcohol",
};
const niaaa = {
  label: "NIAAA: Alcohol and the brain",
  url: "https://www.niaaa.nih.gov/publications/alcohol-and-brain-overview",
};
const nida = {
  label: "NIDA: Prescription medicines (PDF)",
  url: "https://nida.nih.gov/sites/default/files/2609-misuse-of-prescription-drugs_0.pdf",
};

export const alcoholDiagrams: LearningDiagram[] = [
  {
    id: "ad-use-harm-disorder",
    chapterSlug: slug(1),
    sectionId: "ad-1-section-6",
    kind: "comparison",
    pairLabels: ["Concept", "What to keep distinct"],
    title: "Related concepts, different meanings",
    introduction:
      "A visual reading of the source table, not stages everyone passes through.",
    steps: [
      {
        title: "Substance use",
        text: "Consumption alone does not establish a disorder.",
        icon: "person",
      },
      {
        title: "Harm or risk",
        text: "Injury or other harm may occur without dependence.",
        icon: "shield",
      },
      {
        title: "Substance use disorder",
        text: "A problematic pattern assessed by qualified professionals.",
        icon: "message",
      },
    ],
    note: "Do not label a person from an appearance or one behaviour.",
    explanation:
      "This summarizes the distinctions already present in Chapter 01, section 06. Risk and clinical assessment answer different questions.",
    reflection:
      "Why is knowing someone used a substance insufficient to diagnose them?",
    sources: [who],
  },
  {
    id: "ad-brain-functions",
    chapterSlug: slug(2),
    sectionId: "ad-2-section-3",
    kind: "influences",
    title: "Brain communication supports many functions",
    introduction:
      "A conceptual map of the source lesson, not an anatomical diagram or an individual prediction.",
    center: {
      title: "Brain communication",
      text: "Alcohol can interfere with communication pathways.",
      icon: "brain",
    },
    steps: [
      {
        title: "Judgment",
        text: "Considering consequences and decisions.",
        icon: "compass",
      },
      {
        title: "Memory",
        text: "Forming and recalling information.",
        icon: "book",
      },
      {
        title: "Coordination",
        text: "Regulating movement and balance.",
        icon: "body",
      },
      {
        title: "Essential functions",
        text: "Severe alcohol poisoning can affect breathing and consciousness.",
        icon: "heart",
      },
    ],
    note: "Different substances have different effects. Confidence does not measure safe driving ability. Urgent symptoms need medical help.",
    explanation:
      "The map accompanies Chapter 02, sections 03–04. It does not localize functions to a single brain area, imply all substances act identically, or explain addiction through one chemical.",
    reflection: "Why might someone's confidence and their coordination differ?",
    sources: [niaaa],
  },
  {
    id: "ad-risk-time",
    chapterSlug: slug(3),
    sectionId: "ad-3-section-2",
    kind: "comparison",
    pairLabels: ["Immediate concerns", "Longer-term concerns"],
    inlinePairLabels: true,
    title: "Timing is not a measure of seriousness",
    introduction:
      "Both columns describe possibilities. Neither predicts what will happen to one person.",
    steps: [
      {
        title: "Impaired judgment or coordination; injury risk",
        text: "Repeated exposure can contribute to physical health problems.",
        icon: "body",
      },
      {
        title: "Poisoning or a dangerous substance interaction",
        text: "Some patterns of use may affect health, work or relationships over time.",
        icon: "shield",
      },
    ],
    note: "These are parallel examples, not cause-and-effect pairs. A short-term event can be fatal; longer-term harm is not inevitable.",
    explanation:
      "Chapter 03 separates timing from severity. Different substances and individual circumstances carry different risks; the full source table above provides further detail.",
    reflection:
      "Why should immediate symptoms not be dismissed because a person has no diagnosis?",
    sources: [who],
  },
  {
    id: "ad-distinct-terms",
    chapterSlug: slug(4),
    sectionId: "ad-4-section-6",
    kind: "comparison",
    pairLabels: ["Term", "Meaning in context"],
    title: "Five terms, not a ladder",
    introduction:
      "These concepts overlap in some circumstances; they are not interchangeable or an inevitable progression.",
    steps: [
      {
        title: "Use",
        text: "Consuming a substance; not itself a diagnosis.",
        icon: "person",
      },
      {
        title: "Risky or harmful use",
        text: "Exposure increases risk or causes harm.",
        icon: "shield",
      },
      {
        title: "Tolerance",
        text: "The same amount may produce less effect over time.",
        icon: "body",
      },
      {
        title: "Physical dependence",
        text: "Adaptation; withdrawal can follow reduction or stopping.",
        icon: "heart",
      },
      {
        title: "Substance use disorder",
        text: "A clinically assessed problematic pattern, not inferred from dependence alone.",
        icon: "message",
      },
    ],
    note: "Do not abruptly change prescribed medicines or attempt withdrawal after prolonged heavy drinking without appropriate clinical advice.",
    explanation:
      "This summarizes Chapter 04, sections 04–06. Physical dependence can occur during appropriate treatment and is not by itself addiction. The diagram offers no doses, tapering instructions or diagnosis.",
    reflection:
      "What would be lost if all five terms were treated as the same thing?",
    sources: [
      nida,
      {
        label: "CDC: Definitions (including opioid-specific examples)",
        url: "https://www.cdc.gov/overdose-prevention/glossary/",
      },
    ],
  },
];
