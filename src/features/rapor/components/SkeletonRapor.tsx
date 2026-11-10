import { Skeleton, SkeletonBaris, SkeletonKepalaHalaman } from '../../../components/common/Skeleton'

// Hanya bergantung pada primitif skeleton: dipakai juga sebagai fallback <Suspense> di bundle utama.

/** Bilah alat rapor: pengalih kecamatan/dinas, 2 saringan, 3 tombol unduh/cetak. */
export function SkeletonToolbarRapor() {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
      <div className="col-span-2 grid grid-cols-2 rounded-full bg-recessed p-1 sm:inline-grid">
        <div className="flex min-h-9 items-center justify-center rounded-full bg-surface px-4 shadow-edge">
          <Skeleton className="h-3.5 w-24" />
        </div>
        <div className="flex min-h-9 items-center justify-center px-4">
          <Skeleton className="h-3.5 w-16" />
        </div>
      </div>
      {['sm:w-40', 'sm:w-52'].map((lebar) => (
        <div key={lebar} className={`flex min-h-11 min-w-0 items-center justify-between gap-3 rounded-md border border-border bg-surface px-3.5 ${lebar}`}>
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="size-4" />
        </div>
      ))}
      <div className="col-span-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:ml-auto">
        <Skeleton className="h-11 rounded-full sm:w-36" />
        <Skeleton className="h-11 rounded-full sm:w-44" />
        <Skeleton className="hidden h-11 w-28 rounded-full sm:block" />
      </div>
    </div>
  )
}

/** Panel ringkasan 4 angka + catatan cakupan + tabel (md ke atas) / kartu (ponsel). */
export function SkeletonIsiRapor() {
  return (
    <div role="status" className="space-y-5">
      <span className="sr-only">Memuat rapor wilayah…</span>
      <div aria-hidden className="space-y-5">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-edge lg:grid-cols-4">
          {['w-24', 'w-12', 'w-28', 'w-12'].map((lebar, i) => (
            <div key={i} className="bg-surface p-4 sm:p-5">
              <div className="text-xs">
                <SkeletonBaris className="w-24" />
              </div>
              <div className="mt-2 text-2xl leading-none sm:text-3xl">
                <SkeletonBaris className={lebar} />
              </div>
              <div className="mt-2 text-xs">
                <SkeletonBaris className="w-4/5" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5 rounded-lg bg-canvas-blue px-4 py-3 text-sm">
          <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <SkeletonBaris className="w-full" />
            <SkeletonBaris className="w-2/3" />
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-border bg-surface md:block">
          <div className="grid grid-cols-[minmax(0,1.6fr)_5rem_minmax(0,1.2fr)_minmax(0,1.4fr)_7rem_6rem] gap-4 border-b border-border bg-canvas-soft px-4 py-2.5 text-[11px]">
            {['w-20', 'w-12', 'w-16', 'w-14', 'w-16', 'w-14'].map((lebar, i) => (
              <SkeletonBaris key={i} className={lebar} />
            ))}
          </div>
          <div className="divide-y divide-border-soft">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="grid grid-cols-[minmax(0,1.6fr)_5rem_minmax(0,1.2fr)_minmax(0,1.4fr)_7rem_6rem] items-center gap-4 px-4 py-3 text-sm">
                <SkeletonBaris className={['w-28', 'w-40', 'w-32'][i % 3]} />
                <SkeletonBaris className="w-6" />
                <div>
                  <SkeletonBaris className="w-20" />
                  <Skeleton className="mt-1 h-1.5 w-full rounded-full" />
                </div>
                <div>
                  <SkeletonBaris className="w-8" />
                  <div className="text-xs">
                    <SkeletonBaris className="w-36 max-w-full" />
                  </div>
                </div>
                <SkeletonBaris className="w-14" />
                <SkeletonBaris className="w-6" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 md:hidden">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4 shadow-edge">
              <div className="text-base">
                <SkeletonBaris className={['w-32', 'w-44', 'w-36', 'w-28'][i]} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-border">
                {Array.from({ length: 4 }, (_, j) => (
                  <div key={j} className="bg-canvas-soft px-3 py-2">
                    <div className="text-[11px]">
                      <SkeletonBaris className="w-14" />
                    </div>
                    <div className="text-sm">
                      <SkeletonBaris className="w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Seluruh /rapor selama kode halamannya diunduh (fallback <Suspense>). */
export function SkeletonHalamanRapor() {
  return (
    <div className="space-y-6">
      <SkeletonKepalaHalaman lebarJudul="w-4/5 md:w-[40rem]" />
      <SkeletonToolbarRapor />
      <SkeletonIsiRapor />
    </div>
  )
}
