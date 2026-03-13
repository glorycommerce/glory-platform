import { env } from "@/lib/env";

export const defaultSeo = {
  title: `${env.NEXT_PUBLIC_SITE_NAME} | Modest Fashion & Commerce`,
  description:
    "Glory is a multi-merchant commerce platform for women's dresses, hijabs, and custom fashion.",
  url: `https://${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
};
