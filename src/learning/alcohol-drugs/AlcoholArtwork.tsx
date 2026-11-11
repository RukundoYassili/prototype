import { useState } from "react";

export const alcoholPalettes = [
  { ink: "#164E50", accent: "#C99543", paper: "#F5EBDD" },
  { ink: "#303D72", accent: "#278D96", paper: "#E6F1F5" },
  { ink: "#23394D", accent: "#AE563E", paper: "#F3E6D2" },
  { ink: "#65435F", accent: "#8DA58A", paper: "#F7F0E6" },
];

export const alcoholCoverAlt = [
  "Fictional illustration of an adult declining an offered alcoholic drink at a courtyard gathering, with room for her choice to be respected.",
  "Fictional illustration of a 19-year-old student considering difficulties recalling learning after drinking at a gathering; notebooks and a bottle set apart establish the context, not a diagnosis.",
  "Fictional illustration of an adult and a friend considering alternative transport beside a parked motorcycle after drinking at a gathering.",
  "Fictional illustration of Chantal discussing alcohol-related concerns with a healthcare professional, with her work planner nearby; no diagnosis or outcome is shown.",
];
export function AlcoholArtwork({
  file,
  alt,
  priority = false,
}: {
  file: string;
  alt: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="ad-artwork">
      {failed ? (
        <p role="status">Illustration unavailable. {alt}</p>
      ) : (
        <img
          src={`/images/learning/alcohol-drugs/${file}-1440.webp`}
          srcSet={[480, 960, 1440]
            .map(
              (width) =>
                `/images/learning/alcohol-drugs/${file}-${width}.webp ${width}w`,
            )
            .join(", ")}
          sizes="(max-width: 680px) calc(100vw - 40px), (max-width: 1100px) 50vw, 660px"
          width={1440}
          height={960}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          alt={alt}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
