"use client";

import deLocale from "@fullcalendar/core/locales/de";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import qs from "qs";
import { useMemo, useState } from "react";
import { FaCheck, FaCopy, FaMapPin } from "react-icons/fa";

import { Event, EventHost } from "@/lib/strapi/entities";

import { Modal } from "./modal";
import { Toggle } from "./toggle";

const eventHostClassLookup: Record<EventHost, string> = {
    [EventHost.FSTM]: "bg-orange-400",
    [EventHost.AndereFachschaft]: "bg-green-600",
    [EventHost.TUWien]: "bg-blue-400",
};

export function EventCalendar({ events }: { events: Event[] }) {
    const router = useRouter();
    const [showCalendarExport, setShowCalendarExport] = useState(false);

    return (
        <>
            <CalendarExportModal show={showCalendarExport} onClose={() => setShowCalendarExport(false)} />

            <div className="w-full">
                <div className="mb-1 flex flex-row justify-between flex-wrap">
                    <div className="flex flex-row gap-4 mb-2">
                        <span className="">Veranstalter:</span>
                        <span className="inline-flex flex-row flex-wrap gap-x-3">
                            {Object.entries(eventHostClassLookup).map(([k, v]) => (
                                <span key={k} className="inline-flex items-center flex-row gap-1">
                                    <span className={clsx("size-2.5 rounded-full", v)}></span>
                                    <span>{k}</span>
                                </span>
                            ))}
                        </span>
                    </div>
                    <a
                        className="px-3 py-1 bg-background-emph hover:bg-background-emphest rounded-sm cursor-pointer mr-0 ml-auto select-none"
                        onClick={() => setShowCalendarExport(true)}
                    >
                        Kalender abbonieren
                    </a>
                </div>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events.map((e) => ({
                        id: e.documentId,
                        title: e.name,
                        start: e.start,
                        end: e.end,
                        location: e.location,
                        host: e.host,
                    }))}
                    locale={deLocale}
                    eventClick={(info) => router.push(`/events/${info.event._def.publicId}`)}
                    nowIndicator={true}
                    displayEventEnd={true}
                    // height={"70dvh"}
                    eventContent={(eventInfo) => (
                        <div className="flex flex-col md:flex-row gap-1 md:p-1 rounded-sm w-full">
                            <div className="mt-1">
                                <div
                                    className={clsx(
                                        "size-2.5 rounded-full",
                                        eventHostClassLookup[eventInfo.event.extendedProps.host as EventHost],
                                    )}
                                ></div>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[10px] text-gray-600 dark:text-gray-400">{eventInfo.timeText}</p>
                                <p className="font-bold leading-tight">{eventInfo.event.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    <FaMapPin className="inline mr-1" />
                                    <span>{eventInfo.event.extendedProps.location}</span>
                                </p>
                            </div>
                        </div>
                    )}
                />
            </div>
        </>
    );
}

function CalendarExportModal({ show, onClose }: { show: boolean; onClose: () => void }) {
    const [eventHostsState, setEventHostsState] = useState<Record<EventHost, boolean>>(
        Object.fromEntries(Object.values(EventHost).map((h) => [h, true])) as Record<EventHost, boolean>,
    );

    const url = useMemo(() => {
        const base = `${window.location.origin}/api/calendar`;
        const exclude = Object.entries(eventHostsState)
            .filter(([, v]) => !v)
            .map(([k]) => k)
            .join(",");

        return base + (exclude.length > 0 ? `?${qs.stringify({ exclude })}` : "");
    }, [eventHostsState]);

    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        (async function () {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Fehler beim Kopieren: ", err);
            }
        })();
    };
    const handleToggle = (key: EventHost) => {
        setEventHostsState((old) => ({
            ...old,
            [key]: !old[key],
        }));
    };

    return (
        <Modal show={show} onClose={onClose}>
            <h1 className="text-2xl">Kalender exportieren</h1>
            <div>
                <p className="mb-2">
                    Mit dem untenstehenden Link kannst du unseren Kalender abonnieren. So werden neue Events automatisch
                    in deinem Kalender angezeigt.
                </p>
                <p className="mb-1">Wähle hier aus, welche Veranstalter du sehen möchtest.</p>
                <div className="flex flex-col gap-y-1 p-2 mb-2">
                    {Object.entries(eventHostsState).map(([k, v]) => (
                        <span key={k} className="inline-flex items-center flex-row gap-2">
                            <Toggle
                                value={v}
                                onChange={() => handleToggle(k as EventHost)}
                                activeColor={eventHostClassLookup[k as EventHost]}
                            />
                            <span className={clsx(v ? "" : "text-gray-500")}>{k}</span>
                        </span>
                    ))}
                </div>
                <div className="flex flex-row">
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-700 focus:outline-none"
                        type="text"
                        readOnly
                        value={url}
                    />
                    <button
                        className="px-4 py-2 bg-orange-400 text-white rounded-r-lg hover:bg-orange-500 transition cursor-pointer"
                        onClick={handleCopy}
                        disabled={copied}
                        title={copied ? "Kopiert!" : "In Zwischenablage kopieren"}
                    >
                        {copied ? <FaCheck /> : <FaCopy />}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
