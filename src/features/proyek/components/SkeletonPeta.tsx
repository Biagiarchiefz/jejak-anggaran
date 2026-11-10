import { MapPin } from 'lucide-react'
import { Skeleton, SkeletonBaris, SkeletonKepalaHalaman } from '../../../components/common/Skeleton'

// Hanya bergantung pada primitif skeleton (bukan Leaflet): dipakai juga sebagai fallback <Suspense> di bundle utama.

/** Pin bayangan di peta tiruan (persen), kira-kira sebaran proyek di Kota Bandung. */
const PIN = [
  { left: '48%', top: '50%' },
  { left: '38%', top: '36%' },
  { left: '61%', top: '44%' },
  { left: '70%', top: '62%' },
  { left: '33%', top: '64%' },
  { left: '55%', top: '30%' },
]

/** Satu item <DaftarProyek>: thumbnail 64px, nama 2 baris, kecamatan · tahun, badge + pagu, sumber. */
function SkeletonItemDaftar() {
  return (
    <li className="relative flex gap-3 rounded-md border border-border bg-surface p-2.5">
      <div className="size-16 shrink-0 rounded-md bg-recessed motion-safe:animate-pulse" />
      <div className="min-w-0 flex-1">
        <div className="pr-7 text-sm leading-snug">
          <SkeletonBaris className="w-11/12" />
          <SkeletonBaris className="w-3/5" />
        </div>
        <div className="mt-0.5 text-xs">
          <SkeletonBaris className="w-40" />
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2 text-sm">
          <Skeleton className="h-4.5 w-20 rounded-full" />
          <SkeletonBaris className="w-16" />
        </div>
        <div className="mt-1 text-xs">
          <SkeletonBaris className="w-3/4" />
        </div>
      </div>
      <Skeleton className="absolute top-1.5 right-1.5 size-8" />
    </li>
  )
}

/**
 * Hasil /peta selama proyek dimuat: baris jumlah → peta (tinggi sama dengan <PetaProyek>) + legenda →
 * panel "Daftar proyek" berisi item-item terpisah. Grid split-screen sama dengan aslinya.
 */
export function SkeletonHasilPeta() {
  return (
    <div role="status" className="space-y-6">
      <span className="sr-only">Memuat peta proyek…</span>

      <div className="text-sm" aria-hidden>
        <SkeletonBaris className="w-60" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]" aria-hidden>
        <div className="min-w-0">
          <div className="relative h-[50vh] min-h-80 w-full overflow-hidden rounded-lg border border-border bg-canvas-soft md:h-[60vh]">
            {/* Tombol zoom Leaflet di kiri atas. */}
            <div className="absolute top-2.5 left-2.5 overflow-hidden rounded-md border border-border bg-surface">
              <div className="size-8 border-b border-border" />
              <div className="size-8" />
            </div>
            <div className="absolute top-1/2 left-1/2 h-3/5 w-3/5 -translate-1/2 rounded-[45%_55%_50%_50%] border-2 border-dashed border-brand/25" />
            {PIN.map((posisi) => (
              <MapPin
                key={posisi.left + posisi.top}
                className="absolute size-7 -translate-x-1/2 -translate-y-full fill-brand stroke-white opacity-40 motion-safe:animate-pulse [&>circle]:fill-white"
                style={posisi}
                strokeWidth={1.5}
                aria-hidden
              />
            ))}
          </div>
          <div className="mt-3 flex gap-x-5 text-xs">
            <SkeletonBaris className="w-16" />
            <SkeletonBaris className="w-28" />
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-surface shadow-edge lg:flex lg:h-[max(60vh,20rem)] lg:flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="text-base">
              <SkeletonBaris className="w-28" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <ul className="space-y-2 p-2 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
            {Array.from({ length: 4 }, (_, i) => (
              <SkeletonItemDaftar key={i} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/** Seluruh halaman /peta selama kode halamannya diunduh: kepala, kolom cari + saringan, chip status, lalu hasil. */
export function SkeletonHalamanPeta() {
  return (
    <div className="space-y-6">
      <SkeletonKepalaHalaman lebarJudul="w-4/5 md:w-[36rem]" />

      <div className="space-y-3" aria-hidden>
        <div className="flex gap-2 sm:gap-3">
          {/* Kolom cari: ikon kaca pembesar + placeholder teks. */}
          <div className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-md border border-border bg-surface pl-3.5">
            <Skeleton className="size-5 shrink-0 rounded-full" />
            <Skeleton className="h-3.5 w-3/5" />
          </div>
          <Skeleton className="size-11 shrink-0 sm:hidden" />
          <div className="hidden min-h-11 w-56 items-center justify-between rounded-md border border-border bg-surface px-3.5 sm:flex">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="size-4" />
          </div>
        </div>
        <div className="hidden flex-wrap gap-2 sm:flex">
          {['w-32', 'w-36', 'w-28', 'w-24'].map((lebar) => (
            <Skeleton key={lebar} className={`h-11 rounded-full ${lebar}`} />
          ))}
        </div>
      </div>

      <SkeletonHasilPeta />
    </div>
  )
}
