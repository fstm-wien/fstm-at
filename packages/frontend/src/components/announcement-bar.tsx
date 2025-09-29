import ReactMarkdown from "react-markdown";

import { GlobalData } from "@/lib/strapi/entities";

export type AnnouncementBarProps = {
    announcement: NonNullable<GlobalData["announcement"]>;
};

export function AnnouncementBar({ announcement }: AnnouncementBarProps) {
    return (
        <div className="w-full py-2 bg-orange-500 text-center text-white">
            <ReactMarkdown>{announcement.content}</ReactMarkdown>
        </div>
    );
}
