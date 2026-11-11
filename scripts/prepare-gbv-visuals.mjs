import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const directory = "artifacts/gbv-learning";
const output = "public/images/learning/gbv";
await mkdir(output, { recursive: true });
const records = JSON.parse(
  (await readFile(`${directory}/image-prompts.json`, "utf8")).replace(
    /^\uFEFF/,
    "",
  ),
);
if (records.length !== 32 || new Set(records.map((r) => r.id)).size !== 32)
  throw new Error("Expected 32 distinct GBV scenes.");
const scenes = [];
for (const record of records) {
  const source = `${directory}/originals/${record.id}.png`;
  const buffer = await readFile(source);
  const metadata = await sharp(buffer).metadata();
  const files = [];
  for (const width of [640, 1280]) {
    const file = `${output}/${record.id}-${width}.webp`;
    const data = await sharp(buffer)
      .resize(width, (width * 3) / 4, { fit: "cover", position: "centre" })
      .webp({ quality: 84 })
      .toBuffer();
    await writeFile(file, data);
    files.push({
      path: file,
      width,
      height: (width * 3) / 4,
      bytes: data.length,
      sha256: createHash("sha256").update(data).digest("hex"),
    });
  }
  scenes.push({
    ...record,
    source,
    originalToolPath: record.source,
    sourceSha256: createHash("sha256").update(buffer).digest("hex"),
    sourceWidth: metadata.width,
    sourceHeight: metadata.height,
    files,
  });
}
if (new Set(scenes.map((s) => s.sourceSha256)).size !== 32)
  throw new Error("Scenes must have distinct originals.");
await writeFile(
  `${directory}/visual-manifest.json`,
  JSON.stringify(
    {
      collection: "gbv",
      generatedAt: "2026-11-09",
      tool: "built-in image_gen",
      disclosure: "Illustrative fictional example. AI-generated.",
      approval:
        "Educational supplements; specialist publication review remains required.",
      responsiveCrop:
        "Original landscape photograph cropped to 4:3 files; CSS uses 3:2 on mobile with per-scene focal positions.",
      promptSet: `${directory}/image-prompts.json`,
      scenes,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Prepared ${scenes.length} scenes in 64 responsive WebP assets.`);
