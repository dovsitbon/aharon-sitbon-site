import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import archives from "@/data/archives.json";
import { altOf, getDict, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { href } from "@/lib/routes";
import { M, Photo } from "@/lib/ui";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { WatchButton } from "@/components/Clips";

export async function generateMetadata({ params }: PageProps<"/[lang]/story">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMetadata(lang, "/story", d.pages.story.title, d.pages.story.intro);
}

// Photo associée à certaines étapes de la frise
const STEP_PHOTO: Record<number, string> = {
  2: M("archives-1977", "portrait-annees-70"),
  3: M("archives-1977", "tele-1977"),
  5: M("scene", "studio-micro"),
  6: M("scene", "ruelle-guitare"),
  7: M("scene", "kotel-adon-olam"),
  9: M("scene", "desert-guitare"),
};

export default async function Story({ params }: PageProps<"/[lang]/story">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.story;

  return (
    <>
      <PageHero lang={lang} d={d} eyebrow={p.eyebrow} h1={p.h1} intro={p.intro} image={M("portrait", "regard-jerusalem")} />

      {/* Frise */}
      <section className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="timeline">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <SectionHead id="timeline" eyebrow={d.story.eyebrow} title={d.story.title} intro={d.story.intro} center />
          </Reveal>
          <ol className="relative mt-20">
            <span className="absolute inset-y-0 start-5 w-px bg-line md:start-1/2" aria-hidden="true" />
            {d.story.steps.map((s, i) => {
              const photo = STEP_PHOTO[i];
              const even = i % 2 === 0;
              return (
                <Reveal as="li" key={s.title} className="relative grid gap-6 pb-14 ps-14 md:grid-cols-2 md:gap-16 md:ps-0">
                  <span className="absolute start-5 top-1 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-terra/40 bg-paper text-[0.8rem] font-medium text-terra md:start-1/2 rtl:translate-x-1/2" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={even ? "md:pe-16 md:text-end" : "md:col-start-2 md:ps-16"}>
                    <p className="eyebrow plain">{s.year}</p>
                    <h3 className="display mt-3 text-[clamp(1.8rem,3vw,2.4rem)]">{s.title}</h3>
                    <p className="lead mt-4">{s.text}</p>
                  </div>
                  {photo && (
                    <div className={`${even ? "md:col-start-2 md:row-start-1 md:ps-16" : "md:col-start-1 md:row-start-1 md:pe-16"}`}>
                      <Photo src={photo} d={d} sizes="(min-width: 768px) 40vw, 85vw" className="aspect-[4/3] rounded-[1.25rem]" />
                    </div>
                  )}
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 1977 · 2026 */}
      <section className="on-photo relative overflow-hidden bg-blue-deep" aria-labelledby="span-title">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[80vh]">
            <Image src={M("archives-1977", "tele-1977")} alt={altOf(d, M("archives-1977", "tele-1977"))} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover sepia-[25%]" />
            <span className="absolute start-5 bottom-5 rounded-full bg-paper/90 px-4 py-1.5 text-[0.875rem] text-blue md:start-10 md:bottom-10">{d.span.then}</span>
          </div>
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[80vh]">
            <Image src={M("scene", "terrasse-jerusalem")} alt={altOf(d, M("scene", "terrasse-jerusalem"))} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            <span className="absolute end-5 bottom-5 rounded-full bg-paper/90 px-4 py-1.5 text-[0.875rem] text-blue md:end-10 md:bottom-10">{d.span.now}</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-blue-deep/55" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center px-5">
          <Reveal className="max-w-3xl text-center">
            <p className="num text-[clamp(1.1rem,2vw,1.4rem)] text-sand" dir="ltr">
              {d.span.eyebrow}
            </p>
            <h2 id="span-title" className="display mt-5 text-[clamp(2.6rem,7vw,5.6rem)]">
              {d.span.title}
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-haze">{d.span.text}</p>
            <div className="mt-9">
              <WatchButton id="1k-gm2mR9vg" title={d.french.tvTitle} label={d.span.watch} className="btn" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Les années françaises */}
      <section id="french" className="bg-sand-soft px-5 py-24 md:px-10 md:py-32" aria-labelledby="french-title">
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionHead id="french-title" eyebrow={d.french.eyebrow} title={d.french.title} intro={d.french.text} />
            </Reveal>
            <Reveal className="mt-12">
              <h3 className="eyebrow plain">{d.french.names}</h3>
              <ul className="mt-4 flex flex-wrap gap-3" lang="fr" dir="ltr">
                {d.french.namesList.map((n) => (
                  <li key={n} className="rounded-full border border-terra/30 bg-paper px-5 py-2 font-[family-name:var(--font-playfair)] text-[1.25rem] text-blue italic">
                    {n}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="mt-12">
              <h3 className="eyebrow plain">{d.french.records}</h3>
              <ul className="card mt-4 divide-y divide-line">
                {archives.singles.map((s) => (
                  <li key={s.ref} className="grid grid-cols-[3.5rem_1fr] gap-4 px-5 py-4 sm:grid-cols-[4rem_1fr_auto] md:px-6">
                    <span className="num pt-1 text-terra">{s.year}</span>
                    <span dir="ltr" lang="fr" className="text-start rtl:text-end">
                      <span className="block font-[family-name:var(--font-playfair)] text-[1.2rem] text-blue italic">
                        {s.a}
                        {s.b && <span className="text-muted"> / {s.b}</span>}
                      </span>
                      <span className="mt-1 block text-[0.875rem] text-muted">
                        {s.artist}
                        {s.credit && <> · {s.credit}</>}
                      </span>
                    </span>
                    <span className="col-start-2 text-[0.8125rem] text-muted sm:col-start-3 sm:text-end" dir="ltr">
                      {s.label} · {s.ref}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.8125rem] text-muted">{d.french.source}</p>
            </Reveal>
          </div>
          <div className="space-y-8">
            <Reveal>
              <Photo src={M("archives-1977", "portrait-annees-70")} d={d} sizes="(min-width: 1024px) 34vw, 92vw" className="arch aspect-[4/5]" position="50% 25%" />
            </Reveal>
            <Reveal className="card p-7">
              <h3 className="display text-[1.7rem]" lang="fr">
                {d.french.lahayeTitle}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{d.french.lahayeText}</p>
            </Reveal>
            <Reveal className="card p-7">
              <h3 className="display text-[1.7rem]">{d.french.tvTitle}</h3>
              <p className="mt-3 leading-relaxed text-muted">{d.french.tvText}</p>
              <WatchButton id="1k-gm2mR9vg" title={d.french.tvTitle} label={d.span.watch} className="btn mt-6" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* En famille */}
      <section className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="family-title">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <SectionHead id="family-title" eyebrow={d.family.eyebrow} title={d.family.title} intro={d.family.text} center />
          </Reveal>
          <ul className="mt-14 grid gap-8 md:grid-cols-3">
            {(
              [
                ["achake-lo-david", "29VD_iylD44", d.family.david],
                ["modeh-ani-petit-fils", "w67jhBVqoz0", d.family.grandson],
                ["ani-maamin-enfants", "oXid2ifaAmI", d.family.children],
              ] as const
            ).map(([name, id, caption], i) => (
              <Reveal as="li" key={name} delay={i * 0.1}>
                <Photo src={M("famille", name)} d={d} sizes="(min-width: 768px) 31vw, 92vw" className="aspect-[4/3] rounded-[1.25rem]" />
                <p className="mt-4 text-[1.05rem] text-blue">{caption}</p>
                <WatchButton id={id} title={caption} label={d.clips.play} className="link-arrow mt-2" />
              </Reveal>
            ))}
          </ul>

          {/* David Sitbon (avec l'accord de la famille) */}
          <Reveal className="dark grain mt-20 grid items-center gap-10 overflow-hidden rounded-[2rem] p-7 md:grid-cols-[1fr_1.3fr] md:p-12">
            <Photo src={M("famille", "achake-lo-david")} d={d} sizes="(min-width: 768px) 38vw, 90vw" className="aspect-[4/3] rounded-[1.25rem]" position="20% 40%" />
            <div>
              <p className="eyebrow">{d.family.son.eyebrow}</p>
              <h3 className="display mt-4 text-[clamp(2rem,4vw,3rem)]" dangerouslySetInnerHTML={{ __html: d.family.son.title }} />
              <p className="lead mt-5">{d.family.son.text}</p>
              <p className="mt-5 text-sand">{d.family.son.single}</p>
              <WatchButton id="BNF-Ipc-_zE" title="David Sitbon – Lehitbonein Nachon" label={d.family.son.watch} className="btn mt-7" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-24 text-center md:px-10">
        <Link href={href(lang, "music")} className="btn">
          {d.home.musicLink}
        </Link>
      </section>
    </>
  );
}
