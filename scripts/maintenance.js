const express = require("express");
const path = require("path");
const { fileURLToPath } = require("url");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

const frontendDirPath = path.join(__dirname, "..", "packages", "frontend");

app.use(express.static(path.join(frontendDirPath, "public")));
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDirPath, "static", "maintenance.html"));
});

app.listen(port, () => {
    console.log(`Maintenance page viewable at http://localhost:${port}/`);
});
