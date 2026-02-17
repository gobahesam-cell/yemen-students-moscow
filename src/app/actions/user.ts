"use server";

import { cookies } from "next/headers";
import { decodeSession, COOKIE_NAME } from "@/lib/session-core";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateAvatarAction(imageUrl: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || !session.userId) {
            return { error: "غير مصرح لك بالقيام بهذا الإجراء" };
        }

        await prisma.user.update({
            where: { id: session.userId },
            data: { image: imageUrl },
            select: { id: true }
        });

        revalidatePath("/[locale]/(auth)/account", "page");
        return { success: true };
    } catch (error) {
        console.error("Update avatar error:", error);
        return { error: "فشل تحديث الصورة الشخصية" };
    }
}
