import ical from "ical-generator";
import { NextRequest } from "next/server";

import { fetchAPICollection } from "@/lib/strapi/api";
import { Event } from "@/lib/strapi/entities";

export const revalidate = 1800;

export async function GET(request: NextRequest) {
    const headers = new Headers();
    headers.set("Content-Type", "text/calendar; charset=utf-8");
    headers.set("Content-Disposition", 'attachment; filename="fstm.ics"');

    const excludeHosts =
        request.nextUrl.searchParams
            .get("exclude")
            ?.split(",")
            .map((host) => host.trim()) || [];
    console.log(excludeHosts);

    const cal = ical({ name: "FSTM Events" });

    const response = await fetchAPICollection<Event>(`/events`, {
        filters: {
            host: {
                $notIn: excludeHosts,
            },
        },
    });

    if (!Array.isArray(response.data)) {
        throw new Error();
    }

    response.data.forEach((event) => {
        cal.createEvent({
            start: new Date(event.start),
            end: new Date(event.end),
            summary: event.name,
            description: `Veranstalter: ${event.host}`, // TODO: add content?
            location: event.location || "",
        });
    });

    return new Response(cal.toString(), { headers });
}
