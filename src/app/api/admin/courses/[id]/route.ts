import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET single course
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                units: {
                    include: {
                        lessons: true,
                        quiz: {
                            include: {
                                questions: true,
                            },
                        },
                    },
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error) {
        console.error("Get course error:", error);
        return NextResponse.json({ error: "Failed to get course" }, { status: 500 });
    }
}

// PUT update course
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const data = await request.json();

    try {
        const course = await prisma.course.update({
            where: { id },
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
        console.error("Update course error:", error);
        return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
    }
}

// DELETE course
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Delete in order: progress -> enrollments -> questions -> quizAttempts -> quizzes -> lessons -> units -> course

        // Get all units and lessons for this course
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                units: {
                    include: {
                        lessons: true,
                        quiz: true,
                    },
                },
                enrollments: true,
            },
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const lessonIds = course.units.flatMap(u => u.lessons.map(l => l.id));
        const quizIds = course.units.filter(u => u.quiz).map(u => u.quiz!.id);
        const unitIds = course.units.map(u => u.id);

        // Delete lesson progress
        await prisma.lessonProgress.deleteMany({
            where: { lessonId: { in: lessonIds } },
        });

        // Delete enrollments
        await prisma.courseEnrollment.deleteMany({
            where: { courseId: id },
        });

        // Delete quiz attempts
        if (quizIds.length > 0) {
            await prisma.quizAttempt.deleteMany({
                where: { quizId: { in: quizIds } },
            });

            // Delete quiz questions
            await prisma.quizQuestion.deleteMany({
                where: { quizId: { in: quizIds } },
            });

            // Delete quizzes
            await prisma.quiz.deleteMany({
                where: { id: { in: quizIds } },
            });
        }

        // Delete lessons
        await prisma.courseLesson.deleteMany({
            where: { unitId: { in: unitIds } },
        });

        // Delete units
        await prisma.courseUnit.deleteMany({
            where: { courseId: id },
        });

        // Delete course
        await prisma.course.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete course error:", error);
        return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
    }
}
