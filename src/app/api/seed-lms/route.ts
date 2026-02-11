import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
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

        // Create VIDEO lesson
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

        // Create ARTICLE lesson
        await prisma.courseLesson.upsert({
            where: { id: "lesson-1-2" },
            update: {},
            create: {
                id: "lesson-1-2",
                title: "لماذا نتعلم البرمجة؟",
                titleRu: "Зачем учить программирование?",
                description: "أهمية البرمجة في العصر الحديث",
                type: "ARTICLE",
                content: `
          <h2>لماذا البرمجة مهمة؟</h2>
          <p>البرمجة أصبحت مهارة أساسية في العصر الرقمي. إليك بعض الأسباب:</p>
          <ul>
            <li><strong>فرص عمل متنوعة:</strong> شركات التقنية تبحث دائماً عن مبرمجين</li>
            <li><strong>تنمية التفكير المنطقي:</strong> البرمجة تعلمك حل المشكلات</li>
            <li><strong>إنشاء تطبيقات خاصة:</strong> يمكنك بناء أفكارك</li>
            <li><strong>الاستقلالية:</strong> العمل عن بعد والحرية المالية</li>
          </ul>
          <h3>كيف تبدأ؟</h3>
          <p>ابدأ بتعلم لغة بسيطة مثل Python، ثم تدرج للغات أخرى حسب اهتمامك.</p>
        `,
                duration: 10,
                order: 2,
                unitId: unit1.id,
            },
        });

        // Create PDF lesson
        await prisma.courseLesson.upsert({
            where: { id: "lesson-1-3" },
            update: {},
            create: {
                id: "lesson-1-3",
                title: "دليل المبتدئين - PDF",
                titleRu: "Руководство для начинающих",
                description: "ملف PDF شامل للمراجعة",
                type: "PDF",
                pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
                duration: 20,
                order: 3,
                unitId: unit1.id,
            },
        });

        // Create more lessons for unit 2
        await prisma.courseLesson.upsert({
            where: { id: "lesson-2-1" },
            update: {},
            create: {
                id: "lesson-2-1",
                title: "المتغيرات والثوابت",
                titleRu: "Переменные и константы",
                description: "تخزين البيانات",
                type: "VIDEO",
                videoUrl: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
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
                videoUrl: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
                duration: 25,
                order: 2,
                unitId: unit2.id,
            },
        });

        // Create Quiz for unit 1
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

        // Create Quiz Questions
        await prisma.quizQuestion.deleteMany({
            where: { quizId: quiz.id },
        });

        await prisma.quizQuestion.createMany({
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
                    options: ["HTML", "Python", "Photoshop", "Windows"],
                    optionsRu: ["HTML", "Python", "Photoshop", "Windows"],
                    correctIndex: 1,
                    order: 2,
                    quizId: quiz.id,
                },
                {
                    question: "ما فائدة المتغيرات في البرمجة؟",
                    questionRu: "Какова польза переменных?",
                    options: ["تخزين البيانات", "رسم الأشكال", "طباعة الورق", "تشغيل الموسيقى"],
                    optionsRu: ["Для хранения данных", "Для рисования", "Для печати", "Для музыки"],
                    correctIndex: 0,
                    order: 3,
                    quizId: quiz.id,
                },
            ],
        });

        return NextResponse.json({
            success: true,
            message: "تم إنشاء الدورة التجريبية بنجاح مع PDF واختبار!",
            courseId: course.id,
            data: {
                units: 2,
                lessons: 5,
                quizQuestions: 3,
            },
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
