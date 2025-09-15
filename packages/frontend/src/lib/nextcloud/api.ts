import { XMLParser } from "fast-xml-parser";

import { serverEnv } from "../env/server";

export interface NextcloudFileInformation {
    name: string;
    size: number;
}

export async function findExamFiles(): Promise<NextcloudFileInformation[]> {
    const credentials = serverEnv.NEXTCLOUD_LOGIN;
    const cloudRoot = serverEnv.NEXTCLOUD_WEBDAV;
    const pruefungssammlungPath = serverEnv.NEXTCLOUD_PRUEFUNGSSAMMLUNG;

    const response = await fetch(cloudRoot + "/remote.php/webdav" + pruefungssammlungPath, {
        method: "PROPFIND",
        headers: {
            Authorization: "Basic " + Buffer.from(credentials).toString("base64"),
        },
    });
    const xmlString = await response.text();

    const parser = new XMLParser();
    const json = parser.parse(xmlString);

    const result: NextcloudFileInformation[] = [];

    for (const obj of json["d:multistatus"]["d:response"].slice(1)) {
        const href = obj["d:href"] as string;
        try {
            const props = obj["d:propstat"].find((p: Record<string, unknown>) => p["d:status"] === "HTTP/1.1 200 OK")[
                "d:prop"
            ];

            if (!("d:collection" in props["d:resourcetype"])) {
                continue;
            }

            const hrefSegments = href.replace(/\/$/, "").split("/");
            const name = decodeURIComponent(hrefSegments[hrefSegments.length - 1]);
            const size = parseInt(props["d:quota-used-bytes"]);

            result.push({
                name,
                size,
            });
        } catch {
            continue;
        }
    }

    return result;
}
