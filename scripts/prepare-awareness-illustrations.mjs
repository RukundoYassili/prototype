import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const manifestPath = "artifacts/awareness-refresh/illustration-manifest.json";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const output = "public/images/awareness";
await mkdir(output, { recursive: true });
const assets = [];
for (const asset of manifest.assets) {
  const bytes = await readFile(asset.original);
  const metadata = await sharp(bytes).metadata();
  if (metadata.width / metadata.height !== 1.5)
    throw new Error(`Expected 3:2 artwork: ${asset.id}`);
  const variants = [];
  for (const width of [480, 960, 1440]) {
    const file = `${asset.id}-${width}.webp`;
    const info = await sharp(bytes)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 })
      .toFile(`${output}/${file}`);
    variants.push({
      path: `/images/awareness/${file}`,
      width: info.width,
      height: info.height,
      bytes: info.size,
    });
  }
  assets.push({
    ...asset,
    prompt: asset.prompt || manifest.commonTopicPrompt + asset.scenePrompt,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    originalSha256: createHash("sha256").update(bytes).digest("hex"),
    crop: "None. Full composition, object-fit: contain.",
    variants,
  });
}
const provenance = {
  generator: manifest.generator,
  disclosure: manifest.disclosure,
  styleReference: manifest.styleReference,
  assets,
};
await writeFile(
  `${output}/provenance.json`,
  JSON.stringify(provenance, null, 2) + "\n",
);
console.log(
  `Prepared ${assets.length} illustrations / ${assets.reduce((sum, asset) => sum + asset.variants.length, 0)} WebP variants / ${assets.reduce((sum, asset) => sum + asset.variants.reduce((bytes, variant) => bytes + variant.bytes, 0), 0)} bytes.`,
);
