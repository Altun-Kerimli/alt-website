import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from "../components/Navbar";
import { Providers } from "./providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "ALT",
  description: "Technical Infrastructure Platform",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>; // 1. Change type to Promise
}) {
  // 2. Await the params to extract the locale
  const { locale } = await params; 
  
  // Fetch the dictionary for the current language
  const messages = await getMessages();

  return (
    <html lang={locale} className="min-h-screen scroll-smooth" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col antialiased bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-red-600 selection:text-white transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            
            <Navbar />

            <main className="flex-1 w-full relative z-10 pt-20">
              {children}
            </main>

            <footer className="border-t border-black/5 dark:border-white/10 bg-white dark:bg-neutral-950 px-6 py-8 md:px-12 text-center text-xs text-neutral-500 transition-colors duration-300">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <span>&copy; {new Date().getFullYear()} ALTUN KARIMLI</span>
                <span className="flex items-center gap-2 font-medium text-black dark:text-white transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  System Online
                </span>
              </div>
            </footer>

          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}