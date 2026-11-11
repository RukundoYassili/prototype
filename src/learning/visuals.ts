import { continuationStories, continuationDiagrams } from "./visuals-03-07";

import type { VisualStory, LearningDiagram } from "./visual-types";
export type * from "./visual-types";

const understanding = "understanding-mental-health-and-wellbeing";
const emotions = "recognizing-emotions-and-responding-to-them";

// Supplemental teaching visuals stay separate from the verbatim PDF transcription.
const originalStories: VisualStory[] = [
  {
    id: "exam-pressure",
    chapterSlug: understanding,
    sectionId: "section-1-12",
    sourceExample: "Example A:",
    title: "A learner under examination pressure",
    scenes: [
      {
        caption:
          "Before an examination, tension and poor sleep can make studying feel harder.",
        alt: "A fictional young adult learner in a sage shirt sits thoughtfully at a desk with textbooks and an open notebook.",
        mobileFocalPosition: "50% 20%",
      },
      {
        caption:
          "A trusted educator can help discuss priorities and a realistic study schedule. Rest and further support may also be needed.",
        alt: "The same learner and an adult educator sit together, discussing a study schedule at the desk.",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "This example connects emotional support with practical planning. A study conversation is one possible step, not a guarantee that distress will end. Persistent or worsening difficulty may need further help.",
    reflection:
      "What makes the educator’s response supportive rather than blaming?",
  },
  {
    id: "unemployment",
    chapterSlug: understanding,
    sectionId: "section-1-12",
    sourceExample: "Example B:",
    title: "A young adult searching for work",
    scenes: [
      {
        caption:
          "Searching for work can leave someone discouraged and isolated. Their circumstances matter.",
        alt: "A fictional young woman in a rust blouse sits alone beside a closed laptop and job-application papers.",
      },
      {
        caption:
          "A trusted person can offer company and practical job-search assistance. Relevant social or health services may also help.",
        alt: "The same woman and a trusted friend review application materials together at the table.",
      },
    ],
    explanation:
      "Emotional connection and practical assistance can both be relevant. Unemployment is not evidence of insufficient positivity, and encouragement alone cannot remove structural barriers.",
    reflection:
      "Which part of this response offers practical help as well as connection?",
  },
  {
    id: "caregiving",
    chapterSlug: understanding,
    sectionId: "section-1-12",
    sourceExample: "Example C:",
    title: "Sharing family responsibilities",
    scenes: [
      {
        caption:
          "An adult managing family responsibilities may feel exhausted and find concentration difficult.",
        alt: "A fictional middle-aged woman in a blue blouse pauses at a table with folded laundry and household tasks nearby.",
      },
      {
        caption:
          "Sharing tasks can provide practical support. Physical health concerns and persistent symptoms may also need professional attention.",
        alt: "The same caregiver and an adult relative share the task of folding laundry at the table.",
      },
    ],
    explanation:
      "The response changes the workload rather than asking the caregiver simply to cope better. Shared tasks are one possibility; accessible practical and health support may still be necessary.",
    reflection:
      "How does sharing a task differ from telling someone to be more positive?",
  },
  {
    id: "work-meeting",
    chapterSlug: emotions,
    sectionId: "section-2-3",
    title: "An uncertain work meeting",
    scenes: [
      {
        caption:
          "A meeting request may lead to the thought, “I must be in trouble,” alongside fear, tight shoulders, or an urge to avoid it.",
        alt: "A fictional adult man in an olive overshirt looks uncertain while reading a meeting notification on a laptop in a small office.",
      },
      {
        caption:
          "“I do not know what this is about yet” leaves room to ask for clarification and prepare, even while feeling nervous.",
        alt: "The same man has a calm, attentive conversation with a colleague beside the office desk.",
      },
    ],
    explanation:
      "The meeting request has not changed, but its interpretation can influence feelings and actions. Gathering facts does not require pretending that everything is positive or ignoring a genuine problem.",
    reflection:
      "What is known about the meeting, and what is an interpretation?",
  },
  {
    id: "results",
    chapterSlug: emotions,
    sectionId: "section-2-12",
    sourceExample: "Example 1:",
    title: "Disappointing examination results",
    scenes: [
      {
        caption:
          "A learner disappointed by results may feel embarrassed or worry that everyone will judge them.",
        alt: "A fictional young adult woman with short natural hair and a mustard cardigan looks thoughtfully at an examination paper with no readable marks.",
        mobileFocalPosition: "50% 20%",
      },
      {
        caption:
          "Naming embarrassment and talking with a trusted educator can help identify a realistic next step without denying disappointment.",
        alt: "The same learner and a trusted adult educator discuss her study materials together.",
        mobileFocalPosition: "50% 25%",
      },
    ],
    explanation:
      "The goal is to reduce self-blame and find a way forward, not to force happiness or claim that one conversation changes the results.",
    reflection:
      "Which response could acknowledge disappointment without labeling the learner a failure?",
  },
  {
    id: "caregiver-exhaustion",
    chapterSlug: emotions,
    sectionId: "section-2-12",
    sourceExample: "Example 2:",
    title: "Noticing exhaustion before responding",
    scenes: [
      {
        caption:
          "When a caregiver is tired, an interruption can bring irritation. The feeling can be noticed without acting harshly.",
        alt: "A fictional adult man in a pale blue shirt pauses while sorting household items, looking tired but composed.",
        mobileFocalPosition: "50% 20%",
      },
      {
        caption:
          "Acknowledging fatigue and asking whether a task can be shared is one possible response. External practical support may be needed.",
        alt: "The same man talks with an adult relative as they sort household items together.",
      },
    ],
    explanation:
      "Irritation can be considered alongside the person’s workload and need for rest. If nobody can share the task, advice to remain patient does not replace practical support.",
    reflection:
      "What need might be overlooked if the caregiver is only told to stay calm?",
  },
  {
    id: "moving",
    chapterSlug: emotions,
    sectionId: "section-2-12",
    sourceExample: "Example 3:",
    title: "Finding connection after moving",
    scenes: [
      {
        caption:
          "Moving to another district can bring loneliness and a sense of missing familiar people.",
        alt: "A fictional young woman in a soft green blouse sits by a window in a new apartment with a few moving boxes nearby.",
      },
      {
        caption:
          "Messaging a trusted friend is one possible way to reconnect. Choose a safe activity or connection that suits the person.",
        alt: "The same woman sits by the window using her phone to contact a trusted friend, with moving boxes still nearby.",
      },
    ],
    explanation:
      "Connection can begin with a small, chosen step; the move and loneliness are not instantly resolved. Persistent withdrawal or low mood may call for professional support.",
    reflection:
      "Why does it matter that the next step fits the person’s own preferences?",
  },
  {
    id: "conflict-safety",
    chapterSlug: emotions,
    sectionId: "section-2-12",
    sourceExample: "Example 4:",
    title: "Safety comes before an emotional exercise",
    scenes: [
      {
        caption:
          "After a frightening conflict, first consider whether the situation is physically safe. A coping exercise is not the first priority when danger remains.",
        alt: "A fictional adult woman in a plum blouse stands alone in a quiet daylight courtyard, holding her phone and looking concerned; no conflict or violence is shown.",
      },
      {
        caption:
          "Where there is danger, prioritize protection, safe contacts, and appropriate services. A trusted contact may be one part of seeking support.",
        alt: "The same woman sits with a trusted adult companion in a quiet sheltered courtyard, her phone within reach.",
      },
    ],
    explanation:
      "The pictures do not establish that a person is safe. Emotional coping is not a substitute for protection, and no one needs to confront an unsafe person to practise a communication skill.",
    reflection:
      "Why should physical safety be considered before suggesting an emotional exercise?",
  },
];

const originalDiagrams: LearningDiagram[] = [
  {
    id: "mental-health-influences",
    chapterSlug: understanding,
    sectionId: "section-1-4",
    kind: "influences",
    title: "A person within their circumstances",
    introduction:
      "Mental health is shaped by interacting influences, not personal effort alone.",
    steps: [
      {
        title: "Body and health",
        text: "Biology, physical health, and sleep.",
        icon: "body",
      },
      {
        title: "Life experiences",
        text: "Experiences, thoughts, and ways of coping.",
        icon: "brain",
      },
      {
        title: "Relationships",
        text: "Family, friends, and everyday connection.",
        icon: "people",
      },
      {
        title: "Living conditions",
        text: "Work, housing, safety, and access to care.",
        icon: "home",
      },
      {
        title: "Community and culture",
        text: "Belonging, shared meaning, and inclusion.",
        icon: "leaf",
      },
    ],
    note: "People cannot be expected to overcome poverty, violence, or exclusion through positive thinking alone.",
    explanation:
      "These influences interact. A person may need practical assistance, protection, healthcare, or changes in their surroundings as well as emotional support.",
    reflection:
      "Which influences in this diagram require support beyond an individual’s own effort?",
  },
  {
    id: "pressures-and-support",
    chapterSlug: understanding,
    sectionId: "section-1-5",
    kind: "pairs",
    title: "Notice the pressure. Consider the support.",
    introduction:
      "Examples of pressures and potentially protective influences, drawn from the table above.",
    steps: [
      {
        title: "Financial strain",
        text: "Reliable practical and social support",
        icon: "hand",
      },
      {
        title: "Bullying or exclusion",
        text: "Safe, inclusive school or workplace",
        icon: "shield",
      },
      {
        title: "Sleep problems or untreated illness",
        text: "Accessible healthcare and supportive routines",
        icon: "heart",
      },
      {
        title: "Social isolation",
        text: "Trustworthy relationships and community connection",
        icon: "people",
      },
      {
        title: "Unstable or unsafe conditions",
        text: "Safety, stable services, and practical resources",
        icon: "home",
      },
    ],
    note: "These are possibilities, not predictions or a personal checklist for success.",
    explanation:
      "Risk and protective factors do not determine an individual outcome. Institutions and communities help create many protective conditions.",
    reflection:
      "How might a community or institution help create one of these protective conditions?",
  },
  {
    id: "respectful-listening",
    chapterSlug: understanding,
    sectionId: "section-1-10",
    kind: "sequence",
    title: "Offer care without taking away choice",
    introduction:
      "An everyday conversation can leave room for the other person to decide what they want.",
    steps: [
      {
        title: "Ask",
        text: "Would you like to talk, or would you prefer company?",
        icon: "message",
      },
      {
        title: "Listen",
        text: "Make room for their experience without blame or pressure.",
        icon: "ear",
      },
      {
        title: "Offer",
        text: "Ask what they need; help find information or practical support.",
        icon: "hand",
      },
    ],
    note: "Respect privacy and choice. Do not promise absolute secrecy; seek appropriate urgent assistance if immediate safety is at risk.",
    explanation:
      "Care does not require having all the answers or asking someone to disclose painful events. Support can include quiet company and help finding appropriate services.",
    reflection: "How does asking permission give the other person more choice?",
  },
  {
    id: "emotion-connections",
    chapterSlug: emotions,
    sectionId: "section-2-3",
    kind: "connection",
    title: "One event, several connected experiences",
    introduction:
      "Follow the meeting example. These experiences influence one another; this is not a diagnosis or a fixed sequence.",
    steps: [
      { title: "Event", text: "There is a meeting tomorrow.", icon: "book" },
      { title: "Interpretation", text: "I must be in trouble.", icon: "brain" },
      { title: "Feeling", text: "Fear or nervousness.", icon: "heart" },
      { title: "Body", text: "Tight shoulders.", icon: "body" },
      {
        title: "Urge or action",
        text: "An urge to avoid the meeting.",
        icon: "footsteps",
      },
    ],
    note: "Another interpretation is “I do not know what this is about yet.” A possible next step is to ask for clarification and prepare.",
    explanation:
      "A first emotion is not always chosen. Gathering facts can help someone consider a next action without denying nervousness or a genuine problem.",
    reflection:
      "Which part is an observable event, and which part is an interpretation?",
  },
  {
    id: "emotional-check-in",
    chapterSlug: emotions,
    sectionId: "section-2-4",
    kind: "sequence",
    title: "A five-part check-in, at your own pace",
    introduction:
      "An optional way to notice an experience and consider a safe next step.",
    steps: [
      { title: "Pause", text: "Pause briefly if it is safe.", icon: "pause" },
      { title: "Notice", text: "Notice your body and thoughts.", icon: "eye" },
      {
        title: "Name",
        text: "Try “worried,” “hurt,” or “not sure.”",
        icon: "message",
      },
      {
        title: "Consider a need",
        text: "Information, rest, connection, protection, or guidance?",
        icon: "compass",
      },
      {
        title: "Choose",
        text: "Consider one safe next action.",
        icon: "footsteps",
      },
    ],
    note: "“Something feels difficult” is a valid starting point. You may skip this practice; there is no correct feeling to produce.",
    explanation:
      "Naming is about awareness, not eliminating emotions. Writing, talking, drawing, movement, or quiet time may suit different people.",
    reflection:
      "How does allowing “not sure” make this practice more flexible?",
  },
  {
    id: "grounding",
    chapterSlug: emotions,
    sectionId: "section-2-7",
    kind: "skill",
    title: "Reconnect with the present",
    introduction:
      "Optional grounding, following the steps and limits in this lesson.",
    steps: [
      {
        title: "Choose a safe position",
        text: "Keep your eyes open if you prefer.",
        icon: "shield",
      },
      {
        title: "Notice contact",
        text: "Feet on the floor, or your body supported by a chair.",
        icon: "body",
      },
      {
        title: "Notice surroundings",
        text: "Identify two or three things you can see or hear.",
        icon: "eye",
      },
      {
        title: "Return to an activity",
        text: "Consider a simple next activity, such as drinking water.",
        icon: "footsteps",
      },
    ],
    note: "Stop if discomfort, dissociation, or danger increases. External objects may feel safer than body awareness. Grounding is not a cure, and deep breathing is not required.",
    explanation:
      "This is a choice, not an exercise to complete perfectly. Another supportive action or help may be more appropriate if grounding feels uncomfortable.",
    reflection:
      "What could someone choose if focusing on their body feels uncomfortable?",
  },
  {
    id: "allowing-feelings",
    chapterSlug: emotions,
    sectionId: "section-2-8",
    kind: "skill",
    title: "Notice a feeling without having to obey it",
    introduction: "A brief, optional practice with a manageable feeling.",
    steps: [
      {
        title: "Acknowledge",
        text: "I notice sadness. This is a difficult moment.",
        icon: "heart",
      },
      {
        title: "Allow a choice",
        text: "I can notice this feeling and still choose what I do next.",
        icon: "compass",
      },
      {
        title: "Return",
        text: "Bring attention to something safe and ordinary.",
        icon: "leaf",
      },
    ],
    note: "Stop if distress increases. Trauma-related symptoms or intense dissociation may require tailored clinical guidance instead of independent exercises.",
    explanation:
      "Acknowledging a feeling does not require investigating it deeply, surrendering to an urge, or forcing the feeling to disappear.",
    reflection:
      "What is the difference between noticing a feeling and acting on every urge?",
  },
  {
    id: "self-kindness",
    chapterSlug: emotions,
    sectionId: "section-2-9",
    kind: "skill",
    title: "From a harsh label to a constructive response",
    introduction:
      "An example of responding without insults or denying responsibility.",
    steps: [
      { title: "Notice the thought", text: "I always fail.", icon: "brain" },
      {
        title: "Name the difficulty",
        text: "I made a mistake.",
        icon: "message",
      },
      {
        title: "Consider a next step",
        text: "I can decide what to learn and what help I need.",
        icon: "hand",
      },
    ],
    note: "A harsh thought is not a proven fact. Self-kindness does not excuse harmful actions or remove consequences.",
    explanation:
      "A balanced response can acknowledge a specific difficulty and leave room for learning, repair, or support.",
    reflection:
      "Which response names a specific difficulty without turning it into a label for the whole person?",
  },
  {
    id: "safe-conversation",
    chapterSlug: emotions,
    sectionId: "section-2-10",
    kind: "skill",
    title: "Describe. Express. Ask.",
    introduction:
      "Use this pattern only when disclosure is voluntary and the person and situation are safe.",
    steps: [
      {
        title: "Describe the situation",
        text: "When our plans changed without warning…",
        icon: "book",
      },
      {
        title: "Express the feeling",
        text: "…I felt frustrated.",
        icon: "heart",
      },
      {
        title: "Make a specific request",
        text: "Could we discuss changes earlier next time?",
        icon: "message",
      },
    ],
    note: "This does not guarantee agreement. Do not confront someone who may react violently; seek support or a safer communication channel instead.",
    explanation:
      "The pattern describes the speaker’s experience without asserting that the other person intended harm. Sharing feelings remains a choice.",
    reflection:
      "Why does the safety of the situation matter more than using a particular phrase?",
  },
  {
    id: "pause-before-acting",
    chapterSlug: emotions,
    sectionId: "section-2-11",
    kind: "skill",
    title: "Make room for a safer next action",
    introduction:
      "When possible, a brief pause can create space to consider what matters.",
    steps: [
      {
        title: "Check safety",
        text: "Do not delay an essential safety action.",
        icon: "shield",
      },
      {
        title: "Notice the impulse",
        text: "An urge does not have to become an immediate action.",
        icon: "eye",
      },
      {
        title: "Pause if appropriate",
        text: "Ask for time or step away if it is safe.",
        icon: "pause",
      },
      {
        title: "Consider what matters",
        text: "Safety, dignity, fairness, relationships, or the practical problem.",
        icon: "compass",
      },
    ],
    note: "In immediate danger, prioritize safety and appropriate help. If there is a risk of harming someone, disengage if safe and obtain urgent support.",
    explanation:
      "Pausing is not the same as delaying protection. The next step depends on the actual situation, not simply the strength of an emotion.",
    reflection:
      "When would taking immediate safety action matter more than pausing for an exercise?",
  },
];

export const visualStories: VisualStory[] = [
  ...originalStories,
  ...continuationStories,
];
export const learningDiagrams: LearningDiagram[] = [
  ...originalDiagrams,
  ...continuationDiagrams,
];
