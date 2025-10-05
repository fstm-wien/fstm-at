import Link from "next/link";
import { FaClock, FaMapPin, FaUser } from "react-icons/fa";

import { Event } from "@/lib/strapi/entities";

import { LocalDatetime } from "../local-datetime";
import { MarkdownContent } from "../markdown/markdown-content";
import { PageHeading } from "../page-heading";

export type EventPreviewProps = {
    event: Event;
    linkTitle?: boolean;
};

export function EventPreview({ event, linkTitle }: EventPreviewProps) {
    const heading = <PageHeading className="mb-2">{event.name}</PageHeading>;

    return (
        <div className="hyphens-auto break-words">
            {linkTitle ? <Link href={`/events/${event.documentId}`}>{heading}</Link> : heading}
            <div className="flex flex-col lg:flex-row gap-y-1 lg:gap-x-6 mb-6 lg:text-lg text-gray-600 dark:text-gray-300">
                <p className="flex flex-row flex-wrap items-center">
                    <FaClock className="mr-1" />
                    <LocalDatetime datetime={event.start} format="LLL" />
                    <span className="mx-1">&mdash;</span>
                    <LocalDatetime datetime={event.end} format="LLL" />
                </p>
                {event.location && (
                    <p className="flex flex-row items-center gap-1">
                        <FaMapPin />
                        <span>{event.location}</span>
                    </p>
                )}
                <p className="flex flex-row items-center gap-2">
                    <FaUser />
                    <span>{event.host}</span>
                </p>
            </div>
            <article className="mb-6 prose dark:prose-invert !max-w-full">
                {event.content && <MarkdownContent source={event.content} />}
            </article>
        </div>
    );
}
