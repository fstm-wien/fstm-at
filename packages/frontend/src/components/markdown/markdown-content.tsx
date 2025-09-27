import { Element } from "hast";
import ReactMarkdown, { Components } from "react-markdown";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";

import { directiveShortcodes } from "./directive-shortcodes";
import { Sparkly } from "./sparkly";
import { JournaldienstCalendarShortcode } from "./journaldienst-calendar-shortcode";

type ShortcodeMap = {
    sparkly: typeof Sparkly;
    journaldienst_calendar: typeof JournaldienstCalendarShortcode;
};

const shortcodes: ShortcodeMap = {
    sparkly: Sparkly,
    journaldienst_calendar: JournaldienstCalendarShortcode,
};

function parsePropsFromNode(node: Element): Record<string, unknown> {
    const propsStr = node.properties?.["data-props"];
    if (typeof propsStr !== "string") return {};
    try {
        return JSON.parse(propsStr) as Record<string, unknown>;
    } catch {
        return {};
    }
}

function getShortcodeName(node: Element): keyof ShortcodeMap | undefined {
    const n = node.properties?.["data-shortcode"];
    return typeof n === "string" && n in shortcodes ? (n as keyof ShortcodeMap) : undefined;
}

export interface MarkdownProps {
    source: string;
}

export function MarkdownContent({ source }: MarkdownProps) {
    const components: Components = {
        span({ node, children }) {
            const el = node as Element;
            const name = getShortcodeName(el);
            if (!name) return <span>{children}</span>;

            const Comp = shortcodes[name];
            const compProps = parsePropsFromNode(el);
            return <Comp {...compProps}>{children}</Comp>;
        },

        div({ node, children }) {
            const el = node as Element;
            const name = getShortcodeName(el);
            if (!name) return <div>{children}</div>;

            const Comp = shortcodes[name];
            const compProps = parsePropsFromNode(el);
            return <Comp {...compProps}>{children}</Comp>;
        },
    };

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkDirective, directiveShortcodes]} components={components}>
            {source}
        </ReactMarkdown>
    );
}
