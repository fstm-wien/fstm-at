import { PropsWithChildren, Suspense } from "react";

import { ExamData, ExamList, ExamListProps } from "@/components/exam-list";
import { clientEnv } from "@/lib/env/client";

export function PruefungssammlungShortcode(props: ExamListProps & PropsWithChildren) {
    return (
        <Suspense fallback={<PruefungssammlungFallback />}>
            <PruefungssammlungLoader {...props} />
        </Suspense>
    );
}

async function PruefungssammlungLoader(props: Omit<ExamListProps, "files">) {
    const response = await fetch(clientEnv.NEXT_PUBLIC_SITE_URL + "/api/exams", {
        method: "GET",
    });
    const { files }: { files: ExamData[] } = await response.json();

    return <ExamList files={files} {...props} />;
}

function PruefungssammlungFallback() {
    return <ExamList files={Array.from(Array(16).fill(null))} />;
}
