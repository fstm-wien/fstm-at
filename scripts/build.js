const { spawn } = require("child_process");
const http = require("http");

function run(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, args, {
            stdio: "inherit",
            shell: true,
            ...options,
        });
        proc.on("close", (code) => {
            if (code !== 0) reject(new Error(`${command} failed`));
            else resolve();
        });
    });
}

function waitForStrapi(url, timeout = 30000, interval = 1000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        function check() {
            http.get(url, (res) => {
                // console.log(res);
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    resolve();
                } else {
                    retry();
                }
            }).on("error", retry);
        }

        function retry() {
            if (Date.now() - start > timeout) {
                reject(new Error("Strapi did not become ready in time"));
            } else {
                setTimeout(check, interval);
            }
        }

        check();
    });
}

async function main() {
    let strapiProc;
    try {
        console.log("📦 Building Strapi...");
        await run("yarn", ["cms:build"]);

        console.log("🚀 Starting Strapi...");
        const strapiProc = spawn("yarn", ["cms:start"], {
            stdio: "inherit",
            shell: true,
        });

        // Ensure Strapi is killed on exit
        process.on("SIGINT", () => strapiProc.kill("SIGINT"));
        process.on("SIGTERM", () => strapiProc.kill("SIGTERM"));
        process.on("exit", () => strapiProc.kill());

        console.log("⏳ Waiting for Strapi to be ready...");
        await waitForStrapi("http://localhost:1337/_health");

        console.log("📦 Building Next.js frontend...");
        await run("yarn", ["frontend:build"]);

        console.log("🛑 Stopping Strapi...");
        strapiProc.kill("SIGINT");

        console.log("✅ Done!");
    } catch (err) {
        console.error("❌ Build failed:", err.message);
        if (strapiProc) strapiProc.kill("SIGINT");
        process.exit(1); // ❗️ fail the pipeline
    }
}

main();
