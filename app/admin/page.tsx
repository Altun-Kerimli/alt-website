import { enforceBouncer } from "@/proxy";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await enforceBouncer();

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-xl font-mono font-bold text-black dark:text-white">/admin</h1>
        <p className="text-xs text-neutral-500 mt-1">Master operational control console.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/portfolio" className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-transparent rounded hover:border-neutral-300 dark:hover:border-neutral-700 transition block shadow-sm dark:shadow-none">
          <div className="font-mono text-sm font-bold text-black dark:text-white">Manage Portfolio Records</div>
          <div className="text-xs text-neutral-500 mt-1">Mutate database profiles, view entries, insert assets.</div>
        </Link>
      </div>
    </div>
  );
}