"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

import { useMounted } from "@/lib/util/use-mounted";

export function ThemeToggle() {
    const mounted = useMounted();
    const { theme, setTheme } = useTheme();

    const toggleTheme = useCallback(() => {
        setTheme(theme === "light" ? "dark" : "light");
    }, [theme, setTheme]);

    if (!mounted || !theme) {
        return (
            <div className="p-2">
                <div className="h-5 w-5 rounded-full bg-gray-300" />
            </div>
        );
    }

    const isDark = theme === "dark";

    return (
        <div onClick={toggleTheme} className="block text-xl cursor-pointer p-2">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.1 }}
                    className={clsx(isDark ? "text-yellow-200" : "text-yellow-500")}
                >
                    {!isDark ? <FaMoon /> : <FaSun />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
