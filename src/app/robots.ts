import { MetadataRoute } from "next";
import { defaultSeo } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${defaultSeo.url}/sitemap.xml`,
  };
}
