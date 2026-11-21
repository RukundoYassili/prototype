import type { CommunityPhoto } from "./photos";

const selectedFirst = [11, 1, 3, 26, 24, 19];
const photoOrder = [...selectedFirst, ...Array.from({ length: 37 }, (_, index) => index + 1).filter((number) => !selectedFirst.includes(number))];
export const cyanikaPhotos: CommunityPhoto[] = photoOrder.map((number) => ({
  id: `cyanika-${number}`,
  src: `/community-outreach/cyanika/photo-${String(number).padStart(2, "0")}.jpg`,
  alt: number === 24 || number === 30
    ? "A sign for Cyanika Technical Secondary School"
    : number === 2
      ? "A projected presentation during the school outreach"
      : `A moment from the outreach at Cyanika Technical Secondary School, photo ${number}`,
  title: `Cyanika outreach photo ${number}`,
  category: "School outreach",
  position: "50% 50%",
  illustrative: false,
}));
