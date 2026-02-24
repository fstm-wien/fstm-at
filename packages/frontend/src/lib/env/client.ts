import z from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_SITE_URL: z.string().optional(),
    NEXT_PUBLIC_CMS_URL: z.string().optional(),
    NEXT_PUBLIC_CMS_READ_TOKEN: z.string().optional(),
});

export const clientEnv = envSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CMS_URL: process.env.NEXT_PUBLIC_CMS_URL,
    NEXT_PUBLIC_CMS_READ_TOKEN: process.env.NEXT_PUBLIC_CMS_READ_TOKEN,
});
