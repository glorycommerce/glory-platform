import { NextResponse } from "next/server";
import { enrollAffiliate } from "@/lib/affiliate";
import { getAuthSession } from "@/lib/auth";

export async function POST() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const result = await enrollAffiliate(session.user.id);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    code: result.code,
    existing: result.existing,
  });
}
