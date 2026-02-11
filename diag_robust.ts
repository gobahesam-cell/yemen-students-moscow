
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function loadEnv() {
    const envPath = path.resolve(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) {
        console.error(".env file not found at", envPath);
        return;
    }
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach(line => {
        const [key, value] = line.split("=");
        if (key && value) {
            process.env[key.trim()] = value.trim().replace(/^"(.*)"$/, "$1");
        }
    });
}

loadEnv();

const prisma = new PrismaClient();

async function check() {
    try {
        console.log("Using DATABASE_URL:", process.env.DATABASE_URL?.slice(0, 20) + "...");
        const courses = await prisma.course.findMany();
        console.log("Courses Count:", courses.length);
        console.log("Courses:", JSON.stringify(courses, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Diagnostic Error:", err);
        process.exit(1);
    }
}

check();
