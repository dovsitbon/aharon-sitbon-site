import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { href } from "@/lib/routes";
import { M } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, discographyLd } from "@/lib/jsonld";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ListenButton } from "@/components/ListenButton";
import { AlbumCards, ArchivesGrid, SinglesGrid } from "@/components/Discography";
import { ArrowIcon } from "@/components/icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/music">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMetadata(lang, "/music", d.pages.music.title, d.pages.music.desc, "/og/music.jpg");
}

export default async function Music({ params }: PageProps<"/[lang]/music">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.music;
  return (
    <>
      <JsonLd data={[breadcrumbLd(lang, d, [[d.nav.music, `/${lang}/music`]]), discographyLd(lang)]} />
      <PageHero lang={lang} d={d} eyebrow={p.eyebrow} h1={p.h1} intro={p.intro} image={M("scene", "studio-micro")} position="60% 40%">
        <ListenButton label={d.hero.listen} />
      </PageHero>

      <section className="px-5 py-24 md:px-10 md:py-28" aria-labelledby="albums">
        <div className="mx-auto max-w-[1320px]">
          <Reveal className="mb-12">
            <SectionHead id="albums" eyebrow={d.music.albums} title={d.home.musicTitle} />
          </Reveal>
          <AlbumCards />
        </div>
      </section>

      <section className="bg-sand-soft px-5 py-24 md:px-10 md:py-28" aria-labelledby="singles">
        <div className="mx-auto max-w-[1320px]">
          <Reveal className="mb-12">
            <SectionHead id="singles" eyebrow={d.music.singles} title={`${d.music.singles} <em>2019 · 2026</em>`} />
          </Reveal>
          <SinglesGrid />
        </div>
      </section>

      <section className="px-5 py-24 md:px-10 md:py-28" aria-labelledby="archives">
        <div className="mx-auto max-w-[1320px]">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHead id="archives" eyebrow={d.music.archives} title={`${d.music.archives} <em>1971 · 1980</em>`} intro={d.music.archivesText} />
            <Link href={`${href(lang, "story")}#french`} className="link-arrow">
              {d.french.eyebrow} <ArrowIcon />
            </Link>
          </Reveal>
          <ArchivesGrid />
        </div>
      </section>
    </>
  );
}
