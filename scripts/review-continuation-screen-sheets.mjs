import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";

const directory = "artifacts/chapters-03-07/screens";
const output = "artifacts/chapters-03-07/screen-sheets";
await mkdir(output, { recursive: true });
for (const width of [375, 1440]) {
  const files = (await readdir(directory))
    .filter(
      (file) =>
        file.endsWith(`-${width}.jpg`) && !/^(chapter-|library-)/.test(file),
    )
    .sort();
  for (let offset = 0; offset < files.length; offset += 6) {
    const layers = [];
    for (const [index, file] of files.slice(offset, offset + 6).entries()) {
      const left = (index % 3) * 390;
      const top = Math.floor(index / 3) * 1100;
      layers.push({
        input: Buffer.from(
          `<svg width="380" height="28"><rect width="380" height="28" fill="#dce7d4"/><text x="8" y="19" font-family="Arial" font-size="12" fill="#244b39">${file}</text></svg>`,
        ),
        left,
        top,
      });
      layers.push({
        input: await sharp(`${directory}/${file}`)
          .resize({
            width: 380,
            height: 1062,
            fit: "contain",
            position: "top",
            background: "white",
          })
          .png()
          .toBuffer(),
        left,
        top: top + 28,
      });
    }
    await sharp({
      create: {
        width: 1170,
        height: 2200,
        channels: 3,
        background: "#e7ece2",
      },
    })
      .composite(layers)
      .png()
      .toFile(`${output}/${width}-sheet-${offset / 6 + 1}.png`);
  }
  console.log(
    `Prepared ${width}px review sheets for ${files.length} visual units.`,
  );
}

for (const width of [375, 768, 1024, 1440, 1920]) {
  const source = `${directory}/library-${width}.jpg`;
  const { height } = await sharp(source).metadata();
  const sliceHeight = width <= 768 ? 1900 : 1600;
  for (let top = 0; top < height; top += sliceHeight) {
    await sharp(source)
      .extract({
        left: 0,
        top,
        width,
        height: Math.min(sliceHeight, height - top),
      })
      .png()
      .toFile(`${output}/library-${width}-slice-${top / sliceHeight + 1}.png`);
  }
}
