import { useCallback, useEffect, useState } from "react";
import type { SiteLanguage } from "./LanguageSelector";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement: new (options: object, element: string) => unknown } };
  }
}

let loading: Promise<HTMLSelectElement> | undefined;

function translationControl(): Promise<HTMLSelectElement> {
  const existing = document.querySelector<HTMLSelectElement>("#site-google-translate select.goog-te-combo");
  if (existing) return Promise.resolve(existing);
  if (loading) return loading;
  loading = new Promise<HTMLSelectElement>((resolve, reject) => {
    let finished = false;
    const timeout = window.setTimeout(() => { finished = true; reject(new Error("Translation is unavailable right now.")); }, 20000);
    window.googleTranslateElementInit = () => {
      const TranslateElement = window.google?.translate?.TranslateElement;
      if (!TranslateElement) { clearTimeout(timeout); reject(new Error("Translation is unavailable right now.")); return; }
      new TranslateElement({ pageLanguage: "en", includedLanguages: "en,rw", autoDisplay: false }, "site-google-translate");
      const waitForControl = () => {
        if (finished) return;
        const select = document.querySelector<HTMLSelectElement>("#site-google-translate select.goog-te-combo");
        if (select && [...select.options].some((option) => option.value === "rw")) { finished = true; clearTimeout(timeout); resolve(select); }
        else window.setTimeout(waitForControl, 100);
      };
      waitForControl();
    };
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => { finished = true; clearTimeout(timeout); reject(new Error("Translation could not load. Check your connection and try again.")); };
    document.head.appendChild(script);
  }).catch((error) => { loading = undefined; throw error; });
  return loading;
}

function translated(): boolean {
  return document.cookie.split(";").some((cookie) => cookie.trim().startsWith("googtrans=/en/rw"));
}
export function currentSiteLanguage(): SiteLanguage { return translated() ? "rw" : "en"; }

export function useSiteTranslation() {
  const [language, setLanguage] = useState<SiteLanguage>(() => translated() ? "rw" : "en");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (translated()) translationControl().catch(() => setError("Translation could not load. Check your connection and try again."));
  }, []);

  useEffect(() => {
    if (language !== "rw") return;
    // Google translates a document, but React replaces page content on client-side
    // navigation. Load the next document so the saved language applies to it too.
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(destination.href);
    };
    document.addEventListener("click", navigate, true);
    return () => document.removeEventListener("click", navigate, true);
  }, [language]);

  const changeLanguage = useCallback(async (next: SiteLanguage) => {
    if (next === language || busy) return;
    setBusy(true);
    setError("");
    try {
      const select = await translationControl();
      // Google can create the select before its engine is ready. Confirm the
      // service has accepted the change before showing the selected language.
      let confirmed = false;
      for (let attempt = 0; attempt < 20; attempt++) {
        select.value = next;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        await new Promise((resolve) => window.setTimeout(resolve, 750));
        if (translated() === (next === "rw")) { confirmed = true; break; }
      }
      if (!confirmed) throw new Error("Translation is unavailable right now. Please try again.");
      setLanguage(next);
      window.dispatchEvent(new CustomEvent("site-language-change", { detail: next }));
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Translation could not load.");
    } finally { setBusy(false); }
  }, [language, busy]);

  return { language, busy, error, changeLanguage };
}
