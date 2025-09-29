import type { MetadataRoute } from "next";

import { serverEnv } from "@/lib/env/server";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/api/",
        },
        sitemap: `${serverEnv.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    };
}
