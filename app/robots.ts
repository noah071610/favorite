import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/$", "/template$", "/post/polling", "/post/contest", "/post/tournament"],
      disallow: "/auth",
    },
    sitemap: `${process.env.NEXT_PUBLIC_CLIENT_URL}/sitemap.xml`,
  }
}
