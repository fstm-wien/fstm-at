export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { humanFileSize } from "@/utils/human-file-size";
import { findFiles } from "@/utils/nextcloud";
import { FaDownload } from "react-icons/fa6";
import { OrdnerItem } from "./ordner-item";

export default async function Pruefungssammlung() {
    const files = await findFiles();

    return (
        <>
            <h1 className="mb-4 text-3xl font-bold">Prüfungssammlung</h1>
            <div className="flex flex-col divide-y divide-background-emphest">
                {files.map((f) => (
                    <OrdnerItem key={f.name} info={f} />
                ))}
            </div>
        </>
    );
}
