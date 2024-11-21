const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Simple CORS configuration allowing all origins
app.use(cors({
    origin: "*",  // Allow all origins
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

// Set up multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET route
app.get("/", (req, res) => {
    res.send("Hello, everyone!");
});

// POST route to handle the image upload
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No image uploaded.");
    }

    const base64Image = req.file.buffer.toString("base64");

    axios({
        method: "POST",
        url: "https://detect.roboflow.com/pest-detection-iasio/6",
        params: {
            api_key: "MdGDiEHmvh39eJ3mCYef",
        },
        data: base64Image,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
    .then(function (response) {
        res.json(response.data);
    })
    .catch(function (error) {
        console.error("Error response:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});