import { NextResponse } from "next/server"
import acceptLanguage from "accept-language"
import { fallbackLng, languages, cookieName } from "./app/i18n/settings"

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lang*'
  matcher: ["/((?!api|_next/static|_next/image|images|assets|favicon.ico|sw.js).*)"],
}

export function middleware(req) {
  if (
    req.nextUrl.pathname.indexOf("icon") > -1 ||
    req.nextUrl.pathname.indexOf("chrome") > -1 ||
    req.nextUrl.pathname.includes("sitemap") ||
    req.nextUrl.pathname.includes("robots")
  )
    return NextResponse.next()
  let lang
  if (req.cookies.has(cookieName)) {
    lang = acceptLanguage.get(req.cookies.get(cookieName).value)
  }
  if (!lang) lang = acceptLanguage.get(req.headers.get("Accept-Language"))

  if (!lang) lang = fallbackLng

  // Redirect if lang in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL(`/${lang}${req.nextUrl.pathname}`, req.url))
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer"))
    const langInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (langInReferer) response.cookies.set(cookieName, langInReferer)
    return response
  }

  return NextResponse.next()
}
