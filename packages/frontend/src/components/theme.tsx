"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export type Theme = "light" | "dark";

const THEME_KEY = "theme";

export interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>("light");

    function toggleTheme() {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }

    useEffect(() => {
        const isDark =
            localStorage.getItem(THEME_KEY) === "dark" ||
            (localStorage.getItem(THEME_KEY) === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setTheme(isDark ? "dark" : "light");
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used inside a ThemeProvider.");
    }
    return context;
}

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div onClick={toggleTheme} className="block text-xl cursor-pointer p-2">
            {
                {
                    light: <FaMoon />,
                    dark: <FaSun />,
                }[theme]
            }
        </div>
    );
}
