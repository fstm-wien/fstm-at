"use server";

import { fetchAPICollection } from "@/lib/strapi/api";
import { Event } from "@/lib/strapi/entities";

export async function loadMorePastEvents(page: number) {
    const pageSize = 5;

    const response = await fetchAPICollection<Event>(`/events`, {
        sort: "start:desc",
        filters: { end: { $lt: new Date().toISOString() } },
        pagination: { page, pageSize },
    });

    if (!Array.isArray(response.data)) {
        throw new Error();
    }

    return {
        events: response.data,
        pageCount: response.meta.pagination.pageCount,
    };
}
