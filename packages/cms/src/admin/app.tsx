import type { StrapiApp } from "@strapi/strapi/admin";

export default {
    config: {
        locales: ["de"],
        theme: {
            light: {
                colors: {
                    primary100: "#ffedd4",
                    primary200: "#ffd7a8",
                    primary500: "#ff8904",
                    buttonPrimary500: "#ff8904",
                    primary600: "#ff6900",
                    buttonPrimary600: "#ff6900",
                    primary700: "#ca3500",
                },
            },
        },
    },
    bootstrap() {},
};
