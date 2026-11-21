import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Eye,
  Globe2,
  HeartHandshake,
  MessageCircleHeart,
  ShieldCheck,
  Sprout,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { values } from "./content";
import { AboutIllustration } from "./aboutIllustrations";
import "./about.css";

const focusAreas = [
  {
    title: "Mental health",
    description:
      "Understand emotions, everyday challenges, and ways to care for your well-being.",
    to: "/mental-health",
    Icon: Sprout,
    number: "01",
  },
  {
    title: "Understanding GBV",
    description:
      "Learn about consent, boundaries, and options for support with gender-based violence.",
    to: "/understand-gbv",
    Icon: ShieldCheck,
    number: "02",
  },
  {
    title: "Alcohol & drugs",
    description:
      "Explore substance use, its effects, and support pathways without blame or judgment.",
    to: "/alcohol-and-drugs",
    Icon: HeartHandshake,
    number: "03",
  },
];

const team = [
  {
    name: "David Niyomugabo",
    role: "Founder · Strategic Lead & Vision Holder",
    photo: "david",
  },
  {
    name: "Sam NTIGURIRWA",
    role: "Co-Founder · Programs & Partnerships Lead",
    photo: "sam",
  },
  {
    name: "Rukundo Yassili",
    role: "Software Engineer · Digital Platform & Technology Lead",
    photo: "rukundo",
  },
  {
    name: "RWAMASIRABO Ghislain",
    role: "Software Engineer · Digital Platform & Technology Lead",
    photo: "ghislain",
  },
  {
    name: "Rita XAVIERE IKUZO",
    role: "Advocacy & Awareness Lead",
    photo: "rita",
  },
  {
    name: "Aristide NIYIDUHA",
    role: "Information, Research, Content & Knowledge Lead",
    photo: "aristide",
  },
  {
    name: "Eunice Flavia INEZA",
    role: "Community Outreach & Logistics Lead",
    photo: "eunice",
  },
  {
    name: "Gloria hycentha UWIMANA",
    role: "Coordinator · Operations & Team Coordination Lead",
    photo: "gloria",
  },
];
const valueIcons = [HeartHandshake, MessageCircleHeart, Globe2, ShieldCheck];
const eyebrow = "text-xs font-bold uppercase tracking-[0.14em] text-[#416a4c]";
const section = "py-14 md:py-20";
const iconBox =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6f2df] text-[#286340]";

export function AboutPage() {
  return (
    <div className="support-page about-redesign pt-5 md:pt-8">
      <section
        className="about-redesign-hero grid items-center gap-8 overflow-hidden rounded-[28px] bg-[#edf5ec] p-6 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:p-14"
        aria-labelledby="about-title"
      >
        <div>
          <span className={eyebrow}>About Vuga Ndakumva</span>
          <h1
            id="about-title"
            className="mt-5 max-w-[11ch] text-[clamp(2.6rem,5vw,4.6rem)] leading-[1.04] tracking-[-0.05em] text-[#173d2a]"
          >
            Understanding starts with{" "}
            <span className="text-[#4b754d]">listening.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-base leading-7 text-[#4f6554] sm:text-lg sm:leading-8">
            Everyone deserves to be heard. We make information about well-being
            and support easier to understand, so you can find your own way
            forward.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a href="#our-story" className="support-button">
              Discover our story <ArrowDown size={17} aria-hidden="true" />
            </a>
            <Link to="/support" className="about-inline-link">
              Explore support <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="about-hero-image overflow-hidden rounded-[22px] bg-white/50">
          <AboutIllustration name="listening" priority />
        </div>
      </section>

      <section
        className={`${section} grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:gap-24`}
        id="our-story"
        aria-labelledby="about-story-title"
      >
        <div>
          <span className={eyebrow}>Our story</span>
          <h2 id="about-story-title" className="mt-4 max-w-[14ch]">
            Born from the need to be heard.
          </h2>
          <div className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-[#edf5ec] px-5 py-4 text-[#315d3f]">
            <MessageCircleHeart size={22} aria-hidden="true" />
            <p className="text-sm leading-6">
              <strong>Vuga Ndakumva</strong>
              <br />
              “Speak, I can hear.”
            </p>
          </div>
        </div>
        <div className="about-copy max-w-[42rem] space-y-5">
          <p>
            Vuga Ndakumva began with a belief that people affected by
            gender-based violence deserve to be listened to with dignity and
            compassion. Silence can make it harder to find information, support,
            and a way forward.
          </p>
          <p>
            Founded in 2025 by David Niyomugabo, the initiative grew from
            community conversations into a shared commitment to awareness,
            education, and support for people and communities in Rwanda.
          </p>
          <p>
            Today, our work brings together conversations about mental health,
            gender-based violence, and substance use, helping people explore
            information and support at their own pace.
          </p>
          <a href="#our-team" className="about-inline-link">
            Meet the team <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section
        className={`${section} border-t border-[#dce7da]`}
        aria-labelledby="about-purpose-title"
      >
        <div className="mb-8 max-w-2xl">
          <span className={eyebrow}>Our purpose</span>
          <h2 id="about-purpose-title" className="mt-4">
            A commitment to dignity and change.
          </h2>
          <p className="about-copy mt-4">
            Our mission and vision are rooted in awareness, compassion, and the
            belief that every person deserves to be heard.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[24px] border border-[#dce8d7] bg-[#f5f8f2] p-7 sm:p-9">
            <span className={iconBox}>
              <Target size={24} aria-hidden="true" />
            </span>
            <p className={`${eyebrow} mt-7`}>01 / Our mission</p>
            <h3 className="mt-3">Awareness that opens pathways.</h3>
            <p className="about-copy mt-4">
              Raise awareness, educate communities, and make support pathways
              easier to find, helping reduce gender-based violence and empower
              survivors.
            </p>
          </article>
          <article className="rounded-[24px] border border-[#dce8d7] bg-[#edf5ec] p-7 sm:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#286340]">
              <Eye size={24} aria-hidden="true" />
            </span>
            <p className={`${eyebrow} mt-7`}>02 / Our vision</p>
            <h3 className="mt-3">A future free from violence.</h3>
            <p className="about-copy mt-4">
              A society where people live free from gender-based violence,
              communities help protect those at risk, and perpetrators are held
              accountable.
            </p>
          </article>
        </div>
      </section>

      <section
        className={`${section} border-t border-[#dce7da]`}
        aria-labelledby="about-focus-title"
      >
        <div className="mb-8 grid gap-4 md:grid-cols-2 md:items-end md:gap-12">
          <div>
            <span className={eyebrow}>What we focus on</span>
            <h2 id="about-focus-title" className="mt-4">
              Clear information. A place to begin.
            </h2>
          </div>
          <p className="about-copy">
            These topics can be connected, but everyone’s circumstances are
            different. Explore what matters to you without judgment.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {focusAreas.map(({ title, description, to, Icon, number }) => (
            <Link
              to={to}
              key={to}
              className="about-topic-card group flex flex-col rounded-[24px] border border-[#dce8d7] bg-white p-7 transition-colors hover:border-[#8eb28a] hover:bg-[#f5f9f2]"
            >
              <div className="flex items-start justify-between">
                <span className={iconBox}>
                  <Icon size={23} aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-[#78937b]">
                  {number}
                </span>
              </div>
              <h3 className="mt-8">{title}</h3>
              <p className="about-copy mt-3 flex-1">{description}</p>
              <span className="about-inline-link mt-7">
                Explore this topic <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="about-values-section rounded-[28px] bg-[#f1f6ee] px-6 py-12 sm:px-10 md:py-16 lg:px-14"
        aria-labelledby="about-values-title"
      >
        <div className="mb-9 max-w-2xl">
          <span className={eyebrow}>What guides us</span>
          <h2 id="about-values-title" className="mt-4">
            People first. Always.
          </h2>
          <p className="about-copy mt-4">
            These values guide the information we share and how we approach
            support.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = valueIcons[index];
            return (
              <article
                key={value.title}
                className="rounded-[20px] bg-white p-6"
              >
                <span className={iconBox}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-6">{value.title}</h3>
                <p className="about-copy mt-3">{value.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className={`${section} about-team`}
        id="our-team"
        aria-labelledby="about-team-title"
      >
        <div className="mb-9 grid gap-4 md:grid-cols-2 md:items-end md:gap-12">
          <div>
            <span className={eyebrow}>The people behind the work</span>
            <h2 id="about-team-title" className="mt-4">
              Meet our team.
            </h2>
          </div>
          <p className="about-copy">
            Advocates, organizers, and technologists working together to
            strengthen awareness, connection, and community support.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <article
              className="about-team-card overflow-hidden rounded-[20px] border border-[#dce8d7] bg-white"
              key={member.name}
            >
              <div
                className={`about-team-photo about-photo-${member.photo} aspect-[4/3] overflow-hidden bg-[#edf3e9]`}
              >
                {member.photo && <img
                  className="h-full w-full object-cover"
                  src={`/images/about/team/${member.photo}.${member.photo === "rukundo" ? "jpg" : "webp"}`}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                />}
              </div>
              <div className="about-team-info p-5">
                <h3>{member.name}</h3>
                <p className="about-team-role mt-2">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="about-next-step flex flex-col gap-6 rounded-[28px] bg-[#244b39] p-7 text-white sm:p-10 md:flex-row md:items-center md:justify-between md:gap-12"
        aria-labelledby="about-next-title"
      >
        <div className="max-w-2xl">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#bce6a3]">
            <BookOpen size={23} aria-hidden="true" />
          </span>
          <h2 id="about-next-title">A next step that feels right for you.</h2>
          <p className="mt-4 text-base leading-7 text-[#d8e9d6]">
            Keep learning, or explore the support options available to you.
          </p>
        </div>
        <Link to="/support" className="support-button shrink-0">
          Explore support options <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>
      <aside
        className="about-site-note mt-8 border-t border-[#dce7da] pt-6 text-sm leading-6 text-[#526a56]"
        aria-label="About this website"
      >
        <p>
          Vuga Ndakumva is an independent educational initiative. This website
          provides information, not care or emergency response. Booking and
          professional profiles are in development. Team portraits are from the
          earlier Vuga Ndakumva website; the illustration depicts fictional
          people.
        </p>
        <Link to="/urgent-help" className="about-inline-link mt-3">
          Urgent help information <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
