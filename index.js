const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

// Configure CORS to allow specific origins
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Add your front-end origins
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true // Allow credentials if needed
}));

// Set up multer for image upload (in memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET route to display "Hello, everyone!"
app.get("/", (req, res) => {
    res.send("Hello, everyone!");
});

// POST route to handle the image upload
app.post("/upload", upload.single("image"), (req, res) => {
    // Check if the image is uploaded
    if (!req.file) {
        return res.status(400).send("No image uploaded.");
    }

    // Convert the image buffer to a base64-encoded string
    const base64Image = req.file.buffer.toString("base64");

    // Send the base64-encoded image to the Roboflow API
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
            // Return the response from Roboflow API as JSON
            res.json(response.data);
        })
        .catch(function (error) {
            // Log the error response and send it to the client
            console.error("Error response:", error.response?.data || error.message);
            res.status(500).json({ error: error.response?.data || error.message });
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
