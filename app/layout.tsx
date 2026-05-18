import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "ALT",
  description: "Technical Infrastructure Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-neutral-950 text-neutral-100 selection:bg-neutral-800">
      <body className="flex min-h-full flex-col antialiased">
        <nav className="border-b border-neutral-800 px-6 py-4 md:px-12">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-mono tracking-wider font-bold text-lg">ALT</Link>
            <div className="flex gap-6 text-sm font-mono text-neutral-400">
              <Link href="/portfolio" className="hover:text-neutral-100 transition">portfolio</Link>
              <Link href="/tools" className="hover:text-neutral-100 transition">tools</Link>
            </div>
          </div>
        </nav>

        <main className="flex-1 px-6 py-12 md:px-12 max-w-6xl mx-auto w-full">
          {children}
        </main>

        <footer className="border-t border-neutral-800 px-6 py-6 md:px-12 text-center text-xs font-mono text-neutral-500">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <span>&copy; {new Date().getFullYear()}</span>
            <span>system_online</span>
          </div>
        </footer>
      </body>
    </html>
  );
}