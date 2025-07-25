"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.API_KEY;
const uploadsDir = path_1.default.join(__dirname, "uploads");
promises_1.default.mkdir(uploadsDir, { recursive: true }).catch(console.error);
app.get("/", (req, res) => {
    res.send("Hello from backend server!");
});
app.post("/generate-content", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
    }
    if (!API_KEY) {
        console.error("API_KEY is missing in env");
        res
            .status(500)
            .json({ error: "Internal Server Error: API_KEY not configured" });
        return;
    }
    try {
        const response = await axios_1.default.post("https://api.imagepig.com/", { prompt }, {
            headers: {
                "Content-Type": "application/json",
                "Api-Key": API_KEY,
            },
        });
        console.log("API Response:", response.data);
        const imageData = response.data.image_data;
        if (!imageData) {
            res.status(500).json({
                error: "No image data received from API",
                apiResponse: response.data,
            });
            return;
        }
        await prisma.image.create({
            data: {
                prompt,
                imageData,
            },
        });
        res.status(200).json({
            message: "Image generated successfully",
            image_data: imageData,
        });
    }
    catch (error) {
        console.error("API Error:", error.response?.data || error.message || error);
        res.status(500).json({
            error: "Failed to generate image",
            status: error.response?.status || "unknown",
            message: error.message || "No error message available",
            details: error.response?.data || "No detailed error information",
        });
    }
});
app.get("/images", async (req, res) => {
    try {
        const images = await prisma.image.findMany();
        res.status(200).json(images);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch images" });
    }
});
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
