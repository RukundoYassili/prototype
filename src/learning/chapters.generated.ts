// Generated from the supplied PDFs by scripts/import-mental-health-chapters.py.
// Full educational text; edit source content deliberately and retain provenance.
import type { MentalHealthChapter } from "./types";

export const mentalHealthChapters: MentalHealthChapter[] = [
  {
    number: 1,
    slug: "understanding-mental-health-and-wellbeing",
    title: "Understanding Mental Health and Wellbeing",
    originalFilename:
      "VUGA_NDAKUMVA_Mental_Health_Review_and_Expanded_Chapter_01.pdf",
    summary:
      "Explore what mental health means, what shapes wellbeing, and the ways people can care for themselves and support others.",
    timeLabel: "Estimated reading",
    studyTime: "25-35 minutes, with optional reflection",
    referenceHeading: "References and source notes",
    editorialHeading: "Publication approval checklist",
    reflectionSection: "1.13",
    image: "mental-health-group",
    position: "50% 42%",
    version: "1.1",
    date: "2026-11-09",
    language: "English master draft",
    author: "VUGA NDAKUMVA",
    pdfUrl: "/learning/mental-health/chapter-01-mental-health.pdf",
    sourcePages: 7,
    frontMatter: [
      "Audience: General readers, including older adolescents with appropriate support and adults. Estimated reading: 25-35 minutes, with optional reflection. Content type: Educational, not diagnostic.",
      "Purpose: This document reviews the original 28-page mental health handbook and provides a significantly expanded, usable first chapter. It does not contain a separate GBV curriculum, software design, or a content-development roadmap.",
      "Editorial status: Evidence-informed educational draft. It has not been clinically reviewed, translated, field-tested, or approved for public distribution. No diagnosis or individual treatment is provided.",
      "For immediate danger: Seek in-person emergency care or local emergency services. This handbook is not an emergency service. Verify local contact numbers and services before any public release.",
    ],
    goals: [
      "Explain mental health in plain language and recognize that it is more than the absence of illness.",
      "Describe how feelings, thoughts, relationships, body, circumstances and community influence wellbeing.",
      "Differentiate common emotional experiences, psychological distress and possible mental health conditions without self-diagnosing.",
      "Recognize barriers, protective influences, stigma and situations where professional support is useful.",
      "Identify one realistic action to care for mental wellbeing while recognizing problems that require external support.",
    ],
    sections: [
      {
        number: "1.1",
        id: "section-1-1",
        title: "What is mental health?",
        blocks: [
          {
            type: "paragraph",
            text: "Mental health is part of health. It concerns how we experience emotions, think, connect with others, make choices and function in day-to-day life. It influences our ability to learn, work, care for ourselves, contribute to our community and respond to difficulties. Mental health also matters in its own right: every person deserves dignity, belonging and support whether they feel well or are experiencing problems.",
          },
          {
            type: "paragraph",
            text: "Mental health does not mean being happy all the time. Fear, sadness, anger, frustration and worry can be normal responses to life. A person may feel distressed after losing a job or a family member and still have healthy capacities and meaningful relationships. A person with a diagnosed mental health condition may also work, study, raise a family, participate in community life and experience periods of wellbeing. A diagnosis does not define their identity or worth.",
          },
          {
            type: "paragraph",
            text: "The World Health Organization describes mental health as a continuum rather than two fixed categories of healthy or unwell. Our circumstances, resources, symptoms and ability to function can change over time. This is one reason to ask how a person is doing rather than making assumptions from appearance alone. [1]",
          },
        ],
      },
      {
        number: "1.2",
        id: "section-1-2",
        title:
          "Mental health, wellbeing, distress and mental health conditions",
        blocks: [
          {
            type: "paragraph",
            text: "These words are related but not interchangeable. Understanding the difference helps us avoid unnecessary labeling while also taking serious problems seriously.",
          },
          {
            type: "table",
            headers: ["Term", "Plain-language meaning"],
            rows: [
              [
                "Mental wellbeing",
                "How supported, connected, capable and able to participate a person may feel; it can fluctuate.",
              ],
              [
                "Emotional distress",
                "Painful emotions or thoughts that may arise after difficult experiences; not automatically a disorder.",
              ],
              [
                "Mental health condition",
                "A pattern of symptoms or experiences involving significant distress, impaired functioning or other clinical concerns that may need professional care.",
              ],
              [
                "Recovery",
                "A personal process that can involve symptom improvement, finding meaning and rebuilding participation and support; it is not identical for everyone.",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "For example, being worried before an examination is common. Worry that persists for months, disrupts sleep, and leads a person to avoid school or work may warrant assessment. Likewise, sadness after bereavement deserves care and compassion, but should not automatically be diagnosed as depression. A clinician considers history, severity, duration, context, physical health and functioning.",
          },
        ],
      },
      {
        number: "1.3",
        id: "section-1-3",
        title: "Why mental health matters in everyday life",
        blocks: [
          {
            type: "paragraph",
            text: "Mental health influences many ordinary activities. When someone is feeling supported, they may find it easier to concentrate, plan the day, solve problems and connect with others. When someone is under great emotional pressure, tasks that used to feel manageable may become harder. These changes are not a measure of intelligence or character. Emotional health and physical health also interact: sleep, pain, chronic illness and certain medications can affect mood and attention, while persistent distress can contribute to physical symptoms.",
          },
          {
            type: "paragraph",
            text: "In education, mental wellbeing can affect attendance, memory and participation. In work, it can influence energy, relationships and performance. In families, it affects communication and the capacity to respond to stress. In communities, safe environments, inclusion and social support help people feel connected. These are examples of influences, not guarantees; many people function well despite adversity, and some struggle without an obvious external cause.",
          },
        ],
      },
      {
        number: "1.4",
        id: "section-1-4",
        title: "What shapes mental health?",
        blocks: [
          {
            type: "paragraph",
            text: "Mental health is shaped by factors that interact. It is rarely accurate to explain a person's experience with one cause. [1,2]",
          },
          {
            type: "list",
            items: [
              "Biological and physical influences: Genetics, development, disability, chronic illness, sleep, pain, pregnancy-related changes and effects of some substances or medications can contribute.",
              "Psychological influences: Previous experiences, coping skills, beliefs, learning and the ability to recognize and regulate emotions may shape responses to challenges.",
              "Relationships: Supportive friendships, respectful family connections, reliable caregivers and social belonging may protect wellbeing; isolation and harmful relationships may increase distress.",
              "Living conditions: Financial insecurity, housing problems, unsafe environments, discrimination, unemployment or difficulty accessing healthcare can place sustained pressure on mental health.",
              "Community and culture: Shared language, traditions, faith communities and social networks may provide meaning and support for some people, while stigma or exclusion can make help harder to obtain.",
            ],
          },
          {
            type: "paragraph",
            text: "No one chooses their genetics or many of the circumstances they experience. A person facing poverty or violence cannot be expected to solve those problems by thinking positively. Mental health support must sometimes include practical assistance, protection, healthcare and changes in the surrounding environment.",
          },
        ],
      },
      {
        number: "1.5",
        id: "section-1-5",
        title: "Risk factors and protective factors",
        blocks: [
          {
            type: "paragraph",
            text: "A risk factor is something associated with a greater likelihood of difficulty. A protective factor is something that may strengthen resilience or reduce vulnerability. Neither determines what will happen to any individual. One person may experience major adversity and recover with support; another may experience substantial distress without a clear trigger.",
          },
          {
            type: "table",
            headers: ["Possible pressures", "Possible protective influences"],
            rows: [
              [
                "Prolonged financial strain",
                "Reliable practical and social support",
              ],
              ["Bullying or exclusion", "Safe, inclusive school or workplace"],
              [
                "Sleep problems or untreated illness",
                "Accessible healthcare and supportive routines",
              ],
              [
                "Social isolation",
                "Trustworthy relationships and community connection",
              ],
              [
                "Unstable or unsafe conditions",
                "Safety, stable services and practical resources",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "Protective factors should not be presented as an individual checklist for success. Some are created by institutions and communities, not by personal effort alone. [1]",
          },
        ],
      },
      {
        number: "1.6",
        id: "section-1-6",
        title: "Recognizing signs that someone may need support",
        blocks: [
          {
            type: "paragraph",
            text: "People show distress differently. Possible changes include sleeping much more or less than usual; changes in appetite or energy; feeling persistently sad, worried or irritable; avoiding people or activities; difficulty concentrating; or struggling with everyday responsibilities. These signs are not diagnoses. They may result from life stress, a medical condition, medication, substance use or a mental health condition.",
          },
          {
            type: "paragraph",
            text: "Consider four questions: How long has the change been present? How intense is it? Is it getting better or worse? Is the person having difficulty doing important daily activities? These questions help decide whether to seek support, but they cannot confirm or rule out a disorder.",
          },
        ],
      },
      {
        number: "1.7",
        id: "section-1-7",
        title: "Normal fluctuations do not invalidate suffering",
        blocks: [
          {
            type: "paragraph",
            text: "There is no requirement to meet a diagnostic threshold before asking for kindness or practical help. A student struggling after a disappointing examination, a parent adjusting to a new responsibility or a person dealing with bereavement may benefit from rest, conversation, reliable information or professional support even if no mental health disorder is present.",
          },
          {
            type: "paragraph",
            text: "At the same time, serious symptoms should not be dismissed as ordinary stress merely because a person is still attending school or going to work. People can hide distress, and outward productivity does not prove that someone is doing well.",
          },
        ],
      },
      {
        number: "1.8",
        id: "section-1-8",
        title: "Common myths and helpful facts",
        blocks: [
          {
            type: "table",
            headers: ["Myth", "More accurate understanding"],
            rows: [
              [
                "Mental illness is a personal weakness.",
                "Mental health conditions have complex causes; they are not moral failures.",
              ],
              [
                "A person must be visibly distressed to need help.",
                "Difficulties are not always visible to others.",
              ],
              [
                "People with conditions cannot recover or contribute.",
                "Many people improve with appropriate care and maintain meaningful lives.",
              ],
              [
                "Self-help is enough for everyone.",
                "Self-help can be useful but professional care or external support may be essential.",
              ],
              [
                "Asking for help means failure.",
                "Asking for assistance is a reasonable step in caring for health.",
              ],
            ],
          },
        ],
      },
      {
        number: "1.9",
        id: "section-1-9",
        title: "Supporting your own mental wellbeing",
        blocks: [
          {
            type: "paragraph",
            text: "Mental wellbeing can be supported through manageable actions, though there is no single routine that suits everyone. Start with your circumstances and choose what is possible rather than trying to change everything at once.",
          },
          {
            type: "list",
            items: [
              "Connection: Reach out to someone you regard as safe, or participate in a supportive activity when practical.",
              "Rest: Aim for regular sleep opportunities and periods of rest as circumstances permit.",
              "Movement: Choose physical activity appropriate for your abilities, health and preferences.",
              "Meaning: Spend some time on activities that matter to you, such as learning, caregiving, creativity, service or spiritual practice if freely chosen.",
              "Problem-solving: Separate challenges you can influence from those requiring outside help. Choose one small action rather than demanding a complete solution immediately.",
              "Support: Seek healthcare or practical assistance for persistent symptoms or difficult living conditions.",
            ],
          },
          {
            type: "paragraph",
            text: "These ideas are not treatments for every mental health condition, and they do not replace clinical assessment. If a suggested practice increases discomfort, feels unsafe or is unsuitable for you, stop and choose another form of support.",
          },
        ],
      },
      {
        number: "1.10",
        id: "section-1-10",
        title: "How to support another person respectfully",
        blocks: [
          {
            type: "paragraph",
            text: 'You do not need to be a mental health professional to show care. You can listen, ask what the person needs, avoid blame and help them find appropriate information or services. A useful opening question is, "Would you like to talk, or would you prefer company without discussing it?"',
          },
          {
            type: "paragraph",
            text: "Avoid claiming to know what the person is experiencing. Do not pressure them to disclose painful events, promise absolute secrecy, or insist that prayer, positive thoughts, or advice will solve the problem. Respect privacy and autonomy whenever possible. If immediate safety is at risk, seek appropriate urgent assistance.",
          },
        ],
      },
      {
        number: "1.11",
        id: "section-1-11",
        title: "When is professional help appropriate?",
        blocks: [
          {
            type: "paragraph",
            text: "Professional support is reasonable when distress lasts, worsens or disrupts everyday life; when sleep or physical symptoms are concerning; when alcohol or other substances are being used in harmful ways to cope; or when a person wants help understanding persistent changes. A primary-care professional may be a useful starting point and can consider physical as well as psychological explanations.",
          },
          {
            type: "paragraph",
            text: "Urgent assessment is important if a person is at risk of suicide or self-harm, is severely confused or disoriented, experiences serious changes in perception or behavior with safety concerns, is unable to meet basic safety needs, or has serious physical symptoms. Contact local emergency services or go to the nearest emergency department where possible. Locally specific phone numbers must be verified before publication.",
          },
        ],
      },
      {
        number: "1.12",
        id: "section-1-12",
        title: "Contextual examples for readers in Rwanda",
        blocks: [
          {
            type: "paragraph",
            text: "Example A: A learner under examination pressure. A learner feels tense, sleeps poorly before tests and begins thinking they are incapable. A supportive response could include discussing study priorities with a trusted educator, making a realistic schedule, taking rest where possible and seeking further help if distress remains high or functioning deteriorates.",
          },
          {
            type: "paragraph",
            text: "Example B: A young adult facing unemployment. A person searching for work feels discouraged and isolated. Their feelings make sense in a difficult situation. Support may involve emotional connection, job-search assistance and access to relevant social or health services. It would be unfair to suggest that their circumstances are caused by insufficient positivity.",
          },
          {
            type: "paragraph",
            text: "Example C: An adult managing family responsibilities. A caregiver feels exhausted and cannot concentrate. A useful response might include practical redistribution of tasks, checking for physical health concerns, and speaking with a trained health professional if symptoms persist.",
          },
          {
            type: "paragraph",
            text: "These are fictional teaching examples, not case histories. They should be checked with local readers for clarity and relevance.",
          },
        ],
      },
      {
        number: "1.13",
        id: "section-1-13",
        title: "Guided personal reflection",
        blocks: [
          {
            type: "paragraph",
            text: "This is an optional educational exercise, not a screening test. You do not need to write names, diagnoses or private experiences. Skip any prompt that feels uncomfortable.",
          },
          {
            type: "list",
            items: [
              "What situations currently make it easier for me to feel supported or connected?",
              "What pressures are affecting my wellbeing? Which are under my influence and which require external support?",
              "Who is one safe person or service I could approach if I wanted support?",
              "What is one realistic, small action I could take this week?",
              "If a challenge is beyond my control, what practical assistance would make a difference?",
            ],
          },
          {
            type: "paragraph",
            text: "You can keep your answers private. If completing the reflection increases distress, stop and return to a safe everyday activity or speak with someone you trust.",
          },
        ],
      },
      {
        number: "1.14",
        id: "section-1-14",
        title: "Knowledge check and answers",
        blocks: [
          {
            type: "questions",
            items: [
              {
                question:
                  "Question 1. Does good mental health mean never feeling sad, angry or worried?",
                answer:
                  "No. Emotions are part of life, and mental wellbeing is broader than a constant positive mood.",
              },
              {
                question:
                  "Question 2. Can someone have a diagnosed mental health condition and still experience wellbeing?",
                answer:
                  "Yes. A condition does not erase a person's abilities, relationships or potential for meaningful life.",
              },
              {
                question:
                  "Question 3. Can a short checklist diagnose mental illness?",
                answer:
                  "No. Diagnosis requires an appropriate professional assessment of symptoms, context, physical health and functioning.",
              },
              {
                question:
                  "Question 4. Are mental health difficulties only caused by personal choices?",
                answer:
                  "No. Biological, psychological, social and structural influences can all contribute.",
              },
              {
                question:
                  "Question 5. Must a person wait for a crisis before asking for help?",
                answer:
                  "No. Early support is appropriate whenever distress or difficulties deserve attention.",
              },
            ],
          },
        ],
      },
      {
        number: "1.15",
        id: "section-1-15",
        title: "Chapter summary",
        blocks: [
          {
            type: "paragraph",
            text: "Mental health is part of everyone's health and dignity. It changes across life and reflects interacting physical, emotional, relationship and environmental influences. Normal emotions should not be automatically labeled as illness, but persistent or severe symptoms should not be ignored. Support can include self-care, practical help, strong communities and professional healthcare. No one has to prove that they are unwell enough to deserve compassion.",
          },
        ],
      },
    ],
    references: [
      {
        number: 1,
        text: "World Health Organization. Mental health. Fact sheet, 11 September 2026.",
        url: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
        checkedAt: "2026-11-09",
      },
      {
        number: 2,
        text: "World Health Organization. World mental health report: transforming mental health for all. 2022.",
        url: "https://www.who.int/publications/i/item/9789240049338",
        checkedAt: "2026-11-09",
      },
      {
        number: 3,
        text: "World Health Organization. Doing What Matters in Times of Stress: An Illustrated Guide. 2020.",
        url: "https://www.who.int/publications/i/item/9789240003927",
        checkedAt: "2026-11-09",
      },
      {
        number: 4,
        text: "World Health Organization. Psychological self-help interventions: delivering self-help for individuals. 1 June 2026.",
        url: "https://www.who.int/publications/i/item/9789240120785",
        checkedAt: "2026-11-09",
      },
    ],
    referenceNotes: [
      "The chapter is original educational writing informed by these sources, not a reproduction or licensed translation of their text. Any future direct adaptation should follow the relevant source licence.",
    ],
    editorialReview: [
      {
        type: "paragraph",
        text: "The previous 28-page handbook has 18 chapters, introductory explanations, simple examples, and a basic safety note. Most chapters are approximately 250-375 words. The structure is useful, but the material is too short to function as a complete standalone educational lesson.",
      },
      {
        type: "table",
        headers: ["Dimension", "Finding", "Required revision"],
        rows: [
          [
            "Depth",
            "Topics often presented on one page",
            "Expand concepts, context, examples and learning activities",
          ],
          [
            "Evidence",
            "Reference list without systematic inline mapping",
            "Place authoritative references alongside claims and chapter bibliography",
          ],
          [
            "Safety",
            "General warning included",
            "Add signs for routine care, urgent care and self-help limitations",
          ],
          [
            "Learning",
            "Some reflection prompts",
            "Define objectives, recap and answers to knowledge checks",
          ],
          [
            "Local relevance",
            "Limited context",
            "Use inclusive Rwanda-relevant examples and professionally validate terminology",
          ],
          [
            "Publication",
            "Not clinically reviewed",
            "Require clinical, language and accessibility approval",
          ],
        ],
      },
      {
        type: "paragraph",
        text: "Editorial decision: Retain the 18-chapter scope. Expand chapters one at a time, starting with the fundamentals, and review each before publication.",
      },
    ],
    approval: [
      {
        type: "list",
        items: [
          "Clinical reviewer checks accuracy, scope, referral and safety language.",
          "Rwanda-based readers assess examples, clarity and inclusive terminology.",
          "Kinyarwanda and French translations are reviewed by qualified language and mental health reviewers.",
          "Accessibility review includes reading level, heading structure, contrast and screen-reader usability.",
          "Local service directory and emergency routes are verified and dated.",
          "Each published version records reviewer, approval date, evidence sources and next review date.",
        ],
      },
      {
        type: "paragraph",
        text: "Status: Draft for review. Not a clinical protocol and not approved for publication.",
      },
    ],
    worksheetUrl: "/learning/mental-health/chapter-01-reflection.txt",
  },
  {
    number: 2,
    slug: "recognizing-emotions-and-responding-to-them",
    title: "Recognizing Emotions and Responding to Them",
    originalFilename:
      "VUGA_NDAKUMVA_Mental_Health_Expanded_Chapter_02_Emotions.pdf",
    summary:
      "Learn about emotional experiences, practical responses, safe communication, and when additional support may be useful.",
    timeLabel: "Suggested study time",
    studyTime: "35-50 minutes plus optional exercises",
    referenceHeading: "Evidence and editorial references",
    editorialHeading: "Pre-publication approval checklist",
    reflectionSection: "2.15",
    image: "mental-health-listening",
    position: "43% 38%",
    version: "1.1",
    date: "2026-11-09",
    language: "English master draft",
    author: "VUGA NDAKUMVA",
    pdfUrl: "/learning/mental-health/chapter-02-emotions.pdf",
    sourcePages: 7,
    frontMatter: [
      "Audience: General adult readers and older adolescents with appropriate support. Suggested study time: 35-50 minutes plus optional exercises.",
      "Purpose: This standalone chapter teaches readers to identify, understand, express and respond to emotions using safe, practical approaches. It is exclusively about mental health and emotional wellbeing.",
      "Editorial status: Evidence-informed original educational material. This chapter has not yet received clinical review, Kinyarwanda/French localization, accessibility testing or approval for public release. It does not diagnose or provide individual therapy.",
      "Safety: If you are in immediate danger or may harm yourself or another person, seek urgent in-person assistance or local emergency care. Local contact details must be checked before publication.",
    ],
    goals: [
      "Identify common emotions and explain how emotions, thoughts, physical sensations and actions interact.",
      "Recognize that emotions have useful information but do not always represent facts or instructions.",
      "Practise naming feelings and choosing safe responses to them.",
      "Distinguish emotional expression from harmful behavior, suppression and avoidance.",
      "Apply simple grounding, self-kindness and communication skills without treating them as a replacement for healthcare.",
      "Recognize when emotional difficulties warrant routine or urgent professional assistance.",
    ],
    sections: [
      {
        number: "2.1",
        id: "section-2-1",
        title: "What are emotions?",
        blocks: [
          {
            type: "paragraph",
            text: "Emotions are experiences that can involve feelings, bodily changes, thoughts, urges and outward behavior. They often arise when we interpret an event as important: something feels threatening, unfair, disappointing, joyful, surprising or meaningful. For example, after hearing good news a person may feel delighted, smile and want to tell someone; after receiving criticism the same person may feel embarrassed, notice tension and want to withdraw.",
          },
          {
            type: "paragraph",
            text: "Emotions are not signs of moral success or failure. Anger does not make a person dangerous; sadness does not make them weak; fear does not prove that a threat is present. What matters is how a person understands their experience and how they choose to behave. Emotions can be mixed or unclear: someone may feel proud about a new opportunity and worried about the responsibility at the same time.",
          },
          {
            type: "paragraph",
            text: "Different people show emotions differently, and cultural expectations may shape which feelings are openly discussed. Not showing an emotion does not mean the person does not experience it. Equally, another person cannot reliably identify a hidden feeling merely from facial expression or behavior.",
          },
        ],
      },
      {
        number: "2.2",
        id: "section-2-2",
        title: "Emotional experiences: more than one feeling",
        blocks: [
          {
            type: "table",
            headers: [
              "Emotion",
              "What it may signal",
              "Example of a helpful response",
            ],
            rows: [
              [
                "Joy",
                "Something valued or enjoyable has happened",
                "Notice and enjoy it; share if you wish",
              ],
              [
                "Sadness",
                "Loss, disappointment or unmet needs",
                "Allow the feeling; consider comfort or support",
              ],
              [
                "Fear",
                "A possible threat or uncertainty",
                "Check present safety and available options",
              ],
              [
                "Anger",
                "A perceived injustice or boundary issue",
                "Pause, examine the situation and respond safely",
              ],
              [
                "Shame",
                "Concern about negative judgment or self-worth",
                "Challenge harsh labels and seek understanding",
              ],
              [
                "Guilt",
                "Concern about a specific action",
                "Consider repair when appropriate, without self-punishment",
              ],
              [
                "Loneliness",
                "A need for connection or belonging",
                "Reach out to safe people or services",
              ],
            ],
          },
          {
            type: "paragraph",
            text: 'These examples are possibilities, not fixed meanings. A feeling can have several causes. Someone might be irritable because of stress, lack of sleep, illness or something else entirely. It can help to ask, "What else may be happening?" before drawing conclusions.',
          },
        ],
      },
      {
        number: "2.3",
        id: "section-2-3",
        title: "How emotions, thoughts, the body and behavior connect",
        blocks: [
          {
            type: "paragraph",
            text: 'Imagine an adult whose supervisor has asked for a meeting. The event is simple: "There is a meeting tomorrow." One possible thought is, "I must be in trouble." That interpretation may bring fear, tight shoulders and an urge to avoid the meeting. Another thought could be, "I do not know what this is about yet." The person may still feel nervous but be more able to prepare and attend.',
          },
          {
            type: "paragraph",
            text: "In this example, the event, interpretation, feeling, physical sensation and action influence one another. People cannot always choose the first emotion they experience, but they may be able to choose a next step. A realistic response could be to gather facts, practise a calming skill or ask for clarification. It is not necessary to force a positive thought or deny a genuine problem.",
          },
        ],
      },
      {
        number: "2.4",
        id: "section-2-4",
        title: "Naming an emotion: a practical starting point",
        blocks: [
          {
            type: "paragraph",
            text: "Noticing and naming a feeling can create a small space between an experience and an action. WHO stress-management materials use related skills of noticing, naming and returning attention to what matters. The goal is not to eliminate emotions; it is to become more aware and less automatically pulled by them. [1]",
          },
          {
            type: "paragraph",
            text: 'A five-part check-in: (1) Pause briefly if it is safe. (2) Notice what is happening in your body and thoughts. (3) Use a simple label such as "worried," "hurt," "frustrated" or "not sure." (4) Ask what you might need: information, rest, connection, protection or professional guidance. (5) Choose one safe next action.',
          },
          {
            type: "paragraph",
            text: 'A person who cannot name the feeling is not failing the exercise. "Something feels difficult" is a valid starting point. Some people find writing or talking easier than identifying emotions silently. Others prefer drawing, movement or quiet time.',
          },
        ],
      },
      {
        number: "2.5",
        id: "section-2-5",
        title: "Emotions and needs: listening without obeying every urge",
        blocks: [
          {
            type: "paragraph",
            text: "Emotions can direct attention to important needs, but the first urge may not be wise. Anger may reflect a wish to be respected, yet shouting or striking someone would still be harmful. Fear may encourage caution, but avoidance of every uncertain situation can gradually narrow daily life. Sadness may signal a need for comfort, but withdrawing completely for weeks may leave someone without support.",
          },
          {
            type: "paragraph",
            text: 'Consider two separate questions: "What information might this emotion contain?" and "What response would protect my wellbeing and respect other people?" The answers may be different. A safe response to anger might be to ask for space, clarify a boundary, seek mediation or leave an escalating situation.',
          },
        ],
      },
      {
        number: "2.6",
        id: "section-2-6",
        title: "Emotional regulation: what it means and what it does not",
        blocks: [
          {
            type: "paragraph",
            text: "Emotional regulation refers to ways people influence their emotional responses and behavior. It does not mean staying calm all the time, suppressing tears, or never expressing anger. Regulation can include changing a situation, shifting attention, considering other explanations, accepting a feeling, asking for support, and responding according to personal values.",
          },
          {
            type: "paragraph",
            text: "Strategies depend on context. When a person is unsafe, finding protection may matter more than using a relaxation technique. When emotions arise from exhaustion, sleep or practical support may be necessary. When distress is severe or persistent, professional care may be more appropriate than self-help alone.",
          },
        ],
      },
      {
        number: "2.7",
        id: "section-2-7",
        title: "Skill A: grounding in the present",
        blocks: [
          {
            type: "paragraph",
            text: "Grounding is a way to reconnect with the current environment when overwhelmed by thoughts or strong feelings. It is optional. WHO describes grounding as noticing thoughts and feelings, connecting with the body, and refocusing on the surroundings. [1]",
          },
          {
            type: "list",
            items: [
              "Choose a position that feels safe; keep your eyes open if you prefer.",
              "Notice the contact between your feet and the floor or between your body and the chair.",
              "Quietly identify two or three things you can see or hear.",
              "Notice one simple activity you can do next, such as drinking water or returning to a task.",
              "Stop if this brings increased discomfort, dissociation or a sense of danger. Choose another supportive action or seek help.",
            ],
          },
          {
            type: "paragraph",
            text: "You do not need to breathe deeply, relive a painful memory or complete the exercise perfectly. For some people, focusing on the body is uncomfortable; noticing external objects may feel safer. Grounding is a coping tool, not a cure for a mental health condition.",
          },
        ],
      },
      {
        number: "2.8",
        id: "section-2-8",
        title: "Skill B: allowing feelings without surrendering to them",
        blocks: [
          {
            type: "paragraph",
            text: 'Trying to force a painful emotion away may sometimes intensify struggle. A different approach is to acknowledge that it is present: "I notice sadness" or "This is a difficult moment." WHO describes a related skill called "making room" for difficult thoughts and feelings. [1]',
          },
          {
            type: "paragraph",
            text: 'For a brief practice, notice a manageable feeling without investigating it in depth. Say, if useful, "I can notice this feeling and still choose what I do next." Return attention to something safe and ordinary. If the practice increases distress, stop. People who experience trauma-related symptoms or intense dissociation may need tailored clinical guidance rather than independent exercises.',
          },
        ],
      },
      {
        number: "2.9",
        id: "section-2-9",
        title: "Skill C: responding to self-critical thoughts",
        blocks: [
          {
            type: "paragraph",
            text: 'When upset, people sometimes criticize themselves: "I am useless," "I always fail," or "I should never feel this way." Such statements are thoughts, not proven facts. A more balanced response might be, "I made a mistake; I can decide what to learn and what help I need." Self-kindness does not require excusing harmful actions or pretending there are no consequences.',
          },
          {
            type: "paragraph",
            text: "Try speaking to yourself as you would speak to a respected person facing the same challenge. Notice one specific difficulty, acknowledge it without insults, and identify a constructive next step. WHO includes self-kindness among its everyday stress-management skills. [1]",
          },
        ],
      },
      {
        number: "2.10",
        id: "section-2-10",
        title: "Skill D: expressing feelings in a safe conversation",
        blocks: [
          {
            type: "paragraph",
            text: 'Expressing feelings can support understanding and connection, but disclosure should be voluntary and directed toward a safe person. A simple communication pattern is: "When [situation] happened, I felt [emotion]. I would appreciate [specific request]." For example: "When our plans changed without warning, I felt frustrated. Could we discuss changes earlier next time?"',
          },
          {
            type: "paragraph",
            text: "This phrasing helps describe experience without asserting that the other person intended harm. It does not guarantee agreement, and it should not be used to confront someone who could react violently. In unsafe circumstances, seek support or a safer communication channel rather than attempting a direct discussion.",
          },
        ],
      },
      {
        number: "2.11",
        id: "section-2-11",
        title: "Skill E: pause before acting on intense emotion",
        blocks: [
          {
            type: "paragraph",
            text: "A strong emotion can create urgency. When possible, a brief pause may prevent choices that lead to regret. First, check whether you are physically safe. Next, notice the impulse without acting immediately. If appropriate, step away from an argument, drink water, or ask for time. Then consider what matters most: safety, dignity, fairness, relationships or solving the practical problem.",
          },
          {
            type: "paragraph",
            text: "This technique does not mean delaying an essential safety action. When facing immediate danger, prioritise getting to safety and contacting appropriate help. When there is risk of harming someone, disengage from the situation if safe and obtain urgent support.",
          },
        ],
      },
      {
        number: "2.12",
        id: "section-2-12",
        title: "Practical examples in daily life",
        blocks: [
          {
            type: "paragraph",
            text: 'Example 1: A learner receives disappointing results. The learner feels ashamed and thinks, "Everyone will judge me." They may name embarrassment, talk with a trusted educator and make a realistic study plan. The goal is not to deny disappointment but to reduce self-blame and find a way forward.',
          },
          {
            type: "paragraph",
            text: "Example 2: A caregiver feels angry and exhausted. An adult caring for relatives feels irritation when interrupted. Rather than responding harshly, they acknowledge fatigue and ask whether someone can share a task. If no help is available, they may need external practical support, not simply advice to remain patient.",
          },
          {
            type: "paragraph",
            text: "Example 3: A young adult feels isolated. Someone who recently moved to another district misses familiar people. They recognize loneliness and explore a safe way to reconnect, such as messaging a trusted friend or attending an activity that suits their interests. If withdrawal and low mood persist, professional support may be useful.",
          },
          {
            type: "paragraph",
            text: "Example 4: A person feels frightened after a conflict. Before considering emotional exercises, they ask whether the situation is physically safe. Where there is danger, they prioritize protection, safe contacts and appropriate services. Emotional coping is not a substitute for physical safety.",
          },
          {
            type: "paragraph",
            text: "These are fictional teaching situations, not actual case histories. Local reviewers should check that examples are respectful, understandable and relevant across Rwanda.",
          },
        ],
      },
      {
        number: "2.13",
        id: "section-2-13",
        title: "Common misunderstandings",
        blocks: [
          {
            type: "table",
            headers: ["Misunderstanding", "More accurate understanding"],
            rows: [
              [
                '"Negative" emotions should always be removed.',
                "Unpleasant emotions may carry information and are part of life; safe responses matter.",
              ],
              [
                "Feeling angry means acting aggressively.",
                "An emotion and an action are different. Anger can be managed without harm.",
              ],
              [
                "A calm appearance means a person is fine.",
                "People may experience strong emotions privately or express them differently.",
              ],
              [
                "A coping exercise always works.",
                "Some techniques help some people in some settings; adaptation and support may be needed.",
              ],
              [
                "Opening up to anyone is always healthy.",
                "Choose safe, trustworthy people. Privacy and personal choice matter.",
              ],
            ],
          },
        ],
      },
      {
        number: "2.14",
        id: "section-2-14",
        title: "When should someone seek additional help?",
        blocks: [
          {
            type: "paragraph",
            text: "Consider support from a qualified healthcare or mental health professional when emotional distress continues, becomes harder to manage, disrupts sleep or functioning, causes increasing isolation, or leads to harmful coping patterns. Also seek assessment for symptoms that may have a medical cause, such as substantial unexplained changes in energy or new physical problems. Asking for help early is reasonable; a person does not need a diagnosis to deserve support.",
          },
          {
            type: "paragraph",
            text: "Urgent help: If emotions are accompanied by thoughts of suicide, intent to self-harm, threats of serious harm toward others, severe confusion, inability to maintain safety, or other immediate dangers, seek urgent in-person assistance. Contact verified local emergency services or go to an emergency department when possible. This educational document is not a crisis response service.",
          },
        ],
      },
      {
        number: "2.15",
        id: "section-2-15",
        title: "Guided self-reflection worksheet",
        blocks: [
          {
            type: "paragraph",
            text: "Complete this only if it feels comfortable. Do not record identifying or sensitive details if the worksheet could be seen by others. It is not a screening or diagnostic tool.",
          },
          {
            type: "list",
            items: [
              "Situation: Describe an ordinary recent event in one sentence, without names or private details.",
              'Feeling: What emotion or combination of emotions did you notice? "Not sure" is acceptable.',
              "Body: Did you notice tension, restlessness, tiredness or another sensation? You may skip this.",
              "Thought: What was going through your mind? Could there be other explanations?",
              "Need: Did you need rest, clarity, connection, safety, practical assistance or something else?",
              "Response: What is one safe next step you could choose?",
              "Support: Who or what could help if the situation continues?",
            ],
          },
          {
            type: "paragraph",
            text: "Optional seven-day practice: Once a day, note one emotion, one possible cause and one safe response. Do not score yourself or aim to feel happy every day. If repeated monitoring makes you more anxious or distressed, discontinue it.",
          },
        ],
      },
      {
        number: "2.16",
        id: "section-2-16",
        title: "Knowledge check with explained answers",
        blocks: [
          {
            type: "questions",
            items: [
              {
                question:
                  "1. True or false: Feeling afraid always means immediate danger.",
                answer:
                  "False. Fear may help identify threats, but it may also arise in anticipation or uncertainty. Check the facts and your current safety.",
              },
              {
                question: "2. Can someone feel two emotions at once?",
                answer:
                  "Yes. For instance, relief and sadness may occur together after a difficult change.",
              },
              {
                question: "3. Does emotional regulation mean never crying?",
                answer:
                  "No. It is about responding safely and flexibly, not suppressing every emotional expression.",
              },
              {
                question:
                  "4. If grounding makes someone more distressed, should they continue?",
                answer:
                  "No. They can stop, choose another supportive activity and seek appropriate advice if needed.",
              },
              {
                question: "5. When is professional support appropriate?",
                answer:
                  "Whenever distress is persistent, worsening, impairing daily life or difficult to manage, and immediately when serious safety risks are present.",
              },
            ],
          },
        ],
      },
      {
        number: "2.17",
        id: "section-2-17",
        title: "Chapter summary",
        blocks: [
          {
            type: "paragraph",
            text: "Emotions are complex human experiences that can influence thoughts, bodily sensations and actions. No emotion by itself defines a person. Learning to notice, name and respond to emotions can support everyday wellbeing. Helpful responses include checking safety, choosing practical next steps, communicating with safe people, treating oneself with dignity and accessing professional support when needed. Self-help tools are optional supports, not substitutes for treatment or protection.",
          },
        ],
      },
      {
        number: "2.18",
        id: "section-2-18",
        title: "Terms and meanings",
        blocks: [
          {
            type: "table",
            headers: ["Term", "Plain-language meaning"],
            rows: [
              [
                "Emotion",
                "An experience that can include feeling, body responses, thoughts and urges.",
              ],
              [
                "Emotional awareness",
                "Recognizing and naming what one is experiencing.",
              ],
              [
                "Emotional regulation",
                "Ways of responding to emotions and guiding behavior in context.",
              ],
              [
                "Grounding",
                "Returning attention to the present environment when overwhelmed.",
              ],
              [
                "Self-kindness",
                "Responding to oneself with care rather than insults or harsh judgment.",
              ],
              [
                "Psychological distress",
                "Difficult emotions or thoughts; not automatically a disorder.",
              ],
            ],
          },
        ],
      },
    ],
    references: [
      {
        number: 1,
        text: "World Health Organization (2020). Doing What Matters in Times of Stress: An Illustrated Guide. WHO, ISBN 978-92-4-000391-0.",
        url: "https://tdr.who.int/home/our-work/global-engagement/9789240003927",
        checkedAt: "2026-11-09",
      },
      {
        number: 2,
        text: "World Health Organization. Mental health: strengthening our response. General context for wellbeing, risk and protective conditions.",
        url: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
        checkedAt: "2026-11-09",
      },
    ],
    referenceNotes: [
      "This chapter is original explanatory material informed by the above resources, not a reproduction of WHO exercises or a clinical protocol. The examples, communication pattern and worksheets are educational adaptations and should be clinically assessed prior to public use.",
    ],
    editorialReview: [],
    approval: [
      {
        type: "list",
        items: [
          "Clinical reviewer verifies definitions, coping suggestions, warning signs and referral language.",
          "Safety specialist confirms the advice does not unintentionally increase risk in unsafe situations.",
          "Rwanda-based language reviewers validate terminology and examples in English, Kinyarwanda and French.",
          "Accessible formats and reading-level tests are completed with intended users.",
          "Emergency and routine referral contacts are verified, dated and maintained.",
          "A named editor approves final version and schedules review after major evidence changes.",
        ],
      },
    ],
    worksheetUrl: "/learning/mental-health/chapter-02-reflection.txt",
  },
];
