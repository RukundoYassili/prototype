import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { currentSiteLanguage } from "./siteTranslation";

const slides = [
  { image: "africa-reading", description: "A woman reading at a table", title: "Mental health matters.", copy: "Understanding mental wellbeing is a meaningful place to begin caring for ourselves and one another.", label: "Explore mental health", href: "/why-mental-health" },
  { image: "africa-conversation", description: "Two friends talking together", title: "Listening makes a difference.", copy: "A little patience and a listening ear can help someone feel seen, heard, and less alone.", label: "Find support", href: "/support" },
  { image: "africa-hands", description: "Hands joined in a gesture of solidarity", title: "Understand gender-based violence.", copy: "Learning about gender-based violence helps us recognize harm and build a culture of respect.", label: "Understand GBV", href: "/understand-gbv" },
  { image: "africa-friends-phone", description: "Two friends looking at a phone together", title: "Safety and choice matter.", copy: "Everyone deserves dignity, respect, and the space to make their own decisions about support.", label: "Explore support options", href: "/support" },
  { image: "africa-friends-table", description: "Two friends talking together at a table", title: "You don't have to begin alone.", copy: "Find information and pathways to support, at your own pace and without judgment.", label: "Explore the Knowledge Hub", href: "/knowledge-hub" },
];
export default function HeroSlideshow() {
  const [position, setPosition] = useState(0);
  const [language, setLanguage] = useState(currentSiteLanguage);
  const [translatedSlides, setTranslatedSlides] = useState(() => slides.map(({ title, copy, label }) => ({ title, copy, label })));
  const translationSource = useRef<HTMLDivElement>(null);
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
    const source = translationSource.current;
    if (!source) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rows = [...source.querySelectorAll<HTMLElement>("[data-translation-slide]")];
        setTranslatedSlides(rows.map((row, index) => ({
          title: row.querySelector("[data-title]")?.textContent || slides[index].title,
          copy: row.querySelector("[data-copy]")?.textContent || slides[index].copy,
          label: row.querySelector("[data-label]")?.textContent || slides[index].label,
        })));
      });
    };
    const observer = new MutationObserver(update);
    observer.observe(source, { subtree: true, childList: true, characterData: true });
    const onLanguage = (event: Event) => { setLanguage((event as CustomEvent<"en" | "rw">).detail); update(); };
    window.addEventListener("site-language-change", onLanguage);
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("site-language-change", onLanguage); };
  }, []);

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
      <div ref={translationSource} className="hero-translation-source" aria-hidden="true">
        {slides.map((slide) => <div data-translation-slide key={slide.image}><p data-title>{slide.title}</p><p data-copy>{slide.copy}</p><p data-label>{slide.label}</p></div>)}
      </div>
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
      <div className="hero-bottom">
        <div key={position} className="support-hero-copy motion-safe:animate-[hero-copy-in_600ms_ease-out_both]" translate={language === "rw" ? "no" : "yes"}>
          <span className="support-hero-eyebrow"><span /> UNDERSTANDING. CONNECTION. SUPPORT.</span>
          <h1>{language === "rw" ? translatedSlides[position].title : slides[position].title}</h1>
          <p>{language === "rw" ? translatedSlides[position].copy : slides[position].copy}</p>
          <Link to={slides[position % slides.length].href} className="support-button">
            {language === "rw" ? translatedSlides[position].label : slides[position].label} <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="hero-navigation" role="group" aria-label="Choose an awareness slide">
        {slides.map((slide, index) => (
          <button key={slide.image} type="button" className="hero-nav-button"
            aria-label={language === "rw" ? `Igice ${index + 1}: ${translatedSlides[index].title}` : `Slide ${index + 1}: ${slide.title}`}
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
