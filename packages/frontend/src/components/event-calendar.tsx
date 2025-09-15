"use client";

import deLocale from "@fullcalendar/core/locales/de";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { FaMapPin } from "react-icons/fa";

import { Event, EventHost } from "@/lib/strapi/entities";

const eventHostClassLookup: Record<EventHost, string> = {
    [EventHost.FSTM]: "bg-orange-400",
    [EventHost.AndereFachschaft]: "bg-green-600",
    [EventHost.TUWien]: "bg-blue-400",
};

export function EventCalendar({ events }: { events: Event[] }) {
    const router = useRouter();

    return (
        <div className="w-full">
            <div className="flex flex-row gap-4 mb-2">
                <span className="">Veranstalter:</span>
                <span className="inline-flex flex-row flex-wrap gap-x-3">
                    {Object.entries(eventHostClassLookup).map(([k, v]) => (
                        <span key={k} className="inline-flex items-center flex-row gap-1">
                            <span className={clsx("size-2.5 rounded-full", v)}></span>
                            <span>{k}</span>
                        </span>
                    ))}
                </span>
            </div>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events.map((e) => ({
                    id: e.documentId,
                    title: e.name,
                    start: e.start,
                    end: e.end,
                    location: e.location,
                    host: e.host,
                }))}
                locale={deLocale}
                eventClick={(info) => router.push(`/events/${info.event._def.publicId}`)}
                nowIndicator={true}
                displayEventEnd={true}
                // height={"70dvh"}
                eventContent={(eventInfo) => (
                    <div className="flex flex-col md:flex-row gap-1 md:p-1 rounded-sm w-full">
                        <div className="mt-1">
                            <div
                                className={clsx(
                                    "size-2.5 rounded-full",
                                    eventHostClassLookup[eventInfo.event.extendedProps.host as EventHost],
                                )}
                            ></div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400">{eventInfo.timeText}</p>
                            <p className="font-bold leading-tight">{eventInfo.event.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                <FaMapPin className="inline mr-1" />
                                <span>{eventInfo.event.extendedProps.location}</span>
                            </p>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}
