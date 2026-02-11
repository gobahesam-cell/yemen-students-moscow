import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Delete question
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.quizQuestion.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete question error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update question
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const question = await prisma.quizQuestion.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(question);
    } catch (error: any) {
        console.error("Update question error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
