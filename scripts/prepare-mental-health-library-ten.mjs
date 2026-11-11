import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = "artifacts/mental-health-library-ten";
const output = "public/images/learning/mental-health-covers";
const previous = JSON.parse(
  await readFile(
    "artifacts/mental-health-library-refresh/illustration-manifest.json",
    "utf8",
  ),
);
const briefs = JSON.parse(await readFile(`${root}/briefs.json`, "utf8"));
const chapters = JSON.parse(await readFile(`${root}/chapters.json`, "utf8"));
const notes = {
  8: "Reviewed: clear dusk and rest context, neutral expression, complete limbs and ordinary furniture. The scene suggests one optional evening moment, not guaranteed sleep or treatment. Full scene remains visible on mobile.",
  9: "Reviewed: two adult peers, attentive expressions, clear personal space, purposeful open gesture and no intrusive touch. Connection is voluntary, not a claim that every relationship is protective. Full scene remains visible on mobile.",
  10: "Reviewed: a primary-school-aged child, adolescent, caregiver and educator are visually distinct. Adults listen at appropriate levels; both interactions retain personal space. No harm, diagnosis, reenactment or responsibility placed on children. Full scene remains visible on mobile.",
};
const generatedFiles = {
  8: "exec-58c19625-2f32-4d1c-a493-9238cc3f101d.png",
  9: "exec-6aebe1f4-2a7f-4104-9247-7f24a0852f96.png",
  10: "exec-836e64ee-5660-490e-adec-41142d0fc601.png",
};
const assets = [
  ...previous.assets.map((a) => ({ ...a, reused: true })),
  ...briefs.assets.map((a) => ({
    ...a,
    original: `${root}/originals/${a.id}.png`,
    generatedPath: `C:/Users/VUGANDAKUMVA/.codex/generated_images/01a1ba7b-465d-7752-a789-c3dd761b29b7/${generatedFiles[a.chapter]}`,
    styleReference: briefs.styleReference,
    reused: false,
    review: notes[a.chapter],
  })),
];
await mkdir(output, { recursive: true });
const records = [];
for (const asset of assets) {
  const original = await readFile(asset.original);
  const hash = createHash("sha256").update(original).digest("hex");
  const { width, height } = await sharp(original).metadata();
  if (width / height !== 1.5)
    throw new Error(`Expected uncropped 3:2 artwork: ${asset.id}`);
  const variants = [];
  for (const size of [480, 960, 1440]) {
    const path = `${output}/${asset.id}-${size}.webp`;
    // Preserve the seven accepted covers byte-for-byte.
    if (!asset.reused)
      await sharp(original)
        .resize({ width: size })
        .webp({ quality: 84, effort: 6 })
        .toFile(path);
    const data = await readFile(path);
    const meta = await sharp(data).metadata();
    variants.push({
      path: path.replace(/^public/, ""),
      width: meta.width,
      height: meta.height,
      bytes: data.length,
      sha256: createHash("sha256").update(data).digest("hex"),
    });
  }
  records.push({
    ...asset,
    chapter: chapters.find((c) => c.slug === asset.slug).number,
    originalWidth: width,
    originalHeight: height,
    originalSha256: hash,
    styleReference: asset.styleReference || previous.styleReference,
    format:
      "Raster PNG original; responsive raster WebP variants. Not editable vector artwork.",
    placement: "Why Mental Health library chapter card only",
    aspectRatio: "3:2",
    crop: "None; object-fit: contain",
    variants,
  });
}
await writeFile(
  `${output}/provenance.json`,
  JSON.stringify(
    {
      reviewedAt: "2026-11-11",
      generator: "Built-in image_gen",
      disclosure: "Illustrative fictional scenes · AI-generated.",
      scope:
        "Ten chapter covers; seven existing covers retained and three new covers generated. Internal chapter lessons and visuals unchanged.",
      assets: records,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Prepared ${records.length} cover records; retained 21 existing variants and generated 9 new variants.`,
);
console.log(
  `New 960px payload: ${records
    .filter((a) => !a.reused)
    .map((a) => `${a.id}: ${a.variants[1].bytes} bytes`)
    .join("; ")}`,
);
