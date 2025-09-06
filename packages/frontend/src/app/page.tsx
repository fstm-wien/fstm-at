import { EventListItem } from "@/components/event-list";
import { FSTMLogo } from "@/components/fstm-logo";
import { fetchAPICollection, fetchAPISingle } from "@/lib/strapi/api";
import { About, Event } from "@/lib/strapi/entities";
import { generateMetaTitle } from "@/lib/util/meta";
import clsx from "clsx";
import moment from "moment";
import { Metadata } from "next";
import Link from "next/link";
import { BiCalendar, BiTime } from "react-icons/bi";
import { FaBookOpen, FaCalendar } from "react-icons/fa";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type GridItem = { icon: React.ReactNode; title: string; content: string; href?: string };
const gridItems: GridItem[] = [
    {
        icon: <FaBookOpen className="text-green-400" />,
        title: "Prüfungssammlung",
        content: "Wir betreiben eine Sammlung an Altprüfungen, damit ihr euch besser auf Prüfungen vorbereiten könnt.",
        href: "/pruefungssammlung",
    },
    {
        icon: <BiCalendar className="text-red-400" />,
        title: "Kalender",
        content: "Unsere nächsten Veranstaltungen auf einen Blick!",
        href: "/events",
    },
    {
        icon: <BiTime className="text-blue-400" />,
        title: "Journaldienste",
        content: "Zu diesen Zeiten sind wir für euch vor Ort in der Fachschaft erreichbar.",
        href: "/journaldienste",
    },
];

export const metadata: Metadata = {
    title: generateMetaTitle("Home"),
};

export default async function Home() {
    const aboutResponse = await fetchAPISingle<About>("/about");
    const nextEventsResponse = await fetchAPICollection<Event>("/events", {
        sort: "start:desc",
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
                    <div className="flex flex-col gap-2">
                        {nextEventsResponse.data.length > 0 ? (
                            nextEventsResponse.data.map((e) => <EventListItem key={e.documentId} event={e} />)
                        ) : (
                            <div className="">
                                Im Moment sind keine Events geplant. Bald haben wir wieder etwas Neues für euch!
                            </div>
                        )}
                    </div>
                    <p className="mt-4 text-gray-400 underline">
                        <Link href="/events">Mehr Events ...</Link>
                    </p>
                </div>
            )}
            <div className="lg:mx-8 mx-auto grid lg:grid-cols-3 gap-2 lg:gap-8">
                {gridItems
                    .map(
                        (item) =>
                            [
                                item,
                                <div
                                    key={item.title}
                                    className={clsx(
                                        "py-6 px-6 flex flex-col items-center text-center border border-background-emphest",
                                        item.href && "hover:bg-background-emph",
                                    )}
                                >
                                    <span className="mb-4 text-3xl">{item.icon}</span>
                                    <p className="mb-2 font-semibold text-lg">{item.title}</p>
                                    <p className="text-sm">{item.content}</p>
                                </div>,
                            ] as [GridItem, JSX.Element],
                    )
                    .map(([item, element]) =>
                        item.href ? (
                            <Link key={element.key} href={item.href}>
                                {element}
                            </Link>
                        ) : (
                            element
                        ),
                    )}
            </div>
        </>
    );
}
