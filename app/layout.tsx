import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "ALT",
  description: "Technical Infrastructure Platform",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-neutral-950 text-neutral-100 selection:bg-neutral-800">
      <body className="flex min-h-full flex-col antialiased">
        {/* Added relative z-50 to keep dropdowns above main content */}
        <nav className="border-b border-neutral-800 px-6 py-4 md:px-12 relative z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-mono tracking-wider font-bold text-lg">ALT</Link>
            <div className="flex gap-6 text-sm font-mono text-neutral-400">
              
              {/* Portfolio Dropdown */}
              <div className="group relative py-2">
                <Link href="/portfolio" className="hover:text-neutral-100 transition flex items-center gap-1">
                  portfolio
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 transition-transform duration-200 group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
                </Link>
                {/* Hover bridge */}
                <div className="absolute top-[100%] left-0 w-full h-2"></div>
                {/* Dropdown Menu */}
                <div className="absolute top-[calc(100%+0.5rem)] left-0 w-44 hidden group-hover:flex flex-col bg-neutral-950 border border-neutral-800 rounded shadow-xl overflow-hidden">
                  <Link href="/portfolio#websites" className="px-4 py-3 hover:bg-neutral-900 hover:text-neutral-100 transition border-b border-neutral-800/50">/web_sites</Link>
                  <Link href="/portfolio#tg-bots" className="px-4 py-3 hover:bg-neutral-900 hover:text-neutral-100 transition border-b border-neutral-800/50">/telegram</Link>
                  <Link href="/portfolio#mobile" className="px-4 py-3 hover:bg-neutral-900 hover:text-neutral-100 transition border-b border-neutral-800/50">/mobile_apps</Link>
                  <Link href="/portfolio#ai-automation" className="px-4 py-3 hover:bg-neutral-900 hover:text-neutral-100 transition border-b border-neutral-800/50">/automation</Link>
                  <Link href="/portfolio#others" className="px-4 py-3 hover:bg-neutral-900 hover:text-neutral-100 transition">/others</Link>
                </div>
              </div>

              {/* Tools Dropdown */}
              <div className="group relative py-2">
                <Link href="/tools" className="hover:text-neutral-100 transition flex items-center gap-1">
                  tools
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 transition-transform duration-200 group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
                </Link>
                {/* Hover bridge */}
                <div className="absolute top-[100%] left-0 w-full h-2"></div>
                {/* Dropdown Menu */}
                <div className="absolute top-[calc(100%+0.5rem)] left-0 w-40 hidden group-hover:flex flex-col bg-neutral-950 border border-neutral-800 rounded shadow-xl overflow-hidden">
                  <Link href="/tools/decoder" className="px-4 py-3 hover:bg-neutral-900 hover:text-neutral-100 transition border-b border-neutral-800/50">/decoder</Link>
                  <Link href="/tools/media" className="px-4 py-3 hover:bg-neutral-900 hover:text-neutral-500 transition opacity-60 flex justify-between items-center">
                    <span className="line-through">/media</span>
                    <span className="text-[9px] border border-neutral-700 px-1 rounded">offline</span>
                  </Link>
                </div>
              </div>

              <Link href="/contact" className="py-2 hover:text-neutral-100 transition">contact</Link>
            </div>
          </div>
        </nav>

        {/* Added relative z-10 so it sits under the nav dropdowns */}
        <main className="flex-1 px-6 py-12 md:px-12 max-w-6xl mx-auto w-full relative z-10">
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