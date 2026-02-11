# تقرير مشروع yemen-students-moscow

تاريخ التحليل: 02 فبراير 2026

## نظرة عامة
- المشروع مبني على Next.js App Router مع TypeScript و React.
- يعتمد على Tailwind CSS، ويدعم تعدد اللغات عبر next-intl.
- يستخدم Prisma مع PostgreSQL، مع Docker Compose لقاعدة البيانات.

## البنية الرئيسية
- src/app: صفحات ومسارات التطبيق (App Router) مع مجموعات مسارات (route groups).
- src/components: مكونات واجهة المستخدم (Header, Footer, قوائم، نماذج).
- src/lib: جلسات المستخدم، قاعدة البيانات، SEO.
- prisma: المخطط (schema)، المهاجرات (migrations)، وملف seed.
- messages: ملفات الترجمة (ar.json, ru.json).
- public: أصول ثابتة.
- middleware.ts: توجيه متعدد اللغات وحماية لوحة الإدارة.

## المسارات الرئيسية (مستنتجة من الملفات)
صفحات بواجهة متعددة اللغات (مع /ar أو /ru):
- /[locale]
- /[locale]/news
- /[locale]/news/[id]
- /[locale]/events
- /[locale]/events/[id]
- /[locale]/courses
- /[locale]/courses/[slug]
- /[locale]/gallery
- /[locale]/about
- /[locale]/contact
- /[locale]/loading
- /[locale]/error
- /[locale]/not-found

صفحات عامة خارج مسار اللغة:
- /news
- /news/[id]
- /login
- /account
- /admin
- /admin/posts
- /admin/posts/new
- /admin/users

واجهات API:
- /api/auth/login
- /api/auth/logout
- /api/admin/posts
- /api/test-db

ملاحظة: تم تفعيل localePrefix="always"، لذا صفحات اللغة تتطلب /ar أو /ru.

## الميزات الأساسية
- تعدد اللغات (ar/ru) مع اختيار افتراضي للعربية.
- حماية لوحة الإدارة عبر middleware وجلسات موقّعة (HMAC) مع صلاحيات الأدوار.
- تسجيل دخول عبر API باستخدام bcrypt.
- إدارة منشورات/أخبار عبر Prisma (Post) مع خصائص isDraft و isPinned.
- صفحات محتوى: أخبار، فعاليات، دورات، معرض، عنّا، تواصل.
- صفحة حساب عضو (/account).
- بناء بيانات SEO (OG/Twitter/alternates) بحسب اللغة.
- قاعدة بيانات PostgreSQL مع إعدادات Docker Compose وملف seed لإنشاء Admin.

## قاعدة البيانات (Prisma)
- Role: ADMIN, EDITOR, INSTRUCTOR, MEMBER.
- User: معلومات المستخدم وكلمة المرور (hash) والدور.
- Post: عنوان ومحتوى وحالة نشر/تثبيت.

## إعدادات وبيئة
- متغيرات مهمة: DATABASE_URL, SESSION_SECRET, NEXT_PUBLIC_SITE_URL.
- يوجد ملف docker-compose.yml لتشغيل PostgreSQL محلياً.

## ملاحظات
- بعض التعليقات العربية تظهر مشوّهة في المخرجات الطرفية (encoding). يُفضّل التأكد من حفظ الملفات بترميز UTF-8.
- README الحالي هو README افتراضي لِـ Next.js وقد لا يصف المشروع فعلياً.
