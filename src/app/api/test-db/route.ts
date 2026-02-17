import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const columns: any = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User'
    `;

    return NextResponse.json({ columns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
