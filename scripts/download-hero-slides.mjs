import sharp from "sharp";
import { writeFile } from "node:fs/promises";
const photos = [
  {
    name: "hero-yoga",
    id: "photo-1544367567-0f2fcb009e0b",
    description: "A sunlit yoga practice",
  },
  {
    name: "hero-meditation",
    id: "photo-1506126613408-eca07ce68773",
    description: "Quiet outdoor meditation",
  },
  {
    name: "hero-movement",
    id: "photo-1518611012118-696072aa579a",
    description: "Mindful movement in a bright studio",
  },
  {
    name: "hero-nature",
    id: "photo-1472396961693-142e6e269027",
    description: "Sunlit woodland and nature",
  },
];
const results = await Promise.allSettled(
  photos.map(async (photo) => {
    const url = `https://images.unsplash.com/${photo.id}?auto=format&fit=crop&w=2400&q=90`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${photo.name}: ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const meta = await sharp(buffer).metadata();
    if (meta.width < 1920)
      throw new Error(`${photo.name}: image is smaller than HD`);
    await sharp(buffer)
      .rotate()
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(`public/images/${photo.name}.webp`);
    return { ...photo, url, width: meta.width, height: meta.height };
  }),
);
for (const r of results) {
  if (r.status === "fulfilled") console.log(r.value);
  else console.error(r.reason);
}
if (results.some((r) => r.status === "rejected")) process.exitCode = 1;
await writeFile(
  "public/images/hero-slide-credits.json",
  JSON.stringify(
    results.filter((r) => r.status === "fulfilled").map((r) => r.value),
    null,
    2,
  ),
);
