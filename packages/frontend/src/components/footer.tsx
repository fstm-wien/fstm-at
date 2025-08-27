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
        <footer className="mt-16 px-6 lg:px-20 h-14 lg:h-20 flex flex-row items-center border-t border-background-emphest justify-between">
            <span className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Fachschaft Technische Mathematik
            </span>
            <span className="flex flex-row gap-3">
                {socialIcons.map((si) => (
                    <Link key={si.href} href={si.href} className="text-xl text-gray-400" target="_blank">
                        {si.icon}
                    </Link>
                ))}
            </span>
        </footer>
    );
}
