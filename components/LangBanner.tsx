"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import { CloseIcon } from "@/components/icons";
import { rememberLocale } from "@/components/LangSwitch";

const TEXTS = { fr: fr.langBanner, en: en.langBanner, es: es.langBanner };
type Other = keyof typeof TEXTS;
const KEY = "sitbon-lang-banner-closed";

/**
 * Sur les pages en hébreu, si le navigateur est en français, anglais ou espagnol : petit bandeau dans SA langue,
 * avec un lien vers la même page dans sa langue. Pas de redirection automatique. Rendu côté client seulement.
 */
export function LangBanner() {
  const pathname = usePathname() || "/he";
  const [lang, setLang] = useState<Other | null>(null);

  useEffect(() => {
    if (!pathname.startsWith("/he")) return;
    try {
      if (localStorage.getItem(KEY) === "1") return;
    } catch {}
    const prefs = (navigator.languages?.length ? navigator.languages : [navigator.language]).map((l) => l.slice(0, 2).toLowerCase());
    if (prefs[0] === "he" || prefs[0] === "iw") return;
    const found = prefs.find((l): l is Other => l === "fr" || l === "en" || l === "es");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture du navigateur, impossible au rendu serveur
    if (found) setLang(found);
  }, [pathname]);

  if (!lang || !pathname.startsWith("/he")) return null;
  const t = TEXTS[lang];
  const target = `/${lang}${pathname.replace(/^\/he(?=\/|$)/, "")}`;
  const close = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setLang(null);
  };

  return (
    <div lang={lang} dir="ltr" className="fade-in fixed inset-x-3 top-[4.75rem] z-[45] mx-auto md:top-[5.75rem] flex max-w-xl items-center gap-3 rounded-full border border-line bg-paper/97 py-2 ps-5 pe-2 text-[0.9375rem] text-ink shadow-[0_16px_40px_-18px_rgba(20,53,83,0.45)] backdrop-blur-md">
      <span className="min-w-0 flex-1">{t.text}</span>
      <a href={target} hrefLang={lang} onClick={() => rememberLocale(lang)} className="btn !min-h-10 shrink-0 !px-4 !text-[0.875rem]">
        {t.button}
      </a>
      <button type="button" onClick={close} aria-label={t.close} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted hover:bg-sand-soft hover:text-ink">
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
