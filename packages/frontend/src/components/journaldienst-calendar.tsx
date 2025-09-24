"use client";

import { fetchAPICollection } from "@/lib/strapi/api";
import { Journaldienst, Weekday } from "@/lib/strapi/entities";
import { useEffect, useMemo, useState } from "react";

const timeRegex = /^(\d{2}):(\d{2}):(\d{2})\.(\d{3})$/;
const parseTime = (timeString: string) => {
    const match = timeString.match(timeRegex);
    if (!match) {
        throw new Error("Invalid time format");
    }
    const [, hours, minutes, seconds, milliseconds] = match;
    return {
        hours: parseInt(hours, 10),
        minutes: parseInt(minutes, 10),
        seconds: parseInt(seconds, 10),
        milliseconds: parseInt(milliseconds, 10)
    };
};

export type JournaldienstCalendarConfigProps = {
    weekdays?: Weekday[];
    expandHours?: boolean;
    fromHour?: number;
    toHour?: number;
    pxPerMinute?: number;
}

export type JournaldienstCalendarProps = JournaldienstCalendarConfigProps & {
    journaldienste: Journaldienst[];
}

export function JournaldienstCalendarFetch({pagination = false, pageSize = 2, ...props}: JournaldienstCalendarConfigProps & {pagination?: boolean, pageSize?: number}) {
    const [journaldienste, setJournaldienste] = useState<Journaldienst[]>([]);
    useEffect(() => {
        fetchAPICollection<Journaldienst>(`/journaldienste`).then(response => {
            if (!Array.isArray(response.data)) {
                throw new Error();
            }
            setJournaldienste(response.data);
            console.log(response.data)
        });
    }, [])
    if (!pagination)
        return <JournaldienstCalendar journaldienste={journaldienste} {...props} />;
    else
    return (
        <JournaldienstCalendarPagination pageSize={pageSize} journaldienste={journaldienste} {...props} />
    );
}

export function JournaldienstCalendarPagination({
    pageSize = 2,
    weekdays = [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday],
    ...props
}: JournaldienstCalendarProps & { pageSize?: number }) {
    const [currentPage, setCurrentPage] = useState<number>(0);

    const nextPage = () => {
        setCurrentPage((currentPage + 1) % weekdays.length);
    }
    const prevPage = () => {
        setCurrentPage((currentPage - 1 + weekdays.length) % weekdays.length);
    }

    return <>
        <div className="w-full">
            <div className="w-full flex gap-2">
                <button className="flex-1 border rounded-lg" onClick={prevPage}>&lt;</button>
                <button className="flex-1 border rounded-lg" onClick={nextPage}>&gt;</button>
            </div>
            <JournaldienstCalendarFetch weekdays={weekdays.concat(weekdays).slice(currentPage, currentPage + pageSize)
            } {...props} />
        </div>
    </>
}

export function JournaldienstCalendar({
    journaldienste,
    weekdays = [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday],
    expandHours = true,
    fromHour = 8,
    toHour = 16,
    pxPerMinute = 0.8
}: JournaldienstCalendarProps) {
    const [jds, computedFromHour, computedToHour] = useMemo(() => {
        const journaldienstByWeekday: Record<Weekday, {fromHour: number, fromMinute: number, toHour: number, toMinute: number, weekday: Weekday, people: string}[]> = {
            [Weekday.Monday]: [],
            [Weekday.Tuesday]: [],
            [Weekday.Wednesday]: [],
            [Weekday.Thursday]: [],
            [Weekday.Friday]: [],
            [Weekday.Saturday]: [],
            [Weekday.Sunday]: []
        };

        let fromh = fromHour
        let toh = toHour

        journaldienste.map(journaldienst => {
            const fromParsed = parseTime(journaldienst.start)
            const toParsed = parseTime(journaldienst.end)

            return {
                fromHour: fromParsed.hours,
                fromMinute: fromParsed.minutes,
                toHour: toParsed.hours,
                toMinute: toParsed.minutes,
                weekday: journaldienst.weekday,
                people: journaldienst.people
            }
        }).forEach(journaldienst => {
            if (weekdays.includes(journaldienst.weekday) && (expandHours || (fromHour <= journaldienst.fromHour && toHour >= journaldienst.toHour))) {
                journaldienstByWeekday[journaldienst.weekday].push(journaldienst);
            }
            if (expandHours) {
                fromh = Math.min(fromh, journaldienst.fromHour);
                toh = Math.max(toh, journaldienst.toHour);
            }
        });
        return [journaldienstByWeekday, fromh, toh];
    }, [journaldienste, weekdays, fromHour, toHour])

    const hours = useMemo(() => [... new Array(computedToHour - computedFromHour + 1).keys()].map(h => h + computedFromHour), [computedFromHour, computedToHour]);

    return <>
        <div className="w-full flex flex-row align-stretch">
            <div className="invisible flex flex-col">
                {hours.map(h => <span className="text-xs" key={h}>{`${h < 10 ? '0' : ''}${h}:00`}</span>)}
            </div>
            <div className="flex-1 flex flex-row divide-x divide-gray-200 dark:divide-gray-700">
                {weekdays.map(wd => (
                    <div key={wd} className="flex-1 px-2">
                        <div className="font-bold mb-2 text-center">{wd}</div>
                        <div className="relative">
                            {hours.map(h => (
                                <div key={wd + h} style={{height: 60 * pxPerMinute}} className="border-t border-gray-200 dark:border-gray-700">
                                    {wd == weekdays[0] ? (
                                        <span key={`${wd}-${h}`} className="absolute transform -translate-x-2"><span className="absolute transform -translate-x-full -translate-y-1/2 text-xs text-gray-500">
                                            {`${h < 10 ? '0' : ''}${h}:00`}
                                        </span></span>
                                    ) : null}
                                </div>
                            ))}
                            {jds[wd].map(jd => (
                                <div key={JSON.stringify(jd)} className="absolute w-full rounded-lg bg-orange-400 dark:bg-gray-900 dark:border dark:border-orange-400 p-2" style={{top: ((jd.fromHour - computedFromHour) * 60 + jd.fromMinute) * pxPerMinute, height: ((jd.toHour - jd.fromHour) * 60 + jd.toMinute - jd.fromMinute) * pxPerMinute}}>
                                    <div>{jd.people}</div>
                                    <div className="text-xs text-gray-700 dark:text-gray-400">{`${jd.fromHour < 10 ? '0' : ''}${jd.fromHour}:${jd.fromMinute < 10 ? '0' : ''}${jd.fromMinute} - ${jd.toHour < 10 ? '0' : ''}${jd.toHour}:${jd.toMinute < 10 ? '0' : ''}${jd.toMinute}`}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
}