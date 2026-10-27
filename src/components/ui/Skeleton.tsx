export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-recessed ${className ?? 'h-4 w-full'}`} aria-hidden />
}

/** Placeholder satu blok halaman, dengan teks untuk pembaca layar. */
export function SkeletonHalaman({ baris = 4 }: { baris?: number }) {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">Memuat data…</span>
      <Skeleton className="h-8 w-2/3" />
      {Array.from({ length: baris }, (_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  )
}
