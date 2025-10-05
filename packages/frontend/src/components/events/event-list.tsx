import { FaClock, FaMapPin, FaUser } from "react-icons/fa";

import { Event } from "@/lib/strapi/entities";

import { LocalDatetime } from "../local-datetime";
import { LinkCard } from "../ui/card";

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
        <LinkCard href={`/events/` + event.documentId} className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-3">
                <span className="font-semibold">{event.name}</span>
                {event.location && (
                    <span className="inline-flex flex-row gap-1 items-center text-sm text-gray-500 dark:text-gray-400">
                        <FaMapPin />
                        <span>{event.location}</span>
                    </span>
                )}
            </div>
            <div className="text-gray-400 dark:text-gray-500 flex flex-row flex-wrap gap-x-4 text-sm">
                <span className="inline-flex items-center gap-1">
                    <FaClock />
                    <LocalDatetime datetime={event.start} format="LLLL" />
                </span>
                <span className="inline-flex items-center gap-1">
                    <FaUser />
                    <span>{event.host}</span>
                </span>
            </div>
        </LinkCard>
    );
}
