import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import ProfileSettingsClient from "./ProfileSettingsClient";

export default async function ProfileSettingsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/ar/login");
    }

    const user = await prisma.user.findUnique({
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

    if (!user) {
        redirect("/ar/login");
    }

    return <ProfileSettingsClient user={user} />;
}
