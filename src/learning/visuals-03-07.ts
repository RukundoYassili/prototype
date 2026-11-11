import type { VisualStory, LearningDiagram } from "./visuals";

export const continuationDiagrams: LearningDiagram[] = [
  {
    id: "stress-cycle",
    chapterSlug: "understanding-stress-and-healthy-coping-strategies",
    sectionId: "section-3-3",
    kind: "connection",
    title: "Pressure can feed a cycle",
    introduction:
      "The deadline example links pressure, sleep and concentration; there is more than one possible point of support.",
    steps: [
      {
        title: "Deadline pressure",
        text: "A demanding task increases worry.",
        icon: "book",
      },
      {
        title: "Poor sleep",
        text: "Worry can interfere with rest.",
        icon: "body",
      },
      {
        title: "Concentration becomes harder",
        text: "Exhaustion can slow progress.",
        icon: "brain",
      },
      {
        title: "More worry",
        text: "Slower progress may increase pressure.",
        icon: "message",
      },
    ],
    note: "This is an example, not a universal pattern or diagnosis. Rest, practical planning and support may interrupt part of the cycle.",
    explanation:
      "The example shows how pressure, limited rest and slower progress can reinforce each other. Practical planning, rest or asking for help may address different parts of that pattern.",
    reflection: "Where could practical assistance change this fictional cycle?",
  },
  {
    id: "stress-influence",
    chapterSlug: "understanding-stress-and-healthy-coping-strategies",
    sectionId: "section-3-6",
    kind: "pairs",
    title: "Influence and limits of control",
    introduction:
      "Choose reachable actions while acknowledging circumstances that one person cannot determine.",
    steps: [
      {
        title: "Study preparation",
        text: "An examination result cannot be guaranteed.",
        icon: "book",
      },
      {
        title: "Asking for help",
        text: "Another person's response is not under your control.",
        icon: "people",
      },
      {
        title: "Seeking services",
        text: "The wider economy cannot be changed by a coping skill.",
        icon: "home",
      },
    ],
    note: "Recognizing limits does not mean accepting injustice or taking blame for unsafe conditions.",
    explanation:
      "A reachable action can be worthwhile even when the final outcome depends on other people or wider conditions. Recognizing those limits can help identify where outside assistance is needed.",
    reflection:
      "How can an achievable action coexist with a problem that needs wider support?",
    pairLabels: ["An action within reach", "A limit to acknowledge"],
  },
  {
    id: "anxiety-experiences",
    chapterSlug: "understanding-anxiety-and-anxiety-disorders",
    sectionId: "section-4-3",
    kind: "connection",
    title: "Thoughts, body, actions and impact",
    introduction:
      "The source example connects a feared mistake with sensations, avoidance and missed opportunities.",
    steps: [
      {
        title: "An anxious thought",
        text: "One mistake will mean rejection.",
        icon: "brain",
      },
      {
        title: "Physical sensations",
        text: "Tense shoulders or a rapid heartbeat.",
        icon: "body",
      },
      {
        title: "A possible response",
        text: "Skipping a meeting or seeking reassurance.",
        icon: "footsteps",
      },
      {
        title: "Daily impact",
        text: "Opportunities are missed; future worry may grow.",
        icon: "book",
      },
    ],
    note: "These experiences do not diagnose an anxiety disorder. New or serious physical symptoms may need medical assessment.",
    explanation:
      "Looking at thoughts, sensations, actions and daily impact together gives a fuller picture than a single symptom. A professional assessment also considers health, circumstances and alternative explanations.",
    reflection:
      "Why should a physical sensation not automatically be attributed to anxiety?",
  },
  {
    id: "anxiety-avoidance",
    chapterSlug: "understanding-anxiety-and-anxiety-disorders",
    sectionId: "section-4-11",
    kind: "connection",
    title: "Brief relief can leave a fear untested",
    introduction:
      "In the classroom example, avoidance reduces discomfort now but may make the next presentation harder.",
    steps: [
      {
        title: "Trigger and prediction",
        text: "A classroom question brings fear of embarrassment.",
        icon: "message",
      },
      {
        title: "Body response",
        text: "Heartbeat increases and muscles tense.",
        icon: "body",
      },
      {
        title: "Avoidance and relief",
        text: "Missing the presentation brings immediate relief.",
        icon: "footsteps",
      },
      {
        title: "Longer-term effect",
        text: "Attendance falls and fear remains untested.",
        icon: "book",
      },
    ],
    note: "Avoidance can be protective in actual danger. Any treatment steps must be safe, collaborative and appropriate to the person.",
    explanation:
      "Temporary relief can reinforce avoidance of a feared but safe situation. Actual threats require protection; any work on anxiety-maintaining avoidance needs appropriate support and collaboration.",
    reflection:
      "Why is checking actual safety essential before discussing avoidance?",
  },
  {
    id: "depression-influences",
    chapterSlug: "understanding-depression-and-depressive-disorders",
    sectionId: "section-5-6",
    kind: "influences",
    title: "Several influences can interact",
    introduction:
      "The chapter describes biological, psychological and social influences rather than a single cause.",
    steps: [
      {
        title: "Health and vulnerability",
        text: "Family history, chronic illness and other health needs.",
        icon: "body",
      },
      {
        title: "Experiences and thoughts",
        text: "Stress, trauma, loss and self-critical thinking.",
        icon: "brain",
      },
      {
        title: "Living circumstances",
        text: "Income, housing, discrimination and access to support.",
        icon: "home",
      },
      {
        title: "Connection and care",
        text: "Relationships, practical assistance and appropriate treatment.",
        icon: "people",
      },
    ],
    note: "No single influence determines a person's future. Practical hardship needs practical support alongside care.",
    explanation:
      "Health, relationships, experiences and material circumstances may interact. Understanding that context supports a compassionate response and helps identify practical needs alongside appropriate care.",
    reflection:
      "What would be missed by describing every difficulty as a matter of attitude?",
  },
  {
    id: "depression-support",
    chapterSlug: "understanding-depression-and-depressive-disorders",
    sectionId: "section-5-9",
    kind: "influences",
    title: "Care can include several kinds of support",
    introduction:
      "Treatment decisions consider symptoms, preferences, health needs and access, with review over time.",
    steps: [
      {
        title: "Clinical assessment",
        text: "Understand symptoms, physical health and safety.",
        icon: "shield",
      },
      {
        title: "Psychological treatment",
        text: "Appropriate therapy with trained practitioners.",
        icon: "message",
      },
      {
        title: "Prescriber-led decisions",
        text: "Discuss medicines when clinically appropriate.",
        icon: "body",
      },
      {
        title: "Practical and social support",
        text: "Address everyday needs and barriers to care.",
        icon: "people",
      },
    ],
    note: "This diagram does not recommend a medicine, dose or individual treatment. Do not change prescribed medication based on a lesson.",
    explanation:
      "Care can combine clinical and everyday support. The relevant options depend on the person and should be discussed and reviewed with qualified practitioners, including treatment preferences and practical access.",
    reflection: "Why might practical help remain important during treatment?",
  },
  {
    id: "trauma-reactions",
    chapterSlug: "understanding-trauma-and-post-traumatic-stress",
    sectionId: "section-6-3",
    kind: "influences",
    title: "Reactions may involve more than feelings",
    introduction:
      "The source describes changes across feelings, thoughts, body and behaviour.",
    steps: [
      {
        title: "Feelings",
        text: "Fear, grief, anger, shock or numbness.",
        icon: "heart",
      },
      {
        title: "Thoughts",
        text: "Confusion, self-blame or difficulty focusing.",
        icon: "brain",
      },
      {
        title: "Body",
        text: "Tension, fatigue, sleep or appetite changes.",
        icon: "body",
      },
      {
        title: "Behaviour",
        text: "Seeking company, withdrawal or avoiding reminders.",
        icon: "footsteps",
      },
    ],
    note: "People respond differently. Reactions do not by themselves establish PTSD; severe, persistent or worsening difficulties deserve assessment.",
    explanation:
      "Changes can appear in different domains and at different times. Some people notice distress later; visible productivity or the absence of tears does not determine whether support is needed.",
    reflection:
      "Why can someone's outward productivity tell us little about their support needs?",
  },
  {
    id: "trauma-early-support",
    chapterSlug: "understanding-trauma-and-post-traumatic-stress",
    sectionId: "section-6-12",
    kind: "sequence",
    title: "Support begins with present needs",
    introduction:
      "Early support offers practical help and choices without insisting on a detailed account.",
    steps: [
      {
        title: "Check safety and medical needs",
        text: "Address urgent danger and injuries first.",
        icon: "shield",
      },
      {
        title: "Consider essential needs",
        text: "Food, shelter and clear practical information.",
        icon: "home",
      },
      {
        title: "Offer trusted contact",
        text: "Ask what company or assistance is welcome.",
        icon: "people",
      },
      {
        title: "Respect choice",
        text: "Listen if the person wishes; do not require retelling.",
        icon: "ear",
      },
    ],
    note: "Urgent assistance should never wait for completion of these steps. Compulsory emotional debriefing is not a universal prevention measure.",
    explanation:
      "Practical assistance and respectful choices can be offered without requesting a full account. A supporter should stay within their role and help connect with appropriate care when necessary.",
    reflection:
      "How can support be offered without asking someone to relive what happened?",
  },
  {
    id: "grief-changing-experiences",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-6",
    kind: "influences",
    title: "Grief does not follow a required sequence",
    introduction:
      "Memories, sadness, ordinary activities and enjoyment can come and go in different combinations.",
    steps: [
      {
        title: "Reminders",
        text: "A date, song or place can bring feelings back.",
        icon: "heart",
      },
      {
        title: "Connection",
        text: "Stories or values can remain meaningful.",
        icon: "people",
      },
      {
        title: "Present-day life",
        text: "Study, work and daily tasks can coexist with loss.",
        icon: "home",
      },
      {
        title: "Rest and choice",
        text: "Company or solitude may suit different moments.",
        icon: "leaf",
      },
    ],
    note: "These are connected experiences, not stages to complete or a recovery timetable. Continuing sadness does not automatically indicate a disorder.",
    explanation:
      "A person may miss someone while also studying, resting or enjoying company. Those experiences can coexist, and reminders may bring feelings back without meaning that someone has failed to adjust.",
    reflection:
      "Why would a fixed deadline for moving on miss the person's circumstances?",
  },
  {
    id: "grief-types-of-loss",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-2",
    kind: "pairs",
    title: "Different losses deserve acknowledgment",
    introduction:
      "The source distinguishes experiences of loss without turning them into automatic diagnoses.",
    steps: [
      {
        title: "Bereavement",
        text: "Loss of a person through death.",
        icon: "heart",
      },
      {
        title: "Living losses",
        text: "Employment, relationships, health or a familiar place.",
        icon: "home",
      },
      {
        title: "Anticipatory grief",
        text: "Responses before an expected loss.",
        icon: "people",
      },
      {
        title: "Ambiguous loss",
        text: "Uncertainty when there is no clear ending.",
        icon: "compass",
      },
    ],
    note: "Prolonged grief disorder specifically concerns bereavement after death. A short example or a time threshold cannot establish a diagnosis.",
    explanation:
      "Naming the kind of loss helps keep the discussion accurate. Acknowledging grief-like feelings after employment or relationship loss does not mean applying a bereavement-specific diagnosis.",
    reflection: "Why does understanding the kind of loss matter?",
    pairLabels: ["Source term", "Meaning in context"],
  },
  {
    id: "stress-grounding",
    chapterSlug: "understanding-stress-and-healthy-coping-strategies",
    sectionId: "section-3-8",
    kind: "skill",
    title: "Grounding with choice",
    introduction:
      "The source exercise is an optional educational adaptation, not a verbatim WHO protocol.",
    steps: [
      {
        title: "Choose",
        text: "Try only in a reasonably safe place; eyes may stay open.",
        icon: "shield",
      },
      {
        title: "Notice",
        text: "Look for ordinary details or sounds.",
        icon: "eye",
      },
      {
        title: "Connect if comfortable",
        text: "Notice the chair or feet without forcing breathing.",
        icon: "body",
      },
      {
        title: "Name and return",
        text: "Acknowledge the feeling and choose one safe action.",
        icon: "footsteps",
      },
    ],
    note: "Stop if distress increases. Choose another approach if needed, and do not practise during driving or tasks requiring full attention.",
    explanation:
      "The activity offers several ways to bring attention toward the current setting. Choice includes keeping eyes open, avoiding body-focused attention, stopping, or selecting another approach.",
    reflection: "What choices keep this exercise voluntary?",
  },
  {
    id: "stress-unhooking",
    chapterSlug: "understanding-stress-and-healthy-coping-strategies",
    sectionId: "section-3-9",
    kind: "skill",
    title: "Notice a thought before following it",
    introduction:
      "The exercise creates space to respond to a stressful thought without treating it automatically as fact.",
    steps: [
      {
        title: "Identify",
        text: "Notice one thought without trying to force it away.",
        icon: "brain",
      },
      {
        title: "Add a noticing phrase",
        text: "I am having the thought that I cannot cope.",
        icon: "message",
      },
      {
        title: "Consider its pull",
        text: "Is the thought pushing toward a helpful or harmful action?",
        icon: "compass",
      },
      {
        title: "Choose a reachable action",
        text: "A break, information or a safe conversation may fit.",
        icon: "footsteps",
      },
    ],
    note: "Do not dismiss genuine danger. Protection or practical assistance may be the appropriate response.",
    explanation:
      "A noticing phrase creates room to consider the action a thought is encouraging. The next step may be practical help or protection when the concern points to a genuine risk.",
    reflection:
      "How does noticing a thought differ from denying a real concern?",
  },
  {
    id: "stress-routine",
    chapterSlug: "understanding-stress-and-healthy-coping-strategies",
    sectionId: "section-3-10",
    kind: "skill",
    title: "A routine can stay flexible",
    introduction:
      "The chapter offers examples to adapt to living conditions rather than an ideal schedule to complete.",
    steps: [
      {
        title: "Morning",
        text: "Notice how you feel and one essential task.",
        icon: "eye",
      },
      {
        title: "During the day",
        text: "Pause between demands or ask for clarification.",
        icon: "pause",
      },
      {
        title: "Later",
        text: "Move comfortably or rest if exhausted.",
        icon: "leaf",
      },
      {
        title: "Evening",
        text: "Choose connection and preparation for sleep where possible.",
        icon: "people",
      },
    ],
    note: "Basic needs and safety take priority. Work, housing and care responsibilities can limit what is possible.",
    explanation:
      "The examples are anchors to adapt, not a timetable to complete. A small change that fits a person’s resources may be more realistic than trying to follow every suggested activity.",
    reflection:
      "Why might a smaller adjustment be more useful than an ideal routine?",
  },
  {
    id: "stress-journal",
    chapterSlug: "understanding-stress-and-healthy-coping-strategies",
    sectionId: "section-3-11",
    kind: "skill",
    title: "Organize a pressure and a possible response",
    introduction: "The source's two-column journal is private and optional.",
    steps: [
      {
        title: "Name a pressure",
        text: "Use a brief description without identifying details.",
        icon: "book",
      },
      {
        title: "Consider a response",
        text: "Identify information, practical help or a safe contact.",
        icon: "compass",
      },
      {
        title: "Choose your medium",
        text: "Think quietly, draw, talk or write if useful.",
        icon: "message",
      },
    ],
    note: "Do not record sensitive details on an accessible page or device. Stop if writing increases distress.",
    explanation:
      "Putting a pressure beside a possible response can help organize what needs attention. The activity can stay entirely unwritten, and a possible response may involve another person or service.",
    reflection:
      "How could this exercise be used without writing anything down?",
  },
  {
    id: "anxiety-grounding",
    chapterSlug: "understanding-anxiety-and-anxiety-disorders",
    sectionId: "section-4-12",
    kind: "skill",
    title: "Bring attention toward the present",
    introduction:
      "This optional skill may help some people with everyday overwhelm; it is not a cure for an anxiety disorder.",
    steps: [
      {
        title: "Check the setting",
        text: "Pause somewhere safe; keep eyes open if preferred.",
        icon: "shield",
      },
      {
        title: "Notice support",
        text: "Chair or feet, only if comfortable.",
        icon: "body",
      },
      {
        title: "Look and listen",
        text: "Three neutral things and two sounds.",
        icon: "eye",
      },
      {
        title: "Choose a small action",
        text: "Return to a manageable task or another safe step.",
        icon: "footsteps",
      },
    ],
    note: "Stop if distress, dizziness or disconnection increases. External objects, movement or conversation may suit someone better.",
    explanation:
      "Different forms of attention suit different people. External objects or a supportive conversation may be preferable when noticing internal sensations increases discomfort.",
    reflection:
      "What could someone choose if body-focused attention feels uncomfortable?",
  },
  {
    id: "anxiety-predictions",
    chapterSlug: "understanding-anxiety-and-anxiety-disorders",
    sectionId: "section-4-13",
    kind: "skill",
    title: "Question a prediction without forcing optimism",
    introduction:
      "The source distinguishes thoughts from facts while respecting genuine concerns.",
    steps: [
      {
        title: "Describe one worry",
        text: "Write it privately or consider it without writing.",
        icon: "brain",
      },
      {
        title: "Consider the evidence",
        text: "What supports it, and what does not?",
        icon: "book",
      },
      {
        title: "Consider another explanation",
        text: "What might you say to someone you care about?",
        icon: "heart",
      },
      {
        title: "Choose a realistic next action",
        text: "Seek a manageable step rather than certainty.",
        icon: "footsteps",
      },
    ],
    note: "This simplified reflection does not replace CBT. Avoid using it to dismiss real risks.",
    explanation:
      "Considering evidence and another explanation can soften an absolute prediction while still acknowledging the difficulty. The goal is a realistic next action rather than a guaranteed outcome.",
    reflection:
      "How does a balanced alternative differ from promising everything will be fine?",
  },
  {
    id: "anxiety-uncertainty",
    chapterSlug: "understanding-anxiety-and-anxiety-disorders",
    sectionId: "section-4-14",
    kind: "skill",
    title: "Make room for an unanswered question",
    introduction:
      "The job-application example explores repeated email checking without guaranteeing the outcome.",
    steps: [
      {
        title: "Notice checking",
        text: "Recognize the urge for absolute certainty.",
        icon: "eye",
      },
      {
        title: "Identify what can be influenced",
        text: "Keep a way to receive important messages.",
        icon: "compass",
      },
      {
        title: "Choose reasonable intervals",
        text: "Adapt a checking boundary to the situation.",
        icon: "pause",
      },
      {
        title: "Return to another activity",
        text: "Choose something worthwhile and manageable.",
        icon: "leaf",
      },
    ],
    note: "This is an everyday educational experiment, not a substitute for professional care when anxiety is severe.",
    explanation:
      "The applicant balances necessary communication with returning to another activity. The example explores a manageable boundary while accepting that an immediate answer may be unavailable.",
    reflection:
      "Which practical needs should be considered before changing a checking habit?",
  },
  {
    id: "anxiety-routines",
    chapterSlug: "understanding-anxiety-and-anxiety-disorders",
    sectionId: "section-4-15",
    kind: "skill",
    title: "Support wellbeing within real constraints",
    introduction:
      "Sleep opportunities, suitable movement, meals and connection may support general wellbeing.",
    steps: [
      {
        title: "Notice the circumstances",
        text: "Work, housing and health affect available choices.",
        icon: "home",
      },
      {
        title: "Choose one manageable change",
        text: "Adapt rest, meals or movement to ability and access.",
        icon: "leaf",
      },
      {
        title: "Include connection if welcome",
        text: "Consider a trusted person rather than isolation.",
        icon: "people",
      },
    ],
    note: "These supports do not replace treatment. Avoid rigid schedules or blame when circumstances limit choices.",
    explanation:
      "A wellbeing choice should fit health, ability and living conditions. Difficulty following a routine may signal practical constraints or a need for support rather than a lack of effort.",
    reflection:
      "Why should wellbeing guidance consider housing and working hours?",
  },
  {
    id: "depression-small-steps",
    chapterSlug: "understanding-depression-and-depressive-disorders",
    sectionId: "section-5-12",
    kind: "skill",
    title: "Reduce the size of the first step",
    introduction:
      "The source introduces a low-pressure activity skill related to behavioural activation.",
    steps: [
      {
        title: "Choose one gentle activity",
        text: "A cup washed, a brief outdoor moment or a greeting.",
        icon: "leaf",
      },
      {
        title: "Make it smaller",
        text: "Reduce the task if it feels overwhelming.",
        icon: "footsteps",
      },
      {
        title: "Notice without scoring",
        text: "A change may be subtle or absent.",
        icon: "eye",
      },
      {
        title: "Adjust and seek help",
        text: "Repeat or adapt; severe or unsafe symptoms need care.",
        icon: "shield",
      },
    ],
    note: "This is not a success test or a replacement for therapy. Do not respond to difficulty with more self-imposed pressure.",
    explanation:
      "The first step can be reduced when energy is limited. Noticing no immediate improvement is allowed; the activity remains an invitation alongside appropriate assessment and care.",
    reflection:
      "What would a compassionate adjustment look like if the activity is too much?",
  },
  {
    id: "depression-self-criticism",
    chapterSlug: "understanding-depression-and-depressive-disorders",
    sectionId: "section-5-13",
    kind: "skill",
    title: "Respond to a harsh conclusion with care",
    introduction:
      "The source example separates struggling with a task from judging a person's worth.",
    steps: [
      {
        title: "Notice the conclusion",
        text: "One difficult task does not define a person.",
        icon: "brain",
      },
      {
        title: "Consider evidence and context",
        text: "Illness and practical pressures may affect performance.",
        icon: "book",
      },
      {
        title: "Try a gentler response",
        text: "Acknowledge difficulty without forcing positivity.",
        icon: "heart",
      },
      {
        title: "Stop if it becomes overwhelming",
        text: "Choose another form of support.",
        icon: "pause",
      },
    ],
    note: "Reflection that becomes repetitive or distressing can be stopped. Structured CBT belongs with an appropriately trained practitioner.",
    explanation:
      "The example acknowledges that a task was difficult without making it a judgment about personal worth. Reflection can be paused if it becomes repetitive or distressing.",
    reflection:
      "Why should the response acknowledge difficulty instead of denying it?",
  },
  {
    id: "trauma-here-and-now",
    chapterSlug: "understanding-trauma-and-post-traumatic-stress",
    sectionId: "section-6-15",
    kind: "skill",
    title: "Orient to the present if comfortable",
    introduction:
      "The source's here-and-now exercise offers a brief choice of present-focused attention.",
    steps: [
      {
        title: "Look around",
        text: "Identify two neutral objects.",
        icon: "eye",
      },
      {
        title: "Notice support if comfortable",
        text: "Chair or floor; eyes may stay open.",
        icon: "body",
      },
      {
        title: "Acknowledge the present",
        text: "Notice where you are now.",
        icon: "compass",
      },
      {
        title: "Choose a small safe action",
        text: "Water, a quieter place or another useful step.",
        icon: "footsteps",
      },
    ],
    note: "Stop if distress or disconnection increases. This is not exposure therapy and does not replace clinical care.",
    explanation:
      "Present-focused attention offers a brief orientation to the current environment. It does not require describing an event, and stopping remains appropriate if discomfort or disconnection increases.",
    reflection: "Why is stopping an available choice throughout the exercise?",
  },
  {
    id: "trauma-daily-anchors",
    chapterSlug: "understanding-trauma-and-post-traumatic-stress",
    sectionId: "section-6-16",
    kind: "skill",
    title: "Choose one accessible daily anchor",
    introduction:
      "A small predictable action may be easier than a large goal after frightening experiences.",
    steps: [
      {
        title: "Consider basic needs",
        text: "A meal, rest or a predictable wake time.",
        icon: "home",
      },
      {
        title: "Adapt to ability and safety",
        text: "A short walk may suit some people, not everyone.",
        icon: "leaf",
      },
      {
        title: "Ask for practical help",
        text: "Transport or another daily task may need assistance.",
        icon: "people",
      },
    ],
    note: "Do not push through overwhelming exposure alone. Persistent nightmares or significant impairment warrant assessment.",
    explanation:
      "An accessible anchor can make an ordinary day more predictable. Help with transport, care responsibilities or another task may be more useful than setting a larger personal goal.",
    reflection: "Which practical assistance could make a daily task easier?",
  },
  {
    id: "trauma-contact-plan",
    chapterSlug: "understanding-trauma-and-post-traumatic-stress",
    sectionId: "section-6-17",
    kind: "skill",
    title: "Choose support that respects boundaries",
    introduction:
      "The source asks about welcome help without requiring a trauma history.",
    steps: [
      {
        title: "Consider trustworthy people",
        text: "Respect and choice matter more than someone's role.",
        icon: "people",
      },
      {
        title: "Name the kind of help",
        text: "Company, an errand or appointment accompaniment.",
        icon: "message",
      },
      {
        title: "Protect privacy",
        text: "Avoid recording sensitive details where others can access them.",
        icon: "shield",
      },
    ],
    note: "Sharing a history is optional. Immediate danger needs urgent assistance rather than a routine contact plan.",
    explanation:
      "A contact can be chosen for a particular kind of help without receiving a trauma history. Privacy, trust and the person’s boundaries guide what is shared and with whom.",
    reflection: "How can a support plan respect the choice not to disclose?",
  },
  {
    id: "grief-daily-check",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-part-iv",
    kind: "skill",
    title: "One small support check",
    introduction:
      "The activity notices basic needs without expecting grief to disappear.",
    steps: [
      {
        title: "Notice basics",
        text: "Food, water and rest, as available.",
        icon: "body",
      },
      {
        title: "Choose at most one action",
        text: "A simple task or a safe contact.",
        icon: "footsteps",
      },
      {
        title: "Allow a pause",
        text: "There is no recovery test to pass.",
        icon: "pause",
      },
    ],
    note: "These activities are optional and do not require a description of personal loss. Stop if distress increases; seek practical or professional support when needed. Extended inability to meet basic care needs warrants help.",
    explanation:
      "The check focuses on what might support the current day. It allows a small action, no action, or asking for help, without measuring how well someone is grieving.",
    reflection: "Why does this activity ask for at most one small action?",
    sourceBlockId: "grief-activity-1",
  },
  {
    id: "grief-grounding",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-part-iv",
    kind: "skill",
    title: "A choice during an intense wave",
    introduction:
      "The activity offers present-focused attention without deliberately evoking memories.",
    steps: [
      {
        title: "Notice support if comfortable",
        text: "Feet or seat, with eyes open if preferred.",
        icon: "body",
      },
      {
        title: "Look and listen",
        text: "Three ordinary objects and two sounds.",
        icon: "eye",
      },
      {
        title: "Choose one safe step",
        text: "Water, rest or a trusted call may suit the moment.",
        icon: "footsteps",
      },
    ],
    note: "Stop if distress or disconnection increases. Grounding is not treatment for PTSD or prolonged grief disorder.",
    explanation:
      "The activity responds to an intense moment by noticing the current setting. It avoids deliberately evoking memories, and the person can choose another response or stop.",
    reflection:
      "What makes this different from deliberately revisiting painful memories?",
    sourceBlockId: "grief-activity-2",
  },
  {
    id: "grief-support-map",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-part-iv",
    kind: "skill",
    title: "Different people may offer different help",
    introduction:
      "The support map does not expect one person to meet every need.",
    steps: [
      {
        title: "Someone who listens",
        text: "Only a person who respects privacy and choice.",
        icon: "ear",
      },
      {
        title: "Practical assistance",
        text: "Consider help with an everyday task.",
        icon: "people",
      },
      {
        title: "Professional care",
        text: "A qualified professional or relevant service.",
        icon: "shield",
      },
      {
        title: "A place or activity",
        text: "Something that offers a little relief if available.",
        icon: "leaf",
      },
    ],
    note: "Leave categories blank if unavailable. Avoid unsafe contacts and keep any written page private; reaching out remains a choice.",
    explanation:
      "Listening, practical assistance and clinical care may come from different sources. An incomplete map is acceptable and does not imply that someone has failed to build enough support.",
    reflection: "Why is it acceptable to leave a support-map category blank?",
    sourceBlockId: "grief-activity-3",
  },
  {
    id: "grief-remembering",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-part-iv",
    kind: "skill",
    title: "Meaning without pressure",
    introduction:
      "The activity offers low-intensity remembrance only if desired.",
    steps: [
      {
        title: "Choose freely",
        text: "Consider a value, meal or gentle memory if welcome.",
        icon: "heart",
      },
      {
        title: "Keep the option to skip",
        text: "Present-day care is another valid focus.",
        icon: "pause",
      },
      {
        title: "Notice your limits",
        text: "Stop if remembering becomes overwhelming.",
        icon: "shield",
      },
    ],
    note: "Do not force detailed storytelling, exposure or visits to distressing places. Clinical grief treatment should be practitioner-led.",
    explanation:
      "Meaningful connection may take a gentle form that the person chooses. Skipping remembrance and focusing on present-day care is also included in the source activity.",
    reflection:
      "How could someone take part by choosing present-day care instead?",
    sourceBlockId: "grief-activity-4",
  },
  {
    id: "grief-difficult-date",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-part-iv",
    kind: "skill",
    title: "A flexible plan for a difficult date",
    introduction:
      "The activity reduces pressure around an anniversary without promising a particular feeling.",
    steps: [
      {
        title: "Choose place and company",
        text: "Consider where to be and whether company is wanted.",
        icon: "home",
      },
      {
        title: "Identify essentials",
        text: "Keep necessary tasks realistic.",
        icon: "book",
      },
      {
        title: "Plan a break",
        text: "Allow rest, a quiet space or a change of plan.",
        icon: "pause",
      },
      {
        title: "Allow cancellation",
        text: "Plans can change with the person's needs.",
        icon: "compass",
      },
    ],
    note: "A plan is not a promise to feel okay. Serious symptoms around a date deserve professional guidance.",
    explanation:
      "Decisions about company, essential tasks and breaks can reduce unnecessary demands. A flexible plan leaves room for feelings or practical needs to change during the day.",
    reflection:
      "Which parts of a plan could change if the day feels harder than expected?",
    sourceBlockId: "grief-activity-5",
  },
];

