import moment from "moment";
import { Metadata } from "next";

import { EventCalendar } from "@/components/events/event-calendar";
import { EventList } from "@/components/events/event-list";
import PastEventsList from "@/components/events/past-event-list";
import { PageHeading } from "@/components/page-heading";
import { fetchAPICollection } from "@/lib/strapi/api";
import { Event } from "@/lib/strapi/entities";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
    title: "Events",
};

export default async function EventsPage() {
    const [allResponse, pastResponse] = await Promise.all([
        fetchAPICollection<Event>(`/events`, { sort: "start:desc" }),
        fetchAPICollection<Event>(`/events`, {
            sort: "start:desc",
            filters: { end: { $lt: new Date().toISOString() } },
            pagination: { page: 1, pageSize: 5 },
        }),
    ]);

    if (!Array.isArray(allResponse.data) || !Array.isArray(pastResponse.data)) {
        throw new Error();
    }

    const events = allResponse.data.slice().reverse();
    const nextEvents = events.filter((e) => moment(e.end).isAfter());

    return (
        <>
            <PageHeading>Events</PageHeading>
            <div className="mx-auto w-full mb-10">
                <EventCalendar events={events} />
            </div>
            <div className="flex flex-col gap-8">
                {nextEvents.length > 0 && (
                    <div>
                        <h3 className="mb-4 text-2xl font-semibold">Nächste Events</h3>
                        <EventList events={nextEvents} />
                    </div>
                )}
                {pastResponse.data.length > 0 && (
                    <div className="opacity-50">
                        <h3 className="mb-4 text-2xl font-semibold">Vergangene Events</h3>
                        <PastEventsList
                            initialEvents={pastResponse.data}
                            initialPageCount={pastResponse.meta.pagination.pageCount}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
