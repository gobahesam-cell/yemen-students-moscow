import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

async function listModels() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        console.error("GOOGLE_AI_API_KEY is missing");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // The SDK doesn't have a direct listModels, we usually use the REST API for that
        // But we can try to get a model and see if it fails early
        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Model object created. Testing generation...");
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash!");
    } catch (error: any) {
        console.error("Error with gemini-1.5-flash:", error.message);
        console.log("---");
        console.log("Testing gemini-pro...");
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hello");
            console.log("Success with gemini-pro!");
        } catch (err2: any) {
            console.error("Error with gemini-pro:", err2.message);
        }
    }
}

listModels();
