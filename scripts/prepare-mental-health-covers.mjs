import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = "artifacts/mental-health-library-refresh";
const manifest = JSON.parse(
  await readFile(`${root}/illustration-manifest.json`, "utf8"),
);
const output = "public/images/learning/mental-health-covers";
await mkdir(output, { recursive: true });
const sizes = [];
for (const asset of manifest.assets) {
  const source = await sharp(asset.original).metadata();
  if (source.width / source.height !== 1.5)
    throw new Error(`Expected a 3:2 cover: ${asset.id}`);
  const variants = [];
  for (const width of [480, 960, 1440]) {
    const path = `${output}/${asset.id}-${width}.webp`;
    const info = await sharp(asset.original)
      .resize({ width })
      .webp({ quality: 84, effort: 6 })
      .toFile(path);
    variants.push({
      path,
      width: info.width,
      height: info.height,
      bytes: info.size,
    });
  }
  sizes.push({
    id: asset.id,
    slug: asset.slug,
    originalWidth: source.width,
    originalHeight: source.height,
    variants,
  });
}
await writeFile(`${root}/image-sizes.json`, JSON.stringify(sizes, null, 2));
console.log(
  `Prepared ${sizes.length} covers, each with 480/960/1440px WebP variants.`,
);
