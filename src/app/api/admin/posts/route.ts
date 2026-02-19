import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";
import { cookies } from "next/headers";

// دالة مساعدة للتحقق من الصلاحية (لأننا استثنينا الـ middleware عن الـ API)
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await decodeSession(token);
  if (!session || session.role !== "ADMIN") return false;
  return true;
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Fetch Posts Error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // ✅ حماية الـ API يدوياً
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  const image = typeof body.image === "string" ? body.image : null;
  const category = typeof body.category === "string" ? body.category : "عام";
  const isDraft = typeof body.isDraft === "boolean" ? body.isDraft : true;
  const isPinned = typeof body.isPinned === "boolean" ? body.isPinned : false;

  if (!title) {
    return NextResponse.json({ error: "TITLE_REQUIRED" }, { status: 400 });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        titleRu: body.titleRu || null,
        contentRu: body.contentRu || null,
        categoryRu: body.categoryRu || "Общие",
        image,
        isDraft,
        isPinned,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Create Post Error:", error);
    return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });
  }
}
