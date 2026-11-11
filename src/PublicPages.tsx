import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button, Modal } from "./system/components";
import { DemoNote } from "./services/Shared";
import { useDemo } from "./services/DemoContext";

function PublicHero({
  eyebrow,
  title,
  description,
  image,
  alt,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}) {
  return (
    <section className="public-hero">
      <div>
        <span className="svc-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link className="site-cta" to="/services">
          Explore your support <ArrowUpRight size={17} />
        </Link>
      </div>
      <img src={`/images/${image}.webp`} alt={alt} />
    </section>
  );
}

export function ExpertisePage() {
  const { professionals } = useDemo();
  const active = professionals.filter((p) => p.active);
  return (
    <div className="svc-content public-page">
      <PublicHero
        eyebrow="PEOPLE, PRACTICE & POSSIBILITY"
        title="Support starts with understanding."
        description="Find a way to move, pause, or connect that feels right for you. Explore different approaches and the people behind our example services."
        image="hero-meditation"
        alt="A quiet outdoor meditation practice"
      />
      <section className="public-section">
        <span className="svc-eyebrow">OUR APPROACH</span>
        <h2>Different needs. Room for each.</h2>
        <div className="public-grid">
          {[
            [
              "Move at your own pace",
              "Gentle movement and yoga experiences, with formats and preparation explained before you choose.",
              "wellness",
            ],
            [
              "Make space to pause",
              "Guided meditation and everyday routines that invite you to take a moment for yourself.",
              "wellness",
            ],
            [
              "Find a conversation",
              "Explore sample counseling and peer-support formats, with clear boundaries about what each experience offers.",
              "mental-health",
            ],
          ].map(([title, text, category]) => (
            <article className="public-card" key={title}>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link
                  className="svc-yellow-link"
                  to={`/services?category=${category}`}
                >
                  Explore services <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="public-section">
        <span className="svc-eyebrow">MEET THE GUIDES</span>
        <h2>A human introduction.</h2>
        <p className="public-intro">
          Compare specialties, languages, and formats before exploring available
          sessions.
        </p>
        <DemoNote>
          These profiles are fictional. Photography is illustrative, credentials
          are unverified, and no professional care is delivered here.
        </DemoNote>
        <div className="public-grid public-professionals">
          {active.map((p) => (
            <article className="public-card" key={p.id}>
              <img
                src={`/images/${p.image}.webp`}
                alt="Illustrative profile photography"
                loading="lazy"
              />
              <div>
                <span className="svc-eyebrow">FICTIONAL PROFILE</span>
                <h3>{p.name}</h3>
                <p>{p.role}</p>
                <ul>
                  {p.specialties.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <small>
                  {p.languages.join(" · ")}
                  <br />
                  {p.formats.join(" / ")}
                </small>
                <Link className="svc-yellow-link" to={`/professionals/${p.id}`}>
                  Explore profile <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {!active.length && (
          <p role="status">
            No sample professionals are currently available.{" "}
            <Link to="/services">Explore other services.</Link>
          </p>
        )}
      </section>
    </div>
  );
}

const stories = [
  {
    title: "Starting small, finding a rhythm.",
    image: "stretch",
    topic: "Mindful movement",
    intro: "An illustrative story about making room for a gentle routine.",
    paragraphs: [
      "In this fictional scenario, a person curious about movement begins by exploring a short, gentle session rather than committing to a demanding routine.",
      "They compare the format and language options, read the preparation information, and choose a sample session that fits their day. The focus is on comfort and choice, rather than achieving a particular result.",
      "This is an example of how someone might explore the website. It is not a customer testimonial or evidence of a health outcome.",
    ],
  },
  {
    title: "A quiet moment in a busy day.",
    image: "hero-meditation",
    topic: "Everyday calm",
    intro: "An example of exploring a pause without pressure to get it right.",
    paragraphs: [
      "This fictional visitor wants to make a little space in a full schedule. They browse guided practices and read about what a meditation session involves.",
      "They start with an optional resource and consider whether a guided session would suit their preferences. There is no score, assessment, or expectation to share personal information.",
      "This illustrative story does not describe a real participant and makes no promise about results.",
    ],
  },
  {
    title: "Finding a place to connect.",
    image: "event",
    topic: "Shared experiences",
    intro: "A fictional introduction to choosing a group experience.",
    paragraphs: [
      "In this example, a visitor is interested in connecting with others but wants to understand a group format before participating.",
      "They review the facilitator profile, available languages, and group boundaries, then explore a demo place. They can revisit or cancel the sample booking in My space.",
      "No real group, participant experience, or verified outcome is represented by this story.",
    ],
  },
];
export function StoriesPage() {
  const [selected, setSelected] = useState<(typeof stories)[number] | null>(
    null,
  );
  return (
    <div className="svc-content public-page">
      <PublicHero
        eyebrow="SMALL MOMENTS, DIFFERENT PATHS"
        title="There’s more than one way to begin."
        description="Movement, quiet, connection. Explore illustrative stories about finding a starting point that fits everyday life."
        image="hero-movement"
        alt="An illustrative mindful movement practice"
      />
      <DemoNote>
        All stories on this page are fictional scenarios, not testimonials.
        Images do not identify real participants. No outcomes or ratings are
        verified.
      </DemoNote>
      <section className="public-section">
        <h2>A little inspiration for your next step.</h2>
        <div className="public-grid">
          {stories.map((story) => (
            <article className="public-card" key={story.title}>
              <img src={`/images/${story.image}.webp`} alt="" loading="lazy" />
              <div>
                <span className="svc-eyebrow">
                  ILLUSTRATIVE STORY · {story.topic}
                </span>
                <h3>{story.title}</h3>
                <p>{story.intro}</p>
                <button onClick={() => setSelected(story)}>
                  Read story: {story.topic} <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="public-banner">
        <h2>Find your own starting point.</h2>
        <p>
          Browse services by your preferences, or explore a short resource
          first.
        </p>
        <Link to="/resources" className="site-cta">
          Explore resources <ArrowUpRight size={16} />
        </Link>
      </div>
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || ""}
      >
        <div className="svc-form">
          <span className="svc-eyebrow">ILLUSTRATIVE STORY</span>
          {selected?.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Link
            to="/services"
            className="site-cta"
            onClick={() => setSelected(null)}
          >
            Explore services <ArrowUpRight size={16} />
          </Link>
        </div>
      </Modal>
    </div>
  );
}

export { SupportAboutPage as AboutPage } from "./support/SupportPages";

export function ContactPage() {
  const [done, setDone] = useState(false);
  return (
    <div className="svc-content public-page">
      <div className="public-title">
        <span className="svc-eyebrow">LET’S MAKE THINGS CLEARER</span>
        <h1>A little help finding your way.</h1>
        <p>
          Have a question about this experience? Explore the enquiry form below.
          This is a local preview, so nothing is sent.
        </p>
      </div>
      <div className="contact-layout">
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.currentTarget.reset();
            setDone(true);
          }}
          onChange={() => setDone(false)}
        >
          <label>
            What is your enquiry about?
            <select name="purpose" required defaultValue="">
              <option value="" disabled>
                Choose a topic
              </option>
              <option>Finding a service</option>
              <option>Accessibility arrangements</option>
              <option>Using this prototype</option>
              <option>Something else</option>
            </select>
          </label>
          <label>
            Your name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          <label>
            Your question
            <textarea name="message" rows={5} required maxLength={2000} />
          </label>
          <small>
            Please use fictional details. Do not include health histories or
            sensitive information. Fields are cleared after validation; no
            enquiry is created or sent.
          </small>
          <Button type="submit">
            Preview enquiry <ArrowUpRight size={16} />
          </Button>
          {done && (
            <div role="status" className="svc-notice">
              Your enquiry passed validation. Nothing was sent or saved, and no
              reply will follow.
            </div>
          )}
        </form>
        <aside>
          <section className="public-banner">
            <h2>Looking for a session?</h2>
            <p>
              Compare services, formats, languages, and illustrative
              availability in one place.
            </p>
            <Link to="/services?consultation=1" className="site-cta">
              Find a service <ArrowUpRight size={16} />
            </Link>
          </section>
          <section className="public-section">
            <h2>Before you ask.</h2>
            <p className="public-intro">
              Find answers about accessibility and how this demo works.
            </p>
            <Link className="svc-yellow-link" to="/services#accessibility">
              Accessibility & FAQs <ArrowUpRight size={17} />
            </Link>
          </section>
          <DemoNote>
            This form is not monitored and cannot provide care or respond to
            emergencies. Use the urgent-support information below for official
            regional resources.
          </DemoNote>
        </aside>
      </div>
    </div>
  );
}

export function PolicyPage({ kind }: { kind: "privacy" | "terms" }) {
  const privacy = kind === "privacy";
  const sections = privacy
    ? [
        [
          "Temporary activity",
          "Saved services, example appointments, regional preferences, feedback, and admin-preview edits are held in React memory. Refreshing the page resets this activity. No account or authentication is implemented.",
        ],
        [
          "Information entered in forms",
          "Booking contact fields are used within the open booking dialog and discarded on completion or closure. The contact form validates locally and clears its fields after validation. Newsletter signup stays unavailable until a mailing-list connection is configured. When enabled, the email you submit is sent to that connection; it is not saved in this browser. The subscription provider’s privacy terms must be supplied before signup is activated. Avoid entering real or sensitive information into this prototype.",
        ],
        [
          "Resources and downloads",
          "Worksheets download to your device. Completed answers are not collected by this website. Browser download history and files on your device are managed by your browser and operating system.",
        ],
        [
          "Browsing and Quick exit",
          "Support information pages do not ask for your story or health details. Search terms and resource filters appear in page URLs and may remain in browser history. Quick exit replaces the current page with Google; it does not erase browsing history, downloads, device monitoring, or network records. External websites have their own privacy practices.",
        ],
        [
          "Storage, assets, and external links",
          "The application does not intentionally persist activity in cookies or browser storage. Photographs and fonts are served locally. Your browser may cache assets. Links to external information open third-party websites with their own privacy practices; hosting and browser infrastructure may process technical connection information.",
        ],
        [
          "Before production use",
          "This describes the current prototype only. A production privacy policy must be reviewed against the actual organization, hosting, processors, data collection, retention, and user rights before real data is accepted.",
        ],
      ]
    : [
        [
          "A demonstration experience",
          "This is a local reference recreation, not the official BetterHelp website. Services, professional profiles, prices, availability, and appointments are examples. Profiles are fictional and credentials are unverified.",
        ],
        [
          "No real appointments or payments",
          "Booking, rescheduling, cancelling, saving services, and editing admin-preview records only change temporary demo state. No real reservation, payment, account, message, or professional relationship is created.",
        ],
        [
          "Information and service boundaries",
          "Resources and illustrative stories provide general information and examples. They are not clinical assessments, diagnoses, personalized advice, or evidence of outcomes. This website does not deliver care or monitor requests for help.",
        ],
        [
          "Your use of the preview",
          "Use fictional data when trying forms. The administration preview is public and contains sample records only. Activity resets on refresh. Do not rely on this preview for real appointments or urgent assistance.",
        ],
        [
          "Before production use",
          "These prototype-use notes are not production service terms. Actual provider responsibilities, eligibility, charges, cancellation terms, privacy arrangements, and applicable policies require review before a real service launches.",
        ],
      ];
  return (
    <div className="svc-content public-page policy-page">
      <div className="public-title">
        <span className="svc-eyebrow">THE DETAILS, IN PLAIN LANGUAGE</span>
        <h1>
          {privacy ? "Your privacy in this preview." : "Using this prototype."}
        </h1>
        <p>
          {privacy
            ? "How this demonstration handles the information you enter."
            : "What you can expect when exploring this demonstration."}
        </p>
      </div>
      <DemoNote>
        Prototype information only. Production policy content requires review
        before launch.
      </DemoNote>
      {sections.map(([title, text]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{text}</p>
        </section>
      ))}
      <p>
        Explore{" "}
        <Link to={privacy ? "/terms" : "/privacy"}>
          {privacy ? "prototype terms" : "privacy information"}
        </Link>{" "}
        or visit <Link to="/contact">Contact</Link> to try the demo enquiry
        form.
      </p>
    </div>
  );
}
