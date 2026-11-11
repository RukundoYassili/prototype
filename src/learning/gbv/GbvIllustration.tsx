import { useState } from "react";

interface GbvArtwork {
  file: string;
  alt: string;
}

// Landing-page artwork only; source chapters and teaching scenes stay separate.
export const gbvCovers: Record<string, GbvArtwork> = {
  "understanding-gender-based-violence": {
    file: "01-choice-and-connection",
    alt: "Illustration of an adult considering learning materials while a companion leaves the choices in her hands.",
  },
  "types-and-forms-of-gender-based-violence": {
    file: "02-connected-forms",
    alt: "Illustration connecting a home, conversation shapes, financial papers and a phone around one person, reflecting different areas of everyday life.",
  },
  "root-causes-risk-factors-and-gender-inequality": {
    file: "03-opportunity-and-responsibility",
    alt: "Illustration of community members discussing a model with unequal routes to a shared doorway, a metaphor for access to opportunities.",
  },
  "understanding-consent-boundaries-and-bodily-autonomy": {
    file: "04-space-and-consent",
    alt: "Illustration of a young adult expressing a preference while another listens and respects their personal space.",
  },
  "domestic-violence-and-intimate-partner-violence": {
    file: "05-private-support",
    alt: "Illustration of an adult man speaking privately with a woman who listens at equal level, without taking over.",
  },
  "sexual-violence-harassment-and-exploitation": {
    file: "06-care-and-dignity",
    alt: "Illustration of a fully clothed adult considering information with an attentive healthcare professional in a consultation room.",
  },
  "emotional-psychological-and-verbal-abuse": {
    file: "07-heard-and-respected",
    alt: "Illustration of a woman speaking with an attentive friend, with abstract conversation shapes in the background.",
  },
  "economic-violence-and-financial-control": {
    file: "08-resources-and-choice",
    alt: "Illustration of a trader reviewing her own ledger, documents, money pouch and phone while a supporter listens nearby.",
  },
  "technology-facilitated-and-online-gender-based-violence": {
    file: "09-digital-options",
    alt: "Illustration of a young adult discussing options with a trusted person while a phone and closed laptop remain unused.",
  },
  "gender-based-violence-against-children-and-adolescents": {
    file: "10-listening-to-young-people",
    alt: "Illustration of an adolescent speaking with a trusted adult seated at the same eye level, with space between them.",
  },
};

export const gbvHero: GbvArtwork = {
  file: "hero-dignity-and-space",
  alt: "Illustration of two Black African adults seated in their own space in a courtyard, one holding her notebook and the other listening, with a reader further away.",
};

export function GbvIllustration({
  artwork,
  priority = false,
  compact = false,
}: {
  artwork: GbvArtwork;
  priority?: boolean;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const base = `/images/learning/gbv-covers/${artwork.file}`;
  if (failed) {
    return (
      <span className="gbv-art-fallback" role="img" aria-label={artwork.alt}>
        Illustration unavailable. {artwork.alt}
      </span>
    );
  }
  return (
    <img
      className="gbv-illustration"
      src={`${base}-960.webp`}
      srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1440.webp 1440w`}
      sizes={
        compact
          ? "(max-width: 680px) calc(100vw - 80px), 300px"
          : priority
            ? "(max-width: 680px) calc(100vw - 80px), (max-width: 1000px) calc((100vw - 132px) / 2), (max-width: 1280px) calc((100vw - 172px) / 2), 544px"
            : "(max-width: 680px) calc(100vw - 74px), (max-width: 1280px) calc((100vw - 148px) / 2), 566px"
      }
      width={1536}
      height={1024}
      alt={artwork.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
