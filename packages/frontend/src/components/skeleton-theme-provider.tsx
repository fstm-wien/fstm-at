"use client";

import { useTheme } from "next-themes";
import { SkeletonTheme, SkeletonThemeProps } from "react-loading-skeleton";

const skeletonConfig: Record<string, Partial<SkeletonThemeProps>> = {
    light: {
        baseColor: "#ebebeb",
        highlightColor: "#f5f5f5",
    },
    dark: {
        baseColor: "#282c34",
        highlightColor: "#616978",
    },
};

export const SkeletonThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { theme } = useTheme();

    return <SkeletonTheme {...skeletonConfig[theme || ""]}>{children}</SkeletonTheme>;
};
