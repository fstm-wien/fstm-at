export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Event } from "@/types/strapi";
import { fetchAPI } from "@/utils/fetch-api";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { BiSolidDrink } from "react-icons/bi";
import { FaBookOpen, FaCalendar, FaClock, FaMapPin } from "react-icons/fa";

type GridItem = { icon: React.ReactNode; title: string; content: string; href?: string };
const gridItems: GridItem[] = [
    {
        icon: <FaBookOpen className="text-orange-300" />,
        title: "Prüfungssammlung",
        content: "Wir betreiben eine Sammlung an Altprüfungen, damit ihr euch besser auf Prüfungen vorbereiten könnt.",
        href: "/pruefungssammlung",
    },
    {
        icon: <BiSolidDrink className="text-blue-300" />,
        title: "Spritzerstände",
        content: "Spritzer geht immer!",
    },
];

export default async function Home() {
    const response = await fetchAPI<Event>(`/events`, {
        sort: "start:desc",
        pagination: {
            page: 1,
            pageSize: 3,
        },
    });

    if (!Array.isArray(response.data)) {
        throw new Error();
    }

    return (
        <>
            <div className="lg:mt-12 mb-18 mx-auto max-w-4xl flex flex-col lg:flex-row-reverse gap-2 items-center">
                <div className="mx-4 flex shrink-0 flex-col justify-center">
                    {/* <div
                        className={clsx(
                            "absolute w-[256px] h-[128px] top-8 left-1/2 -translate-x-1/2",
                            "bg-radial from-orange-300/30 from-10% to-40% to-transparent",
                        )}
                    ></div> */}
                    <div className="relative w-[96px] lg:w-auto">
                        <Image
                            className=""
                            src="/FSTM_cube.png"
                            width={140}
                            height={140}
                            alt="FSTM Cube"
                            draggable={false}
                        />
                        <Image
                            className="absolute top-0 scale-110 brightness-0 invert -z-5 select-none"
                            src="/FSTM_cube.png"
                            width={140}
                            height={140}
                            alt="FSTM Cube"
                            draggable={false}
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="font-heading">
                        <p className="mb-1 text-3xl font-medium">Willkommen bei der</p>
                        <h1 className="mb-5 text-5xl font-bold text-orange-400">Fachschaft Technische Mathematik</h1>
                    </div>
                    <p className="">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam metus dolor, porta nec lectus a,
                        tempus interdum lorem. Nunc iaculis nunc sed est dapibus suscipit. Fusce vitae euismod ante, sed
                        hendrerit sapien.
                    </p>
                </div>
            </div>
            {response.data && (
                <div className="mb-12 mx-8">
                    <h3 className="mb-4 inline-flex items-center gap-2 text-xl">
                        <FaCalendar />
                        <span>Nächste Events</span>
                    </h3>
                    <div className="flex flex-col gap-2">
                        {response.data.map((e) => (
                            <Link
                                key={e.documentId}
                                href={`/events/` + e.documentId}
                                className="py-3 px-4 flex flex-col gap-1 bg-background-emph hover:bg-background-emphest transition-colors border border-background-emphest rounded-lg"
                            >
                                <div className="flex flex-row items-center gap-3">
                                    <span className="font-semibold">{e.name}</span>
                                    {e.location && (
                                        <span className="inline-flex flex-row gap-1 items-center text-sm text-gray-500 dark:text-gray-400">
                                            <FaMapPin />
                                            <span>{e.location}</span>
                                        </span>
                                    )}
                                </div>
                                <div className="text-gray-400 dark:text-gray-500 inline-flex items-center gap-1 text-sm">
                                    <FaClock />
                                    <span>{e.start}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <p className="mt-4 text-gray-400 underline">
                        <Link href="/events">Mehr Events ...</Link>
                    </p>
                </div>
            )}
            <div className="mx-auto max-w-2xl grid lg:grid-cols-2 gap-2 lg:gap-8">
                {gridItems
                    .map(
                        (item) =>
                            [
                                item,
                                <div
                                    key={item.title}
                                    className={clsx(
                                        "py-6 px-6 flex flex-col items-center text-center bg-background-emph border border-background-emphest rounded-xl transition-colors",
                                        item.href && "hover:bg-background-emphest",
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
