import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            "@next/next/no-img-element": "off", // allow <img> instead of <Image>
            "no-unused-vars": "warn", // warn instead of error
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
];

export default eslintConfig;
