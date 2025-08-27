"use client";

import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import { Event } from "@/types/strapi";
import { useRouter } from "next/navigation";

export function EventCalendar({ events }: { events: Event[] }) {
    const router = useRouter();

    return (
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
    );
}
