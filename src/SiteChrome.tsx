import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Flower2,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ChevronDown,
  Heart,
} from "lucide-react";
import { useDemo } from "./services/DemoContext";
import type { Region } from "./services/data";
import Newsletter from "./Newsletter";
import "./navigation.css";

const knowledgeLinks = [
  {
    to: "/understand-gbv",
    title: "Understand GBV",
    text: "Recognise abuse and explore specialist support.",
  },
  {
    to: "/alcohol-and-drugs",
    title: "Alcohol & Drugs",
    text: "Judgment-free information and support pathways.",
  },
  {
    to: "/resources",
    title: "Guides & Worksheets",
    text: "Practical reading and resources to return to.",
  },
  {
    to: "/blog",
    title: "Blog",
    text: "Thoughtful articles and everyday perspectives.",
  },
];

export function Brand() {
  return (
    <Link to="/" className="site-brand" aria-label="BetterHelp home">
      <Flower2 aria-hidden="true" size={30} />
      <span>
        Better<span>Help</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);
  const [floating, setFloating] = useState(() => window.scrollY > 24);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const hubToggle = useRef<HTMLButtonElement>(null);
  const pointerSelecting = useRef(false);
  const { pathname, search, hash } = useLocation();
  const legacy =
    /^\/(services|professionals|dashboard|admin-preview|expertise|stories)(\/|$)/.test(
      pathname,
    );
  const { region, setRegion } = useDemo();
  const hubActive = [
    "/knowledge-hub",
    ...knowledgeLinks.map((link) => link.to),
  ].some((path) => pathname === path || pathname.startsWith(`${path}/`));
  useLayoutEffect(() => {
    const element = header.current;
    if (!element) return;
    const measure = () =>
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${element.getBoundingClientRect().height}px`,
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = () => setFloating(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    setOpen(false);
    setHubOpen(false);
  }, [pathname, search, hash]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1251px)");
    const closeAtDesktop = () => {
      if (desktop.matches) {
        setOpen(false);
        setHubOpen(false);
      }
    };
    desktop.addEventListener("change", closeAtDesktop);
    return () => desktop.removeEventListener("change", closeAtDesktop);
  }, []);
  useEffect(() => {
    if (!open && !hubOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) {
        setOpen(false);
        setHubOpen(false);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open, hubOpen]);
  return (
    <div className="site-header-space">
      <header
        ref={header}
        className={`site-header unified-header support-header ${legacy ? "has-preview-tools" : ""} ${floating ? "is-floating" : ""}`}
        role="banner"
        onPointerDownCapture={() => {
          pointerSelecting.current = true;
        }}
        onPointerCancelCapture={() => {
          pointerSelecting.current = false;
        }}
        onKeyDownCapture={() => {
          pointerSelecting.current = false;
        }}
        onClick={(event) => {
          pointerSelecting.current = false;
          const link =
            event.target instanceof Element ? event.target.closest("a") : null;
          if (!link) {
            if (!hub.current?.contains(event.target as Node)) setHubOpen(false);
            return;
          }
          setOpen(false);
          setHubOpen(false);
          if (
            link.pathname === pathname &&
            link.search === search &&
            link.hash === hash
          ) {
            if (open) toggle.current?.focus();
            else if (hub.current?.contains(link)) hubToggle.current?.focus();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && hubOpen) {
            e.preventDefault();
            setHubOpen(false);
            hubToggle.current?.focus();
          } else if (e.key === "Escape" && open) {
            setOpen(false);
            toggle.current?.focus();
          }
        }}
      >
        <div className="support-utility-bar">
          <div
            className="header-hotlines"
            role="group"
            aria-label="Rwanda emergency numbers"
          >
            {[
              ["Urgent help", "112"],
              ["GBV", "3512"],
              ["Isange", "3029"],
              ["Child abuse", "116"],
              ["Ambulance", "912"],
            ].map(([label, number]) => (
              <a
                key={number}
                href={`tel:${number}`}
                aria-label={`Rwanda ${label}: ${number}`}
              >
                <span>{label}</span>
                <strong>{number}</strong>
              </a>
            ))}
          </div>
          <div className="header-utility-actions">
            {legacy && (
              <label className="site-region">
                <span className="sr-only">Display region</span>
                <select
                  aria-label="Display region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                >
                  <option value="Rwanda">Rwanda · RWF</option>
                  <option value="International">International · USD</option>
                </select>
              </label>
            )}
            <button
              type="button"
              className="support-quick-exit"
              aria-describedby="quick-exit-note"
              onClick={() => window.location.replace("https://www.google.com/")}
            >
              Quick exit
              <LogOut size={14} aria-hidden="true" />
            </button>
            <span id="quick-exit-note" className="sr-only">
              Changes this page immediately. Does not erase browsing history.
            </span>
          </div>
        </div>
        <Brand />
        <button
          className="site-menu-toggle"
          ref={toggle}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="public-navigation"
          onClick={() => {
            setOpen(!open);
            setHubOpen(false);
          }}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="public-navigation"
          className={`public-navigation ${open ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          {[
            ["/about", "About Us"],
            ["/awareness", "Awareness"],
            ["/why-mental-health", "Why Mental Health"],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
              <ChevronRight
                className="support-nav-arrow"
                size={16}
                aria-hidden="true"
              />
            </NavLink>
          ))}
          <div
            ref={hub}
            className="header-knowledge"
            onBlur={(event) => {
              // Keep mobile links stationary between pointer-down and click.
              // Keyboard focus leaving the disclosure still dismisses it.
              if (pointerSelecting.current) return;
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              )
                setHubOpen(false);
            }}
          >
            <button
              ref={hubToggle}
              type="button"
              className={`header-knowledge-toggle ${hubActive ? "active" : ""}`}
              aria-expanded={hubOpen}
              aria-controls="knowledge-hub-links"
              onClick={() => setHubOpen(!hubOpen)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const last = event.key === "ArrowUp";
                  setHubOpen(true);
                  requestAnimationFrame(() => {
                    const links =
                      hub.current?.querySelectorAll<HTMLAnchorElement>("a");
                    if (links?.length)
                      links[last ? links.length - 1 : 0].focus();
                  });
                }
              }}
            >
              Knowledge Hub
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div
              id="knowledge-hub-links"
              className="header-knowledge-panel"
              hidden={!hubOpen}
              role="group"
              aria-label="Knowledge Hub links"
            >
              <NavLink
                to="/knowledge-hub"
                aria-label="Explore the Knowledge Hub"
                end
                className="header-knowledge-overview"
              >
                <span>
                  <strong>Explore the Knowledge Hub</strong>
                  <small>Clear information. A place to begin.</small>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </NavLink>
              {knowledgeLinks.map((link, index) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  aria-label={link.title}
                  aria-describedby={`knowledge-link-description-${index}`}
                >
                  <span>
                    <strong>{link.title}</strong>
                    <small id={`knowledge-link-description-${index}`}>
                      {link.text}
                    </small>
                  </span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </NavLink>
              ))}
            </div>
          </div>
          <NavLink
            to="/community"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Community
            <ChevronRight
              className="support-nav-arrow"
              size={16}
              aria-hidden="true"
            />
          </NavLink>
          <NavLink to="/donate" className="header-mobile-donate">
            Donate
            <Heart size={16} aria-hidden="true" />
          </NavLink>
        </nav>
        <div className="site-utilities">
          <NavLink to="/support" className="site-cta">
            Find support <ArrowUpRight size={16} aria-hidden="true" />
          </NavLink>
          <NavLink to="/donate" className="site-donate">
            Donate
            <Heart size={15} aria-hidden="true" />
          </NavLink>
        </div>
      </header>
    </div>
  );
}

