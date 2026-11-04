import { notFound } from "next/navigation";
import type { Metadata } from "next";
import press from "@/data/press.json";
import { getDict, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { formatDay } from "@/lib/booking";
import { M } from "@/lib/ui";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon } from "@/components/icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/press">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMetadata(lang, "/press", d.pages.press.title, d.pages.press.intro);
}

export default async function Press({ params }: PageProps<"/[lang]/press">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.press;
  const when = (iso: string) => (iso.length === 4 ? iso : formatDay(iso, lang, { day: "numeric", month: "long", year: "numeric" }));
  const sorted = [...press].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero lang={lang} d={d} eyebrow={p.eyebrow} h1={p.h1} intro={p.intro} image={M("scene", "interview-hamevaker")} position="35% 50%" />

      <section className="px-5 py-24 md:px-10 md:py-28">
        <ul className="mx-auto grid max-w-[1320px] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((a, i) => (
            <Reveal as="li" key={a.url} delay={(i % 3) * 0.06}>
              <a href={a.url} target="_blank" rel="noopener noreferrer" hrefLang={a.lang} className="card group flex h-full flex-col p-7 transition-[border-color,box-shadow] duration-500 hover:border-terra/40 hover:shadow-[0_24px_50px_-30px_rgba(31,78,121,0.35)]">
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-[family-name:var(--font-playfair)] text-[1.45rem] text-blue" dir="ltr">
                    {a.media}
                  </span>
                  <span className="num shrink-0 text-[0.8125rem] text-terra">{when(a.date)}</span>
                </span>
                {a.title && (
                  <span className="mt-4 block text-[1.05rem] font-medium text-ink" lang={a.lang} dir="auto">
                    {a.title}
                  </span>
                )}
                <span className={`block leading-relaxed text-muted ${a.title ? "mt-2" : "mt-4"}`}>{a.summary[lang]}</span>
                <span className="link-arrow mt-auto pt-6">
                  {d.press.read} <ArrowIcon />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Messages du public — À REMPLIR avec de vrais messages, avec leur accord. Aucun avis inventé. */}
      <section className="bg-sand-soft px-5 py-24 md:px-10 md:py-28" aria-labelledby="voices">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="font-[family-name:var(--font-playfair)] text-[5rem] leading-none text-terra/40" aria-hidden="true">
            “
          </span>
          <SectionHead id="voices" eyebrow={d.voices.eyebrow} title={d.voices.title} intro={d.voices.text} center />
        </Reveal>
      </section>
    </>
  );
}
