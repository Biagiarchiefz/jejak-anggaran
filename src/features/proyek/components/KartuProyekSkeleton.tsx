import { Skeleton, SkeletonBaris } from '../../../components/common/Skeleton'

/**
 * Placeholder <KartuProyek>: kerangka, rasio foto, dan tinggi tiap baris teks sama persis
 * (thumbnail 5:2 → nama 2 baris → kecamatan & tahun → panel pagu/kontrak → sumber),
 * sehingga grid tidak bergeser saat kartu asli menggantikannya.
 */
export function KartuProyekSkeleton() {
  return (
    <li aria-hidden className="flex flex-col rounded-lg border border-border bg-surface p-3 shadow-edge">
      <div className="relative aspect-5/2 overflow-hidden rounded-md bg-recessed motion-safe:animate-pulse">
        <div className="absolute top-2 left-2 h-4.5 w-16 rounded-full bg-surface/80" />
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3">
        <div className="min-h-[2lh] text-sm leading-snug">
          <SkeletonBaris className="w-11/12" />
          <SkeletonBaris className="w-3/5" />
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-xs">
          <SkeletonBaris className="w-28" />
          <SkeletonBaris className="w-14" />
        </div>

        <div className="mt-3 grid grid-cols-2 divide-x divide-border rounded-md bg-canvas-soft py-2">
          {['w-10', 'w-14'].map((lebarLabel) => (
            <div key={lebarLabel} className="px-3">
              <div className="text-[11px]">
                <SkeletonBaris className={lebarLabel} />
              </div>
              <div className="mt-0.5 text-sm">
                <SkeletonBaris className="w-20" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <div className="mt-3 border-t border-dashed border-border pt-2 text-xs">
            <SkeletonBaris className="w-3/4" />
          </div>
        </div>
      </div>
    </li>
  )
}

/** Grid kartu proyek yang sedang dimuat; kelas grid sama dengan daftar aslinya. */
export function GridKartuProyekSkeleton({ jumlah, label }: { jumlah: number; label: string }) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {Array.from({ length: jumlah }, (_, i) => (
          <KartuProyekSkeleton key={i} />
        ))}
      </ul>
    </div>
  )
}

/** Placeholder <KartuPin> (kartu proyek di bawah peta hero pada ponsel/tablet). */
export function KartuPinSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`rounded-lg border border-border bg-surface p-2 shadow-pop ${className ?? ''}`}>
      <div className="relative aspect-16/10 overflow-hidden rounded-md bg-recessed motion-safe:animate-pulse">
        <div className="absolute top-2 left-2 h-4.5 w-16 rounded-full bg-surface/80" />
      </div>

      <div className="px-1.5 pt-3 pb-1">
        <div className="text-sm leading-snug">
          <SkeletonBaris className="w-11/12" />
          <SkeletonBaris className="w-1/2" />
        </div>
        <div className="mt-1.5 text-xs">
          <SkeletonBaris className="w-40" />
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs">
          <SkeletonBaris className="w-14" />
          <SkeletonBaris className="w-28" />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border-soft pt-3">
          <div>
            <div className="text-base leading-tight">
              <SkeletonBaris className="w-20" />
            </div>
            <div className="text-xs">
              <SkeletonBaris className="w-24" />
            </div>
          </div>
          <Skeleton className="h-11 w-24 shrink-0 rounded-full" />
        </div>
        <div className="mt-3 border-t border-dashed border-border pt-2 text-xs">
          <SkeletonBaris className="w-3/4" />
        </div>
      </div>
    </div>
  )
}
