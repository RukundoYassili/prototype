import sharp from "sharp";
import { rename } from "node:fs/promises";
await sharp("public/images/hero-meditation.webp")
  .extract({ left: 0, top: 250, width: 2400, height: 1600 })
  .webp({ quality: 82 })
  .toFile("public/images/hero-meditation-optimized.webp");
await rename(
  "public/images/hero-meditation-optimized.webp",
  "public/images/hero-meditation.webp",
);
await sharp("public/images/hero-nature.webp")
  .resize(2400, 1600, { fit: "cover", position: "centre" })
  .webp({ quality: 84 })
  .toFile("public/images/hero-nature-optimized.webp");
await rename(
  "public/images/hero-nature-optimized.webp",
  "public/images/hero-nature.webp",
);
for (const name of [
  "hero",
  "hero-yoga",
  "hero-meditation",
  "hero-movement",
  "hero-nature",
]) {
  const { width, height } = await sharp(
    `public/images/${name}.webp`,
  ).metadata();
  console.log(name, width, height);
}
