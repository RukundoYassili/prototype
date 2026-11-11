import { gbvChapters as foundationChapters } from "./chapters.generated";
import { gbvContinuationChapters } from "./chapters-04-10.generated";

export const gbvChapters = [
  ...foundationChapters,
  ...gbvContinuationChapters,
].sort((a, b) => a.number - b.number);
