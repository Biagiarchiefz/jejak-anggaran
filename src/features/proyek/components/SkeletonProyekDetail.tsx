import { MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import { Skeleton, SkeletonBaris } from '../../../components/common/Skeleton'

// Hanya bergantung pada primitif skeleton (bukan Leaflet): dipakai juga sebagai fallback <Suspense> di bundle utama.

/** Judul bagian (<JudulBagian>): text-lg / md:text-xl. */
function SkeletonJudulBagian({ lebar }: { lebar: string }) {
  return (
    <div className="text-lg leading-tight md:text-xl">
      <SkeletonBaris className={lebar} />
    </div>
  )
}

/** Satu sel <Info> pada grid "Data anggaran": label kapital kecil → nilai. */
function SkeletonInfo({ lebar }: { lebar: string }) {
  return (
    <div className="min-w-0 bg-surface px-4 py-3">
      <div className="text-[11px]">
        <SkeletonBaris className="w-16" />
      </div>
      <div className="mt-1 text-sm">
        <SkeletonBaris className={lebar} />
      </div>
    </div>
  )
}

/** Placeholder <KartuLaporan>: kategori + badge + tanggal → foto & deskripsi → baris aksi. */
export function SkeletonKartuLaporan() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-edge sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex items-center gap-1.5">
          <div className="mr-1 text-base">
            <SkeletonBaris className="w-32" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="text-xs">
          <SkeletonBaris className="w-44" />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="aspect-4/3 w-full shrink-0 sm:w-32" />
        <div className="min-w-0 flex-1 text-sm leading-relaxed">
          <SkeletonBaris className="w-full" />
          <SkeletonBaris className="w-11/12" />
          <SkeletonBaris className="w-3/5" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-soft pt-3">
        {/* Tombol pil "Saya juga melihat" + jumlah. */}
        <div className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border pr-1.5 pl-3">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-5 w-7 rounded-full" />
        </div>
        <div className="flex flex-1 items-center justify-between gap-x-4 text-sm">
          <div className="flex min-h-11 items-center">
            <SkeletonBaris className="w-32" />
          </div>
          <div className="flex min-h-11 items-center">
            <SkeletonBaris className="w-20 sm:w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Satu angka besar di kartu ringkasan: label → angka (text-[26px]) → sumber. */
function SkeletonAngka({ lebar, children }: { lebar: string; children?: ReactNode }) {
  return (
    <>
      <div className="text-xs">
        <SkeletonBaris className="w-28" />
      </div>
      <div className="mt-1.5 text-[26px] leading-none">
        <SkeletonBaris className={lebar} />
      </div>
      <div className="mt-1.5 text-xs">
        <SkeletonBaris className="w-3/4" />
      </div>
      {children}
    </>
  )
}

/**
 * /proyek/:id selama data dimuat: breadcrumb → badge + judul + meta → (ponsel: ringkasan dulu)
 * grid metadata 4 sel, linimasa foto, kartu laporan | kartu ringkasan menempel (peta lokasi, pagu, kontrak, angka laporan, aksi).
 */
export function SkeletonProyekDetail() {
  return (
    <div role="status" className="space-y-6 pb-24 lg:pb-0">
      <span className="sr-only">Memuat detail proyek…</span>

      <div aria-hidden className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <SkeletonBaris className="w-16" />
          <Skeleton className="size-3 rounded-full" />
          <SkeletonBaris className="w-20" />
          <Skeleton className="size-3 rounded-full" />
          <SkeletonBaris className="w-40 max-w-[30vw]" />
        </div>

        {/* Kepala: badge → judul 2 baris → meta berikon */}
        <div>
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="mt-3 max-w-4xl text-[28px] leading-[1.12] md:text-[36px]">
            <SkeletonBaris className="w-full" />
            <SkeletonBaris className="w-1/2" />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
            {['w-44', 'w-36', 'w-28'].map((lebar) => (
              <div key={lebar} className="flex items-center gap-1.5">
                <Skeleton className="size-4 rounded-full" />
                <SkeletonBaris className={lebar} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="order-2 min-w-0 space-y-8 lg:order-1">
            <div>
              <SkeletonJudulBagian lebar="w-40" />
              <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-edge sm:grid-cols-4">
                {['w-4/5', 'w-full', 'w-12', 'w-3/5'].map((lebar, i) => (
                  <SkeletonInfo key={i} lebar={lebar} />
                ))}
              </div>
            </div>

            <div>
              <SkeletonJudulBagian lebar="w-52" />
              {/* Linimasa foto: kartu 224px berjajar; overflow disembunyikan agar tidak ada scroll horizontal. */}
              <div className="mt-3 flex gap-3 overflow-hidden pb-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="w-56 shrink-0">
                    <Skeleton className="aspect-4/3 w-full" />
                    <div className="mt-2 text-xs">
                      <SkeletonBaris className="w-36" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <SkeletonJudulBagian lebar="w-48" />
                <div className="text-xs">
                  <SkeletonBaris className="w-56" />
                </div>
              </div>
              <div className="mt-3 space-y-3">
                <SkeletonKartuLaporan />
                <SkeletonKartuLaporan />
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:self-start">
            <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
              {/* Cuplikan peta lokasi (16:7) dengan satu pin di tengah. */}
              <div className="relative aspect-[16/7] border-b border-border bg-canvas-soft">
                <MapPin
                  className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-full fill-brand stroke-white opacity-40 motion-safe:animate-pulse [&>circle]:fill-white"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>

              <div className="p-4 sm:p-5">
                <SkeletonAngka lebar="w-52" />
                <div className="mt-4 border-t border-border-soft pt-4">
                  <SkeletonAngka lebar="w-48">
                    <div className="mt-3">
                      <Skeleton className="h-1.5 w-full rounded-full" />
                      <div className="mt-1 text-xs">
                        <SkeletonBaris className="w-48" />
                      </div>
                    </div>
                  </SkeletonAngka>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border-soft pt-4">
                  {['w-20', 'w-24'].map((lebar) => (
                    <div key={lebar} className="flex flex-col items-center rounded-md bg-canvas-soft px-2 py-2">
                      <div className="text-[11px]">
                        <SkeletonBaris className={lebar} />
                      </div>
                      <div className="text-lg">
                        <SkeletonBaris className="w-6" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 hidden space-y-2 lg:block">
                  <Skeleton className="h-12 w-full rounded-full" />
                  <Skeleton className="h-12 w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ponsel & tablet: bar aksi yang menempel di atas bottom navigation. */}
      <div aria-hidden className="fixed inset-x-0 bottom-16 z-[1000] flex gap-2 border-t border-border bg-surface p-3 lg:hidden">
        <Skeleton className="h-11 flex-1 rounded-full" />
        <Skeleton className="h-11 flex-1 rounded-full" />
      </div>
    </div>
  )
}
