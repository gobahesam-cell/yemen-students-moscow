interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
    align?: "left" | "center" | "right";
    className?: string;
}

export default function SectionHeader({
    title,
    subtitle,
    badge,
    align = "center",
    className = ""
}: SectionHeaderProps) {

    const alignClass = align === "left" ? "text-left items-start" : align === "right" ? "text-right items-end" : "text-center items-center";

    return (
        <div className={`flex flex-col gap-3 mb-10 ${alignClass} ${className}`}>
            {badge && (
                <span className="inline-block px-3 py-1 text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/10 rounded-full border border-yellow-200 dark:border-yellow-500/20">
                    {badge}
                </span>
            )}
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg leading-relaxed">
                    {subtitle}
                </p>
            )}
            <div className="h-1.5 w-24 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full mt-2" />
        </div>
    );
}
