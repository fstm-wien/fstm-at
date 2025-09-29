import qs from "qs";

import { clientEnv } from "../env/client";
import { Link, Seite, StrapiEntity } from "./entities";

export type StrapiAPIResponse<T extends StrapiEntity> = StrapiAPISingleResponse<T> | StrapiAPICollectionResponse<T>;
export type StrapiAPISingleResponse<T extends StrapiEntity> = StrapiAPIResponseBase<T | null>;
export type StrapiAPICollectionResponse<T extends StrapiEntity> = StrapiAPIResponseBase<T[]>;

interface StrapiAPIResponseBase<T> {
    data: T;
    meta: unknown;
    error: unknown;
}

export function getStrapiURL(path = "") {
    return `${clientEnv.NEXT_PUBLIC_CMS_URL || "http://localhost:1337"}${path}`;
}

export async function fetchAPI<T>(
    path: string,
    urlParamsObject = {},
    options = {},
): Promise<StrapiAPIResponseBase<T | null>> {
    try {
        const mergedOptions = {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${clientEnv.NEXT_PUBLIC_CMS_READ_TOKEN}`,
            },
            ...options,
        };

        const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
        const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ""}`)}`;

        const response = await fetch(requestUrl, mergedOptions);
        const data = await response.json();

        return data as StrapiAPIResponseBase<T>;
    } catch (error) {
        return {
            data: null,
            meta: {},
            error,
        };
    }
}

export async function fetchAPICollection<T extends StrapiEntity>(
    path: string,
    urlParamsObject = {},
    options = {},
): Promise<StrapiAPICollectionResponse<T>> {
    const response = await fetchAPI<T>(path, urlParamsObject, options);

    return {
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta,
        error: response.error,
    };
}

export async function fetchAPISingleFromCollection<T extends StrapiEntity>(
    path: string,
    urlParamsObject = {},
    options = {},
): Promise<StrapiAPISingleResponse<T>> {
    const response = await fetchAPICollection<T>(path, urlParamsObject, options);

    return {
        data: response.data.length > 0 ? response.data[0] : null,
        meta: response.meta,
        error: response.error,
    };
}

export async function fetchAPISingle<T extends StrapiEntity>(
    path: string,
    urlParamsObject = {},
    options = {},
): Promise<StrapiAPISingleResponse<T>> {
    return await fetchAPI<T>(path, urlParamsObject, options);
}

export async function getPageBySlug(slug: string): Promise<StrapiAPISingleResponse<Seite>> {
    return await fetchAPISingleFromCollection<Seite>(`/seiten`, {
        "filters[slug][$eq]": slug,
        populate: {
            navbar: {
                populate: ["items"],
            },
        },
    });
}

export async function getLinkBySlug(slug: string): Promise<StrapiAPISingleResponse<Link>> {
    return await fetchAPISingleFromCollection<Link>(`/links`, {
        filters: {
            slug: {
                $eq: slug,
            },
        },
    });
}
