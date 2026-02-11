import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Create unit
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { courseId, title, titleRu, description, order } = body;

        if (!courseId || !title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const unit = await prisma.courseUnit.create({
            data: {
                courseId,
                title,
                titleRu,
                description,
                order: order || 1,
            },
        });

        return NextResponse.json(unit);
    } catch (error: any) {
        console.error("Create unit error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
