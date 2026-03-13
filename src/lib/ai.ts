import { env } from "@/lib/env";

export function ensureGeminiKey() {
  if (!env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  return env.GEMINI_API_KEY;
}
