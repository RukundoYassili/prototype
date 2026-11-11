import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  HeartHandshake,
  ShieldCheck,
  Flower2,
  Globe2,
  Phone,
  Check,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { SiteHeader, SiteFooter } from "../SiteChrome";
import { useDemo } from "../services/DemoContext";
import {
  officialResources,
  pathways,
  topics,
  values,
  type TopicId,
  type OfficialResource,
} from "./content";

export function SupportLayout() {
  const { pathname } = useLocation();
  return (
    <div className="svc-app support-app">
      <a className="skip" href="#service-main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="service-main" tabIndex={-1}>
        <Outlet />
      </main>
      {pathname !== "/urgent-help" && <UrgentStrip />}
      <SiteFooter />
    </div>
  );
}

export function SupportAboutPage() {
  return (
    <div className="support-page">
      <section className="support-page-hero">
        <div>
          <span className="support-eyebrow">ABOUT US</span>
          <h1>
            Making support
            <br />
            easier to understand.
          </h1>
          <p>
            BetterHelp is dedicated to making support easier to understand and
            access through clear information, compassionate connection, and
            pathways to appropriate care.
          </p>
          <Link to="/support" className="support-button">
            Find your starting point
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <figure>
          <img
            src="/images/mental-health-listening.webp"
            alt="Illustrative photograph of a supportive conversation"
          />
          <figcaption>
            Illustrative photography, not a representation of our staff or
            clients.
          </figcaption>
        </figure>
      </section>
      <section className="support-section">
        <div className="support-section-heading">
          <span className="support-eyebrow">OUR PURPOSE</span>
          <h2>
            Clear information.
            <br />
            Compassionate connection.
          </h2>
          <p>
            A judgment-free place to explore mental health, gender-based
            violence, substance use, and ways to support others. These
            experiences can be connected, and everyone’s circumstances are
            different.
          </p>
        </div>
        <Values />
      </section>
      <section className="support-supporter">
        <Flower2 size={40} />
        <div>
          <h2>Your choices come first.</h2>
          <p>
            You can read information without an account or sharing your story.
            We link to independent official information, explain the limits of
            this website, and encourage you to ask services about privacy,
            accessibility, and eligibility.
          </p>
          <Link to="/#our-work" className="support-text-link">
            Explore our areas of focus
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <p className="support-note">
        BetterHelp is a temporary name for this independent website and is not
        affiliated with the official BetterHelp service. This site provides
        information, not care or emergency response. The separate booking and
        professional-profile previews use fictional data.
      </p>
    </div>
  );
}

