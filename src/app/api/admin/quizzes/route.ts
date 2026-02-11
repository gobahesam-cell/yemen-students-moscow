import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Create quiz
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { unitId, title, titleRu, description, passingScore } = body;

        if (!unitId || !title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if unit already has a quiz
        const existingQuiz = await prisma.quiz.findUnique({
            where: { unitId },
        });

        if (existingQuiz) {
            return NextResponse.json({ error: "Unit already has a quiz" }, { status: 400 });
        }

        const quiz = await prisma.quiz.create({
            data: {
                unitId,
                title,
                titleRu,
                description,
                passingScore: passingScore || 70,
            },
        });

        return NextResponse.json(quiz);
    } catch (error: any) {
        console.error("Create quiz error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
