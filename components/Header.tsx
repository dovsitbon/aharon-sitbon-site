"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Mark, Wordmark } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { CloseIcon, FacebookIcon, MenuIcon, YouTubeIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";

export function Header() {
  const { lang, d } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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

  const home = `/${lang}`;
  const onHero = usePathname() === home && !scrolled && !menu;
  const links = [
    { href: `${home}#story`, label: d.nav.story },
    { href: `${home}#music`, label: d.nav.music },
    { href: `${home}#clips`, label: d.nav.clips },
    { href: `${home}#concerts`, label: d.nav.concerts },
    { href: `${home}#press`, label: d.nav.press },
    { href: `${home}#contact`, label: d.nav.contact },
  ];
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
        className={`fixed inset-x-0 top-0 z-50 text-parchment transition-[background-color,border-color] duration-700 ${
          onHero ? "border-b border-parchment/15 bg-transparent" : "border-b border-line-dark bg-night/95 backdrop-blur-sm"
        }`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:bg-parchment focus:px-4 focus:py-2 focus:text-ink">
          {d.nav.skip}
        </a>
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:h-[5.25rem] md:px-10">
          <div className="flex items-center">
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center min-[1280px]:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-7 min-[1280px]:flex" aria-label={d.nav.menu}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link whitespace-nowrap transition-colors duration-500 hover:text-gold">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href={home} className="flex items-center" aria-label={d.nav.home}>
            <Wordmark />
          </Link>

          <div className="flex items-center justify-end gap-4 md:gap-6">
            <LangSwitch lang={lang} label={d.nav.language} className="hidden lg:flex" />
            <div className="hidden items-center gap-4 lg:flex">{social}</div>
            <Link
              href={`${home}#contact`}
              className={`nav-link flex min-h-10 items-center border px-4 whitespace-nowrap transition-colors duration-500 md:px-5 ${
                onHero ? "border-parchment/70 hover:border-parchment hover:bg-parchment hover:text-night" : "border-gold bg-gold text-night hover:border-parchment hover:bg-parchment"
              }`}
            >
              <span className="hidden sm:inline">{d.nav.book}</span>
              <span className="sm:hidden">{d.nav.bookShort}</span>
            </Link>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fade-in fixed inset-0 z-[60] flex flex-col overscroll-contain bg-night text-parchment" role="dialog" aria-modal="true" aria-label={d.nav.menu}>
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[5.25rem] md:px-10">
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center justify-self-start" onClick={() => setMenu(false)} aria-label={d.nav.close}>
              <CloseIcon />
            </button>
            <Wordmark />
            <span />
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-5" aria-label={d.nav.menu}>
            {links.map((l, i) => (
              <div key={l.href} className="fade-up" style={{ animationDelay: `${0.06 * i + 0.1}s` }}>
                <Link href={l.href} onClick={() => setMenu(false)} className="display text-[2.2rem] transition-colors hover:text-gold rtl:text-[2rem]">
                  {l.label}
                </Link>
              </div>
            ))}
            <div className="fade-in mt-6" style={{ animationDelay: "0.5s" }}>
              <Link href={`${home}#contact`} onClick={() => setMenu(false)} className="btn-solid">
                {d.nav.book}
              </Link>
            </div>
            <Mark className="mt-8 h-6 w-16 text-gold" />
          </nav>
          <div className="flex items-center justify-between border-t border-line-dark px-6 py-4">
            <LangSwitch lang={lang} label={d.nav.language} />
            <div className="flex items-center gap-5">{social}</div>
          </div>
        </div>
      )}
    </>
  );
}
