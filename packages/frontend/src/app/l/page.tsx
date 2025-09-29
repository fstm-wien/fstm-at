import { Metadata } from "next";

import DynamicIcon from "@/components/dynamic-icon";
import { PageHeading } from "@/components/page-heading";
import { fetchAPICollection } from "@/lib/strapi/api";
import { Link } from "@/lib/strapi/entities";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
    title: "Links",
};

export default async function LinksPage() {
    const response = await fetchAPICollection<Link>(`/links`, {
        sort: "priority:desc",
        filters: {
            visible: {
                $eq: true,
            },
        },
    });

    if (!Array.isArray(response.data)) {
        throw new Error();
    }

    const links = response.data;

    return (
        <>
            <PageHeading>Links</PageHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                {links.map((link) => (
                    <LinkContainer key={link.id} link={link} />
                ))}
            </div>
        </>
    );
}

function LinkContainer({ link }: { link: Link }) {
    return (
        <a
            href={link.target}
            className="p-4 border border-gray-200 rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
        >
            <h3 className="text-lg font-semibold flex gap-2 items-center">
                {link.faIcon && <DynamicIcon name={link.faIcon} />}
                {link.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
        </a>
    );
}
