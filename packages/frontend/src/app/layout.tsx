import clsx from "clsx";
import type { Metadata } from "next";
import { Geist, Geist_Mono, PT_Sans } from "next/font/google";
import "react-loading-skeleton/dist/skeleton.css";

import { BackToTop } from "@/components/back-to-top";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme";
import { clientEnv } from "@/lib/env/client";
import { SiteProvider } from "@/lib/site-context";
import { fetchAPISingle, fetchAPISingleFromCollection } from "@/lib/strapi/api";
import { GlobalMetadata, Navbar } from "@/lib/strapi/entities";

import "./globals.css";

export const dynamic = "force-dynamic";

const geist = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const ptSans = PT_Sans({
    variable: "--font-pt-sans",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
    const eventResponse = await fetchAPISingle<GlobalMetadata>(`/global`);
    return {
        title: {
            template: "%s | FSTM",
            default: "Home | FSTM",
        },
        description: eventResponse.data?.metaDescription,
        metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
        openGraph: {
            images: [
                {
                    url: "/images/FSTM_cube.png",
                    alt: "FSTM",
                },
            ],
        },
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const response = await fetchAPISingleFromCollection<Navbar>(`/navbars`, {
        "filters[location][$eq]": "header",
        populate: ["items"],
    });

    return (
        <html lang="de">
            <SiteProvider
                value={{
                    headerNavigation: response.data?.items,
                }}
            >
                <ThemeProvider>
                    <body
                        className={clsx(
                            ...[geist, geistMono, ptSans].map((f) => f.variable),
                            `antialiased flex flex-col min-h-dvh`,
                        )}
                    >
                        <Header />
                        <main className="flex flex-col grow mx-auto px-4 max-w-5xl w-full">{children}</main>
                        <Footer />

                        <BackToTop />
                    </body>
                </ThemeProvider>
            </SiteProvider>
        </html>
    );
}
