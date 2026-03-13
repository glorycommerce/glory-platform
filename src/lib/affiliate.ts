import { Role } from "@prisma/client";
import { db } from "@/lib/db";

function buildAffiliateCode(name?: string | null, email?: string | null) {
  const base =
    name?.trim().replace(/[^a-zA-Z0-9]+/g, "").slice(0, 8) ||
    email?.split("@")[0]?.replace(/[^a-zA-Z0-9]+/g, "").slice(0, 8) ||
    "glory";

  return `${base.toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function generateUniqueAffiliateCode(name?: string | null, email?: string | null) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = buildAffiliateCode(name, email);
    const existing = await db.affiliateProfile.findUnique({
      where: { code },
      select: { id: true },
    });

    if (!existing) {
      return code;
    }
  }

  return `GLORY${Date.now().toString().slice(-6)}`;
}

export async function enrollAffiliate(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      affiliate: { select: { id: true, code: true } },
    },
  });

  if (!user) {
    return { ok: false as const, error: "User not found." };
  }

  if (user.affiliate) {
    return { ok: true as const, code: user.affiliate.code, existing: true as const };
  }

  const code = await generateUniqueAffiliateCode(user.name, user.email);

  await db.user.update({
    where: { id: userId },
    data: {
      role: Role.AFFILIATE,
      affiliate: {
        create: {
          code,
        },
      },
    },
  });

  return { ok: true as const, code, existing: false as const };
}

export async function getAffiliateDashboard(userId: string) {
  const profile = await db.affiliateProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
      referrals: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          order: {
            select: {
              id: true,
              total: true,
              status: true,
              createdAt: true,
            },
          },
        },
      },
      payouts: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!profile) {
    return null;
  }

  const referralAgg = await db.referral.aggregate({
    where: { affiliateId: profile.id },
    _sum: { commission: true },
    _count: { id: true },
  });

  const payoutAgg = await db.payout.aggregate({
    where: { affiliateId: profile.id },
    _sum: { amount: true },
  });

  const totalCommission = referralAgg._sum.commission ?? 0;
  const totalReferrals = referralAgg._count.id ?? 0;
  const totalPaid = payoutAgg._sum.amount ?? 0;

  return {
    profile,
    stats: {
      totalCommission,
      totalReferrals,
      totalPaid,
      outstanding: Math.max(totalCommission - totalPaid, 0),
    },
  };
}
