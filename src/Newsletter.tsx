import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Flower2, Mail } from "lucide-react";
import { Button } from "./system/components";

export default function Newsletter() {
  const id = useId();
  const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT?.trim();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "submitting" | "subscribed" | "confirmation_required" | "error"
  >("idle");
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const complete = state === "subscribed" || state === "confirmation_required";

  return (
    <section
      id="newsletter"
      className="site-newsletter"
      aria-labelledby={`${id}-title`}
    >
      <div className="site-newsletter-inner">
        <div className="site-newsletter-copy">
          <span className="site-newsletter-eyebrow">
            <Mail size={16} aria-hidden="true" /> THE BETTERHELP LETTER
          </span>
          <h2 id={`${id}-title`}>
            A little calm.
            <br />
            <span>In your inbox.</span>
          </h2>
          <p>
            Simple practices, thoughtful reads, and a little encouragement to
            make room for your well-being.
          </p>
          <span className="site-newsletter-detail">
            Occasional notes. Always thoughtful.
          </span>
        </div>
        <div className="site-newsletter-signup">
          {complete ? (
            <div
              className="site-newsletter-success"
              role="status"
              tabIndex={-1}
              ref={(element) => {
                element?.focus({ preventScroll: true });
              }}
            >
              <CheckCircle2 size={32} aria-hidden="true" />
              <h3>
                {state === "confirmation_required"
                  ? "One more little step."
                  : "You’re on the list."}
              </h3>
              <p>
                {state === "confirmation_required"
                  ? "Check your inbox for a confirmation email to finish signing up."
                  : "Thank you for making a little room for us in your inbox."}
              </p>
            </div>
          ) : (
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                if (!endpoint || state === "submitting") return;
                const controller = new AbortController();
                request.current = controller;
                setState("submitting");
                try {
                  const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email.trim() }),
                    signal: controller.signal,
                    credentials: "omit",
                    cache: "no-store",
                  });
                  if (!response.ok) throw new Error("Subscription failed");
                  const result: { status?: string } = await response.json();
                  if (
                    result.status !== "subscribed" &&
                    result.status !== "confirmation_required"
                  )
                    throw new Error("Unconfirmed subscription");
                  if (controller.signal.aborted) return;
                  setEmail("");
                  setState(result.status);
                } catch {
                  if (!controller.signal.aborted) setState("error");
                }
              }}
            >
              <div className="site-newsletter-card-heading">
                <div>
                  <span className="site-newsletter-card-eyebrow">
                    A MOMENT FOR YOU
                  </span>
                  <h3>Your next quiet moment.</h3>
                </div>
                <span className="site-newsletter-mark" aria-hidden="true">
                  <Flower2 size={25} strokeWidth={1.3} />
                </span>
              </div>
              <label htmlFor={`${id}-email`}>Newsletter email address</label>
              <div className="site-newsletter-input-row">
                <div className="site-newsletter-email">
                  <Mail size={17} aria-hidden="true" />
                  <input
                    id={`${id}-email`}
                    type="email"
                    name="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    disabled={state === "submitting" || !endpoint}
                    aria-describedby={`${id}-privacy${!endpoint ? ` ${id}-availability` : ""}${state === "error" ? ` ${id}-error` : ""}`}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (state === "error") setState("idle");
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!endpoint}
                  loading={state === "submitting"}
                >
                  Subscribe <ArrowUpRight size={17} aria-hidden="true" />
                </Button>
              </div>
              <p id={`${id}-privacy`} className="site-newsletter-privacy">
                Unsubscribe at any time. Read our{" "}
                <Link to="/privacy">privacy notice</Link>.
              </p>
              {!endpoint && (
                <p
                  id={`${id}-availability`}
                  className="site-newsletter-availability"
                >
                  <span
                    className="site-newsletter-status-dot"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Signups open soon.</strong> We aren’t collecting
                    email addresses yet.
                  </span>
                </p>
              )}
              {state === "error" && (
                <p
                  id={`${id}-error`}
                  className="site-newsletter-error"
                  role="alert"
                >
                  We couldn’t confirm your subscription. Please try again in a
                  moment.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
