"use client";

import { Navbar } from "@/types/strapi";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNavigation({ navbar }: { navbar: Navbar }) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-1">
            {navbar.items.map((item) => (
                <div key={item.id}>
                    <Link
                        href={item.href}
                        className={clsx(
                            "text-sm",
                            pathname.startsWith(item.href) ? "text-orange-500" : "text-gray-400",
                        )}
                    >
                        {item.label}
                    </Link>
                </div>
            ))}
        </nav>
    );
}
