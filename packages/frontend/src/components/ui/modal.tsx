import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";
import { HTMLAttributes, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

import { useScrollBlock } from "@/lib/hooks/use-scroll-block";

export type ModalProps = HTMLMotionProps<"div"> & {
    children: React.ReactNode;
    show: boolean;
    onClose?: () => void;
};

export function Modal({ className, show, children, onClose, ...props }: ModalProps) {
    const [blockScroll, allowScroll] = useScrollBlock();

    useEffect(() => {
        if (show) {
            blockScroll();
        } else {
            allowScroll();
        }
    }, [show, blockScroll, allowScroll]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={"fixed inset-0 z-100"}
                    initial={{ background: "rgb(0, 0, 0, 0)" }}
                    animate={{ background: "rgb(0, 0, 0, 0.6)" }}
                    exit={{ background: "rgb(0, 0, 0, 0)" }}
                    onClick={onClose}
                >
                    <motion.div
                        className={twMerge(
                            "fixed p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background w-[95%] max-w-lg rounded-md flex flex-col gap-3",
                            className,
                        )}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        {...props}
                    >
                        <div className="absolute p-1 top-4 right-4 cursor-pointer" onClick={onClose}>
                            <FaTimes />
                        </div>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export type ModalTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function ModalTitle({ className, ...props }: ModalTitleProps) {
    return <h1 className={twMerge("text-2xl font-bold", className)} {...props} />;
}
