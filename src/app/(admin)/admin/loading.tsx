export default function AdminLoading() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Banner Skeleton */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800/50 p-8 h-64 w-full animate-pulse">
                <div className="space-y-4">
                    <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl p-6 h-40 animate-pulse">
                        <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4"></div>
                        <div className="h-8 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2"></div>
                        <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    </div>
                ))}
            </div>

            {/* Lists Grid Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl p-6 h-96 animate-pulse">
                        <div className="flex justify-between mb-8">
                            <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                            <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                        </div>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, j) => (
                                <div key={j} className="h-20 bg-slate-50 dark:bg-slate-800/30 rounded-2xl w-full"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
