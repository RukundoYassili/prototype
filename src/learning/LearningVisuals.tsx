import { useState, type CSSProperties } from "react";
import {
  Accessibility,
  ArrowDown,
  ArrowUpDown,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  Compass,
  Ear,
  Eye,
  Footprints,
  HandHeart,
  Heart,
  House,
  Leaf,
  MessageCircle,
  Pause,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import {
  type LearningDiagram,
  type LearningExplanation,
  type VisualIcon,
  type VisualStory as Story,
} from "./visual-types";
import "./learning-visuals.css";
import { useLearningLibrary } from "./library";

const icons = {
  person: UserRound,
  people: Users,
  heart: Heart,
  home: House,
  leaf: Leaf,
  shield: ShieldCheck,
  message: MessageCircle,
  ear: Ear,
  hand: HandHeart,
  brain: Brain,
  body: Accessibility,
  footsteps: Footprints,
  pause: Pause,
  eye: Eye,
  compass: Compass,
  book: BookOpen,
  check: Check,
} satisfies Record<VisualIcon, typeof UserRound>;

function Explanation({
  content,
  title,
}: {
  content: LearningExplanation;
  title: string;
}) {
  return (
    <div className="lv-explore">
      <details className="lv-explanation">
        <summary>
          <span>
            What this shows<span className="sr-only">: {title}</span>
          </span>
          <ChevronDown size={17} aria-hidden="true" />
        </summary>
        <p>{content.explanation}</p>
      </details>
      <p className="lv-reflection">
        <span>Optional reflection</span>
        {content.reflection}
      </p>
    </div>
  );
}

function SceneImage({
  story,
  scene,
  index,
}: {
  story: Story;
  scene: Story["scenes"][number];
  index: number;
}) {
  const { visuals } = useLearningLibrary();
  const [failed, setFailed] = useState(false);
  const name = `${story.id}-${index === 0 ? "situation" : "support"}`;
  const imageBasePath =
    story.illustration?.imageBasePath || visuals.imageBasePath;
  return (
    <figure className="lv-scene">
      <div
        className={`lv-scene-image${failed ? " lv-image-unavailable" : ""}`}
        style={
          {
            "--lv-scene-position": scene.focalPosition || "50% 50%",
            "--lv-scene-mobile-position":
              scene.mobileFocalPosition || "50% 30%",
          } as CSSProperties
        }
      >
        {failed ? (
          <p role="status">
            <BookOpen size={24} aria-hidden="true" />
            Image unavailable. The scene is described below.
          </p>
        ) : (
          <img
            src={`${imageBasePath}/${name}-1280.webp`}
            srcSet={`${imageBasePath}/${name}-640.webp 640w, ${imageBasePath}/${name}-1280.webp 1280w`}
            sizes="(max-width: 680px) calc(100vw - 82px), (max-width: 1100px) calc((100vw - 100px) / 2), 420px"
            width={story.illustration?.width || 1280}
            height={story.illustration?.height || 960}
            loading="lazy"
            decoding="async"
            alt={scene.alt}
            onError={() => setFailed(true)}
          />
        )}
        <span className="lv-scene-number" aria-hidden="true">
          0{index + 1}
        </span>
      </div>
      <figcaption>
        <span className="lv-scene-label">
          {index === 0
            ? "The situation"
            : story.illustration?.supportLabel || "A possible supportive step"}
        </span>
        {failed && <span className="lv-scene-description">{scene.alt}</span>}
        <p>{scene.caption}</p>
      </figcaption>
    </figure>
  );
}

export function VisualStory({
  story,
  sourceHeadingId,
}: {
  story: Story;
  sourceHeadingId?: string;
}) {
  const headingId = sourceHeadingId || `lv-story-${story.id}-title`;
  return (
    <div
      className={`lv-story lv-visual${sourceHeadingId ? " lv-with-source-heading" : ""}`}
      data-visual-id={story.id}
      data-artwork={story.illustration ? "illustration" : undefined}
      role="group"
      aria-labelledby={headingId}
    >
      <div className="lv-heading">
        <span className="lv-eyebrow">
          <Eye size={15} aria-hidden="true" />
          SEE THE EXAMPLE
        </span>
        {!sourceHeadingId && <h3 id={headingId}>{story.title}</h3>}
        <p className="lv-fictional">
          Illustrative fictional example. AI-generated.
        </p>
      </div>
      <div className="lv-story-scenes">
        {story.scenes.map((scene, index) => (
          <SceneImage
            key={`${story.id}-${index}`}
            story={story}
            scene={scene}
            index={index}
          />
        ))}
      </div>
      <Explanation content={story} title={story.title} />
    </div>
  );
}

function Diagram({ diagram }: { diagram: LearningDiagram }) {
  const CenterIcon = icons[diagram.center?.icon || "person"];
  const linked = diagram.kind === "connection";
  const timeline =
    diagram.id === "emotional-check-in" ||
    (diagram.kind === "sequence" && diagram.steps.length > 3);
  return (
    <figure
      className={`lv-diagram lv-visual lv-${diagram.kind}${timeline ? " lv-timeline" : ""}`}
      data-visual-id={diagram.id}
      aria-labelledby={`lv-${diagram.id}-title`}
    >
      <figcaption className="lv-heading">
        <span className="lv-eyebrow">
          <Compass size={15} aria-hidden="true" />
          {diagram.kind === "skill"
            ? "TRY IT IF IT SUITS YOU"
            : "A CLOSER LOOK"}
        </span>
        <h3 id={`lv-${diagram.id}-title`}>{diagram.title}</h3>
        <p>{diagram.introduction}</p>
      </figcaption>
      {diagram.kind === "influences" && (
        <div className="lv-person">
          <CenterIcon size={24} aria-hidden="true" />
          <strong>{diagram.center?.title || "A person"}</strong>
          <span>{diagram.center?.text || "within their circumstances"}</span>
        </div>
      )}
      {diagram.kind === "pairs" || diagram.kind === "comparison" ? (
        <div className="lv-pairs">
          <div className="lv-pair-labels" aria-hidden="true">
            <span>{diagram.pairLabels?.[0] || "Possible pressure"}</span>
            <span>
              {diagram.pairLabels?.[1] || "Possible protective influence"}
            </span>
          </div>
          <dl>
            {diagram.steps.map((step) => {
              const Icon = icons[step.icon];
              return (
                <div key={step.title}>
                  <dt>
                    {diagram.inlinePairLabels && (
                      <span className="lv-comparison-label">
                        {diagram.pairLabels?.[0]}
                      </span>
                    )}
                    {step.title}
                  </dt>
                  <dd>
                    {diagram.kind !== "comparison" && (
                      <ArrowRight
                        className="lv-pair-arrow"
                        size={16}
                        aria-hidden="true"
                      />
                    )}
                    <Icon size={19} aria-hidden="true" />
                    <span>
                      {diagram.inlinePairLabels && (
                        <span className="lv-comparison-label">
                          {diagram.pairLabels?.[1]}
                        </span>
                      )}
                      {step.text}
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ) : (
        <ol className="lv-steps" aria-label={diagram.title}>
          {diagram.steps.map((step, index) => {
            const Icon = icons[step.icon];
            return (
              <li key={step.title}>
                <div className="lv-step-top">
                  <span className="lv-step-icon">
                    <Icon size={23} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  {diagram.kind !== "influences" && (
                    <span className="lv-step-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
                {index < diagram.steps.length - 1 &&
                  diagram.kind !== "influences" && (
                    <span className="lv-connector" aria-hidden="true">
                      {linked ? (
                        <ArrowUpDown size={16} />
                      ) : (
                        <>
                          <ArrowRight className="lv-arrow-across" size={16} />
                          <ArrowDown className="lv-arrow-down" size={16} />
                        </>
                      )}
                    </span>
                  )}
              </li>
            );
          })}
        </ol>
      )}
      <p className="lv-diagram-note">
        <ShieldCheck size={18} aria-hidden="true" />
        <span>{diagram.note}</span>
      </p>
      <Explanation content={diagram} title={diagram.title} />
    </figure>
  );
}

export function sectionStories(
  stories: Story[],
  chapterSlug: string,
  sectionId: string,
) {
  return stories.filter(
    (story) =>
      story.chapterSlug === chapterSlug && story.sectionId === sectionId,
  );
}

export function SectionVisuals({
  chapterSlug,
  sectionId,
}: {
  chapterSlug: string;
  sectionId: string;
}) {
  const { visuals } = useLearningLibrary();
  return (
    <>
      {sectionStories(visuals.stories, chapterSlug, sectionId)
        .filter((story) => !story.sourceExample && !story.sourceExampleId)
        .map((story) => (
          <VisualStory key={story.id} story={story} />
        ))}
      {visuals.diagrams
        .filter(
          (diagram) =>
            diagram.chapterSlug === chapterSlug &&
            diagram.sectionId === sectionId &&
            !diagram.sourceBlockId,
        )
        .map((diagram) => (
          <Diagram key={diagram.id} diagram={diagram} />
        ))}
    </>
  );
}

export function BlockVisuals({
  chapterSlug,
  sourceBlockId,
}: {
  chapterSlug: string;
  sourceBlockId: string;
}) {
  const { visuals } = useLearningLibrary();
  return (
    <>
      {visuals.stories
        .filter(
          (story) =>
            story.chapterSlug === chapterSlug &&
            story.sourceExampleId === sourceBlockId,
        )
        .map((story) => (
          <VisualStory
            key={story.id}
            story={story}
            sourceHeadingId={sourceBlockId}
          />
        ))}
      {visuals.diagrams
        .filter(
          (diagram) =>
            diagram.chapterSlug === chapterSlug &&
            diagram.sourceBlockId === sourceBlockId,
        )
        .map((diagram) => (
          <Diagram key={diagram.id} diagram={diagram} />
        ))}
    </>
  );
}
