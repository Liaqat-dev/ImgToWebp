const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const app = express();
const PORT = 3000;

const upload = multer({ storage: multer.memoryStorage() });
app.use(express.static(path.join(__dirname, "public")));

app.post("/convert", upload.single("image"), async (req, res) => {
    try {
        const {
            quality = 80,
            effort = 4,
            preset = "",
            "compression-type": compressionType = "lossy",
        } = req.body;

        const webpOptions = {
            quality: parseInt(quality),
            effort: parseInt(effort),
        };

        if (compressionType === "lossless") {
            webpOptions.lossless = true;
        } else if (compressionType === "nearLossless") {
            webpOptions.nearLossless = true;
        }

        if (preset) {
            webpOptions.preset = preset;
        }

        const buffer = await sharp(req.file.buffer)
            .webp(webpOptions)
            .toBuffer();

        res.setHeader("Content-Type", "image/webp");
        res.setHeader("Content-Disposition", 'attachment; filename="converted.webp"');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).send("Conversion failed");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
