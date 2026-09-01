import type { MetadataRoute } from "next";
import { legal } from "@/data/legal";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/ops",
        "/api/",
        "/cart",
        "/checkout",
        "/commande",
        "/compte",
        "/create",
        "/design-system",
      ],
    },
    sitemap: `${legal.siteUrl}/sitemap.xml`,
    host: legal.siteUrl.replace(/^https?:\/\//, ""),
  };
}
