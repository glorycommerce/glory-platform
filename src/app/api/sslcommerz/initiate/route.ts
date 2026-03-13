import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST() {
  if (!env.SSLCOMMERZ_STORE_ID || !env.SSLCOMMERZ_STORE_PASSWORD) {
    return NextResponse.json(
      { status: "error", message: "SSLCommerz credentials not configured." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: "ok",
    message: "Initiate SSLCommerz payment here.",
  });
}
