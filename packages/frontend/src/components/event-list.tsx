import { Event } from "@/lib/strapi/entities";
import Link from "next/link";
import { FaClock, FaMapPin } from "react-icons/fa";

import { LocalDatetime } from "./local-datetime";

export function EventList({ events }: { events: Event[] }) {
    return (
        <div className="flex flex-col gap-1">
            {events.map((e) => (
                <EventListItem key={e.documentId} event={e} />
            ))}
        </div>
    );
}

export function EventListItem({ event }: { event: Event }) {
    return (
        <Link
            href={`/events/` + event.documentId}
            className="py-3 px-4 flex flex-col gap-1 hover:bg-background-emph transition-colors border border-background-emphest"
        >
            <div className="flex flex-row items-center gap-3">
                <span className="font-semibold">{event.name}</span>
                {event.location && (
                    <span className="inline-flex flex-row gap-1 items-center text-sm text-gray-500 dark:text-gray-400">
                        <FaMapPin />
                        <span>{event.location}</span>
                    </span>
                )}
            </div>
            <div className="text-gray-400 dark:text-gray-500 inline-flex items-center gap-2 text-sm">
                <FaClock />
                <LocalDatetime datetime={event.start} format="LLLL" />
            </div>
        </Link>
    );
}
