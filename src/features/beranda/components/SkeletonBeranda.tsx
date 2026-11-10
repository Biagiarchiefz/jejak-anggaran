import { MapPin } from 'lucide-react'
import { PitaPenuh } from '../../../components/common/PitaPenuh'
import { Skeleton, SkeletonBaris } from '../../../components/common/Skeleton'
import { GridKartuProyekSkeleton, KartuPinSkeleton } from '../../proyek/components/KartuProyekSkeleton'

// File ini sengaja hanya bergantung pada primitif skeleton: dipakai sebagai fallback <Suspense> di Layout
// (bundle utama), jadi tidak boleh menarik kode section Beranda yang di-lazy-load.

/** Placeholder satu angka di <PitaStatistik>: baris angka, label, dan sumber setinggi aslinya. */
export function SkeletonStatistik() {
  return (
    <div className="border-t border-white/15 pt-6" aria-hidden>
      <div className="text-[36px] leading-none md:text-5xl">
        <SkeletonBaris terang className="w-36 md:w-44" />
      </div>
      <div className="mt-3 text-sm">
        <SkeletonBaris terang className="w-40" />
      </div>
      <div className="mt-3 text-xs">
        <SkeletonBaris terang className="w-48 max-w-full" />
      </div>
    </div>
  )
}

/** Posisi pin bayangan di lapisan peta hero (persen), kira-kira sebaran proyek di Kota Bandung. */
const PIN_HERO = [
  { left: '52%', top: '46%' },
  { left: '41%', top: '34%' },
  { left: '66%', top: '42%' },
  { left: '74%', top: '58%' },
  { left: '44%', top: '60%' },
]

/** Hero <FlatProjectMap>: kolom teks kiri (label, judul 3 baris, deskripsi, tombol) + lapisan peta berpin. */
function SkeletonHero() {
  return (
    <PitaPenuh className="relative -mt-16 flex min-h-dvh flex-col justify-center border-b border-border-soft bg-canvas pt-26 pb-10 md:pt-32 md:pb-14 lg:h-dvh lg:min-h-160 lg:pt-16 lg:pb-0 [&>div]:w-full">
      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:py-10">
        <div className="relative z-10 max-w-xl">
          <div className="text-xs">
            <SkeletonBaris className="w-56" />
          </div>
          <div className="mt-4 text-[36px] leading-[1.05] md:text-[56px] lg:text-[48px] xl:text-[56px]">
            <SkeletonBaris className="w-full" />
            <SkeletonBaris className="w-11/12" />
            <SkeletonBaris className="w-2/3" />
          </div>
          <div className="mt-6 max-w-[560px] text-lg leading-[1.55]">
            <SkeletonBaris className="w-full" />
            <SkeletonBaris className="w-full" />
            <SkeletonBaris className="w-3/5" />
          </div>
          <Skeleton className="mt-8 h-12 w-60 rounded-full" />
        </div>

        <div className="lg:contents">
          <div className="relative z-0 -mx-4 h-80 overflow-hidden bg-canvas-soft sm:-mx-6 sm:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:left-[40%] lg:mx-0 lg:h-auto">
            {/* Garis batas kota tiruan + pin bayangan. */}
            <div className="absolute top-1/2 left-1/2 h-[55%] w-[70%] -translate-1/2 rounded-[45%_55%_50%_50%] border-2 border-dashed border-brand/25 lg:left-[60%] lg:w-[55%]" />
            {PIN_HERO.map((posisi) => (
              <MapPin
                key={posisi.left + posisi.top}
                className="absolute size-8 -translate-x-1/2 -translate-y-full fill-brand stroke-white opacity-40 motion-safe:animate-pulse [&>circle]:fill-white"
                style={posisi}
                strokeWidth={1.5}
                aria-hidden
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-canvas),transparent_22%,transparent_78%,var(--color-canvas))] lg:bg-[linear-gradient(to_right,var(--color-canvas),transparent_32%),linear-gradient(to_bottom,var(--color-canvas),transparent_18%,transparent_70%,var(--color-canvas))]" />
          </div>
          <KartuPinSkeleton className="relative mx-auto mt-3 max-w-sm lg:hidden" />
        </div>
      </div>
    </PitaPenuh>
  )
}

/**
 * Kerangka seluruh Beranda selama kode halamannya diunduh (fallback <Suspense>):
 * hero peta → pita ringkasan angka → kartu proyek. Bentuk dan jaraknya sama dengan section aslinya.
 */
export function SkeletonBeranda() {
  return (
    <div role="status">
      <span className="sr-only">Memuat beranda…</span>

      <SkeletonHero />

      <PitaPenuh className="bg-band py-16 md:py-24">
        <div className="text-xs">
          <SkeletonBaris terang className="w-28" />
        </div>
        <div className="mt-3 text-[28px] leading-[1.12] md:text-[40px]">
          <SkeletonBaris terang className="w-full max-w-xl" />
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonStatistik key={i} />
          ))}
        </div>
      </PitaPenuh>

      <PitaPenuh className="border-y border-border-soft bg-canvas-soft py-16 md:py-24">
        <div className="max-w-[720px]">
          <div className="text-xs">
            <SkeletonBaris className="w-32" />
          </div>
          <div className="mt-3 text-[28px] leading-[1.12] md:text-[40px]">
            <SkeletonBaris className="w-4/5" />
            <SkeletonBaris className="w-3/5" />
          </div>
        </div>
        <div className="mt-10">
          <GridKartuProyekSkeleton jumlah={3} label="Memuat daftar proyek…" />
        </div>
      </PitaPenuh>
    </div>
  )
}
