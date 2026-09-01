import { legal } from "@/data/legal";

export function ArchiveJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "fr-FR",
    url: `${legal.siteUrl}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: "The Brainrot Archive",
      url: legal.siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
