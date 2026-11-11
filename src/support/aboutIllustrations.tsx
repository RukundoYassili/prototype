type AboutIllustrationId = "listening" | "reading";

interface IllustrationAsset {
  file: string;
  width: number;
  height: number;
  alt: string;
}

export const aboutIllustrations: Record<
  AboutIllustrationId,
  IllustrationAsset
> = {
  listening: {
    file: "listening-together",
    width: 1536,
    height: 1024,
    alt: "Illustration of a Black African child, adults, and an older woman listening to one another in a courtyard.",
  },
  reading: {
    file: "reading-at-your-own-pace",
    width: 1448,
    height: 1086,
    alt: "",
  },
};

/** Full scenes are scaled, never cropped. Empty alt marks supporting decoration. */
export function AboutIllustration({
  name,
  priority = false,
}: {
  name: AboutIllustrationId;
  priority?: boolean;
}) {
  const asset = aboutIllustrations[name];
  const base = `/images/about/${asset.file}`;
  return (
    <img
      className="about-illustration"
      src={`${base}-960.webp`}
      srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1440.webp 1440w`}
      sizes="(max-width: 650px) calc(100vw - 80px), (max-width: 900px) calc(100vw - 132px), (max-width: 1372px) 43vw, 570px"
      width={asset.width}
      height={asset.height}
      alt={asset.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
