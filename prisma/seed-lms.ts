import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding LMS data...");

    // إنشاء دورة تجريبية
    const course = await prisma.course.upsert({
        where: { slug: "intro-programming" },
        update: {},
        create: {
            slug: "intro-programming",
            title: "مقدمة في البرمجة",
            titleRu: "Введение в программирование",
            description: "دورة شاملة لتعلم أساسيات البرمجة من الصفر. ستتعلم مفاهيم البرمجة الأساسية والتفكير المنطقي وكتابة أول برنامج لك.",
            descriptionRu: "Комплексный курс для изучения основ программирования с нуля. Вы изучите основные концепции программирования, логическое мышление и напишете свою первую программу.",
            thumbnail: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800",
            duration: 180,
            isPublished: true,
        },
    });

    console.log("✅ Created course:", course.title);

    // إنشاء الوحدات
    const unit1 = await prisma.courseUnit.upsert({
        where: { id: "unit-1-intro" },
        update: {},
        create: {
            id: "unit-1-intro",
            title: "مقدمة عن البرمجة",
            titleRu: "Введение в программирование",
            description: "نظرة عامة على عالم البرمجة وأهميتها",
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
            description: "المتغيرات والأنواع والعمليات الأساسية",
            order: 2,
            courseId: course.id,
        },
    });

    console.log("✅ Created units:", unit1.title, "-", unit2.title);

    // إنشاء الدروس للوحدة الأولى
    await prisma.courseLesson.upsert({
        where: { id: "lesson-1-1" },
        update: {},
        create: {
            id: "lesson-1-1",
            title: "ما هي البرمجة؟",
            titleRu: "Что такое программирование?",
            description: "مقدمة عن مفهوم البرمجة ولغات البرمجة المختلفة",
            descriptionRu: "Введение в концепцию программирования и различные языки программирования",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
            titleRu: "Зачем изучать программирование?",
            description: "أهمية البرمجة في الحياة اليومية وسوق العمل",
            type: "ARTICLE",
            content: `
        <h2>لماذا البرمجة مهمة؟</h2>
        <p>البرمجة أصبحت مهارة أساسية في العصر الرقمي. إليك بعض الأسباب:</p>
        <ul>
          <li>فرص عمل متنوعة ومرتفعة الدخل</li>
          <li>القدرة على حل المشكلات بطرق مبتكرة</li>
          <li>إنشاء تطبيقات ومواقع خاصة بك</li>
          <li>تنمية التفكير المنطقي والنقدي</li>
        </ul>
      `,
            duration: 10,
            order: 2,
            unitId: unit1.id,
        },
    });

    await prisma.courseLesson.upsert({
        where: { id: "lesson-1-3" },
        update: {},
        create: {
            id: "lesson-1-3",
            title: "دليل البدء السريع",
            titleRu: "Руководство по быстрому старту",
            description: "ملف PDF يحتوي على خطوات البداية",
            type: "PDF",
            pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
            duration: 5,
            order: 3,
            unitId: unit1.id,
        },
    });

    // إنشاء الدروس للوحدة الثانية
    await prisma.courseLesson.upsert({
        where: { id: "lesson-2-1" },
        update: {},
        create: {
            id: "lesson-2-1",
            title: "المتغيرات والثوابت",
            titleRu: "Переменные и константы",
            description: "تعرف على كيفية تخزين البيانات",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 20,
            order: 1,
            unitId: unit2.id,
        },
    });

    await prisma.courseLesson.upsert({
        where: { id: "lesson-2-2" },
        update: {},
        create: {
            id: "lesson-2-2",
            title: "أنواع البيانات",
            titleRu: "Типы данных",
            description: "الأعداد والنصوص والقيم المنطقية",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 25,
            order: 2,
            unitId: unit2.id,
        },
    });

    console.log("✅ Created lessons");

    // إنشاء اختبار للوحدة الأولى
    const quiz = await prisma.quiz.upsert({
        where: { unitId: unit1.id },
        update: {},
        create: {
            title: "اختبار الوحدة الأولى",
            titleRu: "Тест первого модуля",
            description: "اختبر معلوماتك عن مقدمة البرمجة",
            passingScore: 70,
            unitId: unit1.id,
        },
    });

    // إنشاء أسئلة الاختبار
    await prisma.quizQuestion.createMany({
        skipDuplicates: true,
        data: [
            {
                question: "ما هي البرمجة؟",
                questionRu: "Что такое программирование?",
                options: ["كتابة قصص", "كتابة تعليمات للحاسوب", "رسم صور", "تصوير فيديو"],
                optionsRu: ["Написание историй", "Написание инструкций для компьютера", "Рисование картин", "Съемка видео"],
                correctIndex: 1,
                order: 1,
                quizId: quiz.id,
            },
            {
                question: "أي من التالي يعتبر لغة برمجة؟",
                questionRu: "Какой из следующих является языком программирования?",
                options: ["HTML", "Python", "CSS", "Photoshop"],
                optionsRu: ["HTML", "Python", "CSS", "Photoshop"],
                correctIndex: 1,
                order: 2,
                quizId: quiz.id,
            },
            {
                question: "ما هي فائدة المتغيرات في البرمجة؟",
                questionRu: "Какова польза переменных в программировании?",
                options: ["لتخزين البيانات", "لرسم الأشكال", "لطباعة الورق", "لتشغيل الموسيقى"],
                optionsRu: ["Для хранения данных", "Для рисования фигур", "Для печати бумаги", "Для воспроизведения музыки"],
                correctIndex: 0,
                order: 3,
                quizId: quiz.id,
            },
        ],
    });

    console.log("✅ Created quiz with questions");

    console.log("\n🎉 Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
