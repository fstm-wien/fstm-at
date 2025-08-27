import { NextRequest } from "next/server";
import sgMail from "@sendgrid/mail";
import moment from "moment";
import { XMLParser } from "fast-xml-parser";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const email = body.email;
    const name = body.name;

    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
        throw new Error();
    }

    sgMail.setApiKey(apiKey);

    const credentials = process.env["NEXTCLOUD_LOGIN"];
    const cloudRoot = process.env["NEXTCLOUD_WEBDAV"];
    const pruefungssammlungPath = process.env["NEXTCLOUD_PRUEFUNGSSAMMLUNG"];

    if (!credentials || !cloudRoot || !pruefungssammlungPath) {
        throw new Error("Misconfigured Nextcloud access config.");
    }

    const response = await fetch(cloudRoot + "/ocs/v2.php/apps/files_sharing/api/v1/shares", {
        method: "POST",
        headers: {
            Authorization: "Basic " + Buffer.from(credentials).toString("base64"),
            "OCS-APIRequest": "true",
        },
        body: JSON.stringify({
            path: pruefungssammlungPath + "/" + name,
            shareType: 3, // public link
            publicUpload: false,
            expireDate: moment().add(2, "weeks").format("YYYY-MM-DD"),
        }),
    });
    const xmlString = await response.text();

    const parser = new XMLParser();
    const json = parser.parse(xmlString);

    console.log(name, pruefungssammlungPath + "/" + name);
    console.log(xmlString);

    if (json?.ocs?.meta?.statuscode == "404") {
        throw new Error();
    }

    if (!email || !email.endsWith("@student.tuwien.ac.at")) {
        throw new Error();
    }

    const msg = {
        to: email,
        from: "fsmat@hornik.dev",
        subject: `Prüfungsordner ${name}`,
        text: `Hier dein Link zum Ordner ${name}.\n\n${""}\n\nDieser Link ist 2 Wochen gültig.`,
    };

    (async () => {
        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error);
        }
    })();

    return Response.json({ status: 200 });
}
