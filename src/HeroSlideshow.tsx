import { useEffect, useRef, useState, type CSSProperties } from "react";

const slides = [
  {
    image: "mental-health-counseling",
    description:
      "Illustrative photograph of a one-to-one counseling conversation",
    position: "62% 34%",
    mobilePosition: "66% 32%",
  },
  {
    image: "mental-health-listening",
    description:
      "Illustrative photograph of a counselor listening during a supportive conversation",
    position: "50% 42%",
    mobilePosition: "14% 36%",
  },
  {
    image: "mental-health-group",
    description:
      "Illustrative photograph of a facilitated group support conversation",
    position: "50% 40%",
    mobilePosition: "43% 35%",
  },
  {
    image: "mental-health-connection",
    description:
      "Illustrative photograph of people joining hands in mutual support",
    position: "50% 44%",
    mobilePosition: "50% 40%",
  },
  {
    image: "mental-health-learning",
    description:
      "Illustrative photograph of mental health learning with a notebook and laptop",
    position: "62% 42%",
    mobilePosition: "72% 35%",
  },
];
// The final duplicate lets the strip continue left before resetting off-transition.
const loopedSlides = [...slides, slides[0]];

export default function HeroSlideshow() {
  const [position, setPosition] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [keyboardPlaying, setKeyboardPlaying] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [inView, setInView] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const running =
    !reduced &&
    visible &&
    inView &&
    (keyboardPlaying || (!hovered && !focused));

  useEffect(() => {
    const hero = container.current?.closest<HTMLElement>(".hero");
    if (!hero) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden);
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    const focus = () => {
      setFocused(true);
      setKeyboardPlaying(false);
    };
    const blur = (event: FocusEvent) => {
      if (!hero.contains(event.relatedTarget as Node | null)) {
        setFocused(false);
        setKeyboardPlaying(false);
      }
    };
    const key = (event: KeyboardEvent) => {
      // Never intercept Space on the navigation or consultation buttons.
      if (event.target === hero && event.code === "Space") {
        event.preventDefault();
        if (!media.matches) setKeyboardPlaying((value) => !value);
      }
    };
    const observer = new IntersectionObserver((entries) =>
      setInView(entries[0].isIntersecting),
    );
    observer.observe(hero);
    hero.addEventListener("mouseenter", enter);
    hero.addEventListener("mouseleave", leave);
    hero.addEventListener("focusin", focus);
    hero.addEventListener("focusout", blur);
    hero.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    media.addEventListener("change", preference);
    return () => {
      observer.disconnect();
      hero.removeEventListener("mouseenter", enter);
      hero.removeEventListener("mouseleave", leave);
      hero.removeEventListener("focusin", focus);
      hero.removeEventListener("focusout", blur);
      hero.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      media.removeEventListener("change", preference);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setAnimated(true);
      setPosition((value) => value + 1);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (position !== slides.length) return;
    // Also settle the loop if the browser cancels a transition while hidden.
    const timer = window.setTimeout(() => {
      setAnimated(false);
      setPosition(0);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [position]);

  return (
    <>
      <div
        className="hero-slides"
        ref={container}
        role="img"
        aria-label={slides[position % slides.length].description}
      >
        <div
          className={`hero-track ${animated ? "is-animated" : ""}`}
          data-position={position}
          data-active-slide={(position % slides.length) + 1}
          data-playing={running}
          style={{ transform: `translate3d(-${position * 100}%, 0, 0)` }}
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.propertyName === "transform" &&
              position === slides.length
            ) {
              setAnimated(false);
              setPosition(0);
            }
          }}
        >
          {loopedSlides.map((slide, index) => (
            <img
              key={`${slide.image}-${index}`}
              className={`hero-slide ${position === index ? "is-active" : ""}`}
              data-loop-clone={index === slides.length || undefined}
              src={`/images/${slide.image}.webp`}
              alt=""
              aria-hidden="true"
              fetchPriority={index === 0 ? "high" : "low"}
              style={
                {
                  "--slide-position": slide.position,
                  "--slide-mobile-position": slide.mobilePosition,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
      <span id="hero-slideshow-help" className="sr-only">
        Five photographs advance automatically. Focus this hero to pause; press
        Space to resume or pause while focused. Automatic movement is disabled
        with reduced motion.
      </span>
    </>
  );
}
