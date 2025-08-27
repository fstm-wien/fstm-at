"use client";

import { Event } from "@/types/strapi";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
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
