"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export function BackToTop() {
    const [scrollTop, setScrollTop] = useState(0);
    const [windowHeight, setWindowHeight] = useState(1080);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScrollTop(window.scrollY);
        });
        window.addEventListener("resize", () => {
            setWindowHeight(window.innerHeight);
        });

        setScrollTop(window.scrollY);
        setWindowHeight(window.innerHeight);
    }, []);

    return (
        <AnimatePresence>
            {scrollTop > windowHeight / 2 && (
                <motion.div
                    className="fixed flex bottom-4 right-4 size-10 bg-background border border-background-emphest rounded-sm shadow-lg hover:bg-background-emph cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ ease: "easeInOut" }}
                >
                    <FaArrowUp className="m-auto" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
