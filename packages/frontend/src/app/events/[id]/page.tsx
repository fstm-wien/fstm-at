import { Event } from "@/types/strapi";
import { fetchAPI } from "@/utils/fetch-api";
import { generateMetaTitle } from "@/utils/meta";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const response = await fetchAPI<Event>(`/events/${id}`);
    const foundEvent: Event | null = !Array.isArray(response.data) ? response.data : null;
    return {
        title: generateMetaTitle("Events", ...(foundEvent ? [foundEvent.name] : [])),
    };
}

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
