import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);
    return session && session.role === "ADMIN";
}

// POST: Restore data from backup JSON
export async function POST(req: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { type, data } = body;

        if (!type || !data || !Array.isArray(data)) {
            return NextResponse.json({ error: "Invalid format" }, { status: 400 });
        }

        let restored = 0;
        let skipped = 0;

        if (type === "posts") {
            for (const post of data) {
                try {
                    // تجاهل المنشورات الموجودة بنفس العنوان
                    const exists = await prisma.post.findFirst({ where: { title: post.title } });
                    if (exists) { skipped++; continue; }

                    await prisma.post.create({
                        data: {
                            title: post.title,
                            content: post.content || "",
                            category: post.category || "عام",
                            titleRu: post.titleRu || null,
                            contentRu: post.contentRu || null,
                            categoryRu: post.categoryRu || null,
                            image: post.image || null,
                            isDraft: post.isDraft ?? true,
                            isPinned: post.isPinned ?? false,
                        },
                    });
                    restored++;
                } catch { skipped++; }
            }
        }

        if (type === "events") {
            for (const event of data) {
                try {
                    const exists = await prisma.event.findFirst({ where: { title: event.title } });
                    if (exists) { skipped++; continue; }

                    await prisma.event.create({
                        data: {
                            title: event.title,
                            description: event.description || "",
                            date: new Date(event.date),
                            location: event.location || "",
                            titleRu: event.titleRu || null,
                            descriptionRu: event.descriptionRu || null,
                            locationRu: event.locationRu || null,
                            image: event.image || null,
                            capacity: event.capacity || 0,
                        },
                    });
                    restored++;
                } catch { skipped++; }
            }
        }

        if (type === "users") {
            for (const user of data) {
                try {
                    const exists = await prisma.user.findUnique({ where: { email: user.email } });
                    if (exists) { skipped++; continue; }

                    await prisma.user.create({
                        data: {
                            name: user.name || null,
                            nameRu: user.nameRu || null,
                            email: user.email,
                            passwordHash: user.passwordHash || await bcrypt.hash("temp123456", 10),
                            role: user.role || "MEMBER",
                            image: user.image || null,
                            university: user.university || null,
                            city: user.city || null,
                            phone: user.phone || null,
                            telegram: user.telegram || null,
                            bio: user.bio || null,
                        },
                    });
                    restored++;
                } catch { skipped++; }
            }
        }

        if (type === "courses") {
            for (const course of data) {
                try {
                    if (!course.slug) { skipped++; continue; }
                    const exists = await prisma.course.findUnique({ where: { slug: course.slug } });
                    if (exists) { skipped++; continue; }

                    // Filter units from exported data (strip id, courseId, _count, etc.)
                    const unitsData = Array.isArray(course.units) ? course.units.map((unit: any) => {
                        const lessonsData = Array.isArray(unit.lessons) ? unit.lessons.map((lesson: any) => ({
                            title: lesson.title || "Untitled",
                            titleRu: lesson.titleRu || null,
                            description: lesson.description || null,
                            descriptionRu: lesson.descriptionRu || null,
                            type: lesson.type || "VIDEO",
                            videoUrl: lesson.videoUrl || null,
                            pdfUrl: lesson.pdfUrl || null,
                            content: lesson.content || null,
                            duration: lesson.duration || null,
                            order: lesson.order ?? 0,
                            isFree: lesson.isFree ?? false,
                        })) : [];

                        return {
                            title: unit.title || "Untitled",
                            titleRu: unit.titleRu || null,
                            description: unit.description || null,
                            order: unit.order ?? 0,
                            ...(lessonsData.length > 0 ? { lessons: { create: lessonsData } } : {}),
                        };
                    }) : [];

                    await prisma.course.create({
                        data: {
                            title: course.title,
                            titleRu: course.titleRu || null,
                            slug: course.slug,
                            description: course.description || "",
                            descriptionRu: course.descriptionRu || null,
                            thumbnail: course.thumbnail || null,
                            duration: course.duration || null,
                            isPublished: course.isPublished ?? false,
                            ...(unitsData.length > 0 ? { units: { create: unitsData } } : {}),
                        },
                    });
                    restored++;
                } catch (err) {
                    console.error("Course restore error:", course.slug, err);
                    skipped++;
                }
            }
        }

        return NextResponse.json({ success: true, restored, skipped });
    } catch (error) {
        console.error("Restore error:", error);
        return NextResponse.json({ error: "Restore failed" }, { status: 500 });
    }
}
