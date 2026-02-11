import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/Toast";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { cookies } from "next/headers";

// Import messages for client provider
import ar from "../../../messages/ar.json";
import ru from "../../../messages/ru.json";

const messagesMap = { ar, ru } as const;
type Locale = keyof typeof messagesMap;

import { decodeSession, COOKIE_NAME } from "@/lib/session-core";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "ar";
  const messages = messagesMap[locale] || ar;

  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  const session = await decodeSession(sessionToken);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider>
          <AdminLayoutClient user={session ? { name: session.name || "User", role: session.role } : undefined}>
            {children}
          </AdminLayoutClient>
        </ToastProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
