import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get("secret");
        const FORCE_SECRET = "ysm_force_2026"; // Simple secret for this session

        // Only allow this if no users exist OR if the secret is provided
        const userCount = await prisma.user.count();

        if (userCount > 0 && secret !== FORCE_SECRET) {
            return NextResponse.json(
                {
                    error: "Users already exist in the database.",
                    hint: "To force admin setup/reset, add ?secret=ysm_force_2026 to the URL"
                },
                { status: 403 }
            );
        }

        const email = "admin@ysm.local";
        const password = "Admin12345!";
        const passwordHash = await bcrypt.hash(password, 10);

        // Use upsert to either create or update the admin
        const admin = await prisma.user.upsert({
            where: { email },
            update: {
                passwordHash,
                role: "ADMIN",
            },
            create: {
                email,
                name: "Admin",
                passwordHash,
                role: "ADMIN",
            },
        });

        return NextResponse.json({
            message: "Admin account is ready!",
            status: userCount > 0 ? "Updated existing admin" : "Created new admin",
            credentials: {
                email: admin.email,
                password: password,
            },
            nextSteps: [
                "1. Login at /login",
                "2. Go to /admin",
                "3. Change your password immediately",
                "4. DELETE this file: src/app/api/setup-admin/route.ts"
            ]
        });
    } catch (error: any) {
        console.error("Setup Admin Error:", error);
        return NextResponse.json({ error: "Failed to setup admin", details: error.message }, { status: 500 });
    }
}