export const continuationStories: VisualStory[] = [
  {
    id: "stress-examination",
    chapterSlug: "understanding-stress-and-healthy-coping-strategies",
    sectionId: "section-3-12",
    sourceExampleId: "example-stress-examination",
    title: "Scenario A: examination pressure",
    scenes: [
      {
        caption:
          "Several assessments and poor sleep can make concentration harder. This does not establish laziness or illness.",
        alt: "Illustrative fictional scene: a Rwandan university student, age 21, dark brown skin, short natural black hair, muted olive cotton shirt. The student is tired and distracted while rereading revision notes before several assessments.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "A trusted teacher may help prioritize revision and protect time for rest. Severe or worsening difficulties also warrant further support.",
        alt: "Illustrative fictional scene: The same student and a trusted adult teacher sit at the desk, discussing a realistic study plan and priorities; papers have no readable text.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "Pressure and exhaustion can affect attention. The teacher offers practical planning alongside rest; persistent or severe difficulty needs more than a revision schedule.",
    reflection:
      "What practical help is offered alongside emotional support in this example?",
  },
  {
    id: "stress-finances",
    chapterSlug: "understanding-stress-and-healthy-coping-strategies",
    sectionId: "section-3-12",
    sourceExampleId: "example-stress-finances",
    title: "Scenario B: financial uncertainty",
    scenes: [
      {
        caption:
          "Unpredictable income can create real pressure and make social contact feel difficult.",
        alt: "Illustrative fictional scene: a Rwandan adult man, age 34, dark brown skin, close-cropped hair, dusty blue shirt. He sits thoughtfully with household bills and looks withdrawn, with his phone set aside.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Emotional connection and practical financial or community assistance may both matter. Relaxation alone cannot resolve lost income.",
        alt: "Illustrative fictional scene: The same man and a trusted adult friend sit together reviewing a simple household budget and discussing practical support, without suggesting the money problem has disappeared.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "Income uncertainty is a material problem as well as an emotional burden. The second scene adds companionship and practical planning without claiming that either removes financial insecurity.",
    reflection:
      "Why would relaxation alone leave an important part of this situation unaddressed?",
  },
  {
    id: "stress-caregiver",
    chapterSlug: "understanding-stress-and-healthy-coping-strategies",
    sectionId: "section-3-12",
    sourceExampleId: "example-stress-caregiver",
    title: "Scenario C: caregiver overload",
    scenes: [
      {
        caption:
          "Care responsibilities can build into exhaustion and irritability when relief is limited.",
        alt: "Illustrative fictional scene: a Rwandan woman, age 43, dark brown skin, short natural hair, muted terracotta blouse. She pauses tiredly after organizing household tasks and appointments for an unwell adult relative; no patient or medical equipment is shown.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Shared responsibilities, relief and help with appointments may address part of the burden. A brief rest does not replace ongoing support.",
        alt: "Illustrative fictional scene: The same woman and an adult relative share practical planning at the table; relative organizes transport papers while she takes a seated break.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "Sharing tasks can reduce part of the care burden. Sustainable support may also involve scheduled relief, transport and healthcare conversations.",
    reflection:
      "Which support changes the workload rather than only asking the caregiver to cope?",
  },
  {
    id: "stress-workplace",
    chapterSlug: "understanding-stress-and-healthy-coping-strategies",
    sectionId: "section-3-12",
    sourceExampleId: "example-stress-workplace",
    title: "Scenario D: conflict at work",
    scenes: [
      {
        caption:
          "Repeated harsh criticism can make work feel threatening or difficult to face.",
        alt: "Illustrative fictional scene: a Rwandan office worker, age 30, dark brown skin, neat short twists, plain light-green blouse. She sits thoughtfully after repeated harsh criticism, with restrained worry, no confrontation or aggressor shown.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Private advice and appropriate workplace remedies may help. Harassment or danger calls for safety and practical action, not simply tolerating the situation.",
        alt: "Illustrative fictional scene: The same worker speaks privately with a trusted adult adviser in a quiet meeting area, considering workplace support options and a closed notebook.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "The worker is seeking private advice rather than being taught to endure mistreatment. Workplace support and safety depend on the actual circumstances.",
    reflection:
      "Why is the safety and fairness of the workplace part of the response?",
  },
  {
    id: "anxiety-examination",
    chapterSlug: "understanding-anxiety-and-anxiety-disorders",
    sectionId: "section-4-16",
    sourceExampleId: "example-anxiety-examination",
    title: "Scenario A — Examination worry",
    scenes: [
      {
        caption:
          "Examination worry can include tension and fear of forgetting prepared material.",
        alt: "Illustrative fictional scene: a Rwandan adult female student, age 22, dark brown skin, braided hair tied back, soft blue cotton top. She looks tense and thoughtful over examination preparation, hands naturally on notebook.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "A realistic plan, comfortable coping skills, rest and trusted support may help. Repeated inability to attend examinations deserves professional advice.",
        alt: "Illustrative fictional scene: The same student discusses a manageable revision plan with a trusted adult teacher at the desk; calm attentive interaction without sudden happiness.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "The response combines preparation, rest and a trusted conversation. Repeated avoidance or substantial interference with education deserves assessment rather than simply more effort.",
    reflection:
      "When does repeated examination difficulty warrant more than ordinary preparation?",
  },
  {
    id: "anxiety-speaking",
    chapterSlug: "understanding-anxiety-and-anxiety-disorders",
    sectionId: "section-4-16",
    sourceExampleId: "example-anxiety-speaking",
    title: "Scenario B — Fear of speaking at work",
    scenes: [
      {
        caption:
          "Fear of speaking can lead someone to turn down responsibilities and avoid meetings.",
        alt: "Illustrative fictional scene: a Rwandan male employee, age 32, dark brown skin, short black hair, cream shirt. He sits quietly at the meeting table, hesitant to speak, without ridicule or hostility.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "A private conversation and professional assessment can explore the pattern. Nobody should force humiliating exposure or infer a diagnosis from one scene.",
        alt: "Illustrative fictional scene: The same employee has a private supportive conversation with a fictional adult practitioner in a plain green blouse in a quiet office; no certificates or badges.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "The conversation makes space to discuss avoidance and its impact. Professional treatment, if appropriate, is collaborative; it does not mean colleagues should force public speaking.",
    reflection:
      "How does an invitation to seek support differ from forced exposure?",
  },
  {
    id: "anxiety-travel",
    chapterSlug: "understanding-anxiety-and-anxiety-disorders",
    sectionId: "section-4-16",
    sourceExampleId: "example-anxiety-travel",
    title: "Scenario C — Panic-like sensations while traveling",
    scenes: [
      {
        caption:
          "New, intense dizziness or breathing discomfort during travel should not automatically be called anxiety.",
        alt: "Illustrative fictional scene: a Rwandan adult female passenger, age 29, dark brown skin, short neat braids, dusty rose shirt. She is seated with a companion, appearing worried by new dizziness and breathing discomfort, no collapse, injury or dramatic gasping.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Companions can help the person access medical assessment. Clinicians can then consider possible causes; the image does not establish panic disorder.",
        alt: "Illustrative fictional scene: The same passenger and companion speak with a fictional healthcare worker in a simple clinic assessment room; everyone seated, no equipment procedure or diagnosis.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "The key action is medical assessment for new, intense symptoms. A later clinician may consider anxiety, but companions should not assume that anxiety explains the episode.",
    reflection:
      "Why should the companions avoid deciding that these symptoms are just anxiety?",
  },
  {
    id: "anxiety-finances",
    chapterSlug: "understanding-anxiety-and-anxiety-disorders",
    sectionId: "section-4-16",
    sourceExampleId: "example-anxiety-finances",
    title: "Scenario D — Worry during financial insecurity",
    scenes: [
      {
        caption:
          "Worry about school costs and essential expenses may reflect real insecurity.",
        alt: "Illustrative fictional scene: a Rwandan caregiver woman, age 39, dark brown skin, natural hair in a low bun, sage cardigan. She looks concerned while considering school costs and essential expenses, no child distress depicted.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Practical assistance and emotional support can work together. Disabling or persistent worry may also need mental health care.",
        alt: "Illustrative fictional scene: The same caregiver and a trusted adult friend sit together identifying practical assistance and organizing a few household papers.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "Real household costs deserve practical help. Emotional support and care can accompany financial or social assistance without blaming the caregiver.",
    reflection:
      "How can support acknowledge both genuine costs and the impact of worry?",
  },
  {
    id: "depression-student",
    chapterSlug: "understanding-depression-and-depressive-disorders",
    sectionId: "section-5-18",
    sourceExampleId: "example-depression-student",
    title: "Scenario A: University student",
    scenes: [
      {
        caption:
          "Weeks of withdrawal, poor sleep and difficulty attending classes deserve compassion and attention.",
        alt: "Illustrative fictional scene: a Rwandan university student, age 23, dark brown skin, short coiled black hair, muted blue overshirt. The student appears quietly withdrawn and low in energy after weeks of missing classes, without exaggerated distress or hopeless imagery.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "A private conversation and help accessing assessment and academic support may be useful. A photograph cannot diagnose depression.",
        alt: "Illustrative fictional scene: The same student talks privately with a trusted adult support person who listens and offers help arranging healthcare and academic support.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "Changes lasting several weeks and affecting studies deserve a private, compassionate conversation. An assessment can explore possible explanations and support needs.",
    reflection:
      "Why would assumptions about laziness miss the student's needs?",
  },
  {
    id: "depression-parent",
    chapterSlug: "understanding-depression-and-depressive-disorders",
    sectionId: "section-5-18",
    sourceExampleId: "example-depression-parent",
    title: "Scenario B: Parent after childbirth",
    scenes: [
      {
        caption:
          "Persistent low mood and overwhelm after childbirth can be difficult to disclose.",
        alt: "Illustrative fictional scene: a Rwandan new parent woman, age 31, dark brown skin, neatly tied natural hair, soft beige cardigan. She sits quietly looking tired and overwhelmed; no infant needs to be visible, no unsafe care situation.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Compassionate maternal healthcare assessment and practical family help may both matter. These scenes do not imply a diagnosis or replace professional care.",
        alt: "Illustrative fictional scene: The same parent speaks privately with a fictional maternal healthcare practitioner while an adult partner quietly organizes practical household help in the background.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "The setting makes room for both confidential care and practical help after childbirth. A scene cannot establish perinatal depression or determine suitable treatment.",
    reflection:
      "What makes practical family help complementary to professional assessment?",
  },
  {
    id: "depression-income",
    chapterSlug: "understanding-depression-and-depressive-disorders",
    sectionId: "section-5-18",
    sourceExampleId: "example-depression-income",
    title: "Scenario C: Worker under financial pressure",
    scenes: [
      {
        caption:
          "Losing income can coincide with isolation, exhaustion and persistent low mood.",
        alt: "Illustrative fictional scene: a Rwandan adult worker man, age 41, dark brown skin, short hair, rust-brown polo shirt. He sits withdrawn and exhausted after losing income, with restrained thoughtful expression.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Care and practical financial or social support may both be needed. Reducing the difficulty to motivation overlooks its context.",
        alt: "Illustrative fictional scene: The same man and an adult support worker talk at a quiet community office, considering both care access and practical financial or social assistance.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "Financial adversity and symptoms may interact. Support can consider living circumstances alongside assessment and care rather than treating the problem as a failure of motivation.",
    reflection:
      "Which parts of the situation call for practical assistance as well as care?",
  },
  {
    id: "depression-older-adult",
    chapterSlug: "understanding-depression-and-depressive-disorders",
    sectionId: "section-5-18",
    sourceExampleId: "example-depression-older-adult",
    title: "Scenario D: Older adult",
    scenes: [
      {
        caption:
          "Changes in sleep and interest in visits can occur alongside chronic pain and other health concerns.",
        alt: "Illustrative fictional scene: a Rwandan older woman, age 69, dark brown skin, short grey natural hair, dusty green blouse. She sits thoughtfully with low energy, a family photo on a side table, without exaggerated pain or frailty.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Assessment can consider physical and mental health together. Depression should not be dismissed as an inevitable part of aging.",
        alt: "Illustrative fictional scene: The same older woman, accompanied by an adult relative if welcome, talks with a fictional healthcare practitioner in an accessible clinic room.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "The older person's physical symptoms and changes in interest both matter. Neither age nor outward appearance rules out a need for care.",
    reflection:
      "Why should physical and mental health be considered together here?",
  },
  {
    id: "trauma-road",
    chapterSlug: "understanding-trauma-and-post-traumatic-stress",
    sectionId: "section-6-24",
    sourceExampleId: "example-trauma-road",
    title: "Scenario A: Distress after a road accident",
    scenes: [
      {
        caption:
          "After a road accident, traffic reminders, nightmares and travel difficulties may disrupt studies.",
        alt: "Illustrative fictional scene: a Rwandan adult university student, age 24, dark brown skin, short black hair, muted teal shirt. He looks tense and tired while considering transport, holding a plain backpack; do not show the accident, injury, damaged vehicle or flashback.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Practical assistance and assessment may help. Nobody should force immediate travel as a test; these scenes show only the later circumstances.",
        alt: "Illustrative fictional scene: The same student and a trusted adult adviser discuss practical transport assistance and a healthcare appointment in a calm campus office.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "These are later difficulties following an accident, not a reenactment. Assistance with transport and assessment respects choice without forcing exposure.",
    reflection:
      "Why would forcing the student to travel be an unsuitable test?",
  },
  {
    id: "trauma-health-worker",
    chapterSlug: "understanding-trauma-and-post-traumatic-stress",
    sectionId: "section-6-24",
    sourceExampleId: "example-trauma-health-worker",
    title: "Scenario B: A health worker after an emergency",
    scenes: [
      {
        caption:
          "A distressing emergency can be followed by poor sleep or irritability, even when someone continues working.",
        alt: "Illustrative fictional scene: a Rwandan healthcare worker woman, age 37, dark brown skin, short braids, plain unbranded sage scrubs. She sits tiredly after a difficult shift, with a cup of water, thoughtful rather than incapacitated.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Confidential professional conversation, feasible rest and workplace support may help. Detailed retelling should not be demanded.",
        alt: "Illustrative fictional scene: The same worker talks privately with an adult support professional in a quiet staff wellbeing room; equal eye level, no intrusive questioning or certificates.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "Continuing to work does not show that someone is unaffected. Support should be confidential and should not demand a detailed account of the emergency.",
    reflection:
      "What protects choice and privacy in the supportive conversation?",
  },
  {
    id: "trauma-threats",
    chapterSlug: "understanding-trauma-and-post-traumatic-stress",
    sectionId: "section-6-24",
    sourceExampleId: "example-trauma-threats",
    title: "Scenario C: Persistent fear after repeated threats",
    scenes: [
      {
        caption:
          "Feeling constantly on guard after threats makes checking present safety important.",
        alt: "Illustrative fictional scene: a Rwandan adult woman, age 35, dark brown skin, neat shoulder-length twists, muted plum blouse. She appears watchful and thoughtful while seated alone; no threatening person, confrontation, weapon or violent scene.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Maintaining distance from an unsafe person may be protective. Professional support should consider privacy, protection and practical needs alongside symptoms.",
        alt: "Illustrative fictional scene: The same woman speaks privately with a fictional qualified support practitioner about present safety and practical assistance, with comfortable space and no physical contact.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "Current threats must be considered first. Staying away from someone unsafe can be protective, and any care needs to respect privacy and protection.",
    reflection:
      "When might keeping distance be a safety measure rather than a problem to overcome?",
  },
  {
    id: "trauma-adolescent",
    chapterSlug: "understanding-trauma-and-post-traumatic-stress",
    sectionId: "section-6-24",
    sourceExampleId: "example-trauma-adolescent",
    title: "Scenario D: A young person’s changed behavior",
    scenes: [
      {
        caption:
          "A young person may withdraw or struggle to concentrate after a frightening experience.",
        alt: "Illustrative fictional scene: a fictional Rwandan adolescent boy, age 16, dark brown skin, short black hair, ordinary blue school sweater. He sits quietly apart from peers after an unspecified frightening event, backpack beside him; no event, injury, abuse or humiliation shown.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "A trusted adult can ask what support is welcome and help arrange age-appropriate assessment. Public disclosure and detailed retelling are not required.",
        alt: "Illustrative fictional scene: The same adolescent has a respectful conversation with a trusted adult school support person in a private room, no closed locked door or coercion.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "A calm private conversation can offer choice and age-appropriate support. The adult should not demand public disclosure or a complete account.",
    reflection:
      "How could an adult offer support without asking the young person to explain everything?",
  },
  {
    id: "grief-student",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-part-v",
    sourceExampleId: "example-grief-student",
    title: "Scenario A — A student after a parent’s death",
    scenes: [
      {
        caption:
          "Grief can affect concentration while tuition and family responsibilities add practical pressure.",
        alt: "Illustrative fictional scene: a Rwandan university student woman, age 22, dark brown skin, neatly pulled-back braids, cream and sage clothing. She looks reflective and distracted after a parent's death, thinking about studies and family responsibilities; no deceased person, funeral or crying close-up.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Trusted support and academic or financial adjustments may reduce pressure. Severe impairment warrants professional support; no diagnosis follows from this example.",
        alt: "Illustrative fictional scene: The same student talks with a trusted adult campus adviser about temporary academic flexibility and practical support, without visible forms or readable text.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "The student's loss and practical obligations are both acknowledged. Academic flexibility and trusted support can help without turning understandable grief into a diagnosis.",
    reflection:
      "What academic or practical pressures accompany the grief in this example?",
  },
  {
    id: "grief-anniversary",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-part-v",
    sourceExampleId: "example-grief-anniversary",
    title: "Scenario B — A parent facing anniversary grief",
    scenes: [
      {
        caption:
          "An anniversary can bring sadness years after a death alongside ordinary functioning and enjoyment.",
        alt: "Illustrative fictional scene: a Rwandan adult parent man, age 48, dark brown skin, short hair with slight greying, soft olive shirt. He sits reflectively on a difficult anniversary, holding an ordinary closed photo album without visible portraits.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Chosen company or a quiet activity may help. Continued memories and sadness do not automatically indicate a disorder.",
        alt: "Illustrative fictional scene: The same man sits with a trusted adult friend on the veranda, choosing quiet company; thoughtful warmth, not celebratory or instantly relieved.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "An anniversary can be painful even when a person participates in daily life. Chosen company is one option, not a requirement to grieve in a particular way.",
    reflection:
      "Why does ongoing sadness on an anniversary not establish a disorder?",
  },
  {
    id: "grief-employment",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-part-v",
    sourceExampleId: "example-grief-employment",
    title: "Scenario C — Loss of employment and identity",
    scenes: [
      {
        caption:
          "Losing long-held employment can affect identity, finances and a person's sense of role.",
        alt: "Illustrative fictional scene: a Rwandan adult worker woman, age 46, dark brown skin, short natural hair, muted ochre blouse. She looks thoughtful and uncertain after losing long-held employment, no eviction or degrading imagery.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "Acknowledgment, practical assistance and trusted contact may help. Prolonged grief disorder concerns bereavement after death, not employment loss.",
        alt: "Illustrative fictional scene: The same woman and a trusted adult adviser review available job-search and practical assistance in a community office, without suggesting a job offer.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "Employment loss can affect identity and security. The source distinguishes this experience from prolonged grief disorder, which concerns bereavement following death.",
    reflection:
      "Why does the kind of loss matter when discussing prolonged grief disorder?",
  },
  {
    id: "grief-assessment",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-part-v",
    sourceExampleId: "example-grief-assessment",
    title: "Scenario D — Severe grief that is not improving",
    scenes: [
      {
        caption:
          "Pervasive yearning, isolation and serious difficulty meeting obligations deserve assessment.",
        alt: "Illustrative fictional scene: a Rwandan adult bereaved woman, age 40, dark brown skin, short twists pulled back, dusty blue blouse. She sits withdrawn and reflective with daily obligations feeling difficult long after a partner's death; no self-harm, deceased person or extreme distress.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "A qualified professional can consider safety, functioning, mood and cultural context. Prolonged grief disorder cannot be diagnosed from a brief story.",
        alt: "Illustrative fictional scene: The same woman speaks with a fictional mental health practitioner in a quiet assessment room, with respectful eye level and no diagnostic labels or certificates.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "The concern is substantial, persistent impairment in context. A clinician may consider several explanations; the timing or photograph alone does not establish a disorder.",
    reflection:
      "What information would a qualified assessment need beyond this short example?",
  },
  {
    id: "grief-child",
    chapterSlug: "understanding-grief-loss-and-emotional-adjustment",
    sectionId: "section-7-part-v",
    sourceExampleId: "example-grief-child",
    title: "Scenario E — A child and confusing explanations",
    scenes: [
      {
        caption:
          "Confusing phrases about a grandparent's death can leave a child with questions or fears.",
        alt: "Illustrative fictional scene: a fictional Rwandan child boy, age 8, dark brown skin, short coiled black hair, plain green T-shirt. The child sits with a thoughtful puzzled expression next to a trusted adult caregiver, no frightening imagery, no bedroom or deceased person.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
      {
        caption:
          "A caregiver can give honest, age-appropriate explanations and predictable support. Persistent or impairing distress may need qualified help.",
        alt: "Illustrative fictional scene: The same child and caregiver sit together at eye level, caregiver calmly answering questions with attentive natural gestures; no visible written explanation.",
        focalPosition: "50% 45%",
        mobileFocalPosition: "50% 35%",
      },
    ],
    explanation:
      "An honest, developmentally appropriate explanation can address confusion while allowing questions. A child should not be forced into public discussion or distressing remembrance.",
    reflection:
      "How can an adult answer questions without forcing a particular emotional response?",
  },
];
