import { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiAPIResponse<T extends StrapiObject> {
    data: T | T[] | unknown;
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
