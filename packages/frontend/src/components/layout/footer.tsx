import clsx from "clsx";
import Link from "next/link";

import { GlobalData } from "@/lib/strapi/entities";

import DynamicIcon from "../dynamic-icon";

export type FooterProps = {
    links: GlobalData["footerLinks"];
};

export function Footer({ links }: FooterProps) {
    return (
        <footer
            className={clsx(
                "mt-16 px-6  py-6 flex flex-col gap-y-2 justify-between ",
                "lg:px-20 lg:flex-row lg:items-center",
                "border-t border-background-emphest text-sm text-gray-400",
            )}
        >
            <span className="">&copy; {new Date().getFullYear()} Fachschaft Technische Mathematik</span>
            <span className="inline-flex flex-row gap-x-3">
                <span>
                    <Link href="/datenschutz" prefetch={false}>
                        Datenschutzerklärung
                    </Link>
                </span>
                <span>&bull;</span>
                <span>
                    <Link href="/impressum" prefetch={false}>
                        Impressum
                    </Link>
                </span>
            </span>
            <span className="flex flex-row gap-2 lg:gap-3">
                {links.map((l) => (
                    <Link key={l.target} href={l.target} className="text-xl text-gray-400" target="_blank">
                        <DynamicIcon name={l.faIcon} />
                    </Link>
                ))}
            </span>
        </footer>
    );
}
