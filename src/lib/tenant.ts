import { headers } from "next/headers";
import { env } from "@/lib/env";

export async function getTenantFromHost() {
  const h = await headers();
  const host = h.get("host") ?? "";
  const root = env.NEXT_PUBLIC_ROOT_DOMAIN;
  const normalized = host.replace(":3000", "").toLowerCase();

  if (!normalized || normalized === root || normalized === `www.${root}`) {
    return { type: "glory", slug: "glory" };
  }

  if (normalized.endsWith(`.${root}`)) {
    const slug = normalized.replace(`.${root}`, "");
    return { type: "merchant", slug };
  }

  return { type: "custom-domain", slug: normalized };
}
