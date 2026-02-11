import Link from "next/link";
import React from "react"; // Explicit import for React.ReactNode

interface FeatureCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    href: string;
    actionLabel: string;
}

export default function FeatureCard({ title, description, icon, href, actionLabel }: FeatureCardProps) {
    return (
        <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 lg:p-8 hover:shadow-xl dark:shadow-none hover:shadow-yellow-500/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 group-hover:from-yellow-500/5 group-hover:to-yellow-500/10" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 group-hover:scale-110 transition-transform duration-300">
                    {icon || (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                    {description}
                </p>

                <Link href={href} className="inline-flex items-center text-sm font-bold text-yellow-600 dark:text-yellow-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    {actionLabel}
                    <svg className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
