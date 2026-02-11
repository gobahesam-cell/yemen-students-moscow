import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export async function GET() {
    try {
        const email = "admin@ysm.local";
        const password = "Admin12345!";
        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name: "Admin",
                passwordHash,
                role: "ADMIN" as Role,
            }
        });

        return NextResponse.json({ success: true, message: "Admin created" });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
