"use client";

import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme";

const navigation: { label: string; href: string }[] = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Fachschaft",
        href: "/fachschaft",
    },
    {
        label: "Kontakt",
        href: "/kontakt",
    },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="mt-2 mb-4 px-4 max-w-7xl mx-auto w-full">
            <div className="px-8 h-16 grid grid-cols-3 items-center">
                <div className="flex flex-row gap-4 items-center">
                    <div className="">
                        <Link href="/">
                            <Image src="/FSTM_cube.png" width={46} height={46} alt="FSTM Logo" draggable={false} />
                        </Link>
                    </div>
                    {pathname !== "/" && (
                        <h3 className="font-semibold text-[19px] tracking-wide font-heading">
                            Fachschaft Technische Mathematik
                        </h3>
                    )}
                </div>
                <nav className="flex flex-row gap-4 justify-center">
                    {navigation.map((nav) => (
                        <span key={nav.href}>
                            <Link
                                href={nav.href}
                                className={clsx(
                                    (nav.href === "/" ? pathname === nav.href : pathname.startsWith(nav.href))
                                        ? "bg-orange-400/40 dark:bg-black/40"
                                        : "dark:bg-transparent hover:bg-orange-400/20 dark:hover:bg-black/20",
                                    "px-4 py-2.5 rounded-md font-medium text-sm transition-colors",
                                )}
                            >
                                {nav.label}
                            </Link>
                        </span>
                    ))}
                </nav>
                <span className="ml-auto mr-0">
                    {/* <MdLogin /> */}

                    <ThemeToggle />
                </span>
            </div>
        </header>
    );
}
