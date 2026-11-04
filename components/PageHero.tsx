import Image from "next/image";
import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { altOf } from "@/lib/i18n";

/** En-tête des pages intérieures : fond sable, titre à gauche, photo dans une arche (clin d'œil aux portes de Jérusalem). */
export function PageHero({ lang, d, eyebrow, h1, intro, image, position, children }: { lang: Locale; d: Dict; eyebrow: string; h1: string; intro: string; image: string; position?: string; children?: React.ReactNode }) {
  return (
    <section className="grain overflow-hidden bg-sand-soft px-5 pt-32 pb-16 md:px-10 md:pt-40 md:pb-24">
      <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16">
        <div>
          <nav aria-label="breadcrumb" className="text-[0.875rem] text-muted">
            <Link href={`/${lang}`} className="hover:text-terra">
              {d.nav.home}
            </Link>
            <span className="mx-2 opacity-50">/</span>
            <span aria-current="page">{eyebrow}</span>
          </nav>
          <h1 className="display rise mt-8 text-[clamp(2.6rem,6.2vw,5.2rem)]" dangerouslySetInnerHTML={{ __html: h1 }} />
          <p className="lead rise mt-7 max-w-xl" style={{ animationDelay: "0.15s" }}>
            {intro}
          </p>
          {children && (
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "0.3s" }}>
              {children}
            </div>
          )}
        </div>
        <div className="rise relative mx-auto w-full max-w-[26rem]" style={{ animationDelay: "0.2s" }}>
          <div className="absolute -inset-3 arch border border-terra/40" aria-hidden="true" />
          <div className="arch relative aspect-[4/5] overflow-hidden bg-sand">
            <Image src={image} alt={altOf(d, image)} fill priority sizes="(min-width: 768px) 26rem, 90vw" className="object-cover" style={position ? { objectPosition: position } : undefined} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Titre de section réutilisable (le titre peut contenir <em>) */
export function SectionHead({ eyebrow, title, intro, center = false, id, className = "" }: { eyebrow: string; title: string; intro?: string; center?: boolean; id?: string; className?: string }) {
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display mt-5 text-[clamp(2.2rem,4.6vw,3.6rem)]" dangerouslySetInnerHTML={{ __html: title }} />
      {intro && <p className={`lead mt-6 ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{intro}</p>}
    </div>
  );
}
