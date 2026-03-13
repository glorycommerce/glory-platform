import { NextResponse } from "next/server";
import { createPasswordResetToken, normalizeEmail } from "@/lib/account";
import { forgotPasswordSchema } from "@/lib/auth-schemas";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid email address." },
      { status: 400 }
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({
      ok: true,
      message: "If that account exists, a reset link has been prepared.",
    });
  }

  const token = await createPasswordResetToken(email);
  const origin = new URL(request.url).origin;

  return NextResponse.json({
    ok: true,
    message: "Reset link prepared. Email delivery is not wired yet.",
    resetUrl: `${origin}/account?mode=reset&token=${token}`,
  });
}
