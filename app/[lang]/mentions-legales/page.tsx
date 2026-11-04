import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/mentions-legales">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return { ...pageMetadata(lang, "/mentions-legales", d.legal.title, d.legal.body[0]), robots: { index: false, follow: true } };
}

export default async function Legal({ params }: PageProps<"/[lang]/mentions-legales">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  return (
    <section className="bg-sand-soft px-5 pt-36 pb-28 md:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="display text-[clamp(2.4rem,5vw,3.6rem)]">{d.legal.title}</h1>
        <div className="mt-10 space-y-5">
          {d.legal.body.map((p) => (
            <p key={p} className="lead">
              {p}
            </p>
          ))}
        </div>
        <Link href={`/${lang}`} className="btn mt-12">
          {d.legal.back}
        </Link>
      </div>
    </section>
  );
}
