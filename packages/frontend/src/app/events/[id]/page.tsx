import { PageHeading } from "@/components/page-heading";
import { generateMetaTitle } from "@/lib/util/meta";
import { Event } from "@/types/strapi";
import { fetchAPI } from "@/utils/fetch-api";
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
            <PageHeading>{foundEvent.name}</PageHeading>
            {foundEvent.content && <BlocksRenderer content={foundEvent.content} />}
        </>
    );
}
