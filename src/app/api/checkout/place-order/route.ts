import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrderWithQuote } from "@/lib/services/checkout";

const payloadSchema = z.object({
  merchantSlug: z.string().min(1),
  paymentMethod: z.enum(["SSLCOMMERZ", "COD", "ADVANCE", "EMI", "STRIPE"]),
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
    const result = await createOrderWithQuote(payload);
    return NextResponse.json({ status: "ok", ...result });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
