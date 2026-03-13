import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const payloadSchema = z.object({
  businessName: z.string().min(2),
  contactName: z.string().min(2),
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

    const [existingMerchant, existingApplication] = await Promise.all([
      db.merchant.findUnique({
        where: { slug: payload.slug },
        select: { id: true },
      }),
      db.merchantApplication.findFirst({
        where: { desiredSlug: payload.slug },
        select: { id: true },
      }),
    ]);

    if (existingMerchant || existingApplication) {
      return NextResponse.json(
        { status: "error", message: "Slug is already in use" },
        { status: 409 }
      );
    }

    const application = await db.merchantApplication.create({
      data: {
        businessName: payload.businessName,
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        desiredSlug: payload.slug,
        nidUrl: payload.nidUrl,
        tinUrl: payload.tinUrl,
        tradeLicenseUrl: payload.tradeLicenseUrl,
        acceptedTerms: payload.acceptedTerms,
        acceptedPolicy: payload.acceptedPolicy,
        status: "PENDING",
      },
      select: {
        id: true,
        desiredSlug: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      status: "ok",
      application,
      message: "Merchant application submitted and pending review.",
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
