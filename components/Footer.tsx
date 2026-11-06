import Link from "next/link";
import site from "@/data/site.json";
import { AppleMusicIcon, FacebookIcon, PhoneIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";
import { LogoFull, SkylineRule } from "@/components/Logo";
import { ListenButton } from "@/components/ListenButton";
import type { Dict, Locale } from "@/lib/i18n";
import { waLink } from "@/lib/booking";
import { href } from "@/lib/routes";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const year = new Date().getFullYear();
  const nav = [
    { href: href(lang, "story"), label: d.nav.story },
    { href: href(lang, "music"), label: d.nav.music },
    { href: href(lang, "videos"), label: d.nav.clips },
    { href: href(lang, "today"), label: d.nav.today },
    { href: href(lang, "events"), label: d.nav.events },
    { href: href(lang, "press"), label: d.nav.press },
    { href: href(lang, "contact"), label: d.nav.contact },
  ];
  const ext = "inline-flex min-h-9 items-center gap-3 transition-colors hover:text-sand";
  return (
    <footer className="dark grain relative overflow-hidden">
      {/* Bandeau d'appel avant le pied de page */}
      <div className="relative mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-8 border-b border-line-blue px-5 pt-20 pb-16 md:flex-row md:items-end md:px-10">
        <div>
          <p className="display max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)]" dangerouslySetInnerHTML={{ __html: d.home.ctaTitle }} />
          <p className="lead mt-4">{d.home.ctaText}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <ListenButton label={d.home.ctaButton} />
          <Link href={href(lang, "contact")} className="btn-ghost text-paper">
            {d.home.ctaSecondary}
          </Link>
        </div>
      </div>

      <SkylineRule className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full text-sand/10" />
      <div className="relative mx-auto grid max-w-[1320px] gap-12 px-5 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:px-10">
        <div>
          <LogoFull className="items-start [&>span]:items-start" />
          <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-haze">{d.footer.tagline}</p>
        </div>
        <div>
          <p className="eyebrow plain">{d.footer.explore}</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 text-[0.9375rem] text-paper/90 md:grid-cols-1">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-9 items-center transition-colors hover:text-sand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow plain">{d.footer.contact}</p>
          <ul className="mt-5 space-y-1 text-[0.9375rem] text-paper/90">
            <li>
              <a href={`tel:${site.phoneIntl.replace(/[\s-]/g, "")}`} className={ext}>
                <PhoneIcon className="h-4 w-4" />
                <span dir="ltr">{lang === "he" ? site.phone : site.phoneIntl}</span>
              </a>
            </li>
            <li>
              <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className={ext}>
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.youtube} target="_blank" rel="noopener noreferrer" className={ext}>
                <YouTubeIcon className="h-4 w-4" />
                YouTube
              </a>
            </li>
            <li>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer" className={ext}>
                <FacebookIcon className="h-4 w-4" />
                Facebook
              </a>
            </li>
            <li>
              <a href={site.appleMusic} target="_blank" rel="noopener noreferrer" className={ext}>
                <AppleMusicIcon className="h-4 w-4" />
                Apple Music
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative mx-auto flex max-w-[1320px] flex-col gap-2 border-t border-line-blue px-5 py-6 pb-24 text-[0.8125rem] text-haze md:flex-row md:justify-between md:px-10 md:pb-6">
        <p>
          © {year} <span translate="no">Aharon Sitbon · אהרון סיטבון</span> · {d.footer.rights}
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-1">
          <span>{d.footer.photos}</span>
          <Link href={href(lang, "guest")} className="underline-offset-4 hover:text-paper hover:underline">
            {d.nav.guest}
          </Link>
          <Link href={href(lang, "mentions-legales")} className="underline-offset-4 hover:text-paper hover:underline">
            {d.footer.legal}
          </Link>
        </p>
      </div>
    </footer>
  );
}
