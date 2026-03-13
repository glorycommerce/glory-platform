import { MetadataRoute } from "next";
import { defaultSeo } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: defaultSeo.url,
      lastModified: new Date(),
    },
    {
      url: `${defaultSeo.url}/category/womens-dresses`,
      lastModified: new Date(),
    },
    {
      url: `${defaultSeo.url}/category/hijabs`,
      lastModified: new Date(),
    },
  ];
}
