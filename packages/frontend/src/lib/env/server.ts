import z from "zod";

import { clientEnv } from "./client";

const envSchema = z.object({
    SENDGRID_API_KEY: z.string().optional(),
    SENDGRID_EMAIL: z.string().optional(),

    NEXTCLOUD_LOGIN: z.string().optional(),
    NEXTCLOUD_WEBDAV: z.string().optional(),
    NEXTCLOUD_PRUEFUNGSSAMMLUNG: z.string().optional(),

    CMS_FULL_TOKEN: z.string().optional(),
});

export const serverEnv = {
    ...envSchema.parse(process.env),
    ...clientEnv,
};
