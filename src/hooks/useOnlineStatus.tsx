"use client";

import { useEffect, useRef } from "react";

const HEARTBEAT_INTERVAL = 30000; // 30 ثانية

export function useOnlineStatus() {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // إرسال heartbeat فوراً
        sendHeartbeat();

        // إرسال heartbeat كل 30 ثانية
        intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

        // إرسال heartbeat عند إغلاق الصفحة
        const handleBeforeUnload = () => {
            // استخدام sendBeacon لإرسال طلب قبل إغلاق الصفحة
            navigator.sendBeacon("/api/user/offline");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    async function sendHeartbeat() {
        try {
            await fetch("/api/user/heartbeat", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            // تجاهل الأخطاء - العملية صامتة
        }
    }
}

// مكون لتفعيل تتبع الاتصال
export function OnlineStatusTracker() {
    useOnlineStatus();
    return null;
}
