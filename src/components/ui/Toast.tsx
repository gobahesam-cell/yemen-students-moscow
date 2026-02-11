"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              min-w-[300px] p-4 rounded-xl shadow-lg border animate-in slide-in-from-left-5 fade-in duration-300
              ${t.type === "success" ? "bg-white dark:bg-slate-900 border-green-500 text-green-600" : ""}
              ${t.type === "error" ? "bg-white dark:bg-slate-900 border-red-500 text-red-600" : ""}
              ${t.type === "info" ? "bg-white dark:bg-slate-900 border-blue-500 text-blue-600" : ""}
            `}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">
                                {t.type === "success" && "✅"}
                                {t.type === "error" && "❌"}
                                {t.type === "info" && "ℹ️"}
                            </span>
                            <p className="font-medium text-sm text-slate-900 dark:text-white">{t.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
}
