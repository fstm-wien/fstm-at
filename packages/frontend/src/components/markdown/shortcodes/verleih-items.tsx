import { Suspense } from "react";

import { VerleihObjekte } from "@/components/verleih-objekte";
import { fetchAPICollection } from "@/lib/strapi/api";
import { VerleihObjekt } from "@/lib/strapi/entities";

export function VerleihObjekteShortcode() {
    return (
        <Suspense fallback={<VerleihObjekte objekte={[]} />}>
            <VerleihObjekteLoader />
        </Suspense>
    );
}

async function VerleihObjekteLoader() {
    const response = await fetchAPICollection<VerleihObjekt>(`/verleihobjekte`);
    if (!Array.isArray(response.data)) {
        throw new Error("Invalid response from API");
    }

    return <VerleihObjekte objekte={response.data} />;
}
