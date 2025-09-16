export function replaceByLookup(template: string, lookup: Record<string, string>): string {
    for (const [key, value] of Object.entries(lookup)) {
        const regex = new RegExp(`{{\w*${key}\w*}}`, "g");
        template = template.replaceAll(regex, value);
    }
    return template;
}
