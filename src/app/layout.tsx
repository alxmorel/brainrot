import type { Metadata } from "next";
import {
  Coiny,
  Fredoka,
  Lilita_One,
  Nunito_Sans,
  Titan_One,
} from "next/font/google";
import { brand } from "@/data/brand";
import { legal } from "@/data/legal";
import { Providers } from "./providers";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const titan = Titan_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-titan",
  display: "swap",
});

const lilita = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lilita",
  display: "swap",
});

const coiny = Coiny({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-coiny",
  display: "swap",
});

const body = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(legal.siteUrl),
  title: {
    default: brand.seo.title,
    template: "%s - Brainrototo",
  },
  description: brand.seo.description,
  applicationName: brand.name,
  authors: [{ name: brand.name, url: legal.siteUrl }],
  creator: brand.name,
  publisher: brand.name,
  keywords: [
    "Brainrototo",
    "brainrototo.com",
    "Brainrototo Wear",
    "créatures Brainrototo",
    "tee Brainrototo",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: brand.name,
    title: brand.seo.title,
    description: brand.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: brand.seo.title,
    description: brand.seo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${legal.siteUrl}/#organization`,
      name: brand.name,
      url: legal.siteUrl,
      email: legal.email,
      brand: {
        "@type": "Brand",
        name: brand.name,
        alternateName: ["brainrototo", "Brainrototo Wear", legal.siteName],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${legal.siteUrl}/#website`,
      name: brand.name,
      alternateName: ["brainrototo", "Brainrototo Wear", legal.siteName],
      url: legal.siteUrl,
      inLanguage: "fr-FR",
      description: brand.seo.description,
      publisher: { "@id": `${legal.siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fredoka.variable} ${titan.variable} ${lilita.variable} ${coiny.variable} ${body.variable} h-full antialiased`}
    >
      <body className="h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
