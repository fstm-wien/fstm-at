import { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiEntity {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface About extends StrapiEntity {
    description: string;
}

export interface GlobalMetadata extends StrapiEntity {
    metaDescription: string;
}

export interface Seite extends StrapiEntity {
    title: string;
    slug: string;
    content: BlocksContent | null;
    navbar?: Navbar;
}

export interface Event extends StrapiEntity {
    name: string;
    content: BlocksContent | null;
    start: string;
    end: string;
    location: string;
    host: EventHost;
}

export enum EventHost {
    FSTM = "FSTM",
    AndereFachschaft = "Andere Fachschaft",
    TUWien = "TU Wien",
}

export interface Journaldienst extends StrapiEntity {
    weekday: Weekday;
    start: string;
    end: string;
    people: string;
}

export enum Weekday {
    Monday = "Montag",
    Tuesday = "Dienstag",
    Wednesday = "Mittwoch",
    Thursday = "Donnerstag",
    Friday = "Freitag",
    Saturday = "Samstag",
    Sunday = "Sonntag",
}

export interface Navbar extends StrapiEntity {
    location: string;
    items: {
        id: number;
        label: string;
        href: string;
    }[];
}

export interface Email extends StrapiEntity {
    key: string;
    subject: string;
    content: BlocksContent | null;
}
