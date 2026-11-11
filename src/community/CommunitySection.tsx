import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Expand,
  HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Modal } from "../system/components";
import { communityPhotos } from "./photos";
import "./community.css";

export default function CommunitySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = communityPhotos[activeIndex ?? 0];
  const isOpen = activeIndex !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);
  const move = (direction: number) => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current + direction + communityPhotos.length) %
          communityPhotos.length,
    );
  };

  if (!communityPhotos.length) return null;

  return (
    <section
      className="community-section"
      id="community"
      aria-labelledby="community-title"
    >
      <div className="community-inner">
        <div className="community-heading">
          <div>
            <span className="community-eyebrow">
              <HeartHandshake size={17} aria-hidden="true" /> COMMUNITY &
              OUTREACH
            </span>
            <h2 id="community-title">
              A community that
              <br />
              <span>cares, together.</span>
            </h2>
          </div>
          <div className="community-intro">
            <p>
              Our outreach brings people together to listen, learn, and make
              space for honest conversations. Because connection is a place to
              begin.
            </p>
            <Link to="/community" className="community-work-link">
              Explore our community work{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div
          className={`community-gallery${communityPhotos.length % 2 === 0 ? " community-gallery-even" : ""}${communityPhotos.length === 1 ? " community-gallery-single" : ""}`}
          role="group"
          aria-label="Community photo gallery"
        >
          {communityPhotos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              className="community-photo"
              onClick={() => setActiveIndex(index)}
              aria-label={`View photo: ${photo.title}`}
              aria-haspopup="dialog"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                width={2400}
                height={1600}
                style={{ objectPosition: photo.position }}
              />
              <span className="community-photo-shade" aria-hidden="true" />
              <span className="community-photo-caption">
                <span className="community-photo-category">
                  {photo.category}
                </span>
                <span className="community-photo-title">{photo.title}</span>
              </span>
              <span className="community-photo-expand" aria-hidden="true">
                <Expand size={18} />
              </span>
            </button>
          ))}
        </div>

        <div className="community-gallery-note">
          <span>People. Conversations. Connection.</span>
          {communityPhotos.some((photo) => photo.illustrative) && (
            <p>
              {communityPhotos.every((photo) => photo.illustrative)
                ? "Illustrative photography. Not photographs of our outreach participants."
                : "Includes illustrative photography, which does not depict our outreach participants."}
            </p>
          )}
        </div>
      </div>

      <div
        className="community-viewer"
        onKeyDown={(event) => {
          if (activeIndex === null || communityPhotos.length < 2) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        <Modal
          open={activeIndex !== null}
          onClose={() => setActiveIndex(null)}
          title="Community gallery"
        >
          <figure className="community-viewer-figure">
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              width={2400}
              height={1600}
            />
            <figcaption>
              <div aria-live="polite" aria-atomic="true">
                <span className="community-viewer-count">
                  {(activeIndex ?? 0) + 1} / {communityPhotos.length}
                </span>
                <h3>{activePhoto.title}</h3>
                <p>
                  {activePhoto.illustrative ? "Illustrative photograph · " : ""}
                  {activePhoto.category}
                </p>
              </div>
              {communityPhotos.length > 1 && (
                <div className="community-viewer-controls">
                  <button
                    type="button"
                    aria-label="Previous community photo"
                    onClick={() => move(-1)}
                  >
                    <ArrowLeft size={20} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next community photo"
                    onClick={() => move(1)}
                  >
                    <ArrowRight size={20} aria-hidden="true" />
                  </button>
                </div>
              )}
            </figcaption>
          </figure>
        </Modal>
      </div>
    </section>
  );
}
