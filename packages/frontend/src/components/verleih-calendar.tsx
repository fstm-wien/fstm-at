"use client";

import deLocale from "@fullcalendar/core/locales/de";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { FaUser } from "react-icons/fa";

import { VerleihTermin } from "@/lib/strapi/entities";

export type VerleihCalendarProps = {
    termine: VerleihTermin[];
};

export function VerleihCalendar({ termine }: VerleihCalendarProps) {
    return (
        <div className="w-full not-prose">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={termine.map((t) => ({
                    id: t.documentId,
                    start: t.start,
                    end: t.end,
                    objekt: t.object?.name ?? "?",
                    borrower: t.borrower,
                }))}
                locale={deLocale}
                nowIndicator={true}
                displayEventEnd={true}
                eventContent={(eventInfo) => (
                    <div className="flex flex-col md:flex-row gap-1 md:p-1 rounded-sm">
                        <div className="flex flex-col">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400">{eventInfo.timeText}</p>
                            <p className="font-bold leading-tight">{eventInfo.event.extendedProps.objekt}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                <FaUser className="inline mr-1" />
                                <span>{eventInfo.event.extendedProps.borrower}</span>
                            </p>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}
