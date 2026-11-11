import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
await sharp("artifacts/hero-restored.png")
  .webp({ quality: 91 })
  .toFile("public/images/hero.webp");
const path = "public/images/asset-provenance.json";
const info = JSON.parse(await readFile(path, "utf8"));
info.method =
  "Photo crops from the user screenshot; hero restored using built-in ImageGen to remove embedded UI and preserve composition.";
info.hero = {
  tool: "Built-in image_gen",
  source: "artifacts/hero-reference.png",
  output: "public/images/hero.webp",
  prompt:
    "Remove all website UI and text; preserve the same smiling red-haired woman, black hat, raised gray sleeve, forest background and full landscape composition. Reconstruct obscured photographic areas. No text, logos or icons.",
};
await writeFile(path, JSON.stringify(info, null, 2));
