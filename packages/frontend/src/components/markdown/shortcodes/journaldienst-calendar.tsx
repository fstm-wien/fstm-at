import { PropsWithChildren, Suspense } from "react";

import { JournaldienstCalendar, JournaldienstCalendarConfigProps } from "@/components/journaldienst-calendar";
import { fetchAPICollection } from "@/lib/strapi/api";
import { Journaldienst } from "@/lib/strapi/entities";

export function JournaldienstCalendarShortcode(props: JournaldienstCalendarConfigProps & PropsWithChildren) {
    return (
        <Suspense fallback={<JournaldienstCalendar journaldienste={[]} {...props} />}>
            <JournaldienstCalendarLoader {...props} />
        </Suspense>
    );
}

async function JournaldienstCalendarLoader(props: JournaldienstCalendarConfigProps) {
    const response = await fetchAPICollection<Journaldienst>(`/journaldienste`);
    if (!Array.isArray(response.data)) {
        throw new Error("Invalid response from API");
    }

    return <JournaldienstCalendar journaldienste={response.data} {...props} />;
}
