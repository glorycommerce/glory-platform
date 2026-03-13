import { NextRequest, NextResponse } from "next/server";
import { getCatalogProductBySlug } from "@/lib/services/catalog";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const merchantSlug = req.nextUrl.searchParams.get("merchantSlug") ?? undefined;
  const product = await getCatalogProductBySlug(slug, merchantSlug);

  if (!product) {
    return NextResponse.json(
      { status: "error", message: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ status: "ok", product });
}
