import { PropsWithChildren } from "react";

import DynamicIcon from "@/components/dynamic-icon";

export function IconShortcode({ children }: PropsWithChildren) {
    if (typeof children !== "string") {
        throw new Error("Invalid shortcode content.");
    }

    return <DynamicIcon name={children} className="inline-block" />;
}
