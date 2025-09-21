import sgMail from "@sendgrid/mail";
import { renderBlock } from "blocks-html-renderer";
import moment from "moment";
import { NextRequest } from "next/server";
import z from "zod";

import { serverEnv } from "@/lib/env/server";
import { fetchAPISingleFromCollection } from "@/lib/strapi/api";
import { Email } from "@/lib/strapi/entities";
import { replaceByLookup } from "@/lib/util/templating";

const requestBodySchema = z.object({
    name: z.string(),
    regNr: z.coerce.number().int().gte(1000000).lte(99999999),
});

export async function POST(request: NextRequest) {
    const body = await request.json();

    const { name, regNr } = requestBodySchema.parse(body);

    const apiKey = serverEnv.SENDGRID_API_KEY;
    if (!apiKey) {
        throw new Error("Sendgrid was not configured.");
    }
    sgMail.setApiKey(apiKey);

    const email = `e${regNr}@student.tuwien.ac.at`;

    const credentials = serverEnv.NEXTCLOUD_LOGIN;
    const cloudRoot = serverEnv.NEXTCLOUD_WEBDAV;
    const pruefungssammlungPath = serverEnv.NEXTCLOUD_PRUEFUNGSSAMMLUNG;

    const emailTemplate = await fetchAPISingleFromCollection<Email>("/emails", {
        "filters[key][$eq]": "pruefungsanfrage",
    });
    if (!emailTemplate.data) {
        throw new Error("Email template not found.");
    }

    const response = await fetch(cloudRoot + "/ocs/v2.php/apps/files_sharing/api/v1/shares", {
        method: "POST",
        headers: {
            "OCS-APIRequest": "true",
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(credentials).toString("base64"),
        },
        body: new URLSearchParams({
            path: pruefungssammlungPath + "/" + name,
            shareType: "3", // public link
            publicUpload: "false",
            expireDate: moment().add(2, "weeks").subtract(1, "day").format("YYYY-MM-DD"),
        }),
    });

    if (response.ok) {
        const json = await response.json();
        const link = json.ocs.data.url;

        if (!email || !email.endsWith("@student.tuwien.ac.at")) {
            throw new Error("Invalid email.");
        }

        const templatingData = {
            name,
            link,
        };
        const msg = {
            to: email,
            from: "fsmat@hornik.dev",
            subject: replaceByLookup(emailTemplate.data.subject, templatingData),
            html: replaceByLookup(renderBlock(emailTemplate.data.content ?? []), templatingData),
        };

        (async () => {
            try {
                await sgMail.send(msg);
            } catch (error) {
                console.error(error);
            }
        })();

        return Response.json({ status: 200 });
    } else {
        const text = await response.text();
        throw new Error(text);
    }
}
