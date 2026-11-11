import { ArrowUpRight, Flower2 } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSlideshow from "./HeroSlideshow";
import { SiteHeader, SiteFooter } from "./SiteChrome";
import {
  Pathways,
  TopicCards,
  UrgentStrip,
  Values,
} from "./support/SupportPages";
import { programs, resourceTopics, supportCategories } from "./support/content";
import { BlogPreview } from "./blog/BlogPages";
import CommunitySection from "./community/CommunitySection";

export default function App() {
  return (
    <div className="landing support-home">
      <a href="#main-content" className="skip">
        Skip to content
      </a>
      <SiteHeader />
      <main className="page-shell" id="main-content" tabIndex={-1}>
        <section
          className="hero hero-mental-health"
          id="home"
          aria-label="Wellness stories"
          aria-roledescription="carousel"
          aria-describedby="hero-slideshow-help"
          tabIndex={0}
        >
          <HeroSlideshow />
          <div className="hero-shade" />
          <div className="hero-bottom">
            <div className="support-hero-copy">
              <span className="support-hero-eyebrow">
                <span />
                UNDERSTANDING. CONNECTION. SUPPORT.
              </span>
              <h1>
                We care about
                <br /> your smile.
              </h1>
              <p>
                Clear information, compassionate connection, and pathways to
                appropriate care. A place to begin, without judgment.
              </p>
              <div className="home-hero-actions">
                <Link to="/support" className="support-button">
                  Find support
                  <ArrowUpRight size={20} aria-hidden="true" />
                </Link>
                <Link to="/knowledge-hub" className="support-text-link">
                  Explore the Knowledge Hub
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <div className="page-content support-home-content">
          <section
            className="support-section support-intro"
            id="explore-support"
            aria-labelledby="explore-support-title"
          >
            <div className="support-section-heading support-heading-row">
              <div>
                <span className="support-eyebrow">
                  A LITTLE UNDERSTANDING GOES A LONG WAY
                </span>
                <h2 id="explore-support-title">
                  Support starts with
                  <br />
                  <span>understanding.</span>
                </h2>
              </div>
              <p>
                Different experiences. One place to explore.
                <br />
                Clear information to help you choose your next step, at your own
                pace.
              </p>
            </div>
            <TopicCards />
            <p className="support-photo-note">
              Illustrative photography. The people pictured are not identified
              as clients, survivors, or people using substances.
            </p>
          </section>
          <section
            className="support-section support-help-section"
            aria-labelledby="help-today-title"
          >
            <div className="support-section-heading">
              <span className="support-eyebrow">YOUR NEXT STEP IS YOURS</span>
              <h2 id="help-today-title">
                How can we help
                <br />
                you today?
              </h2>
              <p>
                There is no single way to begin. Choose what feels closest to
                what you need.
              </p>
              <Flower2
                className="support-heading-flower"
                size={100}
                strokeWidth={0.8}
                aria-hidden="true"
              />
            </div>
            <Pathways />
          </section>
          <section
            className="support-section support-category-section"
            aria-labelledby="support-category-title"
          >
            <div className="support-section-heading">
              <span className="support-eyebrow">KNOW YOUR OPTIONS</span>
              <h2 id="support-category-title">
                The right information.
                <br />A clearer way forward.
              </h2>
              <p>
                Explore support by category. Before making contact, ask about
                opening hours, location, fees, languages, accessibility, and
                privacy.
              </p>
              <Link to="/support" className="support-text-link">
                Explore all support options
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="support-category-list">
              {supportCategories.map((category, i) => (
                <Link key={category.title} to={category.to}>
                  <span className="support-path-number">0{i + 1}</span>
                  <div>
                    <h3>{category.title}</h3>
                    <p>{category.text}</p>
                  </div>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
          <section
            className="support-section"
            aria-labelledby="resource-library-title"
          >
            <div className="support-section-heading support-heading-row">
              <div>
                <span className="support-eyebrow">THE RESOURCE LIBRARY</span>
                <h2 id="resource-library-title">
                  A little clarity.
                  <br />
                  Something to come back to.
                </h2>
              </div>
              <Link to="/resources" className="support-text-link">
                Browse all resources
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="support-resource-grid">
              {resourceTopics.map((resource, i) => (
                <Link key={resource.id} to={`/resources?topic=${resource.id}`}>
                  <span className="support-resource-top">
                    <span>GUIDE / 0{i + 1}</span>
                    <ArrowUpRight size={22} />
                  </span>
                  <h3>{resource.title}</h3>
                  <p>{resource.text}</p>
                  <span className="support-read-label">
                    Explore the guides
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <BlogPreview />
          <section
            className="support-section support-values-section"
            aria-labelledby="approach-title"
          >
            <div className="support-section-heading support-heading-row">
              <div>
                <span className="support-eyebrow">OUR APPROACH</span>
                <h2 id="approach-title">
                  Care begins with
                  <br />
                  how we treat each other.
                </h2>
              </div>
              <p>
                Mental health, personal safety, and substance use can be
                connected. Your circumstances and choices always matter.
              </p>
            </div>
            <Values />
          </section>
          <section
            className="support-programs"
            id="our-work"
            aria-labelledby="our-work-title"
          >
            <div className="support-section-heading">
              <span className="support-eyebrow">
                PROGRAMS & COMMUNITY ENGAGEMENT
              </span>
              <h2 id="our-work-title">
                Understanding grows
                <br />
                when we share it.
              </h2>
              <p>
                Our areas of focus for building safer, healthier communities
                through education and collaboration.
              </p>
              <Link to="/about" className="support-button">
                About our approach
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="support-program-list">
              {programs.map((program, i) => (
                <article key={program.title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{program.title}</h3>
                    <p>{program.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <UrgentStrip />
        </div>
        <CommunitySection />
      </main>
      <SiteFooter />
    </div>
  );
}
