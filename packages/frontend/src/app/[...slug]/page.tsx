export const fetchCache = "force-no-store";

import { Seite } from "@/types/strapi";
import { fetchAPI } from "@/utils/fetch-api";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const response = await fetchAPI<Seite>(`/seiten`, { "filters[slug][$eq]": slug.join("/") });

    const foundPage: Seite | null = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
    if (!foundPage) {
        return notFound();
    }

    return (
        <>
            <h1 className="mt-6 mb-4 text-4xl">{foundPage.title}</h1>
            <BlocksRenderer content={foundPage.content}></BlocksRenderer>
        </>
    );
}
