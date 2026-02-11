import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      titleRu: true,
      contentRu: true,
      categoryRu: true,
      image: true,
      isDraft: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!post) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  return NextResponse.json({ ok: true, post });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });

  const body = await req.json().catch(() => ({}));

  const updated = await prisma.post.update({
    where: { id },
    data: {
      title: body.title,
      content: body.content,
      category: body.category,
      titleRu: body.titleRu,
      contentRu: body.contentRu,
      categoryRu: body.categoryRu,
      image: body.image,
      isDraft: body.isDraft,
      isPinned: body.isPinned,
    },
    select: {
      id: true,
      title: true,
      content: true,
      titleRu: true,
      contentRu: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ ok: true, post: updated });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });

  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
