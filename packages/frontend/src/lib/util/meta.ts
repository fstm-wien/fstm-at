export function generateMetaTitle(...segments: string[]) {
    return ["FSTM", ...segments].join(" - ");
}
