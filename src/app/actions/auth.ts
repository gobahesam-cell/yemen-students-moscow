"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME } from "@/lib/session-core";

export async function logoutAction() {
    const cookieStore = await cookies();

    // 1. حذف الكوكي الرئيسية بشكل صريح مع المسار
    cookieStore.set(COOKIE_NAME, "", {
        path: "/",
        maxAge: -1, // Use -1 to expire immediately
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    });

    // 2. محاولة حذف أي نسخ في مسار /admin
    cookieStore.set(COOKIE_NAME, "", { path: "/admin", maxAge: -1, expires: new Date(0) });

    // للتأكد التام في Next.js SSR
    cookieStore.delete(COOKIE_NAME);

    // 3. إعادة التوجيه
    redirect("/login");
}
