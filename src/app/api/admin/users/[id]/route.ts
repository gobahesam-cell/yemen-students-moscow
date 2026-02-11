import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);
    return session && session.role === "ADMIN";
}

type Ctx = { params: Promise<{ id: string }> };

// DELETE User
export async function DELETE(_: Request, ctx: Ctx) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    try {
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

// UPDATE User (Role or Password)
export async function PATCH(req: Request, ctx: Ctx) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;
    const body = await req.json();
    const { role, password, name } = body;

    try {
        const data: any = {};
        if (role) data.role = role;
        if (name) data.name = name;
        if (password) {
            data.passwordHash = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            select: { id: true, name: true, email: true, role: true },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
