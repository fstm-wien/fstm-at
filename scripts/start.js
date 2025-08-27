const { spawn } = require("child_process");

const { run, stop, waitForStrapi } = require("./_util");

async function main() {
    let strapiProc;
    try {
        console.log("🚀 Starting Strapi...");
        const strapiProc = spawn("yarn", ["cms:start"], {
            stdio: "inherit",
            shell: true,
        });

        process.on("SIGINT", () => strapiProc.kill("SIGINT"));
        process.on("SIGTERM", () => strapiProc.kill("SIGTERM"));
        process.on("exit", () => strapiProc.kill());

        console.log("⏳ Waiting for Strapi to be ready...");
        await waitForStrapi();
        await run("yarn", ["frontend:start"]);

        stop(strapiProc);
    } catch (err) {
        if (strapiProc) stop(strapiProc);
        process.exit(1);
    }
}

main();
