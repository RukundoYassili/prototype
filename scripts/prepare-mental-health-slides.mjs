import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
const photos = [
  {
    name: "mental-health-counseling",
    id: 9064381,
    photographer: "RDNE Stock project",
    page: "https://www.pexels.com/photo/a-woman-in-a-therapy-session-9064381/",
    theme: "One-to-one counseling",
  },
  {
    name: "mental-health-listening",
    id: 5699424,
    photographer: "Alex Green",
    page: "https://www.pexels.com/photo/black-psychologist-with-african-american-client-5699424/",
    theme: "Attentive listening",
  },
  {
    name: "mental-health-group",
    id: 7176302,
    photographer: "SHVETS production",
    page: "https://www.pexels.com/photo/mental-female-specialist-speaking-to-group-of-clients-7176302/",
    theme: "Group support",
  },
  {
    name: "mental-health-connection",
    id: 9775861,
    photographer: "SHVETS production",
    page: "https://www.pexels.com/photo/group-of-men-with-their-hands-together-9775861/",
    theme: "Connection and mutual support",
  },
  {
    name: "mental-health-learning",
    id: 3958396,
    photographer: "Polina Zimmerman",
    page: "https://www.pexels.com/photo/therapist-taking-notes-3958396/",
    theme: "Mental health learning and reflection",
  },
];
const credits = [];
for (const photo of photos) {
  const download = `https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&w=3000`;
  let input;
  try {
    input = await readFile(
      `artifacts/mental-health-candidates/${photo.id}.jpg`,
    );
  } catch {
    const r = await fetch(download);
    if (!r.ok) throw Error(`${photo.id}: ${r.status}`);
    input = Buffer.from(await r.arrayBuffer());
  }
  const target = `public/images/${photo.name}.webp`;
  await sharp(input)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 86, effort: 5 })
    .toFile(target);
  const meta = await sharp(target).metadata();
  if (meta.width < 1920) throw Error("Image below HD");
  credits.push({
    ...photo,
    file: target,
    download,
    license: "https://www.pexels.com/license/",
    checked: "2026-11-08",
    width: meta.width,
    height: meta.height,
    usage:
      "Illustrative stock photography. People shown are not identified as this website’s professionals, clients, or endorsers.",
  });
  console.log({ name: photo.name, width: meta.width, height: meta.height });
}
await writeFile(
  "public/images/mental-health-slide-credits.json",
  JSON.stringify(credits, null, 2) + "\n",
);
