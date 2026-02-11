import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Delete unit
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.courseUnit.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete unit error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update unit
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const unit = await prisma.courseUnit.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(unit);
    } catch (error: any) {
        console.error("Update unit error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
