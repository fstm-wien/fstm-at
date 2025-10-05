import { NextResponse } from "next/server";

import { findExamFiles } from "@/lib/nextcloud/api";

export async function GET() {
    const files = await findExamFiles();

    return NextResponse.json({ files });
}
