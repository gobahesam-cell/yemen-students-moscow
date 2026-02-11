import { prisma } from "./src/lib/db";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function check() {
    try {
        const courses = await prisma.course.findMany();
        console.log("Courses Count:", courses.length);
        console.log("Courses:", JSON.stringify(courses, null, 2));

        const materials = await prisma.courseMaterial.findMany();
        console.log("Materials Count:", materials.length);

        process.exit(0);
    } catch (err) {
        console.error("Diagnostic Error:", err);
        process.exit(1);
    }
}

check();
