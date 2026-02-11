import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ count: users.length, users });
}
