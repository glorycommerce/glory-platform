import { NextResponse } from "next/server";
import { consumePasswordResetToken } from "@/lib/account";
import { resetPasswordSchema } from "@/lib/auth-schemas";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid reset request." },
      { status: 400 }
    );
  }

  const result = await consumePasswordResetToken(parsed.data.token, parsed.data.password);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Password updated. You can sign in now.",
  });
}
