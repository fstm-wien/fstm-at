"use client";

import clsx from "clsx";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaLink, FaSearch } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import RandomWidthSkeleton from "@/components/random-width-skeleton";
import { Modal, ModalTitle } from "@/components/ui/modal";
import type { NextcloudFileInformation } from "@/lib/nextcloud/api";
import { humanFileSize } from "@/lib/util/human-file-size";

import { IconButton } from "./ui/button";

enum ResponseType {
    Success,
    UnknownError,
    TooManyRequests,
}

export type ExamData = {
    name: string;
    size: number;
};

export type ExamListProps = {
    files?: (ExamData | null)[];
};

export function ExamList({ files }: ExamListProps) {
    const [filter, setFilter] = useState("");

    const filteredFiles = useMemo(() => {
        if (!filter) {
            return files;
        }

        const lowercaseFilter = filter.toLowerCase();
        return files?.filter((f) => f?.name.toLocaleLowerCase().includes(lowercaseFilter));
    }, [files, filter]);

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    return (
        <div className="not-prose">
            <div className="relative mb-2">
                <input
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-sm bg-background text-gray-700 dark:text-white focus:outline-none"
                    type="text"
                    onChange={handleFilterChange}
                    value={filter}
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" />
            </div>
            <div className="flex flex-col divide-y divide-background-emphest">
                {filteredFiles &&
                    filteredFiles.map((f, i) => <ExamListItem key={f?.name ?? i} info={f ?? undefined} index={i} />)}
            </div>
        </div>
    );
}

export function ExamListItem({ info, index }: { info?: NextcloudFileInformation; index: number }) {
    const [showForm, setShowForm] = useState(false);
    const [responseType, setResponseType] = useState<ResponseType | undefined>(undefined);

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
        fetch("/api/exams/request", {
            method: "POST",
            body: JSON.stringify({
                folder: info?.name,
                matriculationNr: regNr,
            }),
        }).then((res) => {
            setIsSubmitting(false);
            setShowForm(false);

            if (res.ok) {
                setResponseType(ResponseType.Success);
            } else if (res.status === 429) {
                setResponseType(ResponseType.TooManyRequests);
            } else {
                setResponseType(ResponseType.UnknownError);
            }
        });
    };

    const clearResponseType = () => setResponseType(undefined);

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
                        <ModalTitle>Prüfungsordner anfragen</ModalTitle>
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
                                <IconButton
                                    disabled={isSubmitting || !showForm || formError}
                                    className={clsx("mr-0 ml-auto", isSubmitting && "!cursor-progress")}
                                    onClick={handleSubmitForm}
                                >
                                    <IoMail className="m-auto" />
                                </IconButton>
                            </div>
                            {formError && (
                                <p className="text-sm text-red-500">Die Matrikelnummer sollte 8-stellig sein.</p>
                            )}
                            <p className="mt-3 py-2 px-3 bg-yellow-400/20 text-yellow-700 rounded-lg text-sm">
                                Bitte warte nach der Anfrage ein paar Minuten und prüfe auch deinen Spam-Ordner.
                            </p>
                        </div>
                    </Modal>
                    <Modal show={responseType === ResponseType.Success} onClose={clearResponseType}>
                        <div className="mr-6 flex flex-row gap-4 items-center">
                            <FaCheckCircle className="text-green-500 text-2xl shrink-0" />
                            <p>
                                Wir haben dir einen Link per Mail geschickt. Falls du nach ein paar Minuten noch nichts
                                erhalten hast, bitte prüfe auch deinen Spam-Ordner.
                            </p>
                        </div>

                        <div
                            className="mx-auto px-6 py-2 bg-orange-600 hover:bg-orange-700 cursor-pointer rounded-md text-white transition-colors font-semibold"
                            onClick={clearResponseType}
                        >
                            Okay!
                        </div>
                    </Modal>
                    <Modal show={responseType === ResponseType.UnknownError} onClose={clearResponseType}>
                        <div className="mr-6 flex flex-row gap-4 items-center">
                            <FaExclamationCircle className="text-red-500 text-2xl shrink-0" />
                            <p>
                                Es ist ein Fehler aufgetreteten. Falls dies öfter passiert, bitte lass es uns per Email
                                wissen!
                            </p>
                        </div>

                        <div
                            className="mx-auto px-6 py-2 bg-orange-600 hover:bg-orange-700 cursor-pointer rounded-md text-white transition-colors font-semibold"
                            onClick={clearResponseType}
                        >
                            Okay!
                        </div>
                    </Modal>
                    <Modal show={responseType === ResponseType.TooManyRequests} onClose={clearResponseType}>
                        <div className="mr-6 flex flex-row gap-4 items-center">
                            <FaExclamationCircle className="text-orange-500 text-2xl shrink-0" />
                            <p>
                                Es wurden bereits 5 Prüfungen dieses Monat für diese Matrikelnummer angefordert. Falls
                                du noch mehr anfordern möchtest, bitte schreib uns eine Email diesbezüglich oder komm in
                                der Fachschaft vorbei!
                            </p>
                        </div>

                        <div
                            className="mx-auto px-6 py-2 bg-orange-600 hover:bg-orange-700 cursor-pointer rounded-md text-white transition-colors font-semibold"
                            onClick={clearResponseType}
                        >
                            Okay!
                        </div>
                    </Modal>
                </>
            )}
        </>
    );
}
