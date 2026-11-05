import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { M } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { PageHero } from "@/components/PageHero";
import { Clips } from "@/components/Clips";

export async function generateMetadata({ params }: PageProps<"/[lang]/videos">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMetadata(lang, "/videos", d.pages.videos.title, d.pages.videos.desc, "/og/videos.jpg");
}

export default async function Videos({ params }: PageProps<"/[lang]/videos">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.videos;
  return (
    <>
      <JsonLd data={breadcrumbLd(lang, d, [[d.nav.clips, `/${lang}/videos`]])} />
      <PageHero lang={lang} d={d} eyebrow={p.eyebrow} h1={p.h1} intro={p.intro} image={M("scene", "tzama-5781")} />
      <section className="px-5 pt-8 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-[1320px]">
          <Clips />
        </div>
      </section>
    </>
  );
}
