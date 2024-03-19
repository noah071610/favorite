import { MetadataRoute } from "next"
import { _url } from "./_data"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/$",
        "/polling$",
        "/contest$",
        "/tournament$",
        "/template$",
        "/post/polling",
        "/post/contest",
        "/post/tournament",
      ],
      disallow: ["/auth", "/admin"],
    },
    sitemap: `${_url.client}/sitemap.xml`,
  }
}
