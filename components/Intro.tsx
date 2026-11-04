"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { skylinePath, wavePath } from "@/lib/skyline";

const KEY = "sitbon-intro";
const at = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

/**
 * Ouverture (2 s, une fois par session, sans son), tout en CSS (globals.css) :
 * une corde de guitare dorée vibre au centre, sa vibration devient une onde fine qui dessine les remparts de Jérusalem,
 * puis « AHARON SITBON », « אהרון סיטבון » et la petite ligne dans la langue choisie apparaissent en fondu.
 */
export function Intro({ skipLabel, tagline }: { skipLabel: string; tagline: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro-curtain flex flex-col items-center justify-center overflow-hidden text-blue">
      <svg viewBox="0 0 1000 200" className="h-auto w-[min(92vw,760px)] text-terra" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
        <line className="intro-string" x1="0" y1="110" x2="1000" y2="110" strokeWidth="1.4" />
        <line className="intro-string s2" x1="0" y1="110" x2="1000" y2="110" strokeWidth="0.8" strokeOpacity="0.5" />
        <path className="intro-wave" pathLength={1} d={wavePath()} strokeWidth="1.2" />
        <path className="intro-wall" pathLength={1} d={skylinePath()} strokeWidth="1.2" />
      </svg>
      <p className="intro-fade mt-8 font-[family-name:var(--font-playfair)] text-[clamp(1.8rem,6.5vw,3.6rem)] leading-none tracking-[0.28em] ps-[0.28em]" style={at(0.95)} dir="ltr" translate="no">
        AHARON SITBON
      </p>
      <p className="intro-fade mt-4 font-[family-name:var(--font-frank)] text-[1.5rem] leading-none font-light" style={at(1.12)} dir="rtl" lang="he" translate="no">
        אהרון סיטבון
      </p>
      <p className="intro-fade eyebrow plain mt-6" style={at(1.28)}>
        {tagline}
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="nav-link absolute end-4 bottom-4 min-h-11 px-4 text-muted transition-colors hover:text-blue"
      >
        {skipLabel}
      </button>
    </div>
  );
}
