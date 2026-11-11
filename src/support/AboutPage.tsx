import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AboutIllustration } from "./aboutIllustrations";
import "./about.css";

const focusAreas = [
  {
    title: "Mental health",
    description:
      "Understand emotions, everyday challenges, and ways to care for your well-being.",
    to: "/mental-health",
    Icon: Sprout,
  },
  {
    title: "Understanding GBV",
    description:
      "Learn about consent, boundaries, and options for support with gender-based violence.",
    to: "/understand-gbv",
    Icon: ShieldCheck,
  },
  {
    title: "Alcohol & drugs",
    description:
      "Explore substance use, its effects, and support pathways without blame or judgment.",
    to: "/alcohol-and-drugs",
    Icon: HeartHandshake,
  },
];

export function AboutPage({ values }: { values: ReactNode }) {
  return (
    <div className="support-page about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <span className="support-eyebrow">ABOUT US</span>
          <h1 id="about-title">
            Understanding starts with <span>listening.</span>
          </h1>
          <p>
            Everyone deserves to be heard. We make information about well-being
            and support easier to understand, so you can explore what matters to
            you, at your own pace.
          </p>
          <div className="about-actions">
            <Link to="/support" className="support-button">
              Find your starting point{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/knowledge-hub" className="support-text-link">
              Explore the Knowledge Hub{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="about-hero-art">
          <AboutIllustration name="listening" priority />
          <p className="about-art-caption">
            A little understanding. A stronger connection.
          </p>
        </div>
      </section>

      <section
        className="about-purpose about-section"
        aria-labelledby="about-purpose-title"
      >
        <div className="about-section-intro">
          <div>
            <span className="support-eyebrow">OUR PURPOSE</span>
            <h2 id="about-purpose-title">
              Clear information.
              <br />A place to begin.
            </h2>
          </div>
          <p>
            Whether you are looking for yourself or someone you care about, this
            is a place to learn without judgment. Mental health, personal
            safety, and substance use can be connected. Everyone’s circumstances
            are different.
          </p>
        </div>
        <div className="about-focus-grid">
          {focusAreas.map(({ title, description, to, Icon }) => (
            <Link className="about-focus-card" to={to} key={to}>
              <Icon
                className="about-focus-icon"
                size={28}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="about-card-action">
                Explore this topic <ArrowUpRight size={19} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
        <Link to="/#our-work" className="support-text-link about-work-link">
          Explore our areas of focus{" "}
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>

      <section
        className="about-values about-section"
        aria-labelledby="about-values-title"
      >
        <div className="about-section-intro">
          <div>
            <span className="support-eyebrow">WHAT GUIDES US</span>
            <h2 id="about-values-title">
              People first.
              <br />
              Always.
            </h2>
          </div>
          <p>
            How we talk about support matters. These four values guide the
            information we share and the choices we encourage you to make.
          </p>
        </div>
        {values}
      </section>

      <section className="about-choices" aria-labelledby="about-choices-title">
        <div className="about-choices-art">
          <AboutIllustration name="reading" />
        </div>
        <div className="about-choices-copy">
          <span className="support-eyebrow">AT YOUR OWN PACE</span>
          <h2 id="about-choices-title">
            Your choices
            <br />
            come first.
          </h2>
          <p>You choose where to begin, what to read, and what comes next.</p>
          <ul className="about-choice-list">
            <li>
              <strong>Read without an account.</strong>
              <span>
                You do not need to share your story to explore the information
                here.
              </span>
            </li>
            <li>
              <strong>Ask before sharing.</strong>
              <span>
                Ask services about privacy, accessibility, costs, and
                eligibility before making contact.
              </span>
            </li>
            <li>
              <strong>Understand your privacy.</strong>
              <span>
                Quick exit leaves this site, but does not erase your browsing
                history.
              </span>
            </li>
          </ul>
          <Link to="/privacy" className="support-text-link">
            Read our privacy notice{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="about-next" aria-labelledby="about-next-title">
        <BookOpen size={30} strokeWidth={1.5} aria-hidden="true" />
        <div>
          <h2 id="about-next-title">A next step that feels right for you.</h2>
          <p>Keep learning, or explore the support options available to you.</p>
        </div>
        <Link to="/support" className="support-button">
          Explore support options <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <aside className="about-site-note" aria-label="About this website">
        <strong>About this website</strong>
        <p>
          BetterHelp is a temporary name for this independent website and is not
          affiliated with the official BetterHelp service. This site provides
          information, not care or emergency response. The separate booking and
          professional-profile previews use fictional data. Illustrations show
          fictional people, not our staff or clients.
        </p>
      </aside>
    </div>
  );
}
