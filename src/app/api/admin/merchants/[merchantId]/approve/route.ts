import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ merchantId: string }>;
};

const payloadSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "SUSPENDED"]),
});

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { merchantId } = await context.params;

    const merchant = await db.merchant.update({
      where: { id: merchantId },
      data: { status: payload.status },
      select: { id: true, slug: true, status: true },
    });

    return NextResponse.json({ status: "ok", merchant });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
