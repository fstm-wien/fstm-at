"use server";

import dynamic from "next/dynamic";
import { FaQuestion } from "react-icons/fa";
import { IconBaseProps } from "react-icons/lib";

export default async function DynamicIcon({ name, ...props }: { name: string } & IconBaseProps) {
    const IconComponent = dynamic(
        async () => {
            const mod = await import("react-icons/fa");
            const Icon = mod[name as keyof typeof mod] as React.ComponentType<IconBaseProps> | undefined;
            return Icon ?? FaQuestion;
        },
        {
            ssr: true,
            loading: () => (
                <span
                    style={{ width: props.size ?? "1em", height: props.size ?? "1em", display: "inline-block" }}
                    className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"
                />
            ),
        },
    );

    return <IconComponent {...props} />;
}
