"use client";

import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

type AccordionProps = {
    title?: string;
    children: ReactNode;
};

export function Accordion({ title, children }: AccordionProps) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => setExpanded((e) => !e);

    return (
        <motion.div className="mb-4 rounded-sm bg-background-emph overflow-hidden">
            <div
                className="px-6 py-4 flex flex-row items-start gap-3 cursor-pointer select-none hover:bg-background-emphest"
                onClick={toggleExpanded}
            >
                <motion.span className="grow-0 inline-block" animate={{ rotate: expanded ? 180 : 0 }}>
                    <FaChevronDown className="inline-block" />
                </motion.span>
                <span className="grow font-semibold">{title}</span>
            </div>
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        key="content"
                        className="px-6 [&>p:first-child]:mt-2 [&>p:last-of-type]:mb-0"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { height: "auto" },
                            collapsed: { height: 0 },
                        }}
                    >
                        {children}
                        <div className="h-4"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
