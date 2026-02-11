import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Create question
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { quizId, question, questionRu, options, optionsRu, correctIndex, order } = body;

        if (!quizId || !question || !options || options.length < 2 || correctIndex === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Get next order if not provided
        let questionOrder = order;
        if (questionOrder === undefined) {
            const lastQuestion = await prisma.quizQuestion.findFirst({
                where: { quizId },
                orderBy: { order: "desc" },
            });
            questionOrder = (lastQuestion?.order || 0) + 1;
        }

        const newQuestion = await prisma.quizQuestion.create({
            data: {
                quizId,
                question,
                questionRu: questionRu || null,
                options,
                optionsRu: optionsRu || [],
                correctIndex,
                order: questionOrder,
            },
        });

        return NextResponse.json(newQuestion);
    } catch (error: any) {
        console.error("Create question error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