export function SiteFooter() {
  return (
    <>
      <Newsletter />
      <footer className="site-footer unified-footer" role="contentinfo">
        <div className="site-footer-main">
          <div className="site-footer-intro">
            <Brand />
            <h2>
              A little more room
              <br />
              for well-being.
            </h2>
            <p>
              Clear information, compassionate connection, and pathways to
              appropriate care. Explore your options at your own pace.
            </p>
            <Link to="/support" className="site-cta">
              Find support <ArrowUpRight size={17} />
            </Link>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/knowledge-hub">Knowledge Hub</Link>
            <Link to="/mental-health">Mental health</Link>
            <Link to="/alcohol-and-drugs">Alcohol & drugs</Link>
            <Link to="/understand-gbv">Understand GBV</Link>
            <Link to="/resources">Resources & worksheets</Link>
            <Link to="/blog">Blog & articles</Link>
            <Link to="/community">Community, events & workshops</Link>
          </div>
          <div>
            <h3>Good to know</h3>
            <Link to="/about">About us</Link>
            <Link to="/awareness">Awareness</Link>
            <Link to="/why-mental-health">Why mental health</Link>
            <Link to="/donate">Donate</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/support#help-someone">Supporting someone</Link>
            <Link to="/urgent-help">Urgent help</Link>
            <Link to="/#our-work">Our work</Link>
          </div>
          <div>
            <h3>The details</h3>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <details className="support-preview-links">
              <summary>Interactive previews</summary>
              <Link to="/services">Service catalog demo</Link>
              <Link to="/dashboard">My space preview</Link>
              <Link to="/expertise">Sample professional profiles</Link>
              <Link to="/stories">Illustrative stories</Link>
              <Link to="/admin-preview">Admin preview ↗</Link>
              <p>
                Fictional profiles and sample bookings. No real care or
                appointments.
              </p>
            </details>
            <p>Quick exit does not erase browsing history.</p>
          </div>
        </div>
        <div className="site-footer-bottom">
          <span>BetterHelp · Understanding. Connection. Support.</span>
          <span>
            Temporary branding. Not affiliated with the official BetterHelp
            service.
          </span>
        </div>
      </footer>
    </>
  );
}
