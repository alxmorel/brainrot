import type { MetadataRoute } from "next";
import { brainrots } from "@/data/brainrots";
import { legal } from "@/data/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = legal.siteUrl;

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/guide-tailles`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/mentions-legales`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/cgv`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/confidentialite`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...brainrots.map((brainrot) => ({
      url: `${base}/tee/${brainrot.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
