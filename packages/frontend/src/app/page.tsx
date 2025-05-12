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

type EventReponse = {
    data: {
        id: number;
        documentId: string;
        name: string;
        content: string;
        start: string;
        end: string;
        location: string;
    }[];
};

export default async function Home() {
    const response: EventReponse = await fetchAPI(`/events`, {
        sort: "start:desc",
        pagination: {
            page: 1,
            pageSize: 3,
        },
    });

    return (
        <>
            <div className="mx-auto max-w-2xl flex flex-col items-center">
                <div className="relative mt-8 mb-4">
                    {/* <div
                        className={clsx(
                            "absolute w-[256px] h-[128px] top-8 left-1/2 -translate-x-1/2",
                            "bg-radial from-orange-300/30 from-10% to-40% to-transparent",
                        )}
                    ></div> */}
                    <Image
                        className="relative drop-shadow-lg/30"
                        src="/FSTM_cube.png"
                        width={128}
                        height={128}
                        alt="FSTM Cube"
                        draggable={false}
                    />
                </div>
                <p className="mb-2 text-4xl font-medium text-gray-300">Willkommen bei der</p>
                <h1 className="mb-8 text-4xl font-bold text-orange-400">Fachschaft Technische Mathematik</h1>
                <p className="mb-12 text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam metus dolor, porta nec lectus a,
                    tempus interdum lorem. Nunc iaculis nunc sed est dapibus suscipit. Fusce vitae euismod ante, sed
                    hendrerit sapien.
                </p>
            </div>
            <div className="mb-12">
                <h3 className="mb-4 inline-flex items-center gap-2 text-xl text-gray-400">
                    <FaCalendar />
                    <span>Nächste Events</span>
                </h3>
                <div className="flex flex-col gap-2">
                    {response.data.map((e) => (
                        <Link
                            key={e.documentId}
                            href={`/events/` + e.documentId}
                            className="py-3 px-4 flex flex-col gap-1 bg-background-emph border border-background-emphest rounded-lg"
                        >
                            <div className="flex flex-row items-center gap-3">
                                <span className="font-semibold">{e.name}</span>
                                {e.location && (
                                    <span className="inline-flex flex-row gap-1 items-center text-sm text-gray-400">
                                        <FaMapPin />
                                        <span>{e.location}</span>
                                    </span>
                                )}
                            </div>
                            <div className="text-gray-300 inline-flex items-center gap-1 text-sm">
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
            <div className="mx-auto max-w-2xl grid grid-cols-2 gap-8">
                {gridItems
                    .map(
                        (item) =>
                            [
                                item,
                                <div
                                    key={item.title}
                                    className="py-6 px-6 flex flex-col items-center text-center bg-background-emph border border-background-emphest rounded-xl"
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
