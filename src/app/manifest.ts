import type { MetadataRoute } from "next";
import { brand } from "@/data/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.name,
    description: brand.seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#f3f1ec",
    theme_color: "#ff2fb3",
    lang: "fr",
  };
}
