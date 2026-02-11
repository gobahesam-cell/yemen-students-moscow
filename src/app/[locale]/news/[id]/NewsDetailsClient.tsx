"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag, Pin, Share2, Facebook, Twitter, Copy, CheckCircle2 } from "lucide-react";
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

interface RelatedPost {
    id: string;
    title: string;
    createdAt: string;
}

interface NewsDetailsClientProps {
    post: Post;
    relatedPosts: RelatedPost[];
    locale: string;
}

export default function NewsDetailsClient({ post, relatedPosts, locale }: NewsDetailsClientProps) {
    const [copied, setCopied] = useState(false);
    const isRTL = locale === "ar";
    const date = new Date(post.createdAt);

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            {/* Hero Header */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative container mx-auto max-w-4xl px-4 py-16 md:py-24">
                    {/* Back Link */}
                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            href={`/${locale}/news`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8"
                        >
                            <ArrowRight size={16} className={isRTL ? "" : "rotate-180"} />
                            {locale === "ar" ? "رجوع للأخبار" : "Назад к новостям"}
                        </Link>
                    </motion.div>

                    {/* Meta */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap items-center gap-3 mb-6"
                    >
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur rounded-lg text-sm">
                            <Clock size={14} />
                            {new Intl.DateTimeFormat(locale === "ar" ? "ar" : "ru", {
                                year: "numeric",
                                month: "long",
                                day: "2-digit",
                            }).format(date)}
                        </span>
                        {post.category && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm">
                                <Tag size={14} />
                                {post.category}
                            </span>
                        )}
                        {post.isPinned && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-300 rounded-lg text-sm">
                                <Pin size={14} />
                                {locale === "ar" ? "خبر مهم" : "Важная новость"}
                            </span>
                        )}
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                    >
                        {post.title}
                    </motion.h1>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto max-w-4xl px-4 py-12">
                <div className="grid lg:grid-cols-[1fr_280px] gap-10">
                    {/* Article Content */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-img:rounded-3xl prose-img:shadow-xl"
                    >
                        {post.image && (
                            <div className="mb-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-yellow-500/10 border border-slate-200 dark:border-slate-800">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-auto max-h-[500px] object-cover"
                                />
                            </div>
                        )}
                        <div
                            className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 post-content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </motion.article>

                    {/* Sidebar */}
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Share Card */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Share2 size={18} />
                                {locale === "ar" ? "شارك الخبر" : "Поделиться"}
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')}
                                    className="flex-1 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                                >
                                    <Facebook size={20} className="mx-auto" />
                                </button>
                                <button
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`, '_blank')}
                                    className="flex-1 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-colors"
                                >
                                    <Twitter size={20} className="mx-auto" />
                                </button>
                                <button
                                    onClick={copyLink}
                                    className="flex-1 p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl transition-colors"
                                >
                                    {copied ? <CheckCircle2 size={20} className="mx-auto text-green-600" /> : <Copy size={20} className="mx-auto" />}
                                </button>
                            </div>
                        </div>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                                    {locale === "ar" ? "أخبار ذات صلة" : "Похожие новости"}
                                </h3>
                                <div className="space-y-3">
                                    {relatedPosts.map((rp) => (
                                        <Link
                                            key={rp.id}
                                            href={`/${locale}/news/${rp.id}`}
                                            className="block p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors group"
                                        >
                                            <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
                                                {rp.title}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {new Intl.DateTimeFormat(locale === "ar" ? "ar" : "ru", {
                                                    month: "short",
                                                    day: "2-digit",
                                                }).format(new Date(rp.createdAt))}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.aside>
                </div>
            </section>

            {/* Back to News CTA */}
            <section className="border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto max-w-4xl px-4 py-8">
                    <Link
                        href={`/${locale}/news`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                        <ArrowRight size={18} className={isRTL ? "" : "rotate-180"} />
                        {locale === "ar" ? "عودة لجميع الأخبار" : "Все новости"}
                    </Link>
                </div>
            </section>
        </main>
    );
}
