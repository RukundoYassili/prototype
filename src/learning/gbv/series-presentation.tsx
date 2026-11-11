import type { ChapterPresentation } from "../LearningPages";
import { gbvChapters } from "./chapters";
import { gbvChapter01Presentation } from "./chapter-01-presentation";
import { GbvIllustration, gbvCovers } from "./GbvIllustration";
import "./series-reader.css";
import "./series-art.css";

export const gbvPresentations: Record<string, ChapterPresentation> =
  Object.fromEntries(
    gbvChapters.map((chapter) => [
      chapter.slug,
      {
        ...(chapter.number === 1 ? gbvChapter01Presentation : {}),
        chapterSlug: chapter.slug,
        className:
          "gbv-foundations gbv-series-reader" +
          (chapter.number === 1
            ? ""
            : ` gbv-distinct-chapter gbv-chapter-${String(chapter.number).padStart(2, "0")}`),
        readerTools: true,
        visualDisclosure:
          "The illustrations are AI-generated fictional teaching scenes, not real participants or case histories. A possible supportive response does not guarantee safety or immediate resolution. ",
        headerVisual:
          chapter.number === 1 ? (
            gbvChapter01Presentation.headerVisual
          ) : (
            <figure className="gbv-foundations-hero">
              <GbvIllustration artwork={gbvCovers[chapter.slug]} priority />
              <figcaption>
                Fictional illustration · Learning with dignity and choice.
              </figcaption>
            </figure>
          ),
      },
    ]),
  );
