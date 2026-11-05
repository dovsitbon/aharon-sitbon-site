"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Diaporama plein écran de l'accueil : fondu enchaîné lent et léger zoom (effet « Ken Burns »).
 * Première image prioritaire ; les suivantes se chargent ensuite. Mouvement coupé si l'utilisateur préfère réduire les animations.
 * Pour changer les photos : public/media/slides/ (générées par npm run media) et la liste SLIDES dans app/[lang]/page.tsx.
 */
export function HeroSlides({ slides, label, interval = 6500 }: { slides: { src: string; alt: string; position?: string }[]; label: string; interval?: number }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (paused) return;
    const t = setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % slides.length);
    }, interval);
    return () => clearInterval(t);
  }, [slides.length, interval, paused]);

  return (
    <>
      <div className="absolute inset-0" aria-roledescription="carousel" aria-label={label}>
        {slides.map((s, n) => (
          <div key={s.src} className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${n === i ? "opacity-100" : "opacity-0"}`} aria-hidden={n !== i}>
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={n === 0}
              loading={n === 0 ? undefined : "lazy"}
              quality={80}
              sizes="100vw"
              className={`object-cover ${n === i ? "kenburns" : ""}`}
              style={{ objectPosition: s.position ?? "50% 30%" }}
            />
          </div>
        ))}
      </div>
      <div className="absolute end-5 bottom-6 z-10 flex items-center gap-2 md:end-10 md:bottom-10" dir="ltr">
        {slides.map((s, n) => (
          <button
            key={s.src}
            type="button"
            onClick={() => {
              setI(n);
              setPaused(true);
            }}
            aria-label={`${n + 1} / ${slides.length}`}
            aria-current={n === i}
            className="group flex h-8 items-center"
          >
            <span className={`block h-[3px] rounded-full transition-all duration-500 ${n === i ? "w-8 bg-paper" : "w-4 bg-paper/45 group-hover:bg-paper/80"}`} />
          </button>
        ))}
      </div>
    </>
  );
}
