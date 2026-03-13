export type CategoryContent = {
  slug: string;
  label: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  image: string;
  highlights: [string, string, string];
};

const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  "womens-dresses": {
    slug: "womens-dresses",
    label: "Women's Dresses",
    eyebrow: "Occasionwear",
    subtitle: "Statement silhouettes for events, evenings, and polished daywear.",
    description:
      "Structured edits, evening silhouettes, and seasonal tailoring designed for statement dressing.",
    image: "/category-dresses-glory.svg",
    highlights: ["New arrivals weekly", "Event-ready cuts", "Premium tailoring"],
  },
  hijabs: {
    slug: "hijabs",
    label: "Hijabs & Scarves",
    eyebrow: "Signature Drapes",
    subtitle: "Soft scarves and elevated layers for daily styling and festive looks.",
    description:
      "Soft textures, neutral palettes, and elevated scarf edits for everyday layering and festive looks.",
    image: "/category-hijabs-glory.svg",
    highlights: ["Soft modal blends", "Neutral tones", "Layer-friendly styles"],
  },
  accessories: {
    slug: "accessories",
    label: "Accessories",
    eyebrow: "Finishing Details",
    subtitle: "Jewelry and finishing pieces that sharpen the full outfit story.",
    description:
      "Curated accessories and styling details including necklaces, sets, and fashion-led accents.",
    image: "/category-accessories-glory.svg",
    highlights: ["Jewelry highlights", "Gift-ready edits", "Campaign accessories"],
  },
};

export function getCategoryContent(slug: string): CategoryContent {
  return (
    CATEGORY_CONTENT[slug] ?? {
      slug,
      label: slug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      eyebrow: "Category",
      subtitle: "Curated edits and seasonal styling for the latest Glory collections.",
      description:
        "Browse curated products, signature edits, and category-led styling designed for Glory.",
      image: "/hero-glory-editorial.svg",
      highlights: ["Curated edits", "Fresh drops", "Seasonal styling"],
    }
  );
}

export const HOME_CATEGORIES: CategoryContent[] = [
  getCategoryContent("womens-dresses"),
  getCategoryContent("hijabs"),
  getCategoryContent("accessories"),
];
