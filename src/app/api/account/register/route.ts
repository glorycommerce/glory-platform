import { hash } from "bcryptjs";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { signUpSchema } from "@/lib/auth-schemas";
import { db } from "@/lib/db";
import { normalizeEmail } from "@/lib/account";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid registration details." },
      { status: 400 }
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  await db.user.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      role: Role.CUSTOMER,
      passwordHash: await hash(parsed.data.password, 12),
    },
  });

  return NextResponse.json({ ok: true });
}
