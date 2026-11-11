import { SiteHeader, SiteFooter } from "../SiteChrome";
import { UrgentStrip } from "../support/SupportPages";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  Clock,
  Flower2,
  Globe2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Button, Modal, Select } from "../system/components";
import { useDemo, formatSlot } from "./DemoContext";
import { categoryLabel, type Service } from "./data";

export function ServiceCard({
  service,
  presentation = "default",
}: {
  service: Service;
  presentation?: "default" | "editorial";
}) {
  const { saved, toggleSaved, price, availableSlots, timezone } = useDemo();
  const next = availableSlots(service.id)[0];
  return (
    <article
      className={`svc-card ${presentation === "editorial" ? "svc-card--editorial" : ""}`}
    >
      <Link
        className="svc-card-photo"
        to={`/services/${service.id}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <img src={`/images/${service.image}.webp`} alt="" loading="lazy" />
        <span className={`svc-category ${service.category}`}>
          {categoryLabel(service.category)}
        </span>
      </Link>
      <button
        type="button"
        className={`svc-save ${saved.includes(service.id) ? "saved" : ""}`}
        aria-label={`${saved.includes(service.id) ? "Unsave" : "Save"} ${service.title}`}
        aria-pressed={saved.includes(service.id)}
        onClick={() => toggleSaved(service.id)}
      >
        <Bookmark
          size={17}
          fill={saved.includes(service.id) ? "currentColor" : "none"}
        />
      </button>
      <div className="svc-card-body">
        <div className="svc-meta">
          <span>{service.kind}</span>
          <span>·</span>
          <span>
            <Clock size={12} />
            {service.duration} min
          </span>
        </div>
        <h3>
          <Link to={`/services/${service.id}`}>{service.title}</Link>
        </h3>
        <p>{service.description}</p>
        <div className="svc-card-facts">
          <span>
            <Globe2 size={12} />
            {service.formats.join(" / ")}
          </span>
          <span>{service.languages.join(" · ")}</span>
        </div>
        <div className="svc-next">
          {next
            ? `Next: ${formatSlot(next.startsAt, timezone)}`
            : "No demo sessions available"}
        </div>
        <div className="svc-card-bottom">
          <span>
            <strong>{price(service)}</strong>
            <small>
              {price(service) === "Free"
                ? "Complimentary demo"
                : "Illustrative price / session"}
            </small>
          </span>
          <Link
            to={`/services/${service.id}`}
            className={
              presentation === "editorial"
                ? "svc-explore-service"
                : "svc-circle"
            }
            aria-label={`Explore ${service.title}`}
          >
            {presentation === "editorial" && "Explore service"}
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}
export function DemoNote({ children }: { children?: React.ReactNode }) {
  return (
    <div className="svc-demo-note">
      <ShieldCheck size={15} />
      <span>
        {children ||
          "Interactive demo · Fictional profiles and example prices. No real appointments, payments, or submissions."}
      </span>
    </div>
  );
}
export function Empty({
  title = "Nothing here just yet.",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="svc-empty">
      <Flower2 size={38} />
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export function MatchingDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { services, price } = useDemo();
  const [goal, setGoal] = useState(""),
    [category, setCategory] = useState("any"),
    [language, setLanguage] = useState("English"),
    [format, setFormat] = useState("Any"),
    [budget, setBudget] = useState("Any"),
    [results, setResults] = useState(false);
  const matches = services
    .filter(
      (s) =>
        s.active &&
        (category === "any" || s.category === category) &&
        s.languages.includes(language as "English") &&
        (format === "Any" || s.formats.includes(format as "Online")) &&
        (budget !== "Free only" || s.priceRwf === 0),
    )
    .map((service) => ({ service, score: service.tags.includes(goal) ? 2 : 0 }))
    .filter((result) => result.score > 0)
    .slice(0, 3);
  useEffect(() => {
    if (open) setResults(false);
  }, [open]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      focusKey={results ? "results" : "preferences"}
      title={results ? "A few places to begin." : "Find your kind of support."}
    >
      {results ? (
        <div className="svc-form svc-matching-form">
          <p>
            These suggestions match your preferences only. They are not a
            diagnosis or a clinical assessment.
          </p>
          {matches.length ? (
            matches.map(({ service }) => (
              <Link
                key={service.id}
                className="svc-match-result"
                to={`/services/${service.id}`}
                onClick={onClose}
              >
                <span>
                  <strong>{service.title}</strong>
                  <small>
                    Matches “{goal}” · {language} · {price(service)}
                  </small>
                </span>
                <ArrowUpRight size={20} />
              </Link>
            ))
          ) : (
            <div role="status">
              <p>
                No exact match. Try adjusting your preferences or browse all
                services.
              </p>
            </div>
          )}
          <Button variant="secondary" onClick={() => setResults(false)}>
            Adjust preferences
          </Button>
        </div>
      ) : (
        <form
          className="svc-form svc-matching-form"
          onSubmit={(e) => {
            e.preventDefault();
            setResults(true);
          }}
        >
          <p>
            Five simple preferences. No health history, no score, and no
            pressure to share anything personal.
          </p>
          <Select
            label="What would you like to make room for?"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          >
            <option value="">Choose a goal</option>
            {[
              "Move with ease",
              "Find everyday calm",
              "Talk to someone",
              "Connect with others",
              "Build a routine",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
          <Select
            label="Preferred kind of support"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="any">Open to either</option>
            <option value="wellness">Wellness</option>
            <option value="mental-health">Mental health support</option>
          </Select>
          <Select
            label="Preferred language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {["English", "Kinyarwanda", "French"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
          <Select
            label="Preferred format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            {["Any", "Online", "In person"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
          <Select
            label="Budget preference"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            {["Any", "Free only", "Open to paid services"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
          <Button type="submit">
            See my suggestions <ArrowRight size={16} />
          </Button>
        </form>
      )}
    </Modal>
  );
}

export function ServiceLayout() {
  const [matching, setMatching] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setMatching(false);
  }, [pathname]);
  return (
    <div className="svc-app">
      <a className="skip" href="#service-main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="service-main" tabIndex={-1}>
        <Outlet context={{ openMatching: () => setMatching(true) }} />
      </main>
      <UrgentStrip />
      <SiteFooter />
      <MatchingDialog open={matching} onClose={() => setMatching(false)} />
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="svc-page-heading">
      <div>
        <span className="svc-eyebrow">
          <span className="svc-dot" />
          {eyebrow}
        </span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="svc-check-list">
      {items.map((item) => (
        <li key={item}>
          <Check size={16} />
          {item}
        </li>
      ))}
    </ul>
  );
}
export function LocationNote({ format }: { format: string }) {
  return (
    <p className="svc-location">
      <MapPin size={15} />
      {format === "Online"
        ? "Online · joining instructions are not generated in this demo."
        : "Kigali, Rwanda · demonstration location only. No venue is reserved."}
    </p>
  );
}
