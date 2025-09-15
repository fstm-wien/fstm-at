import z from "zod";

const envSchema = z.object({
    SENDGRID_API_KEY: z.string(),

    NEXTCLOUD_LOGIN: z.string(),
    NEXTCLOUD_WEBDAV: z.string(),
    NEXTCLOUD_PRUEFUNGSSAMMLUNG: z.string(),
});

export const serverEnv = envSchema.parse(process.env);
