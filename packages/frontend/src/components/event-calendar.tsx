"use client";

import deLocale from "@fullcalendar/core/locales/de";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { useRouter } from "next/navigation";
import { FaMapPin } from "react-icons/fa";

import { Event } from "@/lib/strapi/entities";

export function EventCalendar({ events }: { events: Event[] }) {
    const router = useRouter();

    return (
        <div className="w-full">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events.map((e) => ({
                    id: e.documentId,
                    title: e.name,
                    start: e.start,
                    end: e.end,
                    location: e.location,
                }))}
                locale={deLocale}
                eventClick={(info) => router.push(`/events/${info.event._def.publicId}`)}
                nowIndicator={true}
                // height={"70dvh"}
                eventContent={(eventInfo) => (
                    <div className="flex flex-col p-1 bg-orange-400 text-white rounded-sm">
                        <p className="text-[10px] opacity-90">{eventInfo.timeText}</p>
                        <p className="font-bold mb-1 leading-tight">{eventInfo.event.title}</p>
                        <p className="text-xs opacity-90">
                            <FaMapPin className="inline mr-1" />
                            <span>{events.find((e) => e.documentId === eventInfo.event.id)?.location}</span>
                        </p>
                    </div>
                )}
            />
        </div>
    );
}
