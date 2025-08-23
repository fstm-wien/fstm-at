import qs from "qs";
import { getStrapiURL } from "./api";
import { StrapiAPIResponse, StrapiObject } from "@/types/strapi";

export async function fetchAPI<T extends StrapiObject>(
    path: string,
    urlParamsObject = {},
    options = {},
): Promise<StrapiAPIResponse<T>> {
    try {
        const mergedOptions = {
            next: { revalidate: 60 },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
            ...options,
        };

        const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
        const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ""}`)}`;

        const response = await fetch(requestUrl, mergedOptions);
        const data = await response.json();

        return data as StrapiAPIResponse<T>;
    } catch (error) {
        console.error(error);

        throw new Error(`Please check if your server is running and you set all the required tokens.`);
    }
}
