"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Mark, Wordmark } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { ListenButton } from "@/components/ListenButton";
import { CloseIcon, FacebookIcon, MenuIcon, YouTubeIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { href } from "@/lib/routes";

export function Header() {
  const { lang, d } = useLocale();
  const pathname = usePathname() || `/${lang}`;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (menu) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  // Sur l'accueil, en haut de page, le header flotte sur la grande photo (texte clair)
  const onPhoto = pathname === `/${lang}` && !scrolled && !menu;
  const links = [
    { href: href(lang, "story"), label: d.nav.story },
    { href: href(lang, "music"), label: d.nav.music },
    { href: href(lang, "videos"), label: d.nav.clips },
    { href: href(lang, "today"), label: d.nav.today },
    { href: href(lang, "events"), label: d.nav.events },
    { href: href(lang, "press"), label: d.nav.press },
    { href: href(lang, "contact"), label: d.nav.contact },
  ];
  const isActive = (h: string) => pathname === h || pathname.startsWith(`${h}/`);
  const social = (
    <>
      <a href={site.youtube} target="_blank" rel="noopener noreferrer" className="-m-2 flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60" aria-label="YouTube">
        <YouTubeIcon />
      </a>
      <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="-m-2 flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60" aria-label="Facebook">
        <FacebookIcon />
      </a>
    </>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
          onPhoto ? "bg-transparent text-paper" : "bg-paper/95 text-blue shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
        }`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
          {d.nav.skip}
        </a>
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-4 md:h-20 md:px-8">
          <Link href={`/${lang}`} className="flex shrink-0 items-center gap-3" aria-label={d.nav.home}>
            <Mark className={`hidden h-6 w-16 sm:block ${onPhoto ? "text-sand" : "text-terra"}`} />
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-1 min-[1180px]:flex" aria-label={d.nav.menu}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`relative rounded-full px-3 py-2 text-[0.9375rem] font-medium whitespace-nowrap transition-colors rtl:text-[1rem] ${
                  isActive(l.href) ? (onPhoto ? "bg-paper/15" : "bg-sand-soft text-terra") : onPhoto ? "hover:bg-paper/10" : "hover:text-terra"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <LangSwitch lang={lang} label={d.nav.language} className="hidden lg:flex" />
            <div className="hidden items-center gap-3 min-[1600px]:flex">{social}</div>
            <ListenButton label={d.nav.book} className="btn hidden !min-h-11 !px-5 whitespace-nowrap sm:inline-flex" />
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center min-[1180px]:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fade-in fixed inset-0 z-[60] flex flex-col overscroll-contain bg-paper text-blue" role="dialog" aria-modal="true" aria-label={d.nav.menu}>
          <div className="flex h-16 items-center justify-between px-4 md:h-20 md:px-8">
            <Wordmark />
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center" onClick={() => setMenu(false)} aria-label={d.nav.close}>
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-1 px-8" aria-label={d.nav.menu}>
            {[{ href: `/${lang}`, label: d.nav.home }, ...links].map((l, i) => (
              <div key={l.href} className="fade-up" style={{ animationDelay: `${0.04 * i + 0.05}s` }}>
                <Link href={l.href} onClick={() => setMenu(false)} className={`display block py-1.5 text-[2.1rem] ${pathname === l.href ? "!text-terra" : ""}`}>
                  {l.label}
                </Link>
              </div>
            ))}
            <div className="fade-in mt-8" style={{ animationDelay: "0.4s" }}>
              <ListenButton label={d.home.ctaButton} />
            </div>
          </nav>
          <div className="flex items-center justify-between border-t border-line px-6 py-4">
            <LangSwitch lang={lang} label={d.nav.language} />
            <div className="flex items-center gap-5">{social}</div>
          </div>
        </div>
      )}
    </>
  );
}
