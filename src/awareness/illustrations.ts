import type { TopicId } from "../support/content";

export interface AwarenessArtwork {
  file: string;
  alt: string;
  caption: string;
}

export const awarenessHero: AwarenessArtwork = {
  file: "community-reading",
  alt: "Illustration of three Black African adults choosing a book, reading, and sharing a thoughtful conversation on a neighbourhood reading terrace.",
  caption:
    "AI-generated illustration of a fictional community setting, not a record of an outreach activity.",
};

export const awarenessScenes: Record<TopicId, AwarenessArtwork> = {
  "mental-health": {
    file: "one-study-task",
    alt: "A thoughtful student considers her open planner while a friend stands nearby with an open hand, leaving her to choose one manageable study task.",
    caption:
      "AI-generated fictional example. A small study task is one possible form of support, not a solution to distress.",
  },
  "understand-gbv": {
    file: "space-and-device-choice",
    alt: "A woman holds her own phone with its screen facing her while an attentive friend listens from a separate bench without reaching for the device.",
    caption:
      "AI-generated fictional example. The person keeps control of her device and her next steps.",
  },
  "alcohol-and-drugs": {
    file: "a-calm-check-in",
    alt: "Two adult relatives have a calm conversation near a home doorway; the younger relative holds a closed notebook at his side while the other listens.",
    caption:
      "AI-generated fictional example. A respectful check-in about a missed commitment, without labels or blame.",
  },
};

export const awarenessImageBase = (artwork: AwarenessArtwork) =>
  `/images/awareness/${artwork.file}`;
