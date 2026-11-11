import sharp from "sharp";
import { readdir } from "node:fs/promises";

const directory = process.argv[2] || "artifacts/learning-visuals/review";
const files = (await readdir(directory))
  .filter((file) => /^print-\d+-\d+\.png$/.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
for (let offset = 0; offset < files.length; offset += 6) {
  const group = files.slice(offset, offset + 6);
  const layers = [];
  for (const [index, file] of group.entries()) {
    const left = (index % 3) * 384;
    const top = Math.floor(index / 3) * 566;
    const label = file
      .replace("print-", "Chapter ")
      .replace(/-(\d+)\.png$/, " / page $1");
    layers.push({
      input: Buffer.from(
        `<svg width="374" height="26"><rect width="374" height="26" fill="#eaf1e2"/><text x="10" y="18" font-family="Arial" font-size="13" fill="#244b39">${label}</text></svg>`,
      ),
      left,
      top,
    });
    layers.push({
      input: await sharp(`${directory}/${file}`)
        .resize({
          width: 374,
          height: 530,
          fit: "contain",
          background: "white",
        })
        .png()
        .toBuffer(),
      left,
      top: top + 26,
    });
  }
  await sharp({
    create: { width: 1152, height: 1132, channels: 3, background: "#d9e2d1" },
  })
    .composite(layers)
    .png()
    .toFile(`${directory}/print-sheet-${offset / 6 + 1}.png`);
}
console.log(
  `Prepared ${Math.ceil(files.length / 6)} print contact sheets covering ${files.length} pages.`,
);
