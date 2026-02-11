import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all courses
export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                units: {
                    include: {
                        lessons: true,
                        quiz: true,
                    },
                },
                _count: {
                    select: { enrollments: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error("Get courses error:", error);
        return NextResponse.json({ error: "Failed to get courses" }, { status: 500 });
    }
}

// POST create course
export async function POST(request: Request) {
    try {
        const data = await request.json();

        const course = await prisma.course.create({
            data: {
                title: data.title,
                titleRu: data.titleRu,
                slug: data.slug,
                description: data.description,
                descriptionRu: data.descriptionRu,
                thumbnail: data.thumbnail,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error("Create course error:", error);
        return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
    }
}
