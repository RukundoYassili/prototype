interface MentalHealthCoverAsset {
  file: string;
  alt: string;
}

// Library-only artwork. Source records and internal lesson visuals are unchanged.
export const mentalHealthCovers: Record<string, MentalHealthCoverAsset> = {
  "understanding-mental-health-and-wellbeing": {
    file: "01-everyday-connections",
    alt: "Illustration of three adults, including a wheelchair user, sharing small gardening tasks in a community courtyard.",
  },
  "recognizing-emotions-and-responding-to-them": {
    file: "02-emotions-and-choice",
    alt: "Illustration of three young adults with frustrated, thoughtful, and attentive expressions, leaving one another space to pause and listen.",
  },
  "understanding-stress-and-healthy-coping-strategies": {
    file: "03-demands-and-practical-help",
    alt: "Illustration of a tired adult and a relative planning one task together while household responsibilities remain nearby.",
  },
  "understanding-anxiety-and-anxiety-disorders": {
    file: "04-worry-and-a-calm-companion",
    alt: "Illustration of a worried young adult holding a folder on a courtyard bench, with a calm companion listening nearby.",
  },
  "understanding-depression-and-depressive-disorders": {
    file: "05-low-energy-and-quiet-company",
    alt: "Illustration of a tired adult sitting at home while a trusted person offers quiet company, with food and water nearby.",
  },
  "understanding-trauma-and-post-traumatic-stress": {
    file: "06-space-choice-and-support",
    alt: "Illustration of an adult choosing a seat near an open doorway, with a companion at a respectful distance and a clear path outside.",
  },
  "understanding-grief-loss-and-emotional-adjustment": {
    file: "07-loss-and-gentle-company",
    alt: "Illustration of a person reflecting on leaving a familiar home, with packed belongings and a friend nearby to offer practical help.",
  },
  "understanding-sleep-and-mental-wellbeing": {
    file: "08-evening-and-rest",
    alt: "Illustration of a woman setting down a book beside her bed at dusk, with her phone and work bag at a separate desk.",
  },
  "relationships-social-connection-and-mental-wellbeing": {
    file: "09-connection-and-boundaries",
    alt: "Illustration of two friends talking in a courtyard, one speaking while the other listens, with comfortable space between their seats.",
  },
  "child-and-adolescent-mental-health": {
    file: "10-young-people-and-trusted-adults",
    alt: "Illustration of a child drawing with an attentive caregiver nearby, and an adolescent talking with an adult educator on separate seats.",
  },
};

export function MentalHealthCover({ chapterSlug }: { chapterSlug: string }) {
  const cover = mentalHealthCovers[chapterSlug];
  if (!cover) return null;
  const base = `/images/learning/mental-health-covers/${cover.file}`;
  return (
    <img
      className="mh-cover-illustration"
      data-chapter-cover={chapterSlug}
      src={`${base}-960.webp`}
      srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1440.webp 1440w`}
      sizes="(max-width: 650px) calc(100vw - 70px), (max-width: 1372px) calc((100vw - 132px) / 2), 610px"
      width={1536}
      height={1024}
      alt={cover.alt}
      loading="lazy"
      decoding="async"
    />
  );
}
