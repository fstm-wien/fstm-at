import { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkdownContent } from "@/components/markdown/markdown-content";
import { PageHeading } from "@/components/page-heading";
import { getPageBySlug } from "@/lib/strapi/api";

import { SideNavigation } from "./side-navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Props = {
    params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const pageResponse = await getPageBySlug(slug.join("/"));
    const foundPage = pageResponse.data;
    return {
        title: foundPage ? foundPage.title : "404",
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const pageResponse = await getPageBySlug(slug.join("/"));
    const foundPage = pageResponse.data;
    if (!foundPage) {
        return notFound();
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {foundPage.navbar && foundPage.navbar.items && (
                    <aside className="lg:w-48 lg:pt-6 shrink-0">
                        <SideNavigation navbar={foundPage.navbar} />
                    </aside>
                )}
                <div className="hyphens-auto break-words">
                    <PageHeading>{foundPage.title}</PageHeading>
                    <article className="prose dark:prose-invert !max-w-full">
                        {foundPage.content && <MarkdownContent source={foundPage.content} />}
                    </article>
                </div>
            </div>
        </>
    );
}
