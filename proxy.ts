import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["he", "fr", "en", "es"];

// Hébreu par défaut, toujours : la langue du navigateur et les choix précédents ne sont pas pris en compte.
// Le visiteur change de langue avec le sélecteur עב · FR · EN · ES (adresses /fr, /en, /es).
const pickLocale = () => "he";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale()}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|media|icon|apple-icon|og\\.jpg|logo|robots\\.txt|sitemap\\.xml|llms\\.txt|.*\\..*).*)"],
};
