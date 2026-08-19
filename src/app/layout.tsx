import type { Metadata } from "next";
import {
  Coiny,
  Fredoka,
  Lilita_One,
  Nunito_Sans,
  Titan_One,
} from "next/font/google";
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

export const metadata: Metadata = {
  title: "Brainrot.com",
  description:
    "Create your brainrot. Wear the chaos. Colorful collectible toy brand on the internet.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fredoka.variable} ${titan.variable} ${lilita.variable} ${coiny.variable} ${body.variable} h-full antialiased`}
    >
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
