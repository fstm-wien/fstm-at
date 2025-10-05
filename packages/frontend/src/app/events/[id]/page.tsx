import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EventPreview } from "@/components/events/event-preview";
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
            <p className="text-gray-400 underline">
                <Link href="/events">Alle Events ...</Link>
            </p>
            <EventPreview event={foundEvent} />
        </>
    );
}
