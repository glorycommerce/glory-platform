import { db } from "@/lib/db";
import type { CatalogProduct } from "@/lib/types";

type CatalogQuery = {
  merchantSlug?: string;
  categorySlug?: string;
  search?: string;
  limit?: number;
};

type ProductQueryRecord = {
  id: string;
  merchantId: string;
  name: string;
  slug: string;
  description: string | null;
  merchant: { slug: string };
  category: { slug: string } | null;
  subCategory: { slug: string } | null;
  variants: Array<{
    id: string;
    sku: string;
    size: string | null;
    color: string | null;
    stitching: "STITCHED" | "UNSTITCHED";
    price: number;
    compareAt: number | null;
    stock: number;
    images: string[];
  }>;
  discounts: Array<{
    startsAt: Date | null;
    endsAt: Date | null;
    type: "PERCENT" | "FIXED";
    value: number;
  }>;
};

function getDefaultProducts(): CatalogProduct[] {
  return [
    {
      id: "seed-1",
      merchantId: "glory",
      merchantSlug: "glory",
      name: "Luna Linen Dress",
      slug: "luna-linen-dress",
      description: "Minimal linen silhouette for daily wear.",
      categorySlug: "womens-dresses",
      subCategorySlug: null,
      variants: [
        {
          id: "seed-v1",
          sku: "GLR-LUNA-S-BEIGE",
          size: "S",
          color: "Beige",
          stitching: "STITCHED",
          price: 3200,
          compareAt: 3800,
          stock: 15,
          images: [],
        },
      ],
      activeDiscountPercent: 16,
    },
    {
      id: "seed-2",
      merchantId: "glory",
      merchantSlug: "glory",
      name: "Nura Chiffon Hijab",
      slug: "nura-chiffon-hijab",
      description: "Lightweight and soft drape chiffon hijab.",
      categorySlug: "hijabs",
      subCategorySlug: null,
      variants: [
        {
          id: "seed-v2",
          sku: "GLR-NURA-STD-IVORY",
          size: null,
          color: "Ivory",
          stitching: "UNSTITCHED",
          price: 890,
          compareAt: null,
          stock: 42,
          images: [],
        },
      ],
      activeDiscountPercent: null,
    },
  ];
}

function mapCatalogProduct(record: ProductQueryRecord): CatalogProduct {
  const now = new Date();
  const activeDiscount = record.discounts.find(
    (item) =>
      (!item.startsAt || item.startsAt <= now) && (!item.endsAt || item.endsAt >= now)
  );

  return {
    id: record.id,
    merchantId: record.merchantId,
    merchantSlug: record.merchant.slug,
    name: record.name,
    slug: record.slug,
    description: record.description,
    categorySlug: record.category?.slug ?? null,
    subCategorySlug: record.subCategory?.slug ?? null,
    variants: record.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      stitching: variant.stitching,
      price: variant.price,
      compareAt: variant.compareAt,
      stock: variant.stock,
      images: variant.images,
    })),
    activeDiscountPercent:
      activeDiscount && activeDiscount.type === "PERCENT" ? activeDiscount.value : null,
  };
}

export async function listCatalogProducts(
  query: CatalogQuery = {}
): Promise<CatalogProduct[]> {
  try {
    const take = Math.min(query.limit ?? 24, 100);
    const products = (await db.product.findMany({
      where: {
        isActive: true,
        merchant: query.merchantSlug ? { slug: query.merchantSlug } : undefined,
        category: query.categorySlug ? { slug: query.categorySlug } : undefined,
        OR: query.search
          ? [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: { createdAt: "desc" },
      take,
      include: {
        merchant: { select: { slug: true } },
        category: { select: { slug: true } },
        subCategory: { select: { slug: true } },
        variants: true,
        discounts: true,
      },
    })) as ProductQueryRecord[];

    if (products.length === 0) {
      return getDefaultProducts();
    }

    return products.map(mapCatalogProduct);
  } catch {
    return getDefaultProducts();
  }
}

export async function getCatalogProductBySlug(
  slug: string,
  merchantSlug?: string
): Promise<CatalogProduct | null> {
  try {
    const product = (await db.product.findFirst({
      where: {
        slug,
        merchant: merchantSlug ? { slug: merchantSlug } : undefined,
      },
      include: {
        merchant: { select: { slug: true } },
        category: { select: { slug: true } },
        subCategory: { select: { slug: true } },
        variants: true,
        discounts: true,
      },
    })) as ProductQueryRecord | null;

    return product ? mapCatalogProduct(product) : null;
  } catch {
    return getDefaultProducts().find((item) => item.slug === slug) ?? null;
  }
}
