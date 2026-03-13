import { NextResponse } from "next/server";
import { ensureGeminiKey } from "@/lib/ai";

export async function POST() {
  try {
    ensureGeminiKey();
    return NextResponse.json({
      status: "ok",
      message: "AI try-on request accepted. Wire Gemini API here.",
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
