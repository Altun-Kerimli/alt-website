import Link from "next/link";

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl font-mono font-bold">/tools</h1>
        <p className="text-xs text-neutral-500 mt-1">Utility scripts and media automation systems.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/tools/media" className="p-4 border border-neutral-800 rounded hover:border-neutral-700 transition block">
          <div className="font-mono text-sm font-bold">Media Engine</div>
          <div className="text-xs text-neutral-500 mt-1">yt-dlp extraction and audio separation protocol.</div>
        </Link>

        <Link href="/tools/decoder" className="p-4 border border-neutral-800 rounded hover:border-neutral-700 transition block">
          <div className="font-mono text-sm font-bold">Decoder</div>
          <div className="text-xs text-neutral-500 mt-1">Morse and decimal conversion utilities.</div>
        </Link>
        
        {/* Placeholder for future grid expansions */}
        <div className="p-4 border border-neutral-800/50 border-dashed rounded opacity-50 block">
          <div className="font-mono text-sm font-bold">Awaiting deployment...</div>
          <div className="text-xs text-neutral-500 mt-1">Slot available.</div>
        </div>
      </div>
    </div>
  );
}