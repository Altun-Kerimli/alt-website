import "@/app/globals.css";

export const metadata = {
  title: "Admin Dashboard - ALT INC",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-red-600 selection:text-white">
        {/* No Translation Providers, No Public Navbar, Just the CMS */}
        {children}
      </body>
    </html>
  );
}