"use client";

import { motion } from "framer-motion";

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/50 dark:border-white/5 rounded-[2.5rem] p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_40_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700"
        >
            <div className="mb-10">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">{title}</h3>
                {subtitle && <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2 leading-relaxed">{subtitle}</p>}
            </div>
            <div className="relative">
                {children}
            </div>
        </motion.div>
    );
}

// Simple Bar Chart
interface BarChartProps {
    data: { label: string; value: number; color: string }[];
    maxValue?: number;
}

export function SimpleBarChart({ data, maxValue }: BarChartProps) {
    if (!data || data.length === 0) return null;
    const max = maxValue || Math.max(...data.map(d => d.value || 0), 1);

    return (
        <div className="space-y-6">
            {data.map((item, i) => {
                const val = item.value || 0;
                const percentage = Math.min(Math.max((val / max) * 100, 0), 100);
                return (
                    <div key={i} className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">{val}</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${percentage}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ background: item.color }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Simple Line/Area Chart (CSS-based)
interface LineChartProps {
    data: number[];
    color: string;
    height?: number;
}

export function SimpleLineChart({ data, color, height = 120 }: LineChartProps) {
    if (!data || data.length < 2) return null;

    // Sanitize data: Ensure all values are numbers and not NaN
    const sanitizedData = data.map(v => isNaN(v) ? 0 : v);

    const max = Math.max(...sanitizedData, 1);
    const min = Math.min(...sanitizedData, 0);
    const range = max - min || 1;

    return (
        <div className="relative" style={{ height }}>
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="border-b border-slate-100 dark:border-white/5 w-full h-px" />
                ))}
            </div>

            {/* Chart */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area Fill */}
                <motion.path
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    d={`
                        M 0 ${height}
                        ${sanitizedData.map((v, i) => {
                        const x = (i / (sanitizedData.length - 1)) * 100;
                        const y = height - ((v - min) / range) * (height - 20);
                        return `L ${x}% ${y}`;
                    }).join(' ')}
                        L 100% ${height}
                        Z
                    `}
                    fill={`url(#gradient-${color.replace('#', '')})`}
                />

                {/* Line */}
                <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d={sanitizedData.map((v, i) => {
                        const x = (i / (sanitizedData.length - 1)) * 100;
                        const y = height - ((v - min) / range) * (height - 20);
                        return `${i === 0 ? 'M' : 'L'} ${x}% ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Premium Glow Dots */}
                {sanitizedData.map((v, i) => {
                    const x = (i / (sanitizedData.length - 1)) * 100;
                    const y = height - ((v - min) / range) * (height - 20);
                    return (
                        <motion.circle
                            key={i}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1 + i * 0.1, type: "spring", stiffness: 200 }}
                            cx={`${x}%`}
                            cy={y}
                            r="5"
                            fill="white"
                            stroke={color}
                            strokeWidth="3"
                        />
                    );
                })}
            </svg>
        </div>
    );
}

// Donut Chart
interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
    size?: number;
}

export function SimpleDonutChart({ data, size = 160 }: DonutChartProps) {
    const total = data ? data.reduce((sum, d) => sum + (isNaN(d.value) ? 0 : d.value), 0) : 0;
    const radius = Math.max((size - 40) / 2, 0);
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-10">
            <div className="relative">
                <svg width={size} height={size} className="transform -rotate-90">
                    {data && total > 0 && data.map((item, i) => {
                        const val = isNaN(item.value) ? 0 : item.value;
                        const percentage = val / total;
                        const strokeDasharrayNumeric = circumference * percentage;
                        const currentOffset = offset;
                        offset += strokeDasharrayNumeric;

                        // Ensure values are numbers and not NaN
                        const sdArray = isNaN(strokeDasharrayNumeric) ? 0 : strokeDasharrayNumeric;
                        const sdOffset = isNaN(currentOffset) ? 0 : currentOffset;

                        return (
                            <motion.circle
                                key={i}
                                initial={{ strokeDasharray: `0 ${circumference}` }}
                                whileInView={{ strokeDasharray: `${sdArray} ${circumference}` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: i * 0.2, ease: "circOut" }}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={item.color}
                                strokeWidth="15"
                                strokeDashoffset={-sdOffset}
                                strokeLinecap="round"
                            />
                        );
                    })}
                    {/* Background circle if no data */}
                    {(total === 0 || !data) && (
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="15"
                            className="text-slate-100 dark:text-white/5"
                        />
                    )}
                </svg>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{total}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
                {data && data.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                        <div className="w-4 h-4 rounded-lg shrink-0 transition-transform group-hover:scale-125 shadow-sm" style={{ background: item.color }} />
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{item.label}</span>
                        <div className="flex-1 h-px bg-slate-100 dark:bg-white/5 mx-2" />
                        <span className="text-sm font-black text-slate-900 dark:text-white">{isNaN(item.value) ? 0 : item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Mini Sparkline
interface SparklineProps {
    data: number[];
    color: string;
    width?: number;
    height?: number;
}

export function Sparkline({ data, color, width = 80, height = 30 }: SparklineProps) {
    if (!data || data.length < 2) return null;

    const sanitizedData = data.map(v => isNaN(v) ? 0 : v);
    const max = Math.max(...sanitizedData, 1);
    const min = Math.min(...sanitizedData, 0);
    const range = max - min || 1;

    return (
        <svg width={width} height={height}>
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                d={sanitizedData.map((v, i) => {
                    const x = (i / (sanitizedData.length - 1)) * width;
                    const y = height - ((v - min) / range) * (height - 4);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}
