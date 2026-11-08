"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/locales";

const LABELS: Record<Locale, string> = { he: "עב", fr: "FR", en: "EN", es: "ES" };
const NAMES: Record<Locale, string> = { he: "עברית", fr: "Français", en: "English", es: "Español" };

/** Mémorise le choix (1 an) : l'adresse racine « / » ramène ensuite dans cette langue (proxy.ts). */
export const rememberLocale = (l: Locale) => {
  document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000;samesite=lax`;
};

export function GlobeIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.1-3.6-8.5S9.6 5.8 12 3.5Z" />
    </svg>
  );
}

/**
 * Sélecteur de langue.
 * - variant "bar" (en-tête) : icône globe, codes « עב FR EN ES », noms complets sur grand écran, langue active en pastille.
 * - variant "menu" (menu mobile) : quatre gros boutons.
 */
export function LangSwitch({ lang, label, className = "", variant = "bar" }: { lang: Locale; label: string; className?: string; variant?: "bar" | "menu" }) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.replace(/^\/(he|fr|en|es)(?=\/|$)/, "");

  if (variant === "menu") {
    return (
      <nav aria-label={label} className={`grid grid-cols-2 gap-2 ${className}`} dir="ltr">
        {locales.map((l) => (
          <a
            key={l}
            href={`/${l}${rest}`}
            hrefLang={l}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            onClick={() => rememberLocale(l)}
            className={`flex min-h-12 items-center justify-center rounded-full border text-[1.05rem] font-medium transition-colors ${
              l === lang ? "border-blue bg-blue text-paper" : "border-line bg-white text-blue hover:border-blue"
            }`}
          >
            {NAMES[l]}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label={label} className={`flex items-center gap-1 text-[0.95rem] ${className}`} dir="ltr">
      <GlobeIcon className="me-1 h-[18px] w-[18px] opacity-90" />
      {locales.map((l) => (
        <a
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          aria-label={NAMES[l]}
          aria-current={l === lang ? "true" : undefined}
          onClick={() => rememberLocale(l)}
          className={`inline-flex min-h-9 items-center justify-center rounded-full border px-2.5 font-medium transition-colors ${
            l === lang ? "border-current" : "border-transparent opacity-90 hover:border-current/40 hover:opacity-100"
          }`}
        >
          <span className="min-[1480px]:hidden">{LABELS[l]}</span>
          <span className="hidden min-[1480px]:inline">{NAMES[l]}</span>
        </a>
      ))}
    </nav>
  );
}
