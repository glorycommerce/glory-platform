import { NextRequest, NextResponse } from "next/server";
import { listCatalogProducts } from "@/lib/services/catalog";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const merchantSlug = searchParams.get("merchantSlug") ?? undefined;
  const categorySlug = searchParams.get("categorySlug") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "24");

  const products = await listCatalogProducts({
    merchantSlug,
    categorySlug,
    search,
    limit: Number.isNaN(limit) ? 24 : limit,
  });

  return NextResponse.json({ status: "ok", products });
}
