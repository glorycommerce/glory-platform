import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function getMonthKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function GET(req: NextRequest) {
  const month = req.nextUrl.searchParams.get("month") ?? getMonthKey(new Date());
  const entries = await db.leaderboardEntry.findMany({
    where: { month },
    orderBy: { totalSpend: "desc" },
    take: 20,
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return NextResponse.json({
    status: "ok",
    month,
    entries: entries.map(
      (
        entry: {
          userId: string;
          isAnonymous: boolean;
          displayName: string | null;
          totalSpend: number;
          user: { name: string | null; email: string | null };
        },
        index: number
      ) => ({
      rank: index + 1,
      userId: entry.userId,
      displayName:
        entry.isAnonymous ? "Anonymous" : entry.displayName || entry.user.name || "Customer",
      totalSpend: entry.totalSpend,
      })
    ),
  });
}
