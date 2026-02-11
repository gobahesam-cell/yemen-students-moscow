import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { encodeSession, COOKIE_NAME } from "@/lib/session-core";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            nameRu,
            email,
            password,
            university,
            city,
            phone,
            telegram,
            agreedToTerms,
            agreedToPrivacy,
        } = body;

        // التحقق من الحقول المطلوبة
        if (!name || !email || !password) {
            return NextResponse.json({ error: "الاسم والبريد وكلمة المرور مطلوبين" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
        }

        if (!university || !city) {
            return NextResponse.json({ error: "الجامعة والمدينة مطلوبين" }, { status: 400 });
        }

        if (!agreedToTerms || !agreedToPrivacy) {
            return NextResponse.json({ error: "يجب الموافقة على الشروط وسياسة الخصوصية" }, { status: 400 });
        }

        // التحقق من وجود الحساب مسبقاً
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "البريد الإلكتروني مسجل مسبقاً" }, { status: 400 });
        }

        // تشفير كلمة المرور
        const passwordHash = await bcrypt.hash(password, 10);

        // إنشاء المستخدم مع جميع الحقول الجديدة
        const user = await prisma.user.create({
            data: {
                name,
                nameRu: nameRu || null,
                email,
                passwordHash,
                role: "MEMBER",
                university,
                city,
                phone: phone || null,
                telegram: telegram || null,
                agreedToTerms: true,
                agreedToPrivacy: true,
                dataConsentDate: new Date(),
            },
        });

        // مدة الجلسة 7 أيام
        const now = Math.floor(Date.now() / 1000);
        const exp = now + 7 * 24 * 60 * 60;

        // إنشاء الجلسة فوراً لتسجيل الدخول تلقائياً بعد التسجيل
        const token = await encodeSession({
            userId: user.id,
            email: user.email,
            name: user.name || "",
            nameRu: user.nameRu || null,
            role: user.role,
            exp,
        });

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return NextResponse.json({
            success: true,
            user: {
                name: user.name,
                role: user.role,
                university: user.university,
                city: user.city,
            }
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "حدث خطأ أثناء التسجيل" }, { status: 500 });
    }
}
