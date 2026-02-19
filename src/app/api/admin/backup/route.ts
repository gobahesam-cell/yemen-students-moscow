import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";
import { cookies } from "next/headers";

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);
    return session && session.role === "ADMIN";
}

// GET: Export all data as JSON
export async function GET() {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [posts, events, users, courses] = await Promise.all([
            prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
            prisma.event.findMany({ orderBy: { createdAt: "desc" } }),
            prisma.user.findMany({
                orderBy: { createdAt: "desc" },
                select: {
                    id: true, name: true, nameRu: true, email: true, role: true, image: true,
                    university: true, city: true, phone: true, telegram: true, bio: true,
                    birthday: true, createdAt: true,
                },
            }),
            prisma.course.findMany({
                include: {
                    units: {
                        include: {
                            lessons: true,
                            quiz: { include: { questions: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return NextResponse.json({
            exportDate: new Date().toISOString(),
            version: "1.0",
            data: { posts, events, users, courses },
            counts: {
                posts: posts.length,
                events: events.length,
                users: users.length,
                courses: courses.length,
            },
        });
    } catch (error) {
        console.error("Backup export error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
