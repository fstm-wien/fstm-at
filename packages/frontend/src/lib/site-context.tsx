"use client";

import { createContext } from "react";

import { Navbar } from "./strapi/entities";

export interface SiteData {
    title: string;
    description?: string;

    headerNavigation?: Navbar["items"];
}

export const SiteContext = createContext<SiteData | undefined>(undefined);

export function SiteProvider({ children, value }: React.PropsWithChildren & { value: SiteData }) {
    return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
