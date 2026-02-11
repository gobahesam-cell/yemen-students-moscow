"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Clock, ArrowLeft, Pin, Tag, Search, X } from "lucide-react";
import { useState } from "react";

interface Post {
    id: string;
    title: string;
    content: string;
    image: string | null;
    category: string | null;
    isPinned: boolean;
    createdAt: string;
}

interface NewsGridProps {
    posts: Post[];
    locale: string;
}

export default function NewsGrid({ posts, locale }: NewsGridProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Get unique categories
    const categories = [...new Set(posts.map(p => p.category).filter(Boolean))] as string[];

    // Filter posts
    const filteredPosts = posts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.content.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Separate pinned from regular posts
    const pinnedPosts = filteredPosts.filter(p => p.isPinned);
    const regularPosts = filteredPosts.filter(p => !p.isPinned);

    const isRTL = locale === "ar";
    const Arrow = isRTL ? undefined : ArrowLeft;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (posts.length === 0) {
        return (
            <section className="mx-auto max-w-6xl px-4 py-20">
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <div className="text-6xl mb-4">📰</div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {locale === "ar" ? "لا توجد أخبار بعد" : "Пока нет новостей"}
                    </h2>
                    <p className="text-slate-500">
                        {locale === "ar"
                            ? "سيتم نشر الأخبار هنا فور إضافتها من لوحة التحكم."
                            : "Новости появятся здесь после добавления через админ-панель."}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-10">
            {/* Search & Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col sm:flex-row gap-4"
            >
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={locale === "ar" ? "ابحث في الأخبار..." : "Искать новости..."}
                        className="w-full h-12 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedCategory
                                ? "bg-yellow-500 text-black"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                        >
                            {locale === "ar" ? "الكل" : "Все"}
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                    ? "bg-yellow-500 text-black"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Pin size={18} className="text-yellow-500" />
                        <h3 className="font-bold text-slate-900 dark:text-white">
                            {locale === "ar" ? "أخبار مهمة" : "Важные новости"}
                        </h3>
                    </div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-4"
                    >
                        {pinnedPosts.map((post) => (
                            <NewsCard key={post.id} post={post} locale={locale} isPinned />
                        ))}
                    </motion.div>
                </div>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {regularPosts.map((post) => (
                        <NewsCard key={post.id} post={post} locale={locale} />
                    ))}
                </motion.div>
            )}

            {/* No Results */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500">
                        {locale === "ar" ? "لا توجد نتائج" : "Нет результатов"}
                    </p>
                </div>
            )}
        </section>
    );
}

function NewsCard({ post, locale, isPinned = false }: { post: Post; locale: string; isPinned?: boolean }) {
    // Stripping HTML for the excerpt
    const plainText = post.content.replace(/<[^>]*>?/gm, '');
    const excerpt = plainText.length > 120 ? plainText.slice(0, 120) + "…" : plainText;
    const date = new Date(post.createdAt);

    return (
        <motion.article
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5 }}
            className={`group bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden ${isPinned
                ? "border-yellow-300 dark:border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                : "border-slate-200 dark:border-slate-800 hover:border-yellow-300 dark:hover:border-yellow-500/30 hover:shadow-lg"
                }`}
        >
            {post.image && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
            )}
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={14} />
                        <time dateTime={post.createdAt}>
                            {new Intl.DateTimeFormat(locale === "ar" ? "ar" : "ru", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                            }).format(date)}
                        </time>
                    </div>
                    {post.category && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400">
                            <Tag size={12} />
                            {post.category}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {excerpt}
                </p>

                {/* Footer */}
                <Link
                    href={`/${locale}/news/${post.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-yellow-600 dark:text-yellow-400 hover:gap-3 transition-all"
                >
                    {locale === "ar" ? "اقرأ المزيد" : "Читать далее"}
                    <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
                </Link>
            </div>
        </motion.article>
    );
}
