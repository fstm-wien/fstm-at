import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaClock, FaMapPin, FaUser } from "react-icons/fa";

import { LocalDatetime } from "@/components/local-datetime";
import { MarkdownContent } from "@/components/markdown/markdown-content";
import { PageHeading } from "@/components/page-heading";
import { fetchAPISingle } from "@/lib/strapi/api";
import { Event } from "@/lib/strapi/entities";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const eventResponse = await fetchAPISingle<Event>(`/events/${id}`);
    const foundEvent = eventResponse.data;
    return {
        title: foundEvent ? foundEvent.name : "404",
    };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const eventResponse = await fetchAPISingle<Event>(`/events/${id}`);
    const foundEvent = eventResponse.data;
    if (!foundEvent) {
        return notFound();
    }

    return (
        <>
            <div className="hyphens-auto break-words">
                <p className="text-gray-400 underline">
                    <Link href="/events">Alle Events ...</Link>
                </p>
                <PageHeading className="mb-2">{foundEvent.name}</PageHeading>
                <div className="flex flex-col lg:flex-row gap-y-1 lg:gap-x-6 mb-6 lg:text-lg text-gray-600 dark:text-gray-300">
                    <p className="flex flex-row flex-wrap items-center">
                        <FaClock className="mr-1" />
                        <LocalDatetime datetime={foundEvent.start} format="LLL" />
                        <span className="mx-1">&mdash;</span>
                        <LocalDatetime datetime={foundEvent.end} format="LLL" />
                    </p>
                    {foundEvent.location && (
                        <p className="flex flex-row items-center gap-1">
                            <FaMapPin />
                            <span>{foundEvent.location}</span>
                        </p>
                    )}
                    <p className="flex flex-row items-center gap-2">
                        <FaUser />
                        <span>{foundEvent.host}</span>
                    </p>
                </div>
                <article className="prose dark:prose-invert !max-w-full">
                    {foundEvent.content && <MarkdownContent source={foundEvent.content} />}
                </article>
            </div>
        </>
    );
}
