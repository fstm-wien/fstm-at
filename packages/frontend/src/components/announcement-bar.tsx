"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { GlobalData } from "@/lib/strapi/entities";

export type AnnouncementBarProps = {
    announcement: NonNullable<GlobalData["announcement"]>;
};

export function AnnouncementBar({ announcement }: AnnouncementBarProps) {
    const storageKey = "announcement/" + announcement.identifier;
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(localStorage.getItem(storageKey) !== "true");
    }, [storageKey]);

    const closeBar = () => {
        localStorage.setItem(storageKey, String(true));
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="relative w-full px-3 not-md:pr-7 py-3 bg-orange-400 text-left md:text-center z-100 overflow-hidden text-shadow-md">
            <span className="relative prose text-white prose-a:text-blue-100 leading-snug">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{announcement.content}</ReactMarkdown>
            </span>
            <span
                className="absolute p-1 md:p-2 right-1 md:right-2 top-1/2 -translate-y-1/2 cursor-pointer text-white"
                onClick={closeBar}
            >
                <FaTimes />
            </span>
        </div>
    );
}
