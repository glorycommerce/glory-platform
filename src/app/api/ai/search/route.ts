import { NextResponse } from "next/server";
import { ensureGeminiKey } from "@/lib/ai";
import { db } from "@/lib/db";
import { z } from "zod";

const payloadSchema = z.object({
  merchantSlug: z.string().optional(),
  query: z.string().min(2).optional(),
  colorHint: z.string().optional(),
  sizeHint: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    ensureGeminiKey();
    const payload = payloadSchema.parse(await req.json());

    const products = (await db.product.findMany({
      where: {
        isActive: true,
        merchant: payload.merchantSlug ? { slug: payload.merchantSlug } : undefined,
        OR: payload.query
          ? [
              { name: { contains: payload.query, mode: "insensitive" } },
              { description: { contains: payload.query, mode: "insensitive" } },
            ]
          : undefined,
      },
      take: 8,
      include: {
        merchant: { select: { slug: true } },
        variants: true,
      },
    })) as Array<{
      id: string;
      name: string;
      slug: string;
      merchant: { slug: string };
      variants: Array<{ stock: number; color: string | null; size: string | null }>;
    }>;

    const normalizedColor = payload.colorHint?.toLowerCase();
    const normalizedSize = payload.sizeHint?.toLowerCase();

    const matches = products.map((product) => {
      const compatible = product.variants.filter((variant) => {
        const byColor = normalizedColor
          ? variant.color?.toLowerCase().includes(normalizedColor)
          : true;
        const bySize = normalizedSize
          ? variant.size?.toLowerCase().includes(normalizedSize)
          : true;
        return byColor && bySize;
      });

      const inStock = compatible.some((variant) => variant.stock > 0);
      return {
        productId: product.id,
        merchantSlug: product.merchant.slug,
        name: product.name,
        slug: product.slug,
        matchType: compatible.length > 0 ? "exact_or_filtered" : "close",
        inStock,
        variantCount: compatible.length || product.variants.length,
      };
    });

    return NextResponse.json({
      status: "ok",
      message:
        matches.length > 0
          ? "Matches generated from catalog. Add embedding + pgvector for semantic ranking."
          : "No exact match. Suggesting close alternatives and restock request flow.",
      matches,
      restockPrompt:
        matches.length === 0
          ? "No exact result found. Offer restock request capture."
          : null,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
