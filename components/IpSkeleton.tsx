export function IpSkeleton() {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl animate-pulse">
      {/* IP Card skeleton */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-3 w-24 rounded bg-slate-700" />
        <div className="h-16 w-80 rounded-2xl bg-slate-800/60 border border-slate-700/50" />
        <div className="h-5 w-12 rounded-full bg-slate-800" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-slate-800/40 border border-slate-700/40 p-4 space-y-3"
          >
            <div className="h-3 w-20 rounded bg-slate-700" />
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="h-3 w-full rounded bg-slate-700/60" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
