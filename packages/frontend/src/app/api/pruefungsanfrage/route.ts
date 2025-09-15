import sgMail from "@sendgrid/mail";
import moment from "moment";
import { NextRequest } from "next/server";
import z from "zod";

import { serverEnv } from "@/lib/env/server";

const requestBodySchema = z.object({
    name: z.string(),
    regNr: z.coerce.number().int().gte(1000000).lte(99999999),
});

export async function POST(request: NextRequest) {
    const body = await request.json();

    const { name, regNr } = requestBodySchema.parse(body);

    const apiKey = serverEnv.SENDGRID_API_KEY;
    if (!apiKey) {
        throw new Error();
    }
    sgMail.setApiKey(apiKey);

    const email = `e${regNr}@student.tuwien.ac.at`;

    const credentials = serverEnv.NEXTCLOUD_LOGIN;
    const cloudRoot = serverEnv.NEXTCLOUD_WEBDAV;
    const pruefungssammlungPath = serverEnv.NEXTCLOUD_PRUEFUNGSSAMMLUNG;

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
            expireDate: moment().add(2, "weeks").format("YYYY-MM-DD"),
        }),
    });

    if (response.ok) {
        const json = await response.json();
        const url = json.ocs.data.url;

        if (!email || !email.endsWith("@student.tuwien.ac.at")) {
            throw new Error();
        }

        const msg = {
            to: email,
            from: "fsmat@hornik.dev",
            subject: `Prüfungsordner ${name}`,
            text: `Hier dein Link zum Ordner "${name}".\n\n${url}\n\nDieser Link ist 2 Wochen gültig.`,
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
        throw new Error();
    }
}
