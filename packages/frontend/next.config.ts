import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/l/:path*",
                destination: "/links/:path*",
            },
        ];
    },
    async headers() {
        return [
            {
                source: "/:path*{/}?",
                headers: [
                    {
                        key: "X-Accel-Buffering",
                        value: "no",
                    },
                ],
            },
        ];
    },
    output: "standalone",
    outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
