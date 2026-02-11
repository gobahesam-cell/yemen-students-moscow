import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Only allow this if no users exist to prevent misuse
        const userCount = await prisma.user.count();

        if (userCount > 0) {
            return NextResponse.json(
                { error: "Users already exist in the database. This route is disabled for security." },
                { status: 403 }
            );
        }

        const email = "admin@ysm.local";
        const password = "Admin12345!"; // User must change this after first login
        const passwordHash = await bcrypt.hash(password, 10);

        const admin = await prisma.user.create({
            data: {
                email,
                name: "Admin",
                passwordHash,
                role: "ADMIN",
            },
        });

        return NextResponse.json({
            message: "Admin user created successfully!",
            credentials: {
                email: admin.email,
                password: password,
            },
            nextSteps: [
                "1. Login at /login",
                "2. Go to /admin",
                "3. Change your password in Account Settings",
                "4. IMPORTANT: Delete this API file (src/app/api/setup-admin/route.ts) immediately!"
            ]
        });
    } catch (error: any) {
        console.error("Setup Admin Error:", error);
        return NextResponse.json({ error: "Failed to create admin", details: error.message }, { status: 500 });
    }
}
