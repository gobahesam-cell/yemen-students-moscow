import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MainLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    return (
        <>
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
            <Footer />
        </>
    );
}
