import sgMail from "@sendgrid/mail";
import { renderBlock } from "blocks-html-renderer";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { serverEnv } from "@/lib/env/server";
import { fetchAPISingleFromCollection } from "@/lib/strapi/api";
import { Email } from "@/lib/strapi/entities";
import { replaceByLookup } from "@/lib/util/templating";

const requestBodySchema = z.object({
    folder: z.string(),
    matriculationNr: z.coerce.number().int().gte(1000000).lte(99999999),
});

async function validateRequest(matriculationNr: number, folder: string): Promise<boolean> {
    try {
        const res = await fetch(`${serverEnv.NEXT_PUBLIC_CMS_URL}/api/pruefungsanfragen`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${serverEnv.CMS_FULL_TOKEN}`,
            },
            body: JSON.stringify({ data: { matriculationNr, folder } }),
        });

        if (!res.ok) {
            return false;
        }
    } catch {
        return false;
    }

    return true;
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { matriculationNr, folder } = requestBodySchema.parse(body);

    const requestValid = await validateRequest(matriculationNr, folder);
    if (!requestValid) {
        return NextResponse.json({ message: "Too many requests." }, { status: 429 });
    }

    const apiKey = serverEnv.SENDGRID_API_KEY;
    if (!apiKey) {
        throw new Error("Sendgrid was not configured.");
    }
    sgMail.setApiKey(apiKey);

    const email = `e${matriculationNr}@student.tuwien.ac.at`;

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
            path: pruefungssammlungPath + "/" + folder,
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
            name: folder,
            link,
        };
        const msg = {
            to: email,
            from: serverEnv.SENDGRID_EMAIL,
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

        return NextResponse.json({ status: 200 });
    } else {
        const text = await response.text();
        throw new Error(text);
    }
}
