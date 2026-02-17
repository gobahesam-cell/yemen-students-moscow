import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import ProfileSettingsClient from "./ProfileSettingsClient";

export default async function ProfileSettingsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/ar/login");
    }

    let user: any;
    try {
        user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                name: true,
                nameRu: true,
                email: true,
                image: true,
                university: true,
                city: true,
                bio: true,
                phone: true,
                telegram: true,
            },
        });
    } catch {
        // fallback
        const basic = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { id: true, name: true, email: true },
        });
        if (basic) {
            user = {
                ...basic,
                nameRu: null,
                image: null,
                university: null,
                city: null,
                bio: null,
                phone: null,
                telegram: null,
            };
        }
    }

    if (!user) {
        redirect("/ar/login");
    }

    return <ProfileSettingsClient user={user} />;
}
