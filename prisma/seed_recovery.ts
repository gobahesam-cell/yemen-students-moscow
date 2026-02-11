import { prisma } from "./src/lib/db";

async function main() {
    console.log("🌱 Starting recovery seed...");

    // 1. Create dummy users (if not exists)
    // Admin is already there from main seed, but let's add an Editor
    await prisma.user.upsert({
        where: { email: "editor@ysm.local" },
        update: {},
        create: {
            email: "editor@ysm.local",
            name: "محرر الجالية",
            passwordHash: "$2b$10$wKOCfVvL0eY.oN1Q6p8l0eW1C6e5T1q8v8r8r8r8r8r8r8r8r8r8r", // Dummy hash
            role: "EDITOR",
        },
    });

    // 2. Create some placeholder news
    const posts = [
        {
            title: "لقاء الطلاب اليمنيين السنوي في موسكو",
            content: "يسر الجالية اليمنية دعوتكم لحضور اللقاء السنوي لمناقشة أحوال الطلاب وتعزيز الروابط المجتمعية...",
            category: "فعاليات",
            isDraft: false,
            isPinned: true,
        },
        {
            title: "إحصائيات العام الدراسي الجديد",
            content: "شهد هذا العام زيادة ملحوظة في عدد الطلاب اليمنيين المبتعثين إلى الجامعات الروسية...",
            category: "أخبار",
            isDraft: false,
        },
        {
            title: "دليل الطالب الجديد في موسكو",
            content: "نقدم لكم الدليل الشامل لكل ما يحتاجه الطالب الجديد عند وصوله إلى العاصمة الروسية...",
            category: "تعليم",
            isDraft: false,
        }
    ];

    for (const post of posts) {
        await prisma.post.create({ data: post });
    }

    console.log("✅ Recovery data created successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
