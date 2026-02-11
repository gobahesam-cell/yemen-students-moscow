import { prisma } from "@/lib/db";
import Link from "next/link";
import { ImageIcon, FolderOpen, Clock, CheckCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AdminMediaPage() {
  const t = await getTranslations("Admin.media");

  // إحصائيات
  const [albumCount, photoCount, pendingCount, approvedCount] = await Promise.all([
    prisma.album.count(),
    prisma.photo.count(),
    prisma.photo.count({ where: { isApproved: false } }),
    prisma.photo.count({ where: { isApproved: true } }),
  ]);

  const stats = [
    {
      label: t("albums"),
      value: albumCount,
      icon: FolderOpen,
      color: "bg-blue-500",
      href: "/admin/media/albums",
    },
    {
      label: t("allPhotos"),
      value: photoCount,
      icon: ImageIcon,
      color: "bg-purple-500",
      href: "/admin/media/photos",
    },
    {
      label: t("pending"),
      value: pendingCount,
      icon: Clock,
      color: "bg-amber-500",
      href: "/admin/media/pending",
    },
    {
      label: t("approved"),
      value: approvedCount,
      icon: CheckCircle,
      color: "bg-emerald-500",
      href: "/admin/media/photos?approved=true",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-800 via-purple-900 to-slate-950 rounded-3xl p-8 lg:p-10 border border-purple-700/50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <ImageIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
              <p className="text-purple-200 text-sm">{t("subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 ${stat.color} rounded-xl text-white`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          {t("quickActions")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/media/albums/new"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:opacity-90 transition-opacity"
          >
            <FolderOpen size={24} />
            <span className="font-bold">{t("newAlbum")}</span>
          </Link>

          <Link
            href="/admin/media/pending"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white hover:opacity-90 transition-opacity"
          >
            <Clock size={24} />
            <span className="font-bold">{t("reviewPending")} ({pendingCount})</span>
          </Link>

          <Link
            href="/admin/media/photos"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white hover:opacity-90 transition-opacity"
          >
            <ImageIcon size={24} />
            <span className="font-bold">{t("allPhotos")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
