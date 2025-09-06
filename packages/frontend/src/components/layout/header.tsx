"use client";

import { SiteContext } from "@/lib/site-context";
import { getStrapiURL } from "@/lib/strapi/api";
import clsx from "clsx";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { MdLogin } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

import { FSTMLogo } from "../fstm-logo";
import { ThemeToggle } from "../theme";

export function Header() {
    const siteContext = useContext(SiteContext);
    const pathname = usePathname();

    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <header className="mb-4 max-w-6xl mx-auto w-full not-md:sticky top-0 bg-background z-100">
            <div className="px-12 hidden lg:grid h-16 grid-cols-3 items-center">
                <div className="flex flex-row gap-4 items-center">
                    <Link href="/">
                        <FSTMLogo size={46} />
                    </Link>
                </div>
                <nav className="flex flex-row gap-4 justify-center">
                    {siteContext?.headerNavigation &&
                        siteContext.headerNavigation.map((nav) => (
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
                <span className="flex flex-row gap-1 items-center ml-auto mr-0">
                    <ThemeToggle />
                    <Link className="p-2 text-xl" href={getStrapiURL()} target="_blank">
                        <MdLogin />
                    </Link>
                </span>
            </div>

            <div className="px-4 flex flex-row lg:hidden h-14 shadow justify-between items-center">
                <Link href="/">
                    <FSTMLogo size={40} />
                </Link>
                <div className="p-2" onClick={() => setShowSidebar(true)}>
                    <IoMenu className="text-xl" />
                </div>
            </div>

            <div
                className={clsx(
                    "lg:hidden fixed top-0 left-0 w-dvw h-dvh z-10",
                    showSidebar ? "pointer-events-auto" : "pointer-events-none",
                )}
            >
                <motion.div
                    className={clsx(
                        "absolute z-5 top-0 left-0 w-full h-full transition-colors",
                        showSidebar ? "bg-black/60" : "bg-black/0",
                    )}
                    onClick={() => setShowSidebar(false)}
                ></motion.div>
                <motion.div
                    className="block z-10 lg:hidden w-[240px] fixed top-0 h-full right-0 bg-background"
                    initial={{ translateX: "100%" }}
                    animate={{ translateX: showSidebar ? 0 : "100%", transition: { ease: "easeInOut", duration: 0.2 } }}
                >
                    <div className="h-full flex flex-col p-6">
                        <div className="ml-auto mr-0" onClick={() => setShowSidebar(false)}>
                            <RxCross1 />
                        </div>
                        <nav className="mt-6 flex flex-col items-end gap-4">
                            {siteContext?.headerNavigation &&
                                siteContext.headerNavigation.map((nav) => (
                                    <span key={nav.href}>
                                        <Link
                                            href={nav.href}
                                            onClick={() => setShowSidebar(false)}
                                            className={clsx(
                                                (
                                                    nav.href === "/"
                                                        ? pathname === nav.href
                                                        : pathname.startsWith(nav.href)
                                                )
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
                        <div className="flex flex-row gap-1 mt-auto ml-auto mr-0 mb-0">
                            <ThemeToggle />
                            <Link className="p-2 text-xl" href={getStrapiURL()} target="_blank">
                                <MdLogin />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
