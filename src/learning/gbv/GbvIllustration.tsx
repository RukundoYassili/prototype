import { useState } from "react";
import { gbvSeriesCovers } from "./series-art";

interface GbvArtwork {
  file: string;
  alt: string;
}

// Chapter 01 remains unchanged; the remaining covers also appear in their readers.
export const gbvCovers: Record<string, GbvArtwork> = {
  "understanding-gender-based-violence": {
    file: "01-choice-and-connection",
    alt: "Illustration of an adult considering learning materials while a companion leaves the choices in her hands.",
  },
  ...gbvSeriesCovers,
};
// Preserve the existing landing-page supporter scene independently of Chapter 07's cover.
export const gbvSupporterArt: GbvArtwork = {
  file: "07-heard-and-respected",
  alt: "Illustration of a woman speaking with an attentive friend, with abstract conversation shapes in the background.",
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
