export default function PortfolioPage() {
  return (
    <div className="space-y-8">
      <header className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl font-mono font-bold">/portfolio</h1>
        <p className="text-xs text-neutral-500 mt-1">Selected technical works and deployments.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-neutral-800 p-6 rounded space-y-3">
          <span className="font-mono text-xs text-neutral-500">project_01</span>
          <h2 className="text-lg font-bold">System Architecture Template</h2>
          <p className="text-sm text-neutral-400">Description of system metrics, stacks, and execution profiles.</p>
          <div className="flex gap-2 pt-2">
            <span className="bg-neutral-900 border border-neutral-800 text-xs px-2 py-0.5 font-mono text-neutral-400">Next.js</span>
            <span className="bg-neutral-900 border border-neutral-800 text-xs px-2 py-0.5 font-mono text-neutral-400">TS</span>
          </div>
        </div>
      </div>
    </div>
  );
}