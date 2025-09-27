"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes, useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import defaultTheme from "tailwindcss/defaultTheme";

import { Journaldienst as StrapiJournaldienst, Weekday } from "@/lib/strapi/entities";

type Journaldienst = {
    fromHour: number;
    fromMinute: number;
    toHour: number;
    toMinute: number;
    weekday: Weekday;
    people: string;
};

export enum PaginationType {
    Never = "never",
    Always = "always",
    Mobile = "mobile",
}

export type JournaldienstCalendarConfigProps = {
    weekdays?: Weekday[];
    expandHours?: boolean;
    fromHour?: number;
    toHour?: number;
    pxPerMinute?: number;
    pagination?: PaginationType;
    pageSize?: number;
    page?: number;
    onPageChange?: (newPage: number) => void;
};

export type JournaldienstCalendarProps = JournaldienstCalendarConfigProps & {
    journaldienste: StrapiJournaldienst[];
};

export function JournaldienstCalendar({
    journaldienste,
    weekdays = [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday],
    expandHours = true,
    fromHour = 8,
    toHour = 16,
    pxPerMinute = 0.8,
    pagination = PaginationType.Mobile,
    pageSize = 3,
    page,
    onPageChange,
}: JournaldienstCalendarProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${defaultTheme.screens.md})`);
        const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        setIsMobile(mql.matches);
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

    const paginationEnabled = useMemo(() => {
        if (pagination === PaginationType.Always) return true;
        if (pagination === PaginationType.Never) return false;
        if (pagination === PaginationType.Mobile) return isMobile;
    }, [pagination, isMobile]);

    const [currentPage, setCurrentPage] = useState(page ?? 0);

    useEffect(() => {
        if (page !== undefined) {
            setCurrentPage(page);
        }
    }, [page]);

    const handlePageChange = (newPage: number) => {
        if (page === undefined) {
            setCurrentPage(newPage);
        }
        onPageChange?.(newPage);
    };
    const prevPage = () => handlePageChange((currentPage - 1 + weekdays.length) % weekdays.length);
    const nextPage = () => handlePageChange((currentPage + 1) % weekdays.length);

    const computedWeekdays = useMemo(() => {
        if (!paginationEnabled) {
            return weekdays;
        }
        return weekdays.concat(weekdays).slice(currentPage, currentPage + pageSize);
    }, [weekdays, paginationEnabled, pageSize, currentPage]);

    const [journaldiensteByWeekday, computedFromHour, computedToHour] = useMemo(() => {
        const journaldiensteByWeekday: Record<Weekday, Journaldienst[]> = {
            [Weekday.Monday]: [],
            [Weekday.Tuesday]: [],
            [Weekday.Wednesday]: [],
            [Weekday.Thursday]: [],
            [Weekday.Friday]: [],
            [Weekday.Saturday]: [],
            [Weekday.Sunday]: [],
        };

        let computedFromHour = fromHour;
        let computedToHour = toHour;

        journaldienste.map(parseStrapiJournaldienst).forEach((journaldienst) => {
            if (expandHours || (fromHour <= journaldienst.fromHour && toHour >= journaldienst.toHour)) {
                journaldiensteByWeekday[journaldienst.weekday].push(journaldienst);
            }
            if (expandHours) {
                computedFromHour = Math.min(computedFromHour, journaldienst.fromHour);
                computedToHour = Math.max(computedToHour, journaldienst.toHour);
            }
        });
        return [journaldiensteByWeekday, computedFromHour, computedToHour];
    }, [journaldienste, fromHour, toHour, expandHours]);

    const hours = useMemo(
        () => [...new Array(computedToHour - computedFromHour + 1).keys()].map((h) => h + computedFromHour),
        [computedFromHour, computedToHour],
    );

    return (
        <>
            <div className="w-full flex flex-col items-stretch">
                {paginationEnabled && (
                    <div className="flex flex-row mb-4 gap-2">
                        <PaginationButton onClick={prevPage} disabled={currentPage <= 0}>
                            <FaArrowLeft />
                        </PaginationButton>
                        <PaginationButton onClick={nextPage} disabled={currentPage >= weekdays.length - pageSize}>
                            <FaArrowRight />
                        </PaginationButton>
                    </div>
                )}
                <div className="flex flex-row items-stretch">
                    <div className="invisible flex flex-col">
                        {hours.map((h) => (
                            <span className="text-xs" key={`${h}-placeholder`}>
                                {formatTime(h)}
                            </span>
                        ))}
                    </div>
                    <div className="flex-1 flex flex-row divide-x divide-gray-200 dark:divide-gray-700">
                        {computedWeekdays.map((wd) => (
                            <div key={wd} className="flex-1 px-1">
                                <div className="font-bold mb-2 text-center hyphens-none">{wd}</div>
                                <div className="relative">
                                    {hours.map((h) => (
                                        <div
                                            key={`${wd}-${h}`}
                                            style={{ height: 60 * pxPerMinute }}
                                            className="border-t border-gray-200 dark:border-gray-700"
                                        >
                                            {wd == computedWeekdays[0] ? (
                                                <span
                                                    key={`${wd}-${h}-label`}
                                                    className="absolute transform -translate-x-2"
                                                >
                                                    <span className="absolute transform -translate-x-full -translate-y-1/2 text-xs text-gray-500">
                                                        {formatTime(h)}
                                                    </span>
                                                </span>
                                            ) : null}
                                        </div>
                                    ))}
                                    {journaldiensteByWeekday[wd].map((jd) => (
                                        <div
                                            key={JSON.stringify(jd)}
                                            className="absolute w-full rounded-sm bg-orange-400 dark:bg-gray-800 dark:border dark:border-orange-400 p-2 select-none"
                                            style={{
                                                top:
                                                    ((jd.fromHour - computedFromHour) * 60 + jd.fromMinute) *
                                                    pxPerMinute,
                                                height:
                                                    ((jd.toHour - jd.fromHour) * 60 + jd.toMinute - jd.fromMinute) *
                                                    pxPerMinute,
                                            }}
                                        >
                                            <div className="mb-1 font-semibold leading-[1.1]">{jd.people}</div>
                                            <div className="text-xs text-gray-700 dark:text-gray-400">{`${formatTime(jd.fromHour, jd.fromMinute)} - ${formatTime(jd.toHour, jd.toMinute)}`}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

const STRAPI_TIME_REGEX = /^(\d{2}):(\d{2}):(\d{2})\.(\d{3})$/;

const parseStrapiTime = (time: string) => {
    const match = time.match(STRAPI_TIME_REGEX);
    if (!match) {
        throw new Error("Invalid time format");
    }
    const [, hours, minutes, seconds, milliseconds] = match;
    return {
        hours: parseInt(hours, 10),
        minutes: parseInt(minutes, 10),
        seconds: parseInt(seconds, 10),
        milliseconds: parseInt(milliseconds, 10),
    };
};

const parseStrapiJournaldienst = (jd: StrapiJournaldienst): Journaldienst => {
    const fromParsed = parseStrapiTime(jd.start);
    const toParsed = parseStrapiTime(jd.end);
    return {
        fromHour: fromParsed.hours,
        fromMinute: fromParsed.minutes,
        toHour: toParsed.hours,
        toMinute: toParsed.minutes,
        weekday: jd.weekday,
        people: jd.people,
    };
};

const formatTime = (h: number, m: number = 0) => {
    return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
};

function PaginationButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={clsx(
                "flex-1 px-2 py-2 bg-gray-300 rounded flex justify-center transition-transform active:scale-95",
                "dark:bg-gray-800",
                "disabled:opacity-40",
            )}
            {...props}
        >
            {children}
        </button>
    );
}
