import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["he", "fr", "en", "es"];

// Hébreu par défaut. Si le visiteur a déjà choisi une langue avec le sélecteur (cookie NEXT_LOCALE), on la garde.
// La langue du navigateur n'est PAS utilisée pour rediriger (un bandeau la propose sur les pages en hébreu).
function pickLocale(req: NextRequest) {
  const saved = req.cookies.get("NEXT_LOCALE")?.value;
  return saved && LOCALES.includes(saved) ? saved : "he";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|media|icon|apple-icon|og\\.jpg|logo|robots\\.txt|sitemap\\.xml|llms\\.txt|.*\\..*).*)"],
};
