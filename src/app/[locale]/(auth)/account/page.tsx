import { cookies } from "next/headers";
import { decodeSession, COOKIE_NAME } from "@/lib/session-core";
import { redirect } from "next/navigation";
import AccountPageClient from "./AccountPageClient";
import { prisma } from "@/lib/db";

export default async function AccountPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);

    if (!session) {
        redirect("/login");
    }

    // جلب أحدث البيانات من DB
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <AccountPageClient
            user={{
                name: user.name || "عضو",
                nameRu: user.nameRu || null,
                email: user.email,
                role: user.role,
                image: user.image,
                createdAt: user.createdAt.toISOString(),
                university: user.university,
                city: user.city,
                bio: user.bio,
                telegram: user.telegram,
            }}
        />
    );
}
