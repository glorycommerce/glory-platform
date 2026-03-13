import { NextResponse } from "next/server";
import { ensureGeminiKey } from "@/lib/ai";
import { db } from "@/lib/db";
import { z } from "zod";

const payloadSchema = z.object({
  merchantSlug: z.string().optional(),
  question: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    ensureGeminiKey();
    const payload = payloadSchema.parse(await req.json());

    const products = (await db.product.findMany({
      where: {
        isActive: true,
        merchant: payload.merchantSlug ? { slug: payload.merchantSlug } : undefined,
        OR: [
          { name: { contains: payload.question, mode: "insensitive" } },
          { description: { contains: payload.question, mode: "insensitive" } },
        ],
      },
      take: 5,
      include: { variants: true },
    })) as Array<{
      slug: string;
      name: string;
      variants: Array<{ price: number; stock: number }>;
    }>;

    const top = products
      .map((product) => {
        const cheapest = product.variants.reduce((lowest, item) => {
          if (!lowest || item.price < lowest.price) {
            return item;
          }
          return lowest;
        }, null as null | (typeof product.variants)[number]);
        const stock = product.variants.reduce((sum, item) => sum + item.stock, 0);
        return {
          slug: product.slug,
          name: product.name,
          fromPrice: cheapest?.price ?? null,
          stock,
        };
      })
      .sort((a, b) => b.stock - a.stock);

    const coupon = await db.coupon.findFirst({
      where: {
        status: "ACTIVE",
        OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
      },
      orderBy: { createdAt: "desc" },
      select: { code: true, type: true, value: true },
    });

    return NextResponse.json({
      status: "ok",
      message:
        "Inventory-grounded assistant response generated. Connect Gemini for richer persuasion copy.",
      question: payload.question,
      suggestions: top,
      coupon,
      recommendation:
        top.length > 0
          ? `Top in-stock option: ${top[0].name}. Highlight urgency and applicable coupon.`
          : "No direct inventory hit. Offer related categories and restock request.",
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
