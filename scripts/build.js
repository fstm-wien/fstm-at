const { spawn } = require("child_process");

const { run, stop, waitForStrapi } = require("./_util");

async function main() {
    let strapiProc;
    try {
        console.log("📦 Building Strapi...");
        await run("yarn", ["cms:build"]);

        console.log("🚀 Starting Strapi...");
        const strapiProc = spawn("yarn", ["cms:start"], {
            stdio: "inherit",
            shell: true,
            detached: process.platform !== "win32",
        });

        process.on("SIGINT", () => strapiProc.kill("SIGINT"));
        process.on("SIGTERM", () => strapiProc.kill("SIGTERM"));
        process.on("exit", () => strapiProc.kill());

        console.log("⏳ Waiting for Strapi to be ready...");
        await waitForStrapi();

        console.log("📦 Building Next.js frontend...");
        await run("yarn", ["frontend:build"]);

        console.log("🛑 Stopping Strapi...");
        stop(strapiProc);

        console.log("✅ Done!");
    } catch (err) {
        console.error("❌ Build failed:", err.message);
        if (strapiProc) stop(strapiProc);
        process.exit(1); // ❗️ fail the pipeline
    }
}

main();
