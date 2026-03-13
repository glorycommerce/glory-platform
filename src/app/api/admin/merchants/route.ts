import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const merchants = await db.merchant.findMany({
    where:
      status && ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].includes(status)
        ? { status: status as "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" }
        : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      contactEmail: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ status: "ok", merchants });
}
