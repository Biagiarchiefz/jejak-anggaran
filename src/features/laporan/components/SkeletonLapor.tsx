import { Card } from '../../../components/common/Card'
import { Skeleton, SkeletonBaris, SkeletonKepalaHalaman } from '../../../components/common/Skeleton'

// Hanya bergantung pada primitif skeleton: dipakai juga sebagai fallback <Suspense> di bundle utama.

const JUMLAH_KATEGORI = 4

/** Label field (KELAS_LABEL: text-sm). */
function SkeletonLabel({ lebar }: { lebar: string }) {
  return (
    <div className="text-sm">
      <SkeletonBaris className={lebar} />
    </div>
  )
}

/**
 * /proyek/:id/lapor selama status masuk atau data proyek dimuat: tautan kembali → judul →
 * kotak ringkasan proyek → kartu form (4 pilihan kategori, textarea 5 baris, area unggah foto, kotak privasi, tombol).
 */
export function SkeletonLapor() {
  return (
    <div role="status" className="mx-auto max-w-[560px] space-y-6">
      <span className="sr-only">Memuat formulir laporan…</span>

      <div aria-hidden className="space-y-6">
        <div className="text-sm">
          <SkeletonBaris className="w-44" />
        </div>
        <SkeletonKepalaHalaman eyebrow={false} deskripsi={false} lebarJudul="w-4/5" />

        {/* Ringkasan proyek yang dilaporkan. */}
        <div className="rounded-lg border border-border bg-canvas-soft p-4">
          <div className="text-xs">
            <SkeletonBaris className="w-12" />
          </div>
          <div className="mt-0.5">
            <SkeletonBaris className="w-4/5" />
          </div>
          <div className="mt-1 text-sm">
            <SkeletonBaris className="w-40" />
          </div>
        </div>

        <Card className="space-y-8">
          <div>
            <SkeletonLabel lebar="w-40" />
            <div className="mt-2 grid gap-2">
              {Array.from({ length: JUMLAH_KATEGORI }, (_, i) => (
                <div key={i} className="flex gap-3 rounded-md border border-border bg-surface p-3.5">
                  <Skeleton className="mt-1 size-4 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <SkeletonBaris className={['w-28', 'w-36', 'w-32', 'w-20'][i]} />
                    <div className="text-sm">
                      <SkeletonBaris className={['w-11/12', 'w-full', 'w-4/5', 'w-1/2'][i]} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SkeletonLabel lebar="w-36" />
            <div className="mt-0.5 text-sm">
              <SkeletonBaris className="w-full" />
            </div>
            {/* Setinggi textarea rows=5: 5 × 24px + py-2.5 + border. */}
            <div className="mt-2 h-[142px] rounded-md border border-border bg-surface" />
            <div className="mt-1 flex justify-end text-xs">
              <SkeletonBaris className="w-12" />
            </div>
          </div>

          <div>
            <SkeletonLabel lebar="w-24" />
            <div className="mt-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border-strong bg-canvas-soft px-4 py-8">
              <Skeleton className="size-6" />
              <div className="text-sm">
                <SkeletonBaris className="w-72 max-w-[70vw]" />
              </div>
              <div className="text-xs">
                <SkeletonBaris className="w-64 max-w-[65vw]" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg bg-canvas-blue p-4">
            <Skeleton className="mt-0.5 size-5 shrink-0" />
            <div className="min-w-0 flex-1 text-sm">
              <SkeletonBaris className="w-full" />
              <SkeletonBaris className="w-3/4" />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-12 w-full rounded-full sm:w-24" />
            <Skeleton className="h-12 w-full rounded-full sm:w-40" />
          </div>
        </Card>

        <div className="text-xs">
          <SkeletonBaris className="w-full max-w-md" />
        </div>
      </div>
    </div>
  )
}
