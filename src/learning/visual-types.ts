export type VisualIcon =
  | "person"
  | "people"
  | "heart"
  | "home"
  | "leaf"
  | "shield"
  | "message"
  | "ear"
  | "hand"
  | "brain"
  | "body"
  | "footsteps"
  | "pause"
  | "eye"
  | "compass"
  | "book"
  | "check";

export interface VisualStep {
  title: string;
  text: string;
  icon: VisualIcon;
}
export interface LearningExplanation {
  explanation: string;
  reflection: string;
}
export interface VisualScene {
  caption: string;
  alt: string;
  focalPosition?: string;
  mobileFocalPosition?: string;
}
export interface VisualStory extends LearningExplanation {
  id: string;
  chapterSlug: string;
  sectionId: string;
  sourceExample?: string;
  sourceExampleId?: string;
  title: string;
  scenes: [VisualScene, VisualScene];
  illustration?: {
    imageBasePath: string;
    width: number;
    height: number;
    supportLabel?: string;
  };
}
export interface LearningDiagram extends LearningExplanation {
  sources?: { label: string; url: string }[];
  id: string;
  chapterSlug: string;
  sectionId: string;
  sourceBlockId?: string;
  pairLabels?: [string, string];
  inlinePairLabels?: boolean;
  title: string;
  introduction: string;
  kind:
    "influences" | "pairs" | "comparison" | "sequence" | "connection" | "skill";
  steps: VisualStep[];
  note: string;
  center?: VisualStep;
}
