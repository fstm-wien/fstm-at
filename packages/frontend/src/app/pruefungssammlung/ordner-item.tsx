"use client";

import { humanFileSize } from "@/lib/util/human-file-size";
import { NextcloudFileInformation } from "@/utils/nextcloud";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { FaLink, FaTimes } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

export function OrdnerItem({ info }: { info: NextcloudFileInformation }) {
    const [showModal, setShowModal] = useState(false);
    const [regNr, setRegNr] = useState("");
    const [modalHasFormatError, setModalHasFormatError] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const handleRegNrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,8}$/.test(value)) {
            setRegNr(e.target.value);
            setModalHasFormatError(e.target.value.length !== 8);
        }
    };
    const handleRegNrKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMail();
        }
    };

    const handleSendMail = useCallback(() => {
        if (modalHasFormatError) {
            return;
        }

        setIsSending(true);
        fetch("/api/pruefungsanfrage", {
            method: "POST",
            body: JSON.stringify({ name: info.name, regNr }),
        }).then((res) => {
            setIsSending(false);
            if (res.ok) {
                setShowModal(false);
            }
        });
    }, [info.name, regNr, modalHasFormatError]);

    useEffect(() => {
        if (!showModal) {
            setRegNr("");
        }
    }, [showModal]);

    return (
        <>
            <div
                key={info.name}
                className="px-2 py-2 flex flex-row gap-3 items-center bg-background hover:bg-background-emph"
            >
                <p>{info.name}</p>
                <p className="ml-auto shrink-0 text-xs text-gray-400">{humanFileSize(info.size)}</p>
                <div className="mr-0 flex flex-row gap-2">
                    <div className="p-1 cursor-pointer opacity-30 hover:opacity-100" onClick={() => setShowModal(true)}>
                        <FaLink />
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 bottom-0 z-20"
                        initial={{ background: "rgb(0, 0, 0, 0)" }}
                        animate={{ background: "rgb(0, 0, 0, 0.6)" }}
                        exit={{ background: "rgb(0, 0, 0, 0)" }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            className="fixed p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background w-[95%] max-w-lg rounded-md flex flex-col gap-3"
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
                            <div>
                                <p className="mb-1">
                                    Wir schicken dir den Zugriff auf den Prüfungsordner <b>{info.name}</b> als Link per
                                    Mail! Dieser ist dann 14 Tage gültig.
                                </p>
                                <p className="mb-1">Bitte gib dazu deine Matrikelnummer ein.</p>
                            </div>
                            <div className="mb-2">
                                <div className="flex flex-row gap-1 mb-3 items-center">
                                    <p className="font-mono text-gray-400 select-none">e</p>
                                    <input
                                        className="font-mono py-1 px-2 w-24 rounded-md border-1 border-gray-400"
                                        placeholder="XXXXXXXX"
                                        value={regNr}
                                        onChange={handleRegNrChange}
                                        onKeyDown={handleRegNrKeydown}
                                    />
                                    <p className="font-mono text-gray-400 select-none mr-3">
                                        <span>@student</span>
                                        <span className="hidden lg:inline">.tuwien.ac.at</span>
                                        <span className="inline lg:hidden">.tu...</span>
                                    </p>
                                    <div
                                        className={clsx(
                                            "ml-auto py-1 px-2 self-stretch flex text-white rounded-md transition-colors",
                                            isSending || !showModal || modalHasFormatError
                                                ? "cursor-progress bg-background-emphest"
                                                : "cursor-pointer bg-orange-600 hover:bg-orange-700",
                                        )}
                                        onClick={handleSendMail}
                                    >
                                        <IoMail className="m-auto" />
                                    </div>
                                </div>
                                {modalHasFormatError && (
                                    <p className="text-sm text-red-500">Die Matrikelnummer sollte 8-stellig sein.</p>
                                )}
                                <p className="mt-3 py-2 px-3 bg-yellow-400/20 text-yellow-700 rounded-lg text-sm">
                                    Bitte warte nach der Anfrage ein paar Minuten und prüfe auch deinen Spam-Ordner.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
