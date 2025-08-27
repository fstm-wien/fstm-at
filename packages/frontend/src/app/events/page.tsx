import { EventCalendar } from "@/components/event-calendar";
import { Event } from "@/types/strapi";
import { fetchAPI } from "@/utils/fetch-api";
import { generateMetaTitle } from "@/utils/meta";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
    title: generateMetaTitle("Events"),
};

export default async function EventsPage() {
    const response = await fetchAPI<Event>(`/events`, {
        sort: "start:desc",
    });

    if (!Array.isArray(response.data)) {
        throw new Error();
    }

    const events = response.data;

    return (
        <>
            <div className="mt-4 px-16">
                <EventCalendar events={events} />
            </div>
        </>
    );
}
