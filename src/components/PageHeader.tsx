"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Sparkles, BookOpen, Users, Award, GraduationCap } from "lucide-react";

export default function PageHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description?: string;
  badge?: string;
}) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary Glow */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#d4af37]/30 to-amber-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4"
        />
        {/* Secondary Glow */}
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/20 to-purple-500/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-2 h-2 bg-[#d4af37]/50 rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Diagonal Lines */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 30px,
              rgba(255,255,255,0.1) 30px,
              rgba(255,255,255,0.1) 31px
            )`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 max-w-5xl">
        {/* Floating Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#d4af37] to-amber-500 shadow-2xl shadow-[#d4af37]/30">
            <GraduationCap size={40} className="text-slate-900" />
          </div>
        </motion.div>

        {badge && (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#d4af37] text-sm font-bold mb-6"
          >
            <Sparkles size={16} />
            {badge}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6"
        >
          <span className="relative inline-block">
            {title}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37] rounded-full origin-left"
            />
          </span>
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10"
          >
            {description}
          </motion.p>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {[
            { icon: BookOpen, label: locale === "ar" ? "دورات متنوعة" : "Разные курсы" },
            { icon: Users, label: locale === "ar" ? "مجتمع تعليمي" : "Сообщество" },
            { icon: Award, label: locale === "ar" ? "شهادات معتمدة" : "Сертификаты" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
              className="flex items-center gap-2 text-white/70"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <item.icon size={16} className="text-[#d4af37]" />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full h-auto fill-white dark:fill-slate-950">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* Side Decorations */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent" />
    </motion.div>
  );
}
