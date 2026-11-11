import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const source = process.argv[2] || "artifacts/reference.webp";
await mkdir("public/images", { recursive: true });
const { width, height } = await sharp(source).metadata();
console.log({ width, height });
const crops = {
  professional: [215, 429, 113, 134],
  pregnant: [340, 429, 132, 82],
  mindfulness: [55, 575, 132, 65],
  kindness: [198, 575, 131, 65],
  hands: [340, 575, 132, 65],
  event: [56, 835, 118, 105],
  exercise: [302, 835, 170, 79],
  environment: [244, 1138, 176, 76],
  stretch: [217, 1351, 256, 110],
  story: [55, 1690, 103, 122],
  footer: [42, 1855, 220, 110],
  "avatar-1": [195, 846, 20, 25],
  "avatar-2": [217, 846, 19, 25],
  "avatar-3": [240, 846, 20, 25],
  "avatar-4": [262, 846, 20, 25],
};
for (const [name, [x, y, w, h]] of Object.entries(crops)) {
  await sharp(source)
    .extract({
      left: Math.round((x * width) / 521),
      top: Math.round((y * height) / 2048),
      width: Math.round((w * width) / 521),
      height: Math.round((h * height) / 2048),
    })
    .webp({ quality: 95 })
    .toFile(`public/images/${name}.webp`);
}
await writeFile(
  "public/images/asset-provenance.json",
  JSON.stringify(
    {
      source: "User-supplied original-c827749b6fcb0053e6a0a6cda3516413.webp",
      method:
        "Photo crops from flattened screenshot; no generation or stock substitution.",
      referenceSize: [521, 2048],
      crops,
    },
    null,
    2,
  ),
);
