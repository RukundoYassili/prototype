import sharp from "sharp";
const names = [
  "hero",
  "hero-yoga",
  "hero-meditation",
  "hero-movement",
  "hero-nature",
];
const tiles = await Promise.all(
  names.map(async (name, i) => ({
    input: await sharp(`public/images/${name}.webp`)
      .resize(400, 240, { fit: "cover" })
      .png()
      .toBuffer(),
    left: (i % 2) * 410,
    top: Math.floor(i / 2) * 250,
  })),
);
await sharp({
  create: { width: 820, height: 750, channels: 3, background: "#ddd" },
})
  .composite(tiles)
  .png()
  .toFile("artifacts/hero-slides-review.png");
