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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
            {children}
        </motion.div>
    );
}

// Simple Bar Chart
interface BarChartProps {
    data: { label: string; value: number; color: string }[];
    maxValue?: number;
}

export function SimpleBarChart({ data, maxValue }: BarChartProps) {
    const max = maxValue || Math.max(...data.map(d => d.value));

    return (
        <div className="space-y-4">
            {data.map((item, i) => (
                <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / max) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full rounded-full"
                            style={{ background: item.color }}
                        />
                    </div>
                </div>
            ))}
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
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
        <div className="relative" style={{ height }}>
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="border-b border-slate-100 dark:border-slate-800" />
                ))}
            </div>

            {/* Chart */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area Fill */}
                <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    d={`
                        M 0 ${height}
                        ${data.map((v, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = height - ((v - min) / range) * (height - 20);
                        return `L ${x}% ${y}`;
                    }).join(' ')}
                        L 100% ${height}
                        Z
                    `}
                    fill={`url(#gradient-${color})`}
                />

                {/* Line */}
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                    d={data.map((v, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = height - ((v - min) / range) * (height - 20);
                        return `${i === 0 ? 'M' : 'L'} ${x}% ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                />

                {/* Dots */}
                {data.map((v, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = height - ((v - min) / range) * (height - 20);
                    return (
                        <motion.circle
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            cx={`${x}%`}
                            cy={y}
                            r="4"
                            fill="white"
                            stroke={color}
                            strokeWidth="2"
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
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <div className="flex items-center gap-6">
            <svg width={size} height={size} className="transform -rotate-90">
                {data.map((item, i) => {
                    const percentage = item.value / total;
                    const strokeDasharray = circumference * percentage;
                    const strokeDashoffset = -offset;
                    offset += strokeDasharray;

                    return (
                        <motion.circle
                            key={i}
                            initial={{ strokeDasharray: 0 }}
                            animate={{ strokeDasharray }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={item.color}
                            strokeWidth="16"
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    );
                })}
            </svg>

            <div className="space-y-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white mr-auto">{item.value}</span>
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
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
        <svg width={width} height={height}>
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                d={data.map((v, i) => {
                    const x = (i / (data.length - 1)) * width;
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
