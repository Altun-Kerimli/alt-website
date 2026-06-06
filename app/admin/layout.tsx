import "@/app/globals.css";
import { Providers } from "@/app/[locale]/providers";
import AdminNavbar from "./components/AdminNavbar";

export const metadata = {
  title: "Admin Dashboard - ALT INC",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-red-600 selection:text-white transition-colors duration-300">
        <Providers>
          <AdminNavbar />
          <main className="max-w-6xl mx-auto p-6 md:p-12">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}