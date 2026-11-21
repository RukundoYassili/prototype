import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const slides = [
  { image: "africa-reading", description: "A woman reading at a table", title: "Mental health matters.", copy: "Understanding mental wellbeing is a meaningful place to begin caring for ourselves and one another.", label: "Explore mental health", href: "/why-mental-health" },
  { image: "africa-conversation", description: "Two friends talking together", title: "Listening makes a difference.", copy: "A little patience and a listening ear can help someone feel seen, heard, and less alone.", label: "Find support", href: "/support" },
  { image: "africa-hands", description: "Hands joined in a gesture of solidarity", title: "Understand gender-based violence.", copy: "Learning about gender-based violence helps us recognize harm and build a culture of respect.", label: "Understand GBV", href: "/understand-gbv" },
  { image: "africa-friends-phone", description: "Two friends looking at a phone together", title: "Safety and choice matter.", copy: "Everyone deserves dignity, respect, and the space to make their own decisions about support.", label: "Explore support options", href: "/support" },
  { image: "africa-friends-table", description: "Two friends talking together at a table", title: "You don't have to begin alone.", copy: "Find information and pathways to support, at your own pace and without judgment.", label: "Explore the Knowledge Hub", href: "/knowledge-hub" },
];
export default function HeroSlideshow() {
  const [position, setPosition] = useState(0);
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
      setPosition((value) => (value + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <>
      <div
        className="hero-slides"
        ref={container}
        role="img"
        aria-label={slides[position % slides.length].description}
      >
        <div
          className="hero-track"
          data-position={position}
          data-active-slide={(position % slides.length) + 1}
          data-playing={running}
        >
          {slides.map((slide, index) => (
            <img
              key={`${slide.image}-${index}`}
              className={`hero-slide motion-safe:transition-opacity motion-safe:duration-[900ms] motion-safe:ease-in-out ${position === index ? "is-active opacity-100" : "opacity-0"}`}
              src={`/images/${slide.image}.webp`}
              srcSet={`/images/${slide.image}-mobile.webp 840w, /images/${slide.image}.webp 2400w`}
              sizes="100vw"
              alt=""
              aria-hidden="true"
              fetchPriority={index === 0 ? "high" : "low"}
              style={
                {
                  "--slide-position": "center",
                  "--slide-mobile-position": slide.image === "africa-reading" ? "62% center" : "center",
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
      <div className="hero-shade" />
      <span className="hero-photo-note">Illustrative stock photography</span>
      <div className="hero-bottom">
        <div key={position} className="support-hero-copy motion-safe:animate-[hero-copy-in_600ms_ease-out_both]">
          <span className="support-hero-eyebrow"><span /> UNDERSTANDING. CONNECTION. SUPPORT.</span>
          <h1>{slides[position % slides.length].title}</h1>
          <p>{slides[position % slides.length].copy}</p>
          <Link to={slides[position % slides.length].href} className="support-button">
            {slides[position % slides.length].label} <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="hero-navigation" role="group" aria-label="Choose an awareness slide">
        {slides.map((slide, index) => (
          <button key={slide.image} type="button" className="hero-nav-button"
            aria-label={`Slide ${index + 1}: ${slide.title}`}
            aria-current={position % slides.length === index ? "true" : undefined}
            onClick={() => setPosition(index)}>
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <span id="hero-slideshow-help" className="sr-only">
        Five awareness slides advance automatically. Use the slide buttons to choose a message. Focus this hero to pause; press
        Space to resume or pause while focused. Automatic movement is disabled
        with reduced motion.
      </span>
    </>
  );
}
