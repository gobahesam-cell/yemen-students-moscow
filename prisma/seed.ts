
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding courses...");

  const course1 = await prisma.course.upsert({
    where: { slug: "moscow-student-guide" },
    update: {},
    create: {
      slug: "moscow-student-guide",
      title: "دليل الطالب الجديد في موسكو",
      titleRu: "Гид для новых студентов في Москве",
      description: "دورة شاملة تشرح كل ما يحتاجه الطالب الجديد عند وصوله لموسكو، من السكن إلى الإجراءات القانونية.",
      descriptionRu: "Комплексный курс, объясняющий все, что нужно новому студенту по прибытии в Москву.",
      thumbnail: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg",
      materials: {
        create: [
          {
            title: "المقدمة والوصول",
            titleRu: "Введение и прибытие",
            type: "VIDEO",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            title: "دليل الإجراءات القانونية (PDF)",
            titleRu: "Гид по юридическим процедурам (PDF)",
            type: "PDF",
            url: "https://example.com/guide.pdf"
          }
        ]
      }
    }
  });

  console.log("✅ Seeded course:", course1.title);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
