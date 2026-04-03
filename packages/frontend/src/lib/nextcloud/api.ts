import { XMLParser } from "fast-xml-parser";

import { serverEnv } from "../env/server";

export interface NextcloudFileInformation {
    name: string;
    size: number;
}

export async function findExamFiles(): Promise<NextcloudFileInformation[]> {
    if (!serverEnv.NEXTCLOUD_LOGIN || !serverEnv.NEXTCLOUD_WEBDAV || !serverEnv.NEXTCLOUD_PRUEFUNGSSAMMLUNG) {
        throw new Error("Nextcloud was not configured.");
    }
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
            const props = obj["d:propstat"]["d:prop"];
            const resourceType = props["d:resourcetype"];
            if (!resourceType || !("d:collection" in props["d:resourcetype"])) {
                continue;
            }

            const hrefSegments = href.replace(/\/$/, "").split("/");
            const name = decodeURIComponent(hrefSegments[hrefSegments.length - 1]);
            const size = parseInt(props["d:quota-used-bytes"]);

            result.push({
                name,
                size,
            });
        } catch (e) {
            console.error(e);
            continue;
        }
    }

    return result;
}
