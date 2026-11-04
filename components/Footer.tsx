import Link from "next/link";
import site from "@/data/site.json";
import { AppleMusicIcon, FacebookIcon, PhoneIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";
import { LogoFull, SkylineRule } from "@/components/Logo";
import type { Dict, Locale } from "@/lib/i18n";
import { waLink } from "@/lib/booking";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const year = new Date().getFullYear();
  const home = `/${lang}`;
  const nav = [
    { href: `${home}#story`, label: d.nav.story },
    { href: `${home}#music`, label: d.nav.music },
    { href: `${home}#clips`, label: d.nav.clips },
    { href: `${home}#concerts`, label: d.nav.concerts },
    { href: `${home}#press`, label: d.nav.press },
    { href: `${home}#contact`, label: d.nav.book },
  ];
  const ext = "inline-flex min-h-9 items-center gap-3 transition-colors hover:text-gold";
  return (
    <footer className="grain relative overflow-hidden bg-night text-parchment">
      <SkylineRule className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full text-gold/15" />
      <div className="relative mx-auto grid max-w-[1400px] items-start gap-14 px-5 pt-28 pb-12 md:grid-cols-3 md:px-10 md:pt-36">
        <div className="order-first md:order-none md:col-start-2">
          <LogoFull />
          <p className="mx-auto mt-8 max-w-xs text-center text-[0.9375rem] leading-relaxed text-mist">{d.footer.tagline}</p>
        </div>
        <div className="md:col-start-1 md:row-start-1">
          <p className="eyebrow">{d.footer.contact}</p>
          <ul className="mt-5 space-y-2 text-[0.9375rem]">
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
        <div className="md:text-end">
          <p className="eyebrow">{d.footer.explore}</p>
          <ul className="mt-5 space-y-2 text-[0.9375rem] text-parchment/85">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-9 items-center transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-2 border-t border-line-dark px-5 py-6 pb-24 text-[0.8125rem] text-mist md:flex-row md:justify-between md:px-10 md:pb-6">
        <p>
          © {year} <span translate="no">Aharon Sitbon · אהרון סיטבון</span> · {d.footer.rights}
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-1">
          <span>{d.footer.photos}</span>
          <Link href={`${home}/mentions-legales`} className="underline-offset-4 hover:text-parchment hover:underline">
            {d.footer.legal}
          </Link>
        </p>
      </div>
    </footer>
  );
}
