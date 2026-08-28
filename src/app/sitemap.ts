import type { MetadataRoute } from "next";
import { archiveArticles, archiveCharacters } from "@/data/archive";
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
      url: `${base}/brainrots`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
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
    ...archiveCharacters.map((character) => ({
      url: `${base}/brainrots/${character.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...archiveArticles.map((article) => ({
      url: `${base}/blog/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
