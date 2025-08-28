import sgMail from "@sendgrid/mail";
import moment from "moment";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();

    const name = body.name;
    const regNr = body.regNr;

    // TODO: validation

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
        throw new Error();
    }
    sgMail.setApiKey(apiKey);

    const email = `e${regNr}@student.tuwien.ac.at`;

    const credentials = process.env.NEXTCLOUD_LOGIN;
    const cloudRoot = process.env.NEXTCLOUD_WEBDAV;
    const pruefungssammlungPath = process.env.NEXTCLOUD_PRUEFUNGSSAMMLUNG;

    if (!credentials || !cloudRoot || !pruefungssammlungPath) {
        throw new Error("Misconfigured Nextcloud access config.");
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
