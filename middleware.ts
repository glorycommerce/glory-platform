import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "glory.com";
  const normalized = host.replace(":3000", "").toLowerCase();

  if (
    normalized === root ||
    normalized === `www.${root}` ||
    normalized === "localhost"
  ) {
    return NextResponse.next();
  }

  if (normalized.endsWith(`.${root}`)) {
    const slug = normalized.replace(`.${root}`, "");
    const url = req.nextUrl.clone();
    url.pathname = `/store/${slug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
