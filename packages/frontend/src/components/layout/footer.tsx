import clsx from "clsx";
import Link from "next/link";
import { FaDiscord, FaInstagram, FaWhatsapp } from "react-icons/fa";

const socialIcons: {
    icon: React.ReactNode;
    href: string;
}[] = [
    {
        icon: <FaDiscord />,
        href: "https://discord.gg/JAr6EZTEvb",
    },
    {
        icon: <FaInstagram />,
        href: "https://www.instagram.com/fstm_tuwien/",
    },
    {
        icon: <FaWhatsapp />,
        href: "https://chat.whatsapp.com/CbeftBqE96q3PI4idXULj4?mode=ems_copy_h_t",
    },
];

export function Footer() {
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
                {socialIcons.map((si) => (
                    <Link key={si.href} href={si.href} className="text-xl text-gray-400" target="_blank">
                        {si.icon}
                    </Link>
                ))}
            </span>
        </footer>
    );
}
