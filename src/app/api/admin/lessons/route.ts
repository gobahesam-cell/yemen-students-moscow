import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Create lesson
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { unitId, title, titleRu, description, type, videoUrl, pdfUrl, content, duration, order, isFree } = body;

        if (!unitId || !title || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const lesson = await prisma.courseLesson.create({
            data: {
                unitId,
                title,
                titleRu,
                description,
                type,
                videoUrl,
                pdfUrl,
                content,
                duration: duration || 10,
                order: order || 1,
                isFree: isFree || false,
            },
        });

        return NextResponse.json(lesson);
    } catch (error: any) {
        console.error("Create lesson error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
