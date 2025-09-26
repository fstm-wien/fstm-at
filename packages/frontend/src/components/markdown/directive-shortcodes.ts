import type { Properties } from "hast";
import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export type Primitive = string | number | boolean;
export type Attrs = Record<string, Primitive>;

function parseAttrs(obj: unknown): Attrs {
    const raw = (obj ?? {}) as Record<string, unknown>;
    const out: Attrs = {};
    for (const [k, v] of Object.entries(raw)) {
        if (typeof v === "string") {
            if (/^(true|false)$/i.test(v)) out[k] = /^true$/i.test(v);
            else if (/^-?\d+(\.\d+)?$/.test(v)) out[k] = Number(v);
            else out[k] = v;
        } else if (typeof v === "number" || typeof v === "boolean") {
            out[k] = v;
        }
    }
    return out;
}

export interface ShortcodePropsHast extends Properties {
    "data-shortcode": string;
    "data-props"?: string; // JSON string of props
}

export const directiveShortcodes: Plugin<[], Root> = () => {
    return (tree) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        visit(tree, (node: any) => {
            const type: unknown = node?.type;
            if (type !== "textDirective" && type !== "leafDirective" && type !== "containerDirective") {
                return;
            }

            const name = String(node.name ?? "").toLowerCase();
            if (!name) return;

            const attrs = parseAttrs(node.attributes);

            node.data = node.data ?? {};
            const isInline = type === "textDirective";

            const props: ShortcodePropsHast = {
                "data-shortcode": name,
                "data-props": Object.keys(attrs).length ? JSON.stringify(attrs) : undefined,
            };

            node.data.hName = isInline ? "span" : "div";
            node.data.hProperties = props;
        });
    };
};
