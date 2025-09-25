"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaLink } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import { Modal } from "@/components/modal";
import RandomWidthSkeleton from "@/components/random-width-skeleton";
import { NextcloudFileInformation } from "@/lib/nextcloud/api";
import { humanFileSize } from "@/lib/util/human-file-size";

export function OrdnerItem({ info, index }: { info?: NextcloudFileInformation; index: number }) {
    const [showForm, setShowForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [regNr, setRegNr] = useState("");
    const [formError, setFormError] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegNrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length === 0 || (Number.isInteger(parseInt(value)) && value.length <= 8)) {
            setRegNr(e.target.value);
            setFormError(![7, 8].includes(e.target.value.length));
        }
    };
    const handleRegNrKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmitForm();
        }
    };

    const handleSubmitForm = () => {
        if (formError) {
            return;
        }

        setIsSubmitting(true);
        fetch("/api/pruefungsanfrage", {
            method: "POST",
            body: JSON.stringify({ name: info?.name, regNr }),
        }).then((res) => {
            setIsSubmitting(false);
            if (res.ok) {
                setShowForm(false);
                setShowSuccess(true);
            }
        });
    };

    useEffect(() => {
        if (!showForm) {
            setRegNr("");
        }
    }, [showForm]);

    return (
        <>
            <div className="px-2 py-2 flex flex-row grow-0 gap-3 items-center bg-background hover:bg-background-emph">
                <span>{info ? info.name : <RandomWidthSkeleton inline width={240} seed={index} />}</span>
                <span className="ml-auto shrink-0 text-xs text-gray-400">
                    {info ? humanFileSize(info.size) : <RandomWidthSkeleton inline width={50} seed={index} />}
                </span>

                <div className="mr-0 flex flex-row gap-2">
                    <div
                        className={clsx(
                            "p-1 opacity-30 hover:opacity-100",
                            info ? "cursor-pointer" : "pointer-events-none",
                        )}
                        onClick={() => setShowForm(true)}
                    >
                        <FaLink />
                    </div>
                </div>
            </div>
            {info && (
                <>
                    <Modal show={showForm} onClose={() => setShowForm(false)}>
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
                                        isSubmitting || !showForm || formError
                                            ? "cursor-progress bg-background-emphest"
                                            : "cursor-pointer bg-orange-600 hover:bg-orange-700",
                                    )}
                                    onClick={handleSubmitForm}
                                >
                                    <IoMail className="m-auto" />
                                </div>
                            </div>
                            {formError && (
                                <p className="text-sm text-red-500">Die Matrikelnummer sollte 8-stellig sein.</p>
                            )}
                            <p className="mt-3 py-2 px-3 bg-yellow-400/20 text-yellow-700 rounded-lg text-sm">
                                Bitte warte nach der Anfrage ein paar Minuten und prüfe auch deinen Spam-Ordner.
                            </p>
                        </div>
                    </Modal>
                    <Modal show={showSuccess} onClose={() => setShowSuccess(false)}>
                        <div className="mr-6 flex flex-row gap-4 items-center">
                            <FaCheckCircle className="text-green-500 text-2xl shrink-0" />
                            <p>
                                Wir haben dir einen Link per Mail geschickt. Falls du nach ein paar Minuten noch nichts
                                erhalten hast, bitte prüfe auch deinen Spam-Ordner.
                            </p>
                        </div>

                        <div
                            className="mx-auto px-6 py-2 bg-orange-600 hover:bg-orange-700 cursor-pointer rounded-md text-white transition-colors font-semibold"
                            onClick={() => setShowSuccess(false)}
                        >
                            Okay!
                        </div>
                    </Modal>
                </>
            )}
        </>
    );
}
