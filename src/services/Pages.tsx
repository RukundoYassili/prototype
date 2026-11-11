import { useState } from "react";
import {
  Link,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Download,
  Flower2,
  Globe2,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { Button, Checkbox, Input, Modal, Select } from "../system/components";
import { useDemo, formatSlot } from "./DemoContext";
import {
  officialResources,
  resourceTopics,
  supportArticles,
} from "../support/content";
import {
  categoryLabel,
  languages,
  resources,
  type DemoBooking,
  type Resource,
  type Service,
} from "./data";
import {
  CheckList,
  DemoNote,
  Empty,
  LocationNote,
  PageHeading,
  ServiceCard,
} from "./Shared";

const image = (name: string) => `/images/${name}.webp`;
export function ServicesPage() {
  const demo = useDemo();
  const { openMatching } = useOutletContext<{ openMatching: () => void }>();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const setFilter = (key: string, value: string) => {
    // Read the latest history entry so rapid filter changes do not overwrite
    // another navigation that React has not rendered yet.
    const next = new URLSearchParams(window.location.search);
    if (value === "all" || !value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: key === "q" });
  };
  const q = params.get("q") || "",
    category = params.get("category") || "all",
    cost = params.get("cost") || "all",
    format = params.get("format") || "all",
    language = params.get("language") || "all",
    availability = params.get("availability") || "all";
  const selections = [
    { key: "q", value: q, label: `Search: ${q}` },
    {
      key: "category",
      value: category,
      label: category === "wellness" ? "Wellness" : "Mental health support",
    },
    { key: "cost", value: cost, label: cost === "free" ? "Free" : "Paid" },
    { key: "format", value: format, label: format },
    { key: "language", value: language, label: language },
    {
      key: "availability",
      value: availability,
      label: `Next ${availability} days`,
    },
  ].filter(({ value }) => value && value !== "all");
  const advancedCount = selections.filter(
    ({ key }) => !["q", "category"].includes(key),
  ).length;
  const focusSearch = () =>
    document
      .querySelector<HTMLInputElement>('[aria-label="Search services"]')
      ?.focus({ preventScroll: true });
  const clearFilters = () => {
    setParams({});
    focusSearch();
  };
  const filtered = demo.services.filter(
    (s) =>
      s.active &&
      (!q ||
        `${s.title} ${s.description} ${s.tags.join(" ")}`
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (category === "all" || s.category === category) &&
      (cost === "all" ||
        (cost === "free" ? s.priceRwf === 0 : s.priceRwf > 0)) &&
      (format === "all" || s.formats.includes(format as "Online")) &&
      (language === "all" || s.languages.includes(language as "English")) &&
      (availability === "all" ||
        demo
          .availableSlots(s.id)
          .some(
            (slot) =>
              (format === "all" || slot.format === format) &&
              Date.parse(slot.startsAt) <
                Date.now() + Number(availability) * 86400000,
          )),
  );
  return (
    <div className="svc-catalog-page">
      {params.get("consultation") === "1" && (
        <div className="svc-content">
          <div className="public-banner">
            <span className="svc-eyebrow">
              BOOK A CONSULTATION / START HERE
            </span>
            <h2>First, find the support that fits.</h2>
            <p>
              Choose a service below to compare formats, sample professionals,
              prices, and available times. Then select Book a demo session to
              continue.
            </p>
            <Button variant="secondary" onClick={openMatching}>
              Help me choose <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}
      <section className="svc-discovery-hero">
        <div className="svc-discovery-copy">
          <span className="svc-eyebrow">
            <span className="svc-dot" /> SUPPORT, IN YOUR OWN WAY
          </span>
          <h1>
            A little support.
            <br />A little more <em>you.</em>
          </h1>
          <p>
            Movement, moments of calm, and space to be heard. <br />
            Find an experience that meets you where you are.
          </p>
          <div className="svc-hero-actions">
            <Button onClick={openMatching}>
              Find my support <Sparkles size={16} />
            </Button>
            <a href="#service-catalog">
              Explore services <ArrowDown />
            </a>
          </div>
          <div className="svc-hero-promises">
            <span>
              <Check size={13} />
              Online & in person
            </span>
            <span>
              <Check size={13} />
              Free & paid options
            </span>
          </div>
        </div>
        <div className="svc-discovery-art">
          <img
            className="svc-art-main"
            src={image("hero-movement")}
            alt="Mindful movement in a bright studio"
          />
          <img
            className="svc-art-small"
            src={image("hero")}
            alt="A joyful moment outdoors"
          />
          <span className="svc-art-label">
            <Flower2 size={20} />
            <span>
              Care that makes
              <br />
              room for you.
            </span>
          </span>
          <span className="svc-art-orbit" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>
      <div className="svc-content">
        <DemoNote />
        <section id="service-catalog" className="svc-catalog">
          <div className="svc-section-top">
            <div>
              <span className="svc-eyebrow">FIND YOUR NEXT SMALL STEP</span>
              <h2>What feels right for you?</h2>
            </div>
            <span className="svc-timezone">
              <Globe2 size={14} />
              Times in {demo.timezone}
            </span>
          </div>
          <div
            className="svc-category-tabs"
            role="group"
            aria-label="Service category"
          >
            {[
              ["all", "All services"],
              ["wellness", "Wellness"],
              ["mental-health", "Mental health support"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={category === value}
                onClick={() => setFilter("category", value)}
              >
                {value === "wellness" ? (
                  <Flower2 size={16} />
                ) : value === "mental-health" ? (
                  <Heart size={16} />
                ) : (
                  <SlidersHorizontal size={16} />
                )}{" "}
                {label}
              </button>
            ))}
          </div>
          <div className="svc-filters">
            <div className="svc-filter-toolbar">
              <label className="svc-search">
                <Search size={18} />
                <span className="sr-only">Search services</span>
                <input
                  placeholder="Search a service or a goal…"
                  aria-label="Search services"
                  value={q}
                  onChange={(e) => setFilter("q", e.target.value)}
                />
              </label>
              <button
                type="button"
                className="svc-filter-toggle"
                aria-expanded={filtersOpen}
                aria-controls="catalog-advanced-filters"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <SlidersHorizontal size={16} /> Filters{" "}
                {advancedCount > 0 && <span>{advancedCount}</span>}
              </button>
            </div>
            <div
              id="catalog-advanced-filters"
              className={`svc-advanced-filters ${filtersOpen ? "is-open" : ""}`}
            >
              <Select
                label="Price"
                value={cost}
                onChange={(e) => setFilter("cost", e.target.value)}
              >
                <option value="all">Any price</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </Select>
              <Select
                label="Format"
                value={format}
                onChange={(e) => setFilter("format", e.target.value)}
              >
                <option value="all">Any format</option>
                <option>Online</option>
                <option>In person</option>
              </Select>
              <Select
                label="Language"
                value={language}
                onChange={(e) => setFilter("language", e.target.value)}
              >
                <option value="all">Any language</option>
                {languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
              <Select
                label="Availability"
                value={availability}
                onChange={(e) => setFilter("availability", e.target.value)}
              >
                <option value="all">Any time</option>
                <option value="7">Next 7 days</option>
                <option value="14">Next 14 days</option>
              </Select>
            </div>
          </div>
          {selections.length > 0 && (
            <div className="svc-filter-chips" aria-label="Selected filters">
              {selections.map(({ key, label }) => (
                <button
                  type="button"
                  key={key}
                  aria-label={`Remove ${label} filter`}
                  onClick={() => {
                    setFilter(key, "all");
                    focusSearch();
                  }}
                >
                  {label}
                  <X size={13} aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                className="svc-clear-filters"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}
          <div className="svc-results-bar">
            <p role="status">
              <strong>{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "experience" : "experiences"} to explore
            </p>
            <span>Example prices · No payments</span>
          </div>
          {filtered.length ? (
            <div className="svc-card-grid">
              {filtered.map((service) => (
                <ServiceCard
                  service={service}
                  key={service.id}
                  presentation="editorial"
                />
              ))}
            </div>
          ) : (
            <Empty title="Let’s try a different path.">
              <p>
                No services match these preferences. Try fewer filters or
                explore all experiences.
              </p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </Empty>
          )}
        </section>
        <section className="svc-match-banner">
          <div className="svc-match-symbol">
            <Flower2 size={66} />
          </div>
          <div>
            <span className="svc-eyebrow">
              YOU DON’T HAVE TO KNOW WHERE TO START
            </span>
            <h2>
              A few preferences.
              <br />A clearer place to begin.
            </h2>
            <p>
              Tell us what you’re looking for, and explore a few relevant
              options.
            </p>
          </div>
          <Button variant="secondary" onClick={openMatching}>
            Find my support <ArrowUpRight size={17} />
          </Button>
        </section>
        <section className="svc-how">
          <div>
            <span className="svc-eyebrow">SMALL STEPS, CLEARLY EXPLAINED</span>
            <h2>Space for a simpler start.</h2>
          </div>
          {[
            [
              "01",
              "Find your fit",
              "Explore services or answer a few optional questions.",
            ],
            [
              "02",
              "Choose your moment",
              "Preview a professional, format, and available time.",
            ],
            [
              "03",
              "Make room for you",
              "Review your demo request and explore your private-space preview.",
            ],
          ].map(([n, t, d]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </section>
        <section id="accessibility" className="svc-faq">
          <div>
            <span className="svc-eyebrow">GOOD QUESTIONS, CLEAR ANSWERS</span>
            <h2>A little more clarity.</h2>
            <p>Everything here is a demonstration. Take your time exploring.</p>
          </div>
          <div>
            {[
              [
                "Are these real services?",
                "No. All services, profiles, prices, and schedules are examples. Booking adds a sample appointment to this browser session only. No care, payment, or appointment is delivered.",
              ],
              [
                "What is the difference between wellness and mental health support?",
                "Wellness examples focus on movement, reflection, and routines. Mental health examples illustrate support conversations and groups. This demo does not diagnose, assess clinical needs, or provide treatment.",
              ],
              [
                "Can I choose online or in-person sessions?",
                "Yes. Choose your preferred format when previewing a booking. In-person examples refer to Kigali, Rwanda; no real venue is reserved. Online previews do not create joining links.",
              ],
              [
                "Can you accommodate accessibility needs?",
                "The website supports keyboard navigation, labeled forms, visible focus, reduced motion, and responsive layouts. In a real service, confirm venue access, communication preferences, and participation needs with the provider before booking. Physical accommodations are not verified in this demo.",
              ],
              [
                "What happens to my information?",
                "Preferences, appointments, and saves stay in temporary memory and disappear on refresh. Booking contact fields are discarded after confirmation or closing. Please do not enter health histories or sensitive information.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
function ArrowDown() {
  return <ArrowRight size={15} style={{ transform: "rotate(90deg)" }} />;
}

export function ServiceDetail() {
  const { slug } = useParams();
  const demo = useDemo();
  const service = demo.services.find((s) => s.id === slug);
  if (!service) return <NotFound />;
  const available = demo.availableSlots(service.id);
  const providers = demo.professionals.filter(
    (p) => service.professionalIds.includes(p.id) && p.active,
  );
  return (
    <div className="svc-content svc-detail-page">
      <Link className="svc-back" to="/services">
        <ArrowLeft size={15} /> All services
      </Link>
      <DemoNote />
      <div className="svc-detail-hero">
        <div>
          <span className="svc-eyebrow">
            {categoryLabel(service.category)} · {service.kind}
          </span>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
          <div className="svc-detail-facts">
            <span>
              <Clock size={16} />
              {service.duration} minutes
            </span>
            <span>
              <Globe2 size={16} />
              {service.formats.join(" / ")}
            </span>
            <span>{service.languages.join(" · ")}</span>
          </div>
          <div className="svc-detail-price">
            <strong>{demo.price(service)}</strong>
            <span>Illustrative price. No payment collected.</span>
          </div>
          <div className="svc-hero-actions">
            <Button
              disabled={!service.active || !available.length}
              onClick={() => demo.setRequest({ serviceId: service.id })}
            >
              {service.kind === "Group"
                ? "Register a demo place"
                : "Book a demo session"}{" "}
              <ArrowRight size={17} />
            </Button>
            <Button
              variant="secondary"
              aria-pressed={demo.saved.includes(service.id)}
              onClick={() => demo.toggleSaved(service.id)}
            >
              <Bookmark
                size={16}
                fill={demo.saved.includes(service.id) ? "currentColor" : "none"}
              />
              {demo.saved.includes(service.id) ? "Saved" : "Save service"}
            </Button>
          </div>
          {!service.active && (
            <p className="svc-error">This demonstration service is paused.</p>
          )}
        </div>
        <img
          src={image(service.image)}
          alt="Illustrative service photography"
        />
      </div>
      <div className="svc-detail-columns">
        <div>
          <section className="svc-info-block">
            <span className="svc-eyebrow">A LITTLE CONTEXT</span>
            <h2>Is this a place to begin?</h2>
            <p>{service.audience}</p>
            <CheckList items={service.benefits} />
          </section>
          <section className="svc-info-block">
            <h2>What to expect</h2>
            <ol className="svc-steps">
              <li>
                <strong>A welcoming introduction</strong>
                <p>
                  Discuss preferences, practical arrangements, and what
                  participation involves.
                </p>
              </li>
              <li>
                <strong>Space at your own pace</strong>
                <p>
                  {service.kind === "Group"
                    ? "Learn the group boundaries and choose how you would like to participate."
                    : "Explore the session format and ask questions about what feels comfortable."}
                </p>
              </li>
              <li>
                <strong>A clear next step</strong>
                <p>
                  Reflect on the experience and consider whether you would like
                  further information.
                </p>
              </li>
            </ol>
          </section>
          <section className="svc-info-block">
            <h2>Before your session</h2>
            <p>
              Check the language, time zone, and format. For an online session,
              choose a comfortable place with a reliable connection. For an
              in-person session, confirm the address and accessibility
              arrangements with the provider.
            </p>
            <p>
              This is general preparation information. No clinical assessment,
              emergency response, or real session is provided in this preview.
            </p>
          </section>
          <section className="svc-info-block">
            <h2>Meet the sample professionals</h2>
            <div className="svc-provider-grid">
              {providers.map((p) => (
                <Link
                  className="svc-provider-card"
                  to={`/professionals/${p.id}`}
                  key={p.id}
                >
                  <img src={image(p.image)} alt="" />
                  <div>
                    <span className="svc-label">DEMO PROFILE</span>
                    <h3>{p.name}</h3>
                    <p>{p.role}</p>
                    <small>{p.languages.join(" · ")}</small>
                  </div>
                  <ArrowUpRight size={19} />
                </Link>
              ))}
            </div>
          </section>
        </div>
        <aside className="svc-detail-aside">
          <div className="svc-panel">
            <span className="svc-eyebrow">A MOMENT THAT FITS</span>
            <h3>Sample availability</h3>
            <p className="svc-small">All times in {demo.timezone}</p>
            {available.slice(0, 4).map((slot) => (
              <button
                className="svc-slot-row"
                key={slot.id}
                disabled={!service.active}
                onClick={() =>
                  demo.setRequest({
                    serviceId: service.id,
                    professionalId: slot.professionalId,
                  })
                }
              >
                <span>
                  <strong>{formatSlot(slot.startsAt, demo.timezone)}</strong>
                  <small>
                    {slot.format} ·{" "}
                    {
                      demo.professionals.find(
                        (p) => p.id === slot.professionalId,
                      )?.name
                    }
                  </small>
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
            {!available.length && (
              <p>No demo sessions available. Please explore another service.</p>
            )}
            <DemoNote>Example times only. Nothing is reserved.</DemoNote>
          </div>
          <div className="svc-panel">
            <h3>Flexible, and clearly explained.</h3>
            <p>
              You can reschedule or cancel sample appointments in My space. Real
              fees, notice periods, refund terms, and privacy arrangements must
              be confirmed with a real provider; none apply or are processed
              here.
            </p>
            <details>
              <summary>Can I change my booking?</summary>
              <p>
                Yes. Open My space and choose Reschedule or Cancel for an
                upcoming demo appointment.
              </p>
            </details>
            <details>
              <summary>Is this urgent support?</summary>
              <p>
                No. Use the urgent-support information at the bottom of the page
                for official regional resources.
              </p>
            </details>
          </div>
        </aside>
      </div>
      <div className="svc-mobile-book">
        <span>
          <strong>{demo.price(service)}</strong>
          <small>Illustrative / session</small>
        </span>
        <Button
          disabled={!service.active || !available.length}
          onClick={() => demo.setRequest({ serviceId: service.id })}
        >
          Choose a demo time <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

export function ProfessionalPage() {
  const { slug } = useParams();
  const demo = useDemo();
  const professional = demo.professionals.find((p) => p.id === slug);
  if (!professional) return <NotFound />;
  const offerings = demo.services.filter(
    (s) => s.active && s.professionalIds.includes(professional.id),
  );
  return (
    <div className="svc-content svc-profile-page">
      <Link to="/services" className="svc-back">
        <ArrowLeft size={15} /> Explore services
      </Link>
      <DemoNote>
        Fictional demonstration profile. This is not a verified professional or
        an endorsement.
      </DemoNote>
      <div className="svc-profile-hero">
        <img
          src={image(professional.image)}
          alt="Illustrative portrait; not a verified provider"
        />
        <div>
          <span className="svc-eyebrow">MEET A SAMPLE PROFESSIONAL</span>
          <h1>{professional.name}</h1>
          <h2>{professional.role}</h2>
          <p>{professional.bio}</p>
          <div className="svc-tags">
            {professional.specialties.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="svc-small">
            {professional.languages.join(" · ")} ·{" "}
            {professional.formats.join(" / ")}
          </p>
          <div className="svc-credential-note">
            <Check size={17} />
            <span>
              Qualifications, registration, experience, and professional
              suitability are not verified. Actual credential information must
              be supplied before a real service launches.
            </span>
          </div>
          {!professional.active && (
            <p>This demonstration profile is currently paused.</p>
          )}
        </div>
      </div>
      <div className="svc-section-top">
        <div>
          <span className="svc-eyebrow">EXPLORE TOGETHER</span>
          <h2>Services with {professional.name.split(" ")[0]}</h2>
        </div>
      </div>
      <div className="svc-profile-services">
        {offerings.map((s) => (
          <article className="svc-panel" key={s.id}>
            <span className="svc-label">{categoryLabel(s.category)}</span>
            <h3>
              <Link to={`/services/${s.id}`}>{s.title}</Link>
            </h3>
            <p>{s.description}</p>
            <strong>
              {demo.price(s)} · {s.duration} min
            </strong>
            <Button
              disabled={
                !professional.active ||
                !demo
                  .availableSlots(s.id)
                  .some((slot) => slot.professionalId === professional.id)
              }
              onClick={() =>
                demo.setRequest({
                  serviceId: s.id,
                  professionalId: professional.id,
                })
              }
            >
              Choose a demo time <ArrowRight size={15} />
            </Button>
          </article>
        ))}
      </div>
      <section className="svc-panel svc-profile-availability">
        <h2>Illustrative availability</h2>
        <p>
          Times shown in {demo.timezone}. Availability is not a real appointment
          offer.
        </p>
        {offerings
          .flatMap((s) =>
            demo
              .availableSlots(s.id)
              .filter((slot) => slot.professionalId === professional.id)
              .slice(0, 2),
          )
          .slice(0, 6)
          .map((slot) => (
            <div className="svc-resource-line" key={slot.id}>
              <div>
                <strong>{formatSlot(slot.startsAt, demo.timezone)}</strong>
                <small>
                  {demo.services.find((s) => s.id === slot.serviceId)?.title} ·{" "}
                  {slot.format}
                </small>
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  demo.setRequest({
                    serviceId: slot.serviceId,
                    professionalId: professional.id,
                  })
                }
              >
                Preview booking
              </Button>
            </div>
          ))}
      </section>
    </div>
  );
}

export function DashboardPage() {
  const demo = useDemo();
  const [tab, setTab] = useState("Upcoming"),
    [cancel, setCancel] = useState<DemoBooking | null>(null),
    [feedback, setFeedback] = useState<DemoBooking | null>(null),
    [rating, setRating] = useState("5"),
    [comment, setComment] = useState(""),
    [notice, setNotice] = useState("");
  const list =
    tab === "History"
      ? demo.bookings.filter((b) => b.status !== "Upcoming")
      : demo.bookings.filter((b) => b.status === "Upcoming");
  return (
    <div className="svc-content svc-dashboard">
      <PageHeading
        eyebrow="MY SPACE · DEMO DASHBOARD"
        title="A little space, just for you."
        description="Your example appointments, saved experiences, and small next steps."
        action={
          <Link className="svc-yellow-link" to="/services">
            Explore services <ArrowRight size={16} />
          </Link>
        }
      />
      <DemoNote>
        This dashboard contains sample records and your temporary demo activity.
        There is no account or authentication. Everything resets on refresh.
      </DemoNote>
      <div className="svc-dashboard-stats">
        {[
          [
            demo.bookings.filter((b) => b.status === "Upcoming").length,
            "Upcoming sessions",
            CalendarDays,
          ],
          [demo.saved.length, "Saved experiences", Bookmark],
          [
            demo.bookings.filter((b) => b.status === "Completed").length,
            "Completed examples",
            Check,
          ],
        ].map(([n, label, Icon]) => {
          const Symbol = Icon as typeof Check;
          return (
            <div key={String(label)}>
              <Symbol size={23} />
              <strong>{String(n)}</strong>
              <span>{String(label)}</span>
            </div>
          );
        })}
      </div>
      <div className="svc-dashboard-top">
        <div
          className="svc-category-tabs"
          role="group"
          aria-label="My space views"
        >
          {["Upcoming", "Saved services", "History"].map((t) => (
            <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <small>Times in {demo.timezone}</small>
      </div>
      {notice && (
        <div role="status" className="svc-notice">
          {notice}
        </div>
      )}
      {tab === "Saved services" ? (
        demo.saved.length ? (
          <div className="svc-card-grid">
            {demo.services
              .filter((s) => demo.saved.includes(s.id))
              .map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
          </div>
        ) : (
          <Empty title="Make room for something good.">
            <p>Save an experience to find it here later in this preview.</p>
            <Link className="svc-yellow-link" to="/services">
              Explore services <ArrowRight size={16} />
            </Link>
          </Empty>
        )
      ) : list.length ? (
        <div className="svc-appointment-list">
          {list
            .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
            .map((b) => {
              const s = demo.services.find((s) => s.id === b.serviceId),
                p = demo.professionals.find((p) => p.id === b.professionalId);
              return (
                <article
                  className="svc-appointment"
                  key={b.id}
                  data-starts-at={b.startsAt}
                >
                  <img src={image(s?.image || "environment")} alt="" />
                  <div className="svc-appointment-info">
                    <span className={`svc-status ${b.status.toLowerCase()}`}>
                      {b.status} · demo
                    </span>
                    <h2>
                      <Link to={`/services/${b.serviceId}`}>
                        {s?.title || "Archived service"}
                      </Link>
                    </h2>
                    <p>
                      {formatSlot(b.startsAt, demo.timezone)}{" "}
                      <small>({demo.timezone})</small>
                    </p>
                    <p>
                      {p?.name || "Sample provider"} · {b.format} ·{" "}
                      {demo.price(b)}
                    </p>
                    {b.format === "In person" && (
                      <small>Kigali · demonstration location</small>
                    )}
                    {b.feedback && (
                      <small>
                        Private feedback preview saved · {b.feedback.rating}/5
                      </small>
                    )}
                  </div>
                  <div className="svc-appointment-actions">
                    {b.status === "Upcoming" ? (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            demo.setRequest({
                              serviceId: b.serviceId,
                              rescheduleId: b.id,
                            })
                          }
                        >
                          Reschedule
                        </Button>
                        <Button variant="ghost" onClick={() => setCancel(b)}>
                          Cancel appointment
                        </Button>
                      </>
                    ) : b.status === "Completed" ? (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setFeedback(b);
                          setRating(String(b.feedback?.rating || 5));
                          setComment(b.feedback?.comment || "");
                        }}
                      >
                        {b.feedback
                          ? "Edit private feedback"
                          : "Leave private feedback"}
                      </Button>
                    ) : (
                      <Link to={`/services/${b.serviceId}`}>
                        Explore again <ArrowUpRight size={14} />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
        </div>
      ) : (
        <Empty title="Room for your next step.">
          <p>No example appointments in this view.</p>
          <Link className="svc-yellow-link" to="/services">
            Explore services
          </Link>
        </Empty>
      )}
      <Modal
        open={!!cancel}
        onClose={() => setCancel(null)}
        title="Cancel this demo appointment?"
      >
        <div className="svc-form">
          <p>
            This updates your temporary dashboard only. No real appointment,
            cancellation fee, or notification is involved.
          </p>
          <Button
            variant="danger"
            onClick={() => {
              demo.setBookings((v) =>
                v.map((b) =>
                  b.id === cancel?.id ? { ...b, status: "Cancelled" } : b,
                ),
              );
              setCancel(null);
              setNotice(
                "Demo appointment cancelled. You can find it in History.",
              );
            }}
          >
            Confirm demo cancellation
          </Button>
          <Button variant="secondary" onClick={() => setCancel(null)}>
            Keep appointment
          </Button>
        </div>
      </Modal>
      <Modal
        open={!!feedback}
        onClose={() => setFeedback(null)}
        title="A private moment of reflection."
      >
        <form
          className="svc-form"
          onSubmit={(e) => {
            e.preventDefault();
            demo.setBookings((v) =>
              v.map((b) =>
                b.id === feedback?.id
                  ? { ...b, feedback: { rating: Number(rating), comment } }
                  : b,
              ),
            );
            setFeedback(null);
            setComment("");
            setNotice(
              "Private feedback preview saved in temporary memory. No public review was posted.",
            );
          }}
        >
          <p>
            This is a private feedback demonstration, not a real session review.
            Please do not include sensitive health details.
          </p>
          <Select
            label="Experience rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} / 5
              </option>
            ))}
          </Select>
          <label className="svc-textarea-label">
            Optional non-sensitive feedback
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={300}
              rows={4}
              placeholder="For example: the booking flow was easy to follow."
            />
          </label>
          <Checkbox
            label="I understand this stays in the demo and is not published."
            required
          />
          <Button type="submit">Save private feedback preview</Button>
        </form>
      </Modal>
    </div>
  );
}

export function ResourcesPage() {
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState<Resource | null>(null);
  const query = params.get("q") || "";
  const type = params.get("type") || "All";
  const category = params.get("category") || "all";
  const topic = params.get("topic") || "all";
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(window.location.search);
    if (!value || value === "all" || value === "All") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: key === "q" });
  };
  const shown = [...supportArticles, ...resources].filter(
    (r) =>
      (type === "All" || r.type === type) &&
      (category === "all" || r.category === category) &&
      (topic === "all" ||
        r.topic === topic ||
        (!r.topic &&
          topic === "mental-health" &&
          r.category === "mental-health")) &&
      `${r.title} ${r.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="svc-content svc-resources">
      <PageHeading
        eyebrow="A LITTLE GUIDANCE, AT YOUR PACE"
        title="Good things to come back to."
        description="Plain-language guides to mental health, GBV, substance use, and supporting someone, alongside gentle practices and worksheets."
      />
      <DemoNote>
        General information and optional reflection only. These resources do not
        provide diagnosis, treatment, or personalized advice.
      </DemoNote>
      <div className="svc-resource-filters">
        <label className="svc-search">
          <Search size={18} />
          <span className="sr-only">Search resources</span>
          <input
            aria-label="Search resources"
            value={query}
            placeholder="Find a resource…"
            onChange={(e) => update("q", e.target.value)}
          />
        </label>
        <Select
          label="Resource type"
          value={type}
          onChange={(e) => update("type", e.target.value)}
        >
          {["All", "Article", "Guided practice", "Worksheet"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </Select>
        <Select
          label="Resource category"
          value={category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="all">All categories</option>
          <option value="wellness">Wellness</option>
          <option value="mental-health">Mental health support</option>
          <option value="gbv">Gender-based violence</option>
          <option value="substance-use">Alcohol & drugs</option>
          <option value="supporters">Supporting someone</option>
        </Select>
        <Select
          label="Resource topic"
          value={topic}
          onChange={(e) => update("topic", e.target.value)}
        >
          <option value="all">All topics</option>
          {resourceTopics.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </Select>
      </div>
      {(query || type !== "All" || category !== "all" || topic !== "all") && (
        <button className="support-text-link" onClick={() => setParams({})}>
          Clear all resource filters <X size={15} />
        </button>
      )}
      <p className="svc-small" role="status">
        {shown.length} resources to explore
      </p>
      {shown.length ? (
        <div className="svc-resource-grid">
          {shown.map((r) => (
            <article className="svc-resource-card" key={r.id}>
              <img src={image(r.image)} alt="" loading="lazy" />
              <div>
                <span className="svc-eyebrow">
                  {r.type} · {r.minutes} MIN
                </span>
                <h2 id={`resource-title-${r.id}`}>{r.title}</h2>
                <p>{r.description}</p>
                <div className="svc-resource-actions">
                  <button
                    onClick={() => setSelected(r)}
                    aria-describedby={`resource-title-${r.id}`}
                  >
                    Read more <ArrowUpRight size={17} />
                  </button>
                  {r.download && (
                    <a
                      href={r.download}
                      download
                      aria-label={`Download ${r.title}`}
                    >
                      <Download size={18} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty title="No resources found.">
          <p>Try a different search or resource type.</p>
          <Button
            onClick={() => {
              setParams({});
            }}
          >
            Reset resource filters
          </Button>
        </Empty>
      )}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || ""}
      >
        <div className="svc-form">
          <span className="svc-eyebrow">
            {selected?.type} · GENERAL INFORMATION
          </span>
          {selected?.content.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {selected?.sources && (
            <div>
              <h3>Further reading & official sources</h3>
              {selected.sources.map((id) => {
                const source = officialResources.find((item) => item.id === id);
                return source ? (
                  <p key={id}>
                    <a
                      className="support-text-link"
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.title}
                      <ArrowUpRight size={15} />
                    </a>
                    <small>Checked 8 November 2026</small>
                  </p>
                ) : null;
              })}
            </div>
          )}
          {selected?.download && (
            <a className="svc-yellow-link" href={selected.download} download>
              Download worksheet <Download size={16} />
            </a>
          )}
          <DemoNote>
            Completed worksheets stay with you. This website does not collect
            your answers.
          </DemoNote>
        </div>
      </Modal>
    </div>
  );
}
export function NotFound() {
  return (
    <div className="svc-content">
      <Empty title="This path needs a fresh start.">
        <p>
          We couldn’t find that page. Explore the services available in this
          preview.
        </p>
        <Link className="svc-yellow-link" to="/services">
          Back to services <ArrowRight size={16} />
        </Link>
      </Empty>
    </div>
  );
}
