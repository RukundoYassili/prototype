import { AwarenessActivities } from "./AwarenessActivities";
import { AwarenessIllustration } from "./AwarenessIllustration";
import { awarenessHero, awarenessScenes } from "./illustrations";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  HeartHandshake,
  MessageCircle,
  Shield,
  Sprout,
  ChevronDown,
} from "lucide-react";
import { loadAwarenessContent, resolveAwarenessResource } from "./content";
import "../support/information.css";
import "./awareness.css";

const content = loadAwarenessContent();
const Arrow = () => <ArrowUpRight size={18} aria-hidden="true" />;
const icons = {
  "mental-health": HeartHandshake,
  "understand-gbv": Shield,
  "alcohol-and-drugs": Sprout,
};

export default function AwarenessPage() {
  const { hash } = useLocation();
  const [audienceId, setAudienceId] = useState(content.audiences[0].id);
  const audience = content.audiences.find((item) => item.id === audienceId)!;
  const audienceResource = resolveAwarenessResource(audience.resource);
  return (
    <div className="support-page information-page awareness-page">
      <header className="information-hero awareness-hero">
        <div>
          <span className="support-eyebrow">AWARENESS & UNDERSTANDING</span>
          <h1>
            Understanding starts <br />
            <span>with a conversation.</span>
          </h1>
          <p>
            Clear information. More thoughtful conversations. Explore mental
            health, safety and respect, and alcohol and drugs—with practical
            ways to support yourself and the people around you.
          </p>
          <div className="awareness-hero-actions">
            <Link className="support-button" to="#awareness-topics">
              Explore the topics <Arrow />
            </Link>
            <Link className="support-text-link" to="/community">
              Explore community activities <Arrow />
            </Link>
          </div>
        </div>
        <AwarenessIllustration artwork={awarenessHero} priority />
      </header>

      <nav className="awareness-section-nav" aria-label="On this page">
        <span>A place to begin</span>
        {[
          ["awareness-topics", "Topics"],
          ["awareness-actions", "Everyday Actions"],
          ["awareness-campaigns", "Campaigns"],
          ["awareness-resources", "Resources"],
          ["awareness-questions", "Questions"],
        ].map(([id, label]) => (
          <Link
            key={id}
            to={`#${id}`}
            aria-current={hash === `#${id}` ? "location" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>

      <section
        className="support-section"
        id="awareness-topics"
        aria-labelledby="awareness-topics-title"
      >
        <div className="support-section-heading">
          <span className="support-eyebrow">
            LEARN A LITTLE. UNDERSTAND MORE.
          </span>
          <h2 id="awareness-topics-title">Three topics. Everyday relevance.</h2>
          <p>
            Start wherever your questions are. These introductions offer ideas
            to reflect on, not an assessment of your situation. All examples are
            fictional.
          </p>
        </div>
        <div className="awareness-lessons">
          {content.lessons.map((lesson, index) => {
            const Icon = icons[lesson.id];
            const resource = resolveAwarenessResource(lesson.resource);
            const source = content.sources.find(
              (item) => item.id === lesson.sourceId,
            )!;
            return (
              <article
                className="awareness-lesson"
                key={lesson.id}
                aria-labelledby={`${lesson.id}-lesson-title`}
              >
                <div className="awareness-lesson-intro">
                  <span className="awareness-lesson-number">
                    <Icon size={25} aria-hidden="true" /> 0{index + 1}
                  </span>
                  <h3 id={`${lesson.id}-lesson-title`}>{lesson.title}</h3>
                  <p>{lesson.intro}</p>
                  <AwarenessIllustration artwork={awarenessScenes[lesson.id]} />
                  <Link className="support-text-link" to={resource.to}>
                    Read more: {resource.title} <Arrow />
                  </Link>
                </div>
                <div className="awareness-lesson-body">
                  <h4>Three things to take with you</h4>
                  <ul>
                    {lesson.takeaways.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="awareness-example">
                    <span className="support-eyebrow">
                      A FICTIONAL EVERYDAY EXAMPLE
                    </span>
                    <p>{lesson.example}</p>
                  </div>
                  <div className="awareness-misconception">
                    <h4>A common misconception</h4>
                    <p className="awareness-quote">{lesson.misconception}</p>
                    <p>{lesson.explanation}</p>
                  </div>
                  <a className="awareness-source" href={source.url}>
                    Source: {source.title} <Arrow />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="awareness-actions"
        id="awareness-actions"
        aria-labelledby="awareness-actions-title"
      >
        <div className="support-section-heading">
          <span className="support-eyebrow">SMALL STEPS, IN YOUR OWN WAY</span>
          <h2 id="awareness-actions-title">What can I do today?</h2>
          <p>
            Choose a perspective for a few practical starting points. You can
            explore every option; nothing you select is saved.
          </p>
        </div>
        <div
          className="awareness-audience-buttons"
          role="group"
          aria-label="Choose your perspective"
        >
          {content.audiences.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={item.id === audienceId}
              aria-controls="awareness-audience-content"
              onClick={() => setAudienceId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          className="awareness-audience-content"
          id="awareness-audience-content"
          role="region"
          aria-label="Suggested everyday actions"
          aria-live="polite"
          aria-atomic="true"
        >
          <div>
            <h3>{audience.title}</h3>
            <p>{audience.intro}</p>
            <Link className="support-text-link" to={audienceResource.to}>
              {audienceResource.title} <Arrow />
            </Link>
          </div>
          <ol>
            {audience.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="support-section"
        aria-labelledby="awareness-conversations-title"
      >
        <div className="support-section-heading">
          <span className="support-eyebrow">WORDS THAT MAKE ROOM</span>
          <h2 id="awareness-conversations-title">
            Start a better conversation.
          </h2>
          <p>
            These fictional conversation starters are invitations, not scripts
            you have to follow. Reflection is optional—there is nothing to fill
            in or submit.
          </p>
        </div>
        <div className="awareness-conversation-grid">
          {content.conversations.map((item) => (
            <article className="information-card" key={item.title}>
              <MessageCircle size={24} aria-hidden="true" />
              <h3>{item.title}</h3>
              <blockquote>{item.words}</blockquote>
              <p>{item.text}</p>
              <div className="awareness-reflection">
                <span className="support-eyebrow">A MOMENT TO REFLECT</span>
                <p>{item.reflection}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="support-section"
        id="awareness-campaigns"
        aria-labelledby="awareness-campaigns-title"
      >
        <div className="awareness-programmes">
          <div className="support-section-heading">
            <span className="support-eyebrow">
              LEARNING THAT REACHES FURTHER
            </span>
            <h2 id="awareness-campaigns-title">
              Bring understanding
              <br />
              into shared spaces.
            </h2>
            <p>
              Campaigns and outreach can turn learning into conversation. These
              are educational programme descriptions, rather than announcements
              of confirmed activities.
            </p>
          </div>
          <div>
            {content.programmes.map((item, index) => (
              <article key={item.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <h3 className="awareness-activities-title">
          Confirmed community activities
        </h3>
        <AwarenessActivities activities={content.activities} />
      </section>

      <section
        className="support-section"
        id="awareness-resources"
        aria-labelledby="awareness-resources-title"
      >
        <div className="support-section-heading">
          <span className="support-eyebrow">
            YOUR NEXT QUESTION STARTS HERE
          </span>
          <h2 id="awareness-resources-title">Keep learning.</h2>
          <p>
            Go a little deeper with our existing learning collection. Check each
            resource’s review status before using it for a group session.
          </p>
        </div>
        <div className="awareness-resource-grid">
          {content.resources.map((item) => (
            <Link
              className="information-card awareness-reading-card"
              key={item.to}
              to={item.to}
            >
              {item.artwork && (
                <img
                  className="awareness-resource-cover"
                  src={`${item.artwork.base}-480.webp`}
                  srcSet={`${item.artwork.base}-480.webp 480w, ${item.artwork.base}-960.webp 960w, ${item.artwork.base}-1440.webp 1440w`}
                  sizes="(max-width: 640px) calc(100vw - 88px), (max-width: 1000px) 40vw, 380px"
                  width={1536}
                  height={1024}
                  alt={item.artwork.alt}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className="support-eyebrow">
                <BookOpen size={16} aria-hidden="true" /> {item.format}
              </span>
              <h3>{item.title}</h3>
              <span className="information-card-action">
                Continue reading <Arrow />
              </span>
            </Link>
          ))}
        </div>
        <p className="awareness-resource-disclosure">
          Resource artwork is illustrative and AI-generated. Existing learning
          covers are reused where available; none depicts actual participants.
        </p>
        <Link
          className="support-text-link awareness-hub-link"
          to="/knowledge-hub"
        >
          Browse the Knowledge Hub <Arrow />
        </Link>
      </section>

      <section
        className="support-section awareness-faq"
        id="awareness-questions"
        aria-labelledby="awareness-questions-title"
      >
        <div className="support-section-heading">
          <span className="support-eyebrow">A LITTLE MORE CLARITY</span>
          <h2 id="awareness-questions-title">Your questions, answered.</h2>
        </div>
        <div>
          {content.faqs.map((item) => (
            <details key={item.question}>
              <summary>
                <span>{item.question}</span>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <aside className="awareness-review">
        <p>
          <strong>About this content.</strong> {content.review.label} Sources
          checked{" "}
          <time dateTime={content.review.checkedAt}>11 November 2026</time>.
          Examples are fictional and do not describe actual participants.
        </p>
      </aside>
      <aside
        className="information-callout awareness-support"
        aria-labelledby="awareness-support-title"
      >
        <HeartHandshake size={34} aria-hidden="true" />
        <div>
          <h2 id="awareness-support-title">
            You can take the next step at your pace.
          </h2>
          <p>
            Find information about support and the questions you can ask before
            deciding what feels right for you. This website cannot respond to
            emergencies.
          </p>
        </div>
        <div className="awareness-support-links">
          <Link className="support-button" to="/support">
            Get support <Arrow />
          </Link>
          <Link className="support-text-link" to="/urgent-help">
            Urgent help information <Arrow />
          </Link>
        </div>
      </aside>
    </div>
  );
}
