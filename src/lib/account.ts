import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

const RESET_TOKEN_TTL_MS = 1000 * 60 * 30;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createPasswordResetToken(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const token = randomUUID();
  const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await db.verificationToken.deleteMany({
    where: { identifier: `reset:${normalizedEmail}` },
  });

  await db.verificationToken.create({
    data: {
      identifier: `reset:${normalizedEmail}`,
      token,
      expires,
    },
  });

  return token;
}

export async function consumePasswordResetToken(token: string, password: string) {
  const resetToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (
    !resetToken ||
    !resetToken.identifier.startsWith("reset:") ||
    resetToken.expires < new Date()
  ) {
    return { ok: false as const, error: "This reset link is invalid or expired." };
  }

  const email = resetToken.identifier.replace("reset:", "");
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    await db.verificationToken.delete({ where: { token } });
    return { ok: false as const, error: "This reset link is invalid or expired." };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hash(password, 12),
    },
  });

  await db.verificationToken.delete({ where: { token } });

  return { ok: true as const };
}

export async function getAccountDashboard(userId: string) {
  const [user, orders, points] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: { name: true, slug: true },
                },
              },
            },
          },
        },
      },
    }),
    db.pointsLedger.aggregate({
      where: { userId },
      _sum: { points: true },
    }),
  ]);

  return {
    user,
    orders,
    points: points._sum.points ?? 0,
  };
}
