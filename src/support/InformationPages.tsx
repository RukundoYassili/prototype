import {
  ArrowUpRight,
  BookOpen,
  Heart,
  HeartHandshake,
  Lightbulb,
  Megaphone,
  Shield,
  Sprout,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { BlogPreview } from "../blog/BlogPages";
import "./information.css";

function InformationHero({
  eyebrow,
  title,
  accent,
  description,
  image,
  position = "50% 42%",
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image: string;
  position?: string;
  children?: ReactNode;
}) {
  return (
    <header className="information-hero">
      <div>
        <span className="support-eyebrow">{eyebrow}</span>
        <h1>
          {title}
          <br />
          <span>{accent}</span>
        </h1>
        <p>{description}</p>
        {children}
      </div>
      <figure>
        <img
          src={`/images/${image}.webp`}
          alt={
            image === "mental-health-learning"
              ? "Illustrative photograph of a mental health learning workspace"
              : "Illustrative photograph of people connecting and listening together"
          }
          style={{ objectPosition: position }}
          width={2400}
          height={1600}
          fetchPriority="high"
        />
        <figcaption>
          Illustrative photography, not a photograph of our outreach
          participants.
        </figcaption>
      </figure>
    </header>
  );
}

function InformationCallout({
  title,
  text,
  to,
  action,
}: {
  title: string;
  text: string;
  to: string;
  action: string;
}) {
  return (
    <aside className="information-callout">
      <HeartHandshake size={34} strokeWidth={1.4} aria-hidden="true" />
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <Link className="support-button" to={to}>
        {action}
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </aside>
  );
}

export function KnowledgeHubPage() {
  return (
    <div className="support-page information-page">
      <InformationHero
        eyebrow="THE KNOWLEDGE HUB"
        title="A little clarity."
        accent="A way forward."
        description="Clear information, thoughtful reading, and practical guides for understanding mental health, personal safety, substance use, and the ways we support one another."
        image="mental-health-learning"
        position="63% 43%"
      >
        <Link className="support-button" to="#knowledge-topics">
          Explore the hub
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </InformationHero>
      <section
        className="support-section"
        id="knowledge-topics"
        aria-labelledby="knowledge-topics-title"
      >
        <div className="support-section-heading">
          <span className="support-eyebrow">CHOOSE WHAT MATTERS TO YOU</span>
          <h2 id="knowledge-topics-title">Understanding, at your pace.</h2>
        </div>
        <div className="information-grid information-hub-grid">
          {[
            {
              title: "Mental health",
              text: "Information about emotional well-being and what seeking support can involve.",
              to: "/mental-health",
              Icon: HeartHandshake,
            },
            {
              title: "Understand GBV",
              text: "Explore abuse, controlling behaviour, boundaries, and specialist support options.",
              to: "/understand-gbv",
              Icon: Shield,
            },
            {
              title: "Alcohol & Drugs",
              text: "Judgment-free information about substances, safer choices, and support pathways.",
              to: "/alcohol-and-drugs",
              Icon: Sprout,
            },
            {
              title: "Guides & Worksheets",
              text: "Plain-language reading, practical resources, and downloadable worksheets.",
              to: "/resources",
              Icon: BookOpen,
            },
            {
              title: "Blog",
              text: "Thoughtful articles about support, connection, and everyday well-being.",
              to: "/blog",
              Icon: Lightbulb,
            },
            {
              title: "Supporting someone",
              text: "Explore ways to listen and help while respecting another person’s choices.",
              to: "/support#help-someone",
              Icon: Users,
            },
          ].map(({ title, text, to, Icon }) => (
            <Link className="information-card" key={to} to={to}>
              <span className="information-card-icon">
                <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="information-card-action">
                Start exploring
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <BlogPreview />
    </div>
  );
}

export function DonatePage() {
  return (
    <div className="support-page information-page donation-page">
      <InformationHero
        eyebrow="SUPPORT OUR PURPOSE"
        title="More understanding."
        accent="Stronger connection."
        description="Thank you for wanting to stand alongside our community. Explore the purpose behind our work and the areas we’re building around care, information, and connection."
        image="mental-health-connection"
        position="50% 44%"
      >
        <Link className="support-button" to="/about">
          Explore our purpose
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </InformationHero>
      <section className="donation-layout" aria-labelledby="donation-title">
        <div>
          <span className="support-eyebrow">THE WORK WE CARE ABOUT</span>
          <h2 id="donation-title">
            Making room for
            <br />
            care and connection.
          </h2>
          <p>
            Our focus is on making support easier to understand and helping
            people explore their options with dignity.
          </p>
          <div className="donation-focus-list">
            {[
              {
                Icon: Megaphone,
                title: "Awareness & outreach",
                text: "Clear conversations that invite understanding rather than judgment.",
              },
              {
                Icon: BookOpen,
                title: "Accessible information",
                text: "Plain-language guides and clear pathways to appropriate support.",
              },
              {
                Icon: Users,
                title: "Community learning",
                text: "Space for people to connect, ask questions, and learn together.",
              },
            ].map(({ Icon, title, text }) => (
              <article key={title}>
                <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="donation-giving" aria-labelledby="giving-title">
          <span className="donation-giving-icon">
            <Heart size={28} strokeWidth={1.4} aria-hidden="true" />
          </span>
          <span className="support-eyebrow">GIVING WITH CLARITY</span>
          <h2 id="giving-title">Giving details are coming soon.</h2>
          <p>
            Online donations aren’t open yet. Our official giving options will
            appear here once they are confirmed.
          </p>
          <button
            className="support-button donation-unavailable"
            type="button"
            disabled
          >
            Donations not yet open
            <Heart size={16} aria-hidden="true" />
          </button>
          <p className="donation-detail">
            No payments or financial details are collected on this page.
          </p>
          <Link className="support-text-link" to="/awareness">
            Get to know our work
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </aside>
      </section>
    </div>
  );
}