export function TopicCards() {
  return (
    <div className="support-topic-grid">
      {topics.map((topic, i) => (
        <article
          className={`support-topic-card support-tone-${i}`}
          key={topic.id}
        >
          <Link
            to={`/${topic.id}`}
            className="support-topic-link"
            aria-label={topic.action}
          >
            <div className="support-topic-photo">
              <img
                src={`/images/${topic.image}.webp`}
                alt=""
                loading="lazy"
                style={{ objectPosition: topic.imagePosition }}
              />
              <span className="support-card-number">0{i + 1}</span>
            </div>
            <div className="support-topic-body">
              <span className="support-eyebrow">{topic.eyebrow}</span>
              <h3>{topic.title}</h3>
              <p>{topic.summary}</p>
              <span className="support-card-action">
                {topic.action}
                <ArrowUpRight size={20} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

export function Pathways() {
  return (
    <div className="support-pathways">
      {pathways.map((path, i) => (
        <Link to={path.to} key={path.title} className="support-pathway">
          <span className="support-path-number">0{i + 1}</span>
          <div>
            <h3>{path.title}</h3>
            <p>{path.text}</p>
          </div>
          <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export function Values() {
  return (
    <div className="support-values">
      {values.map((value, i) => (
        <article key={value.title}>
          <span className="support-value-icon" aria-hidden="true">
            {
              [
                <HeartHandshake key="h" />,
                <Flower2 key="f" />,
                <Globe2 key="g" />,
                <ShieldCheck key="s" />,
              ][i]
            }
          </span>
          <h3>{value.title}</h3>
          <p>{value.text}</p>
        </article>
      ))}
    </div>
  );
}

export function UrgentStrip() {
  return (
    <section className="support-urgent" aria-labelledby="urgent-strip-title">
      <div>
        <span className="support-eyebrow">WHEN HELP CANNOT WAIT</span>
        <h2 id="urgent-strip-title">Need urgent assistance?</h2>
        <p>
          This website cannot respond to emergencies. Explore official
          information for your location.
        </p>
      </div>
      <Link to="/urgent-help" className="support-button support-button-outline">
        Urgent help information
        <ArrowUpRight size={18} />
      </Link>
    </section>
  );
}

export function SourceCards({ records }: { records: OfficialResource[] }) {
  return (
    <div className="support-source-grid">
      {records.map((source) => (
        <article className="support-source" key={source.id}>
          <span className="support-eyebrow">
            {source.region} · EXTERNAL RESOURCE
          </span>
          <h3>{source.title}</h3>
          <p>{source.description}</p>
          {source.caveat && (
            <p className="support-source-caveat">{source.caveat}</p>
          )}
          <div className="support-source-actions">
            {source.phone && (
              <a className="support-phone" href={`tel:${source.phone}`}>
                <Phone size={15} />
                Call {source.phone}
              </a>
            )}
            <a href={source.url} target="_blank" rel="noreferrer">
              Official information
              <ArrowUpRight size={16} />
            </a>
          </div>
          <small>
            Source checked{" "}
            {new Date(`${source.checkedAt}T12:00:00Z`).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              },
            )}
            . Confirm current details with the organization.
          </small>
        </article>
      ))}
    </div>
  );
}

function RegionPreference() {
  const { region, setRegion } = useDemo();
  return (
    <label className="support-region">
      <Globe2 size={18} aria-hidden="true" />
      <span>Support location</span>
      <select
        aria-label="Support location"
        value={region}
        onChange={(e) =>
          setRegion(e.target.value as "Rwanda" | "International")
        }
      >
        <option value="Rwanda">Rwanda</option>
        <option value="International">International</option>
      </select>
    </label>
  );
}

export function TopicPage({
  id,
  chapters,
}: {
  id: TopicId;
  chapters?: import("react").ReactNode;
}) {
  const topic = topics.find((item) => item.id === id)!;
  const { region } = useDemo();
  const records = officialResources.filter(
    (source) =>
      topic.sourceIds.includes(source.id) &&
      (source.region === region ||
        (region === "Rwanda" && source.id.startsWith("who-"))),
  );
  return (
    <div className={`support-page support-topic-page topic-${id}`}>
      <section className="support-page-hero">
        <div>
          <Link className="support-back" to="/support">
            <ArrowLeft size={15} aria-hidden="true" />
            Get support
          </Link>
          <span className="support-eyebrow">{topic.label}</span>
          <h1>{topic.headline}</h1>
          <p>{topic.intro}</p>
          <a href="#support-options" className="support-button">
            Explore support options
            <ArrowUpRight size={18} />
          </a>
        </div>
        <figure>
          <img
            src={`/images/${topic.image}.webp`}
            alt="Illustrative photograph of people connecting and offering support"
            style={{ objectPosition: topic.imagePosition }}
          />
          <figcaption>
            Illustrative photography; people pictured are not identified as
            service users.
          </figcaption>
        </figure>
      </section>
      <nav className="support-topic-jumps" aria-label="On this page">
        <span>ON THIS PAGE</span>
        {chapters && <a href="#gbv-chapters">Chapters</a>}
        <a href="#understanding">Understanding</a>
        <a href="#support-options">Support options</a>
        <a href="#official-resources">Official resources</a>
        <a href="#for-supporters">For supporters</a>
      </nav>
      {chapters}
      <section className="support-section" id="understanding">
        <div className="support-section-heading">
          <span className="support-eyebrow">A LITTLE CLARITY</span>
          <h2>Understanding is a place to begin.</h2>
        </div>
        <div className="support-guidance-grid">
          {topic.guidance.map((item, i) => (
            <article key={item.title}>
              <span className="support-path-number">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="support-section support-expect" id="support-options">
        <div>
          <span className="support-eyebrow">AT YOUR PACE</span>
          <h2>Options to explore.</h2>
          <ul className="support-check-list">
            {topic.options.map((item) => (
              <li key={item}>
                <Check size={18} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Before your first conversation</h3>
          <ol>
            {topic.expect.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p className="support-note">
            You do not need to tell your story on this website. It does not
            assess needs, deliver care, or arrange appointments.
          </p>
        </div>
      </section>
      <section className="support-section" id="official-resources">
        <div className="support-section-heading support-heading-row">
          <div>
            <span className="support-eyebrow">INFORMATION YOU CAN FOLLOW</span>
            <h2>Find your next point of contact.</h2>
          </div>
          <RegionPreference />
        </div>
        <p className="support-section-intro">
          These links lead to independent organizations and public information.
          They are not affiliated with this site. Ask about eligibility, hours,
          fees, language, accessibility, and privacy before contacting a
          service.
        </p>
        <SourceCards records={records} />
      </section>
      <section className="support-supporter" id="for-supporters">
        <HeartHandshake size={36} aria-hidden="true" />
        <div>
          <span className="support-eyebrow">
            FOR FRIENDS, FAMILY & SUPPORTERS
          </span>
          <h2>Being there can start with listening.</h2>
          <p>{topic.supporter}</p>
          <Link className="support-text-link" to="/resources?topic=supporters">
            Read supporter guidance
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="support-section support-related">
        <div>
          <span className="support-eyebrow">KEEP EXPLORING</span>
          <h2>Clear information. Your own pace.</h2>
        </div>
        <Link to={`/resources?topic=${topic.id}`} className="support-button">
          Browse related resources
          <ArrowUpRight size={18} />
        </Link>
      </section>
      <p className="support-note">
        General educational information, not a diagnosis or personalized medical
        or legal advice. The official resources above provide further context.
      </p>
    </div>
  );
}

export function SupportPage() {
  return (
    <div className="support-page">
      <header className="support-title">
        <span className="support-eyebrow">A CLEARER WAY FORWARD</span>
        <h1>
          Start wherever
          <br />
          you are.
        </h1>
        <p>
          You do not need the right words or a diagnosis to explore your
          options. Choose what feels most useful to you today.
        </p>
      </header>
      <Pathways />
      <section className="support-section">
        <div className="support-section-heading">
          <span className="support-eyebrow">THREE PLACES TO BEGIN</span>
          <h2>Different needs. The same respect.</h2>
        </div>
        <TopicCards />
        <p className="support-photo-note">
          Illustrative photography. The people pictured are not identified as
          clients, survivors, or people using substances.
        </p>
      </section>
      <section className="support-section support-practical-grid">
        <article id="health-referrals">
          <span className="support-eyebrow">HEALTH SERVICES & REFERRALS</span>
          <h2>Ask before you connect.</h2>
          <p>
            A local health service can explain assessment and referral routes.
            In Rwanda, the RBC health call centre provides health-service
            information.
          </p>
          <ul>
            <li>Is a referral or appointment required?</li>
            <li>What are the opening hours, fees, and eligibility rules?</li>
            <li>
              Which languages and accessibility arrangements are available?
            </li>
            <li>How is personal information handled?</li>
          </ul>
          <SourceCards
            records={officialResources.filter((source) => source.id === "rbc")}
          />
        </article>
        <article id="legal-practical">
          <span className="support-eyebrow">LEGAL & PRACTICAL ASSISTANCE</span>
          <h2>Understand the options.</h2>
          <p>
            Specialist services can explain reporting and protection pathways.
            Ask about available legal assistance, accommodation referrals, and
            any reporting obligations; availability depends on your situation
            and location.
          </p>
          <SourceCards
            records={officialResources.filter(
              (source) => source.id === "isange",
            )}
          />
        </article>
      </section>
      <section className="support-supporter" id="help-someone">
        <HeartHandshake size={40} aria-hidden="true" />
        <div>
          <span className="support-eyebrow">HELPING SOMEONE ELSE</span>
          <h2>You don’t need to have every answer.</h2>
          <p>
            Ask if it is a safe time to talk. Listen without judgment, ask what
            would help, and respect their choices. Offer practical support
            without taking over. Consider safe contact methods and be honest
            about your own limits.
          </p>
          <Link to="/resources?topic=supporters" className="support-text-link">
            Explore supporter guidance
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="support-section">
        <div className="support-section-heading">
          <span className="support-eyebrow">ACCESS & PRIVACY</span>
          <h2>A few things to know.</h2>
        </div>
        <div className="support-faq">
          <details>
            <summary>Do I need to share personal information here?</summary>
            <p>
              No. The support information pages have no intake forms, diagnostic
              questionnaires, or accounts. External services have their own
              privacy practices.
            </p>
          </details>
          <details>
            <summary>What accessibility and languages are available?</summary>
            <p>
              This site supports keyboard navigation and reduced motion. Content
              is currently in English, with other languages planned. Ask each
              external provider about interpretation, physical access, and
              communication arrangements.
            </p>
          </details>
          <details>
            <summary>
              Are the services and bookings on this website real?
            </summary>
            <p>
              The support links lead to independent public resources. The
              separate <Link to="/services">service catalog</Link> and booking
              pages remain demonstrations with fictional profiles; no real
              appointment is arranged.
            </p>
          </details>
          <details>
            <summary>Does Quick exit remove browsing history?</summary>
            <p>
              No. It immediately replaces the current page with Google. It does
              not clear browsing history, downloads, device monitoring, or
              records held by networks and other services.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}

export function UrgentHelpPage() {
  const { region } = useDemo();
  return (
    <div className="support-page support-urgent-page">
      <header className="support-title">
        <span className="support-eyebrow">URGENT HELP</span>
        <h1>
          Some things
          <br />
          shouldn’t wait.
        </h1>
        <p>
          This website is not monitored and cannot respond to emergencies. If
          someone is in immediate danger, contact local emergency services or go
          to the nearest emergency department when safe.
        </p>
        <RegionPreference />
      </header>
      {region === "Rwanda" ? (
        <>
          <section
            className="support-emergency-numbers"
            aria-label="Rwanda emergency contacts"
          >
            <article>
              <span>Immediate emergency</span>
              <a href="tel:112">
                112
                <ArrowUpRight />
              </a>
              <p>Government of Rwanda emergency number</p>
            </article>
            <article>
              <span>Ambulance</span>
              <a href="tel:912">
                912
                <ArrowUpRight />
              </a>
              <p>Emergency medical transport</p>
            </article>
            <article>
              <span>GBV assistance</span>
              <a href="tel:3029">
                3029
                <ArrowUpRight />
              </a>
              <p>Isange One Stop Centre assistance</p>
            </article>
          </section>
          <p className="support-note">
            Isange contact may lead to a law-enforcement report. If possible,
            ask about confidentiality before sharing identifying details.
          </p>
          <SourceCards
            records={officialResources.filter((source) =>
              ["emergency", "isange", "rbc"].includes(source.id),
            )}
          />
        </>
      ) : (
        <>
          <section className="support-expect">
            <div>
              <h2>Outside Rwanda</h2>
              <p>
                Emergency numbers vary by country. Contact your local emergency
                service for immediate danger. The links below offer country
                information; they are not crisis lines or emergency responders.
              </p>
            </div>
          </section>
          <SourceCards
            records={officialResources.filter((source) =>
              ["who-countries", "unhcr"].includes(source.id),
            )}
          />
        </>
      )}
      <section className="support-section">
        <h2>Choose a safe way to make contact.</h2>
        <p className="support-section-intro">
          Consider whether calls, messages, or browsing could be monitored. Use
          a safer device or contact method if available. Quick exit changes the
          page immediately, but does not erase history or monitoring records.
        </p>
        <Link to="/support" className="support-text-link">
          Explore routine support
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
