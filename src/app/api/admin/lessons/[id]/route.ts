import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Delete lesson
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.courseLesson.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete lesson error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update lesson
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const lesson = await prisma.courseLesson.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(lesson);
    } catch (error: any) {
        console.error("Update lesson error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
