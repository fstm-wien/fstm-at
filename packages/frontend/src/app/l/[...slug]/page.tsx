import { notFound, redirect } from "next/navigation";

import { getLinkBySlug } from "@/lib/strapi/api";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Props = {
    params: Promise<{ slug: string[] }>;
};

export default async function LinkRedirectionPage({ params }: Props) {
    const { slug } = await params;
    const linkResponse = await getLinkBySlug(slug.join("/"));
    const foundLink = linkResponse.data;
    if (!foundLink) {
        return notFound();
    }

    redirect(foundLink.target);
}
