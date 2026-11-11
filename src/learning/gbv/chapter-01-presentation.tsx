import type { ChapterPresentation } from "../LearningPages";
import type { LearningDiagram, VisualStory } from "../visual-types";
import { gbvDiagrams, gbvStories } from "./visuals";
import "./chapter-01.css";

export const gbvFoundationsSlug = "understanding-gender-based-violence";
const imageBasePath = "/images/learning/gbv/chapter-01";

// Supplemental presentation only: the generated source transcription is untouched.
const sceneDescriptions: Record<string, [string, string]> = {
  "gbv-training-opportunity": [
    "Fictional illustration of a young woman in a mustard cardigan considering a training leaflet in a quiet training room, with a phone face down nearby.",
    "Fictional illustration of the same woman, in the same room with her leaflet and bag, considering information with a training adviser at a respectful distance.",
  ],
  "gbv-household-earnings": [
    "Fictional illustration of a market trader in a blue blouse pausing over a closed earnings notebook in a quiet room beside her produce stall.",
    "Fictional illustration of the same trader and notebook in the same room, with a support worker listening without taking over her decisions.",
  ],
  "gbv-student-monitoring": [
    "Fictional illustration of a college student in a sage shirt looking concerned at her phone in a quiet campus room, with her navy backpack nearby.",
    "Fictional illustration of the same student in the same room with an adviser, her phone put away while they discuss the support she prefers.",
  ],
  "gbv-volunteer-disclosure": [
    "Fictional illustration of a man in a beige shirt beginning a conversation with a volunteer in a quiet community room, without notes or recording devices.",
    "Fictional illustration of the same man and volunteer in the same room, with the volunteer listening and explaining options while leaving personal space.",
  ],
  "gbv-child-safeguarding": [
    "Fictional illustration of an adolescent in a blue school sweater talking with a teacher in a school welfare room; no abuse is depicted.",
    "Fictional illustration of the same adolescent and teacher in the same room, joined by a safeguarding worker who sits at a respectful distance.",
  ],
  "gbv-friend-listening": [
    "Fictional illustration of a woman in a rust blouse speaking with a friend at a quiet cafe table, while the friend is briefly distracted by a phone.",
    "Fictional illustration of the same women at the same cafe table, with the phone put away and the friend listening attentively; the speaker remains thoughtful.",
  ],
};

export const illustratedGbvStories: VisualStory[] = gbvStories.map((story) => {
  if (story.chapterSlug !== gbvFoundationsSlug) return story;
  return {
    ...story,
    illustration: {
      imageBasePath,
      width: 1440,
      height: 1080,
      supportLabel: "A possible supportive response",
    },
    scenes: story.scenes.map((scene, index) => ({
      ...scene,
      alt: sceneDescriptions[story.id][index],
    })) as VisualStory["scenes"],
  };
});

export const illustratedGbvDiagrams: LearningDiagram[] = [
  ...gbvDiagrams.map((diagram) =>
    diagram.id === "gbv-consent"
      ? {
          ...diagram,
          center: {
            title: "Consent",
            text: "Freedom to choose",
            icon: "hand" as const,
          },
        }
      : diagram,
  ),
  {
    id: "gbv-control-versus-care",
    chapterSlug: gbvFoundationsSlug,
    sectionId: "gbv-section-1-5",
    title: "Control versus care",
    introduction: "A visual comparison of the distinction in this lesson.",
    kind: "comparison",
    pairLabels: ["Care", "Control"],
    inlinePairLabels: true,
    steps: [
      {
        title: "Express concern and discuss safety while respecting decisions.",
        text: "Use fear, punishment, coercion, threats or surveillance to override choices.",
        icon: "shield",
      },
    ],
    note: "A person may experience both affection and abuse in the same relationship; affection does not cancel harmful behavior.",
    explanation:
      "Individual signs do not establish a legal finding, but they deserve attention when they create fear or limit freedom.",
    reflection: "What would preserve freedom to choose?",
  },
];

export const gbvChapter01Presentation: ChapterPresentation = {
  chapterSlug: gbvFoundationsSlug,
  className: "gbv-foundations",
  visualDisclosure:
    "The illustrations are AI-generated fictional teaching scenes, not real participants or case histories. A possible supportive response does not guarantee safety or immediate resolution. ",
  headerVisual: (
    <figure className="gbv-foundations-hero">
      <img
        src={`${imageBasePath}/gbv-foundations-header-1280.webp`}
        srcSet={`${imageBasePath}/gbv-foundations-header-640.webp 640w, ${imageBasePath}/gbv-foundations-header-1280.webp 1280w`}
        sizes="(max-width: 850px) calc(100vw - 80px), (max-width: 1400px) 42vw, 570px"
        width={1536}
        height={1024}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        alt="Fictional illustration of two adults exploring learning materials together, with space to choose where to begin."
      />
      <figcaption>
        Fictional illustration · Learning with dignity and choice.
      </figcaption>
    </figure>
  ),
};
