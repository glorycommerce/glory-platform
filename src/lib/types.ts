export type Money = {
  amount: number;
  currency: "BDT" | "USD";
};

export type CatalogVariant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  stitching: "STITCHED" | "UNSTITCHED";
  price: number;
  compareAt: number | null;
  stock: number;
  images: string[];
};

export type CatalogProduct = {
  id: string;
  merchantId: string;
  merchantSlug: string;
  name: string;
  slug: string;
  description: string | null;
  categorySlug: string | null;
  subCategorySlug: string | null;
  variants: CatalogVariant[];
  activeDiscountPercent: number | null;
};
