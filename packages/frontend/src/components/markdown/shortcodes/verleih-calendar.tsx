import { Suspense } from "react";

import { VerleihCalendar } from "@/components/verleih-calendar";
import { fetchAPICollection } from "@/lib/strapi/api";
import { VerleihTermin } from "@/lib/strapi/entities";

export function VerleihCalendarShortcode() {
    return (
        <Suspense fallback={<VerleihCalendar termine={[]} />}>
            <VerleihCalendarLoader />
        </Suspense>
    );
}

async function VerleihCalendarLoader() {
    const response = await fetchAPICollection<VerleihTermin>(`/verleihtermine`, { populate: "object" });
    if (!Array.isArray(response.data)) {
        throw new Error("Invalid response from API");
    }

    return <VerleihCalendar termine={response.data} />;
}
