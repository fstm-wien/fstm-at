const { spawn } = require("child_process");
const http = require("http");

module.exports.stop = function (proc) {
    return new Promise((resolve) => {
        if (!proc) return resolve();

        proc.on("exit", resolve);

        if (process.platform === "win32") {
            // Windows: just kill the process
            proc.kill("SIGINT");
        } else {
            // Unix: kill the entire process group
            try {
                process.kill(-proc.pid, "SIGINT");
            } catch (err) {
                // if killing the group fails, fall back
                proc.kill("SIGINT");
            }
        }
    });
};

module.exports.run = function (command, args = [], options = {}) {
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
};

module.exports.waitForStrapi = function (timeout = 30000, interval = 1000) {
    const url = "http://localhost:1337/_health";
    return new Promise((resolve, reject) => {
        const start = Date.now();

        function check() {
            http.get(url, (res) => {
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
};
