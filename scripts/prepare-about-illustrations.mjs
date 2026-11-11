import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const output = "public/images/about";
await mkdir(output, { recursive: true });
const assets = [];
for (const file of ["listening-together", "reading-at-your-own-pace"]) {
  const input = `artifacts/about-refresh/originals/${file}.png`;
  const source = await sharp(input).metadata();
  const variants = [];
  for (const width of [480, 960, 1440]) {
    const path = `${output}/${file}-${width}.webp`;
    const info = await sharp(input)
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
  assets.push({
    file,
    originalWidth: source.width,
    originalHeight: source.height,
    variants,
  });
}
await writeFile(
  "artifacts/about-refresh/image-sizes.json",
  JSON.stringify(assets, null, 2),
);
console.log(JSON.stringify(assets, null, 2));
