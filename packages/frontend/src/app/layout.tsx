import { BackToTop } from "@/components/back-to-top";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme";
import { SiteProvider } from "@/types/site-context";
import { Navbar } from "@/types/strapi";
import { fetchAPI } from "@/utils/fetch-api";
import { generateMetaTitle } from "@/utils/meta";
import clsx from "clsx";
import type { Metadata } from "next";
import { Geist, PT_Sans } from "next/font/google";

import "./globals.css";

export const dynamic = "force-dynamic";

const geist = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const ptSans = PT_Sans({
    variable: "--font-pt-sans",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: generateMetaTitle(),
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const response = await fetchAPI<Navbar>(`/navbars`, { "filters[location][$eq]": "header", populate: ["items"] });

    return (
        <html lang="en">
            <SiteProvider
                value={{
                    title: "FSTM",
                    headerNavigation:
                        Array.isArray(response.data) && response.data.length > 0 ? response.data[0].items : undefined,
                }}
            >
                <ThemeProvider>
                    <body
                        className={clsx(
                            ...[geist, ptSans].map((f) => f.variable),
                            `antialiased flex flex-col min-h-dvh`,
                        )}
                    >
                        <Header />
                        <main className="flex flex-col grow mx-auto px-4 max-w-5xl w-full">{children}</main>
                        <footer className="mt-16 px-6 lg:px-20 h-14 lg:h-20 flex flex-row items-center border-t border-background-emphest justify-between">
                            <span className="text-sm text-gray-400">
                                &copy; {new Date().getFullYear()} Fachschaft Technische Mathematik
                            </span>
                            <span></span>
                        </footer>
                        <BackToTop />
                    </body>
                </ThemeProvider>
            </SiteProvider>
        </html>
    );
}
