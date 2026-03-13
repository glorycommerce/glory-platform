import { NextResponse } from "next/server";
import { z } from "zod";
import { getCatalogProductBySlug } from "@/lib/services/catalog";
import { buildCartQuote } from "@/lib/services/pricing";
import { db } from "@/lib/db";

const payloadSchema = z.object({
  merchantSlug: z.string().min(1),
  couponCode: z.string().optional(),
  requestedPoints: z.number().int().min(0).default(0),
  userId: z.string().optional(),
  items: z
    .array(
      z.object({
        productSlug: z.string().min(1),
        variantId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const merchant = await db.merchant.findUnique({
      where: { slug: payload.merchantSlug },
      select: { id: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { status: "error", message: "Merchant not found" },
        { status: 404 }
      );
    }

    const products = await Promise.all(
      payload.items.map((item) =>
        getCatalogProductBySlug(item.productSlug, payload.merchantSlug)
      )
    );

    if (products.some((item) => !item)) {
      return NextResponse.json(
        { status: "error", message: "Invalid products in cart" },
        { status: 400 }
      );
    }

    const coupon = payload.couponCode
      ? await db.coupon.findFirst({
          where: {
            code: payload.couponCode,
            merchantId: merchant.id,
            status: "ACTIVE",
          },
        })
      : null;

    const pointsBalance = payload.userId
      ? (
          await db.pointsLedger.findMany({
            where: { userId: payload.userId },
            select: { points: true },
          })
        ).reduce((sum: number, item: { points: number }) => sum + item.points, 0)
      : 0;

    const quote = buildCartQuote({
      lines: payload.items.map((item, index) => ({
        product: products[index]!,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      coupon,
      pointsBalance,
      maxPointsPerOrder: 500,
      requestedPoints: payload.requestedPoints,
    });

    return NextResponse.json({ status: "ok", quote });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
