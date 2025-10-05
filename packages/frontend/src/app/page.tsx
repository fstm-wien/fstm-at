import moment from "moment";
import Link from "next/link";
import { FaCalendar } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import DynamicIcon from "@/components/dynamic-icon";
import { EventList } from "@/components/events/event-list";
import { FSTMLogo } from "@/components/fstm-logo";
import { Card, LinkCard } from "@/components/ui/card";
import { fetchAPICollection, fetchAPISingle } from "@/lib/strapi/api";
import { About, Event } from "@/lib/strapi/entities";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
    const aboutResponse = await fetchAPISingle<About>("/about", {
        populate: ["gridItems"],
    });
    const nextEventsResponse = await fetchAPICollection<Event>("/events", {
        sort: "start:asc",
        filters: {
            end: {
                $gte: moment().toISOString(),
            },
        },
        pagination: {
            page: 1,
            pageSize: 3,
        },
    });

    return (
        <>
            <div className="lg:mt-12 mb-18 mx-auto max-w-4xl flex flex-col lg:flex-row-reverse gap-2 items-center">
                <div className="mx-4 flex shrink-0 flex-col justify-center">
                    <FSTMLogo size={140} className="w-[96px] lg:w-auto" />
                </div>
                <div className="flex flex-col">
                    <div className="font-heading">
                        <p className="mb-1 text-3xl font-medium">Willkommen bei der</p>
                        <h1 className="mb-5 text-5xl font-bold text-orange-400">Fachschaft Technische Mathematik</h1>
                    </div>
                    <p className="">{aboutResponse.data?.description}</p>
                </div>
            </div>
            {nextEventsResponse.data && (
                <div className="mb-12 lg:mx-8">
                    <h3 className="mb-4 inline-flex items-center gap-2 text-xl">
                        <FaCalendar />
                        <span className="font-semibold">Nächste Events</span>
                    </h3>
                    {nextEventsResponse.data.length > 0 ? (
                        <EventList events={nextEventsResponse.data} />
                    ) : (
                        <p>Im Moment sind keine Events geplant. Bald haben wir wieder etwas Neues für euch!</p>
                    )}
                    <p className="mt-4 text-gray-400 underline">
                        <Link href="/events">Mehr Events ...</Link>
                    </p>
                </div>
            )}
            <div className="lg:mx-8 mx-auto grid lg:grid-cols-3 gap-2 lg:gap-4">
                {(aboutResponse.data?.gridItems ?? []).map((item) => {
                    const content = (
                        <div className="m-auto flex flex-col justify-center items-center text-center">
                            {item.faIcon && (
                                <span className="mb-4 text-2xl" style={{ color: item.color || "unset" }}>
                                    <DynamicIcon name={item.faIcon} />
                                </span>
                            )}
                            <h3 className="mb-2 font-semibold text-lg">{item.title}</h3>
                            {item.content && (
                                <div className="text-sm prose dark:prose-invert">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    );

                    return item.target ? (
                        <LinkCard key={item.id} size="large" href={item.target}>
                            {content}
                        </LinkCard>
                    ) : (
                        <Card key={item.id} size="large">
                            {content}
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
