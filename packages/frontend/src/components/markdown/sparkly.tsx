"use client";

import { CSSProperties, useState } from "react";

import { randomRange } from "@/lib/util/random";
import { useRandomInterval } from "@/lib/util/use-random-interval";

function SparkleStar({ color, size, style }: { color: string; size: number; style: CSSProperties }) {
    return (
        <span
            className="absolute pointer-events-none animate-[growAndShrink_1s_ease-in-out_forwards] z-10 -translate-x-0.5 -translate-y-0.5"
            style={style}
        >
            <svg
                className="animate-[spin_1s_linear_forwards]"
                width={size}
                height={size}
                fill="none"
                viewBox="0 0 160 160"
            >
                <path
                    d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
                    fill={color}
                />
            </svg>
        </span>
    );
}

// Default color is a bright yellow
const DEFAULT_COLOR = "hsl(50deg, 100%, 50%)";
const generateSparkle = (color = DEFAULT_COLOR): SparkleData => {
    return {
        id: String(randomRange(100000, 999999)),
        createdAt: Date.now(),
        color,
        size: randomRange(10, 20),
        style: {
            top: randomRange(0, 100) + "%",
            left: randomRange(0, 100) + "%",
            zIndex: 2,
        },
    };
};

type SparkleData = {
    id: string;
    createdAt: number;
    color: string;
    size: number;
    style: CSSProperties;
};

export function Sparkly({ children }: React.PropsWithChildren) {
    const [sparkles, setSparkles] = useState<SparkleData[]>([]);

    useRandomInterval(
        () => {
            const now = Date.now();
            const sparkle = generateSparkle();
            const nextSparkles = sparkles.filter((sparkle) => {
                const delta = now - sparkle.createdAt;
                return delta < 1000;
            });
            nextSparkles.push(sparkle);
            setSparkles(nextSparkles);
        },
        100,
        500,
    );

    return (
        <span className="relative inline-block">
            {sparkles.map((sparkle) => (
                <SparkleStar key={sparkle.id} color={sparkle.color} size={sparkle.size} style={sparkle.style} />
            ))}
            <strong className="gradientText">{children}</strong>
        </span>
    );
}
