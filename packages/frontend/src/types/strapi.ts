import { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiAPIResponse<T extends StrapiObject> {
    data: T | T[];
    meta: unknown;
    error: unknown;
}

export interface StrapiObject<M = unknown> {
    id: number;
    documentId: string;
    meta: M;
}

export interface Seite extends StrapiObject {
    title: string;
    slug: string;
    content: BlocksContent;
    navbar?: Navbar;
}

export interface Event extends StrapiObject {
    name: string;
    content: BlocksContent;
    start: string;
    end: string;
    location: string;
}

export interface Journaldienst extends StrapiObject {
    start: string;
    end: string;
    people: string;
}

export interface Navbar extends StrapiObject {
    location: string;
    items: {
        id: number;
        label: string;
        href: string;
    }[];
}
