export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Event, Seite } from "@/types/strapi";
import { fetchAPI } from "@/utils/fetch-api";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { notFound } from "next/navigation";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const response = await fetchAPI<Event>(`/events/${id}`);

    const foundEvent: Event | null = !Array.isArray(response.data) ? response.data : null;
    if (!foundEvent) {
        return notFound();
    }

    return (
        <>
            <h1 className="mt-6 mb-4 text-4xl">{foundEvent.name}</h1>
            {foundEvent.content && <BlocksRenderer content={foundEvent.content} />}
        </>
    );
}
