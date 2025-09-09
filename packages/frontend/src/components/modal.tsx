import { AnimatePresence, motion } from "motion/react";
import { FaTimes } from "react-icons/fa";

export function Modal({ show, children, onClose }: React.PropsWithChildren<{ show: boolean; onClose?: () => void }>) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed top-0 left-0 right-0 bottom-0 z-100"
                    initial={{ background: "rgb(0, 0, 0, 0)" }}
                    animate={{ background: "rgb(0, 0, 0, 0.6)" }}
                    exit={{ background: "rgb(0, 0, 0, 0)" }}
                    onClick={onClose}
                >
                    <motion.div
                        className="fixed p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background w-[95%] max-w-lg rounded-md flex flex-col gap-3"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
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
