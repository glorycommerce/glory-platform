import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const payloadSchema = z.object({
  businessName: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7),
  nidUrl: z.string().url(),
  tinUrl: z.string().url(),
  tradeLicenseUrl: z.string().url(),
  acceptedTerms: z.literal(true),
  acceptedPolicy: z.literal(true),
});

export async function POST(req: Request) {
  try {
    const payload = payloadSchema.parse(await req.json());

    const existing = await db.merchant.findUnique({
      where: { slug: payload.slug },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "Slug is already in use" },
        { status: 409 }
      );
    }

    const merchant = await db.merchant.create({
      data: {
        name: payload.businessName,
        slug: payload.slug,
        status: "PENDING",
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        legalAcceptedAt: new Date(),
        storefronts: {
          create: {
            name: payload.businessName,
          },
        },
      },
      select: {
        id: true,
        slug: true,
        status: true,
      },
    });

    return NextResponse.json({
      status: "ok",
      merchant,
      documents: {
        nidUrl: payload.nidUrl,
        tinUrl: payload.tinUrl,
        tradeLicenseUrl: payload.tradeLicenseUrl,
      },
      message: "Merchant application submitted and pending admin approval.",
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
