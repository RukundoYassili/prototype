import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import assert from "node:assert/strict";

const root = "artifacts/gbv-chapter-01-refresh";
const directory = "public/images/learning/gbv/chapter-01";
const manifest = JSON.parse(
  await readFile(`${root}/illustration-manifest.json`, "utf8"),
);
await mkdir(directory, { recursive: true });
const results = [];
for (const asset of manifest.assets) {
  const metadata = await sharp(asset.original).metadata();
  const ratio = asset.id === "gbv-foundations-header" ? 3 / 2 : 4 / 3;
  assert(
    Math.abs(metadata.width / metadata.height - ratio) < 0.005,
    `${asset.id}: unexpected aspect ratio`,
  );
  const variants = [];
  for (const width of [640, 1280]) {
    const path = `${directory}/${asset.id}-${width}.webp`;
    const result = await sharp(asset.original)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 })
      .toFile(path);
    variants.push({
      path,
      width: result.width,
      height: result.height,
      bytes: result.size,
    });
  }
  results.push({
    id: asset.id,
    section: asset.section,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    variants,
  });
}
await writeFile(`${root}/image-sizes.json`, JSON.stringify(results, null, 2));
console.log(
  `Optimized ${results.length} illustrations into ${results.length * 2} WebP files.`,
);
