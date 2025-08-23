"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import { Event } from "@/types/strapi";
import { fetchAPI } from "@/utils/fetch-api";
import { useRouter } from "next/navigation";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const router = useRouter();

    useEffect(() => {
        (async function () {
            const response = await fetchAPI<Event>("/events", {});
            if (Array.isArray(response.data)) {
                setEvents(response.data);
            }
        })();
    }, []);

    return (
        <>
            {/* <pre className="over">
                <code>{JSON.stringify(events, null, 2)}</code>
            </pre> */}
            <div className="mt-4 px-16">
                <FullCalendar
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    events={events.map((e) => ({
                        id: e.documentId,
                        title: e.name,
                        start: e.start,
                        end: e.end,
                    }))}
                    eventClick={(info) => router.push(`/events/${info.event._def.publicId}`)}
                />
            </div>
        </>
    );
}
