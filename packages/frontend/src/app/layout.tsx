import clsx from "clsx";
import type { Metadata } from "next";
import { Inter, PT_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { MdLogin } from "react-icons/md";
import "./globals.css";
import { ThemeProvider, ThemeToggle } from "@/components/theme";
import { Header } from "@/components/header";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const ptSans = PT_Sans({
    variable: "--font-pt-sans",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: "FSTM: Startseite",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <ThemeProvider>
                <body
                    className={clsx(
                        ...[inter, ptSans].map((f) => f.variable),
                        inter.className,
                        `antialiased flex flex-col min-h-dvh`,
                    )}
                >
                    <Header />
                    <main className="flex flex-col grow mx-auto px-4 max-w-7xl">{children}</main>
                    <footer className="mt-16 px-20 h-20 flex flex-row items-center border-t border-background-emphest justify-between">
                        <span className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} Fachschaft Technische Mathematik
                        </span>
                        <span></span>
                    </footer>
                </body>
            </ThemeProvider>
        </html>
    );
}
