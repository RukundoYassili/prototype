import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, Play, RotateCcw } from "lucide-react";
import { Modal } from "../system/components";
import type { CommunityVideo } from "./content";
import type { CommunityPhoto } from "./photos";

export function CommunityVideoPlayer({
  video,
  poster,
  title,
}: {
  video: CommunityVideo;
  poster: string;
  title: string;
}) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const player = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const loadButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (failed) {
      loadButton.current?.focus();
      return;
    }
    if (!started) return;
    (video.source.provider === "local"
      ? player.current
      : frame.current
    )?.focus();
  }, [started, failed, video.source.provider, attempt]);
  const retry = () => {
    setFailed(false);
    setLoaded(false);
    setAttempt((value) => value + 1);
    setStarted(true);
  };
  return (
    <section className="community-video" aria-label={`Video: ${title}`}>
      <div className="community-video-stage">
        {!started || failed ? (
          <div className="community-video-poster">
            <img src={poster} alt="" width={1600} height={900} />
            <button
              ref={loadButton}
              type="button"
              onClick={failed ? retry : () => setStarted(true)}
            >
              {failed ? (
                <RotateCcw aria-hidden="true" />
              ) : (
                <Play aria-hidden="true" />
              )}
              {failed ? "Retry video" : "Load video"}
            </button>
          </div>
        ) : video.source.provider === "local" ? (
          <video
            key={attempt}
            ref={player}
            tabIndex={0}
            controls
            playsInline
            preload="metadata"
            poster={poster}
            onError={() => setFailed(true)}
          >
            <source src={video.source.src} onError={() => setFailed(true)} />
            {video.captions.map((caption, index) => (
              <track
                key={caption.language}
                kind="captions"
                src={caption.src}
                srcLang={caption.language}
                label={caption.label}
                default={index === 0}
              />
            ))}
            Your browser cannot play this video. Read the transcript below.
          </video>
        ) : (
          <iframe
            key={attempt}
            ref={frame}
            title={title}
            src={`https://www.youtube-nocookie.com/embed/${video.source.id}?autoplay=0&cc_load_policy=1&playsinline=1`}
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <p className="community-media-note" role="status">
        {failed
          ? "The video could not load. Try again or read the full transcript below."
          : !started
            ? `Load the player when you’re ready. No autoplay.${video.source.provider === "youtube" ? " Loading connects to YouTube." : ""}`
            : "Use the player’s controls to start playback and turn on captions."}
      </p>
      {started && video.source.provider === "youtube" && !failed && (
        <div className="community-player-help">
          <p>
            {loaded
              ? "If YouTube is unavailable, you can retry, open the original video, or read the transcript."
              : "Loading the player. You can also read the transcript below."}
          </p>
          <button type="button" onClick={retry}>
            Reload player
          </button>
          <a
            href={`https://www.youtube.com/watch?v=${video.source.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open on YouTube
          </a>
        </div>
      )}
      <details className="community-transcript">
        <summary>Read the transcript</summary>
        <p>{video.transcript}</p>
      </details>
      {video.captions.length > 0 && (
        <div className="community-caption-links">
          Captions:{" "}
          {video.captions.map((caption) => (
            <a key={caption.language} href={caption.src} download>
              {caption.label} (VTT)
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export function CommunityAlbum({
  photos,
  title,
}: {
  photos: CommunityPhoto[];
  title: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const open = active !== null;
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const close = () => {
    setActive(null);
    trigger.current?.focus();
  };
  const move = (direction: number) =>
    setActive((index) =>
      index === null
        ? null
        : (index + direction + photos.length) % photos.length,
    );
  if (!photos.length) return null;
  const photo = photos[active ?? 0];
  return (
    <div className="community-album">
      <div className="community-album-grid">
        {photos.map((item, index) => (
          <figure key={item.id}>
            <button
              type="button"
              aria-label={`View photo: ${item.title}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setActive(index);
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                width={1200}
                height={800}
                style={{ objectPosition: item.position }}
              />
              <span className="community-album-expand" aria-hidden="true">
                <Expand size={18} />
              </span>
            </button>
            <figcaption>
              {item.title}
              {item.illustrative && " · Illustrative photograph"}
            </figcaption>
          </figure>
        ))}
      </div>
      <div
        className="community-viewer"
        onKeyDown={(event) => {
          if (
            active === null ||
            !["ArrowLeft", "ArrowRight"].includes(event.key)
          )
            return;
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }}
      >
        <Modal open={open} onClose={close} title={title}>
          <figure className="community-viewer-figure">
            <img src={photo.src} alt={photo.alt} width={1600} height={1000} />
            <figcaption>
              <div aria-live="polite" aria-atomic="true">
                <span>
                  {(active ?? 0) + 1} / {photos.length}
                </span>
                <h3>{photo.title}</h3>
                <p>
                  {photo.category}
                  {photo.illustrative && " · Illustrative photograph"}
                </p>
              </div>
              {photos.length > 1 && (
                <div className="community-viewer-controls">
                  <button
                    type="button"
                    aria-label="Previous community photo"
                    onClick={() => move(-1)}
                  >
                    <ArrowLeft />
                  </button>
                  <button
                    type="button"
                    aria-label="Next community photo"
                    onClick={() => move(1)}
                  >
                    <ArrowRight />
                  </button>
                </div>
              )}
            </figcaption>
          </figure>
        </Modal>
      </div>
    </div>
  );
}
