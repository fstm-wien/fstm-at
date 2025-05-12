import Image from "next/image";
import Link from "next/link";
import { BiSolidDrink } from "react-icons/bi";
import { FaBookOpen } from "react-icons/fa";

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

export default function Home() {
    return (
        <>
            <div className="mx-auto max-w-2xl flex flex-col items-center">
                <Image
                    className="mt-8 mb-4"
                    src="/FSTM_cube.png"
                    width={128}
                    height={128}
                    alt="FSTM Cube"
                    draggable={false}
                />
                <p className="mb-2 text-4xl font-medium text-gray-300">Willkommen bei der</p>
                <h1 className="mb-8 text-4xl font-bold text-orange-400">Fachschaft Technische Mathematik</h1>
                <p className="mb-12 text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam metus dolor, porta nec lectus a,
                    tempus interdum lorem. Nunc iaculis nunc sed est dapibus suscipit. Fusce vitae euismod ante, sed
                    hendrerit sapien.
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
                                    <p>{item.content}</p>
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
