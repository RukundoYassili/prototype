import { useState } from "react";
import { awarenessImageBase, type AwarenessArtwork } from "./illustrations";

export function AwarenessIllustration({
  artwork,
  priority = false,
}: {
  artwork: AwarenessArtwork;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const base = awarenessImageBase(artwork);
  return (
    <figure
      className={`awareness-illustration ${priority ? "awareness-illustration-hero" : "awareness-illustration-topic"}`}
    >
      {failed ? (
        <div
          className="awareness-art-unavailable"
          role="img"
          aria-label={artwork.alt}
        >
          Illustration unavailable. The example is described in the accompanying
          text.
        </div>
      ) : (
        <img
          src={`${base}-960.webp`}
          srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1440.webp 1440w`}
          sizes={
            priority
              ? "(max-width: 1000px) calc(100vw - 40px), (max-width: 1372px) 48vw, 630px"
              : "(max-width: 700px) calc(100vw - 88px), 560px"
          }
          width={1536}
          height={1024}
          alt={artwork.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      <figcaption>{artwork.caption}</figcaption>
    </figure>
  );
}
