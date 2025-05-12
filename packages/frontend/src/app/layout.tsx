import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { MdLogin } from "react-icons/md";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FSTM: Startseite",
};

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={clsx(inter.variable, inter.className, `antialiased flex flex-col min-h-dvh bg-gray-900`)}>
                <header className="mt-2 mb-4 px-4 max-w-7xl mx-auto w-full">
                    <div className="px-8 h-16 flex flex-row items-center bg-background-emph rounded-lg border border-background-emphest">
                        <div className="mr-2">
                            <Link href="/">
                                <Image src="/FSTM_cube.png" width={40} height={40} alt="FSTM Logo" draggable={false} />
                            </Link>
                        </div>
                        <h3 className="mr-8 font-semibold text-[17px]">Fachschaft Technische Mathematik</h3>
                        <nav className="flex flex-row gap-4">
                            {navigation.map((nav, i) => (
                                <span key={nav.href}>
                                    <Link
                                        href={nav.href}
                                        className={clsx(
                                            i === 0 ? "bg-orange-500/20" : "bg-transparent hover:bg-orange-500/10",
                                            "px-3 py-2 rounded-md font-medium text-sm transition-colors text-gray-300",
                                        )}
                                    >
                                        {nav.label}
                                    </Link>
                                </span>
                            ))}
                        </nav>
                        <span className="ml-auto mr-0">{/* <MdLogin /> */}</span>
                    </div>
                </header>
                <main className="grow mx-auto px-4 max-w-7xl">{children}</main>
                <footer className="mt-4 px-20 h-20 flex flex-row items-center border-t border-background-emphest justify-between">
                    <span className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Fachschaft Technische Mathematik
                    </span>
                    <span></span>
                </footer>
            </body>
        </html>
    );
}
