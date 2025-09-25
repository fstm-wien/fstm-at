import { useCallback, useEffect, useRef } from "react";

import { randomRange } from "./random";

export const useRandomInterval = (callback: () => void, minDelay: number, maxDelay: number) => {
    const timeoutId = useRef<number | null>(null);
    const savedCallback = useRef<() => void>(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const isEnabled = typeof minDelay === "number" && typeof maxDelay === "number";
        if (isEnabled) {
            const handleTick = () => {
                const nextTickAt = randomRange(minDelay, maxDelay);
                timeoutId.current = window.setTimeout(() => {
                    savedCallback.current();
                    handleTick();
                }, nextTickAt);
            };
            handleTick();
        }
        return () => {
            if (timeoutId.current) window.clearTimeout(timeoutId.current);
        };
    }, [minDelay, maxDelay]);

    const cancel = useCallback(function () {
        if (timeoutId.current) window.clearTimeout(timeoutId.current);
    }, []);

    return cancel;
};
