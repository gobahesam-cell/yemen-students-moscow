// Simple seed script for LMS
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding LMS data...");

    // Create sample course
    const course = await prisma.course.upsert({
        where: { slug: "intro-programming" },
        update: {
            thumbnail: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        create: {
            slug: "intro-programming",
            title: "مقدمة في البرمجة",
            titleRu: "Введение в программирование",
            description: "دورة شاملة لتعلم أساسيات البرمجة من الصفر. ستتعلم مفاهيم البرمجة الأساسية والتفكير المنطقي وكتابة أول برنامج لك.",
            descriptionRu: "Комплексный курс для изучения основ программирования с нуля.",
            thumbnail: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
    });

    console.log("✅ Course created:", course.id);

    // Create units
    const unit1 = await prisma.courseUnit.upsert({
        where: { id: "unit-1-intro" },
        update: {},
        create: {
            id: "unit-1-intro",
            title: "مقدمة عن البرمجة",
            titleRu: "Введение",
            description: "نظرة عامة على عالم البرمجة",
            order: 1,
            courseId: course.id,
        },
    });

    const unit2 = await prisma.courseUnit.upsert({
        where: { id: "unit-2-basics" },
        update: {},
        create: {
            id: "unit-2-basics",
            title: "المفاهيم الأساسية",
            titleRu: "Основные концепции",
            description: "المتغيرات والأنواع",
            order: 2,
            courseId: course.id,
        },
    });

    console.log("✅ Units created");

    // Create lessons
    await prisma.courseLesson.upsert({
        where: { id: "lesson-1-1" },
        update: {},
        create: {
            id: "lesson-1-1",
            title: "ما هي البرمجة؟",
            titleRu: "Что такое программирование?",
            description: "مقدمة عن مفهوم البرمجة",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
            duration: 15,
            order: 1,
            isFree: true,
            unitId: unit1.id,
        },
    });

    await prisma.courseLesson.upsert({
        where: { id: "lesson-1-2" },
        update: {},
        create: {
            id: "lesson-1-2",
            title: "لماذا نتعلم البرمجة؟",
            titleRu: "Зачем учить программирование?",
            description: "أهمية البرمجة",
            type: "ARTICLE",
            content: "<h2>لماذا البرمجة مهمة؟</h2><p>البرمجة أصبحت مهارة أساسية في العصر الرقمي.</p>",
            duration: 10,
            order: 2,
            unitId: unit1.id,
        },
    });

    await prisma.courseLesson.upsert({
        where: { id: "lesson-2-1" },
        update: {},
        create: {
            id: "lesson-2-1",
            title: "المتغيرات والثوابت",
            titleRu: "Переменные",
            description: "تخزين البيانات",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
            duration: 20,
            order: 1,
            unitId: unit2.id,
        },
    });

    console.log("✅ Lessons created");
    console.log("🎉 Seeding completed!");
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
