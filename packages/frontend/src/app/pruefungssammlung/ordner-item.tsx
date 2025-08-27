"use client";

import { humanFileSize } from "@/utils/human-file-size";
import { NextcloudFileInformation } from "@/utils/nextcloud";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { FaCross, FaDownload, FaTimes } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

export function OrdnerItem({ info }: { info: NextcloudFileInformation }) {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [modalHasFormatError, setModalHasFormatError] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const validateEmail = useCallback(() => {
        setModalHasFormatError(!email.endsWith("@student.tuwien.ac.at"));
    }, [email]);
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handleEmailKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMail();
        }
    };

    const sendMail = () => {
        fetch("/api/pruefungsanfrage", {
            method: "POST",
            body: JSON.stringify({ name: info.name, email }),
        }).then((res) => {
            setIsSending(false);
            if (res.ok) {
                setShowModal(false);
            }
        });
        setIsSending(true);

        setTimeout(() => {
            setIsSending(false);
        }, 1000);
    };

    return (
        <>
            <div
                key={info.name}
                className="px-2 py-2 flex flex-row gap-3 items-center bg-background hover:bg-background-emph"
            >
                <div className="flex flex-row gap-3 items-end">
                    <p>{info.name}</p>
                    <p className="text-xs pb-0.5 text-gray-400">{humanFileSize(info.size)}</p>
                </div>
                <div className="ml-auto mr-0 flex flex-row gap-2">
                    <div className="p-1 cursor-pointer opacity-30 hover:opacity-100" onClick={() => setShowModal(true)}>
                        <FaDownload />
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 bottom-0"
                        initial={{ background: "rgb(0, 0, 0, 0)" }}
                        animate={{ background: "rgb(0, 0, 0, 0.4)" }}
                        exit={{ background: "rgb(0, 0, 0, 0)" }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            className="fixed p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background w-lg rounded-md flex flex-col gap-3"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="absolute p-1 top-4 right-4 cursor-pointer"
                                onClick={() => setShowModal(false)}
                            >
                                <FaTimes />
                            </div>
                            <h1 className="text-2xl">Prüfungsordner anfragen</h1>
                            <p className="mb-2">
                                Bitte gib deine Studenten-Email-Adresse ein. <br className="mt-1" />
                                Wir schicken dir Zugriff den Prüfungsordner <b>{info.name}</b> als Link per Mail!
                            </p>
                            <div className="mb-2">
                                <div className="flex flex-row gap-2 mb-3">
                                    <input
                                        className="grow font-mono py-1 px-2 rounded-md bg-background-emph hover:bg-background-emphest"
                                        placeholder="eXXXXXXXX@student.tuwien.ac.at"
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        onBlur={validateEmail}
                                        onKeyDown={handleEmailKeydown}
                                    />
                                    <div
                                        className={clsx(
                                            "py-1 px-2 flex text-white rounded-md transition-colors",
                                            isSending || !showModal || modalHasFormatError
                                                ? "cursor-progress bg-background-emphest"
                                                : "cursor-pointer bg-orange-600 hover:bg-orange-700",
                                        )}
                                        onClick={() => sendMail()}
                                    >
                                        <IoMail className="m-auto" />
                                    </div>
                                </div>
                                {modalHasFormatError && (
                                    <p className="text-sm text-red-500">
                                        Die Email sollte im Format <code>eXXXXXXXX@student.tuwien.ac.at</code> sein.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
