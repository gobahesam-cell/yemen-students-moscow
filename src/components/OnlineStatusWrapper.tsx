"use client";

import { useEffect, useRef } from "react";

const HEARTBEAT_INTERVAL = 30000; // 30 ثانية

export function OnlineStatusWrapper({ children }: { children: React.ReactNode }) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // إرسال heartbeat فوراً
        sendHeartbeat();

        // إرسال heartbeat كل 30 ثانية
        intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

        // إرسال heartbeat عند إغلاق الصفحة
        const handleBeforeUnload = () => {
            navigator.sendBeacon("/api/user/offline");
        };

        // تحديث عند عودة المستخدم للتبويب
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                sendHeartbeat();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    async function sendHeartbeat() {
        try {
            await fetch("/api/user/heartbeat", {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // تجاهل الأخطاء - العملية صامتة
        }
    }

    return <>{children}</>;
}
