"use client";

import { VerleihObjekt } from "@/lib/strapi/entities";

export type VerleihObjekteProps = {
    objekte: VerleihObjekt[];
};

export function VerleihObjekte({ objekte }: VerleihObjekteProps) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Beschreibung</th>
                </tr>
            </thead>
            <tbody>
                {objekte.map((o) => (
                    <tr key={o.id}>
                        <td>{o.name}</td>
                        <td>{o.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
