import moment from "moment";
import type { MetadataRoute } from "next";

import { serverEnv } from "@/lib/env/server";
import { fetchAPICollection } from "@/lib/strapi/api";
import { Seite } from "@/lib/strapi/entities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const pagesResponse = await fetchAPICollection<Seite>("/seiten");
    const siteUrl = serverEnv.NEXT_PUBLIC_SITE_URL;

    const sitemap: MetadataRoute.Sitemap = [
        {
            url: `${siteUrl}/`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${siteUrl}/events`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/pruefungssammlung`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    for (const r of pagesResponse.data) {
        sitemap.push({
            url: `${siteUrl}/${r.slug}`,
            lastModified: moment(r.updatedAt).toDate(),
            changeFrequency: "monthly",
            priority: 0.7,
        });
    }

    return sitemap;
}
