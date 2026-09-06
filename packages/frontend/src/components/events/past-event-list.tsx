"use client";

import { useState, useTransition } from "react";

import { loadMorePastEvents } from "@/app/events/actions";
import { Event } from "@/lib/strapi/entities";

import { EventList } from "./event-list";

export default function PastEventsList({
    initialEvents,
    initialPageCount,
}: {
    initialEvents: Event[];
    initialPageCount: number;
}) {
    const [events, setEvents] = useState(initialEvents);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(initialPageCount);
    const [isPending, startTransition] = useTransition();

    function handleLoadMore() {
        startTransition(async () => {
            const nextPage = page + 1;
            const result = await loadMorePastEvents(nextPage);
            setEvents((prev) => [...prev, ...result.events]);
            setPage(nextPage);
            setPageCount(result.pageCount);
        });
    }

    return (
        <>
            <EventList events={events} />
            {page < pageCount && (
                <button
                    onClick={handleLoadMore}
                    disabled={isPending}
                    className="mt-4 underline disabled:opacity-50 cursor-pointer"
                >
                    {isPending ? "Lädt ..." : "Weitere Events laden"}
                </button>
            )}
        </>
    );
}
