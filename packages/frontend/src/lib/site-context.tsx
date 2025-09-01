"use client";

import { Navbar } from "@/types/strapi";
import { createContext } from "react";

export interface SiteData {
    title: string;
    description?: string;

    headerNavigation?: Navbar["items"];
}

export const SiteContext = createContext<SiteData | undefined>(undefined);

export function SiteProvider({ children, value }: React.PropsWithChildren & { value: SiteData }) {
    return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
