import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// جلب ألبوم للعرض العام (الصور المعتمدة فقط)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ albumId: string }> }
) {
    try {
        const { albumId } = await params;

        const album = await prisma.album.findUnique({
            where: {
                id: albumId,
                isPublic: true,
            },
            select: {
                id: true,
                titleAr: true,
                titleRu: true,
                description: true,
                photos: {
                    where: { isApproved: true },
                    select: {
                        id: true,
                        url: true,
                        caption: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!album) {
            return NextResponse.json(
                { error: "Album not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(album);
    } catch (error) {
        console.error("Error fetching album:", error);
        return NextResponse.json(
            { error: "Failed to fetch album" },
            { status: 500 }
        );
    }
}
