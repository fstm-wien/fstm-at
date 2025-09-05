"use client";

import { Event } from "@/lib/strapi/entities";
import deLocale from "@fullcalendar/core/locales/de";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useRouter } from "next/navigation";
import { FaMapPin } from "react-icons/fa";

export function EventCalendar({ events }: { events: Event[] }) {
    const router = useRouter();

    return (
        <div className="w-full">
            <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                events={events.map((e) => ({
                    id: e.documentId,
                    title: e.name,
                    start: e.start,
                    end: e.end,
                    location: e.location,
                }))}
                locale={deLocale}
                slotLabelInterval={"01:00"}
                slotLabelFormat={{
                    hour: "numeric",
                    minute: "numeric",
                }}
                eventClick={(info) => router.push(`/events/${info.event._def.publicId}`)}
                nowIndicator={true}
                allDaySlot={false}
                height={"70dvh"}
                eventContent={(eventInfo) => (
                    <div className="flex flex-col lg:p-1">
                        <p className="text-xs">{eventInfo.timeText}</p>
                        <p className="font-bold mb-1">{eventInfo.event.title}</p>
                        <p className="text-xs">
                            <FaMapPin className="inline mr-1" />
                            <span>{events.find((e) => e.documentId === eventInfo.event.id)?.location}</span>
                        </p>
                    </div>
                )}
            />
        </div>
    );
}
