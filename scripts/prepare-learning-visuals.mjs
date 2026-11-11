import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const originalPrompts = JSON.parse(
  await readFile("artifacts/learning-visuals/generation-prompts.json", "utf8"),
);
const continuationPrompts = JSON.parse(
  (
    await readFile(
      "artifacts/learning-visuals/chapters-03-07-generation-progress.json",
      "utf8",
    )
  ).replace(/^\uFEFF/, ""),
);
const briefs = JSON.parse(
  await readFile(
    "artifacts/learning-visuals/chapters-03-07-scenes.json",
    "utf8",
  ),
);
const prompts = [
  ...originalPrompts,
  ...continuationPrompts.map(({ id, prompt, reference }) => ({
    id,
    prompt,
    ...(reference ? { reference } : {}),
  })),
];
const expectedIds = [
  ...originalPrompts.map((item) => item.id),
  ...briefs.flatMap((item) => [`${item.id}-situation`, `${item.id}-support`]),
];
const availableOnly = process.argv.includes("--available");
if (
  new Set(prompts.map((item) => item.id)).size !== prompts.length ||
  (!availableOnly &&
    expectedIds.some((id) => !prompts.some((item) => item.id === id)))
)
  throw new Error("Missing or duplicated teaching scene generation records.");
const previous = JSON.parse(
  await readFile("public/images/learning/provenance.json", "utf8"),
);
await mkdir("public/images/learning", { recursive: true });
const scenes = [];
for (const record of prompts) {
  const source = `artifacts/learning-visuals/${record.id}.png`;
  const original = await readFile(source);
  const sha256 = createHash("sha256").update(original).digest("hex");
  const retained = previous.scenes.find(
    (scene) => scene.id === record.id && scene.sha256 === sha256,
  );
  if (
    retained &&
    (
      await Promise.all(
        retained.outputs.map((output) =>
          stat(`public${output.file}`)
            .then(() => true)
            .catch(() => false),
        ),
      )
    ).every(Boolean)
  ) {
    scenes.push(retained);
    continue;
  }
  const outputs = [];
  for (const width of [640, 1280]) {
    const height = (width * 3) / 4;
    const file = `public/images/learning/${record.id}-${width}.webp`;
    const result = await sharp(original)
      .resize(width, height, { fit: "cover", position: "centre" })
      .webp({ quality: 84, effort: 5 })
      .toFile(file);
    outputs.push({
      file: file.replace("public", ""),
      width,
      height,
      bytes: result.size,
    });
  }
  scenes.push({
    ...record,
    source,
    sha256,
    outputs,
  });
}
const manifest = {
  generatedAt: "2026-11-09",
  tool: "Built-in image_gen",
  disclosure:
    "AI-generated, illustrative fictional examples. Not real participants, providers, case histories, or endorsements.",
  review:
    "Each original was visually reviewed for story alignment, recurring-character continuity, natural anatomy, respectful expressions, and absence of embedded explanatory labels. Captions and diagrams are editable React content based on the supplied educational drafts. No clinical review is implied.",
  scenes,
};
await writeFile(
  "public/images/learning/provenance.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    scenes: scenes.length,
    responsiveAssets: scenes.length * 2,
    bytes: scenes
      .flatMap((scene) => scene.outputs)
      .reduce((sum, output) => sum + output.bytes, 0),
  }),
);
