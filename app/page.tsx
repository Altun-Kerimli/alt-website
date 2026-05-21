import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-mono tracking-tight font-bold">alt.sys</h1>
      <p className="text-neutral-400 leading-relaxed text-sm">
        Central hub for technical engineering execution, freelance architecture, and media automation tools.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <Link href="/portfolio" className="p-4 border border-neutral-800 rounded hover:border-neutral-700 transition block">
          <div className="font-mono text-sm font-bold">/portfolio</div>
          <div className="text-xs text-neutral-500 mt-1">Background and project index.</div>
        </Link>

        <Link href="/tools" className="p-4 border border-neutral-800 rounded hover:border-neutral-700 transition block">
          <div className="font-mono text-sm font-bold">/tools</div>
          <div className="text-xs text-neutral-500 mt-1">Utility scripts.</div>
        </Link>
        
        <Link href="/contact" className="p-4 border border-neutral-800 rounded hover:border-neutral-700 transition block">
          <div className="font-mono text-sm font-bold">/contact</div>
          <div className="text-xs text-neutral-500 mt-1">Reach out to me.</div>
        </Link>
      </div>
    </div>
  );
}