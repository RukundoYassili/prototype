import { useEffect, useRef, useState } from "react";
import { Check, Globe2 } from "lucide-react";

export type SiteLanguage = "en" | "rw";

export function LanguageSelector({ language, onChange, placement, busy }: {
  language: SiteLanguage;
  onChange: (language: SiteLanguage) => void;
  placement: "desktop" | "mobile";
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return (
    <div className={`language-selector language-selector--${placement} notranslate`} translate="no" ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}>
      <button ref={trigger} type="button" className="language-selector-trigger"
        aria-label="Choose language" aria-expanded={open}
        aria-controls={`language-options-${placement}`} onClick={() => setOpen(!open)}>
        <Globe2 size={18} aria-hidden="true" />
        <span>{busy ? "…" : language === "en" ? "EN" : "RW"}</span>
      </button>
      <div id={`language-options-${placement}`} className="language-selector-menu" hidden={!open}
        role="group" aria-label="Choose language">
        {([ ["en", "English"], ["rw", "Kinyarwanda"] ] as const).map(([code, label]) => (
          <button type="button" key={code} lang={code} className="language-option" disabled={busy}
            aria-pressed={language === code}
            onClick={() => { onChange(code); setOpen(false); trigger.current?.focus(); }}>
            <span>{label}</span>{language === code && <Check size={16} aria-hidden="true" />}
          </button>
        ))}
        <p className="language-selector-note">Kinyarwanda is automatically translated by <a href="https://translate.google.com/" target="_blank" rel="noreferrer">Google Translate</a>.</p>
      </div>
    </div>
  );
}
