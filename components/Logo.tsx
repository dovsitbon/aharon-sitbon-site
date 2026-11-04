import { skylinePath } from "@/lib/skyline";

/**
 * Logo typographique provisoire (l'artiste n'a pas de logo) : « AHARON SITBON » en capitales fines très espacées,
 * « אהרון סיטבון » dessous, et un fin trait doré : une corde qui devient une onde et dessine l'arche d'une porte de Jérusalem.
 * Pour le remplacer : changer ce composant, ou y mettre un <img src="/logo.svg">.
 */
export function Mark({ className = "h-5 w-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 40" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true">
      <path d="M2 30 H30 C34 30 35 24 38 24 S42 34 45 34 S48 22 51 22 S54 30 56 30" />
      <path d="M44 30 V18 A12 12 0 0 1 68 18 V30" />
      <path d="M56 30 C58 30 59 24 61 24 S64 34 67 34 S70 26 72 26 S76 30 82 30 H110" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col items-center leading-none ${className}`} translate="no">
      <span dir="ltr" className="font-[family-name:var(--font-cormorant)] text-[0.95rem] font-light tracking-[0.42em] ps-[0.42em] md:text-[1.15rem]">
        AHARON SITBON
      </span>
      <span dir="rtl" lang="he" className="mt-1.5 font-[family-name:var(--font-frank)] text-[0.8rem] font-light tracking-[0.12em] opacity-80 md:text-[0.9rem]">
        אהרון סיטבון
      </span>
    </span>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Mark className="mb-4 h-7 w-20 text-gold" />
      <Wordmark />
    </div>
  );
}

export function SkylineRule({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 200" preserveAspectRatio="xMidYMax meet" className={className} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" aria-hidden="true">
      <path d={skylinePath()} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
