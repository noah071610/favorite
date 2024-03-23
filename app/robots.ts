import { MetadataRoute } from "next"
import { _url } from "./_data"

export default function robots(): MetadataRoute.Robots {
  const arr = ["/$", "/polling$", "/contest$", "/tournament$", "/template$", "/post"]

  // 언어 코드
  const languages = ["ko", "en", "ja", "th"]

  // 모든 언어 코드를 각 경로에 추가
  const allow = arr.flatMap((path) => languages.map((lang) => `/${lang}${path}`))

  return {
    rules: {
      userAgent: "*",
      allow,
      disallow: ["/auth", "/admin"],
    },
    sitemap: [`${_url.client}/sitemap.xml`],
  }
}
