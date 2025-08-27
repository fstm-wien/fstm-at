import { Seite } from "@/types/strapi";
import { fetchAPI } from "@/utils/fetch-api";
import { generateMetaTitle } from "@/utils/meta";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { SideNavigation } from "./side-navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Props = {
    params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const response = await fetchAPI<Seite>(`/seiten`, {
        "filters[slug][$eq]": slug.join("/"),
    });

    const foundPage: Seite | null = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
    return {
        title: generateMetaTitle(foundPage ? foundPage.title : "404"),
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const response = await fetchAPI<Seite>(`/seiten`, {
        "filters[slug][$eq]": slug.join("/"),
        populate: {
            navbar: {
                populate: ["items"],
            },
        },
    });

    const foundPage: Seite | null = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
    if (!foundPage) {
        return notFound();
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {foundPage.navbar && foundPage.navbar.items && (
                    <aside className="lg:w-48 lg:pt-6">
                        <SideNavigation navbar={foundPage.navbar} />
                    </aside>
                )}
                <div>
                    <h1 className="font-bold mt-2 lg:mt-6 mb-8 text-4xl">{foundPage.title}</h1>
                    <article className="prose dark:prose-invert !max-w-full">
                        <BlocksRenderer content={foundPage.content}></BlocksRenderer>
                    </article>
                </div>
            </div>
        </>
    );
}
