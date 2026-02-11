import { prisma } from "@/lib/db";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, Calendar, FolderOpen } from "lucide-react";

export default async function GalleryPage() {
  const locale = await getLocale();
  const isArabic = locale === "ar";

  const albums = await prisma.album.findMany({
    where: { isPublic: true },
    include: {
      _count: {
        select: { photos: { where: { isApproved: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full mb-4">
            <ImageIcon className="text-purple-500" size={18} />
            <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">
              {isArabic ? "معرض الصور" : "Фотогалерея"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            {isArabic ? "ألبوماتنا" : "Наши альбомы"}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {isArabic
              ? "اكتشف لحظاتنا المميزة من الفعاليات والأنشطة"
              : "Откройте для себя наши особенные моменты с мероприятий и активностей"}
          </p>
        </div>

        {/* Albums Grid */}
        {albums.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="text-slate-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {isArabic ? "لا توجد ألبومات حالياً" : "Альбомов пока нет"}
            </h3>
            <p className="text-slate-500">
              {isArabic ? "سيتم إضافة الصور قريباً" : "Фотографии будут добавлены скоро"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/${locale}/gallery/${album.id}`}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                  {album.coverImage ? (
                    <Image
                      src={album.coverImage}
                      alt={isArabic ? album.titleAr : album.titleRu || album.titleAr}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FolderOpen className="text-slate-300 dark:text-slate-600" size={60} />
                    </div>
                  )}

                  {/* Photo Count Badge */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm flex items-center gap-1.5">
                    <ImageIcon size={14} />
                    <span>{album._count.photos}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {isArabic ? album.titleAr : album.titleRu || album.titleAr}
                  </h3>

                  {album.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                      {album.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={12} />
                    {new Date(album.createdAt).toLocaleDateString(
                      isArabic ? "ar-SA" : "ru-RU"
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}