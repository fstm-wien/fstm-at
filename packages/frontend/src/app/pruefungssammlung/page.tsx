import { generateMetaTitle } from "@/utils/meta";
import { findFiles } from "@/utils/nextcloud";
import { Metadata } from "next";
import { FaLink } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import { OrdnerItem } from "./ordner-item";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
    title: generateMetaTitle("Prüfungssammlung"),
};

export default async function Pruefungssammlung() {
    const files = await findFiles();

    return (
        <>
            <h1 className="mb-4 text-3xl font-bold">Prüfungssammlung</h1>
            <div className="flex flex-col gap-2 mb-4">
                <p>Um euch die Altprüfungen ansehen zu können:</p>
                <ol className="flex flex-col gap-1 list-decimal pl-5">
                    <li>Sucht euch die entsprechende Prüfung in der untenstehenden Liste.</li>
                    <li>
                        Klickt auf das <FaLink className="inline-block" />
                        -Symbol.
                    </li>
                    <li>
                        Tragt eure Studenten-Email ein (im Format <code>eXXXXXXXX@student.tuwien.ac.at</code>).
                    </li>
                    <li>
                        Klickt auf das <IoMail className="inline-block" />
                        -Symbol um einen Link zum Prüfungsordner zu erhalten.
                    </li>
                </ol>
                <p>
                    Zu manchen Prüfungen gibt es noch keine digitale Version, dafür aber eine physische Version in der
                    Fachschaft, diese könnt ihr natürlich auch jederzeit einsehen. Damit unsere Sammlung auch in Zukunft
                    noch aktuell bleibt, bitten wir euch, uns Angabeblätter und Berichte über mündliche Prüfungen vorbei
                    zu bringen. Als kleines Dankeschön bekommt ihr dafür ein Getränk aus dem Fachschaftskühlschrank
                    gratis!
                </p>
            </div>
            <p className="mb-2">Aktuell haben wir (digital) Prüfungen zu:</p>
            <div className="flex flex-col divide-y divide-background-emphest">
                {files.map((f) => (
                    <OrdnerItem key={f.name} info={f} />
                ))}
            </div>
        </>
    );
}
