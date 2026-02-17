import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";

// دالة للتحقق من صلاحية الأدمن
async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);
    return session && session.role === "ADMIN";
}

export async function GET() {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        let users;
        try {
            // محاولة جلب كل الحقول
            users = await prisma.user.findMany({
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    nameRu: true,
                    role: true,
                    createdAt: true,
                    image: true,
                    university: true,
                    city: true,
                    lastSeenAt: true,
                    _count: {
                        select: {
                            rsvps: true,
                            enrollments: true,
                            photos: true,
                        }
                    }
                },
            });
        } catch {
            // إذا فشل، جلب الحقول الأساسية فقط
            console.log("Falling back to basic user list");
            const basicUsers = await prisma.user.findMany({
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                },
            });
            users = basicUsers.map(u => ({
                ...u,
                nameRu: null,
                image: null,
                university: null,
                city: null,
                lastSeenAt: null,
                _count: { rsvps: 0, enrollments: 0, photos: 0 },
            }));
        }

        // Compute isOnline dynamically
        const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;
        const now = Date.now();
        const usersWithOnlineStatus = users.map((user: any) => ({
            ...user,
            isOnline: user.lastSeenAt ? (now - new Date(user.lastSeenAt).getTime()) < ONLINE_THRESHOLD_MS : false,
        }));

        return NextResponse.json(usersWithOnlineStatus);
    } catch (error) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, email, password, role } = body;

        // validation
        if (!email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // check duplicate
        const existing = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
            },
            select: { id: true, email: true, name: true, role: true },
        });

        return NextResponse.json(newUser);
    } catch (error) {
        console.error("Create User Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
