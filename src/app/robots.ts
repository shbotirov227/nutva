import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      "https://nutva.uz/sitemap.xml",
      // Dynamic sitemap ham mavjud bo'lsa
      "https://nutva.uz/sitemap-0.xml",
    ],
    host: "https://nutva.uz",
  }
}
