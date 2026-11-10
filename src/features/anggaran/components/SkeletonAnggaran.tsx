import { Card } from '../../../components/common/Card'
import { Skeleton, SkeletonBaris, SkeletonKepalaHalaman } from '../../../components/common/Skeleton'

// Hanya bergantung pada primitif skeleton: dipakai juga sebagai fallback <Suspense> di bundle utama.

/** Baris sumber di kaki kartu (<SumberData dalamKartu>). */
function SkeletonSumberKartu() {
  return (
    <div className="mt-3 border-t border-dashed border-border pt-2 text-xs">
      <SkeletonBaris className="w-3/4 max-w-64" />
    </div>
  )
}

/** Tombol lipat ("Tampilkan … lainnya" / "Lihat tabel") di kaki grafik. */
function SkeletonTombolLipat({ lebar, className = 'mt-1' }: { lebar: string; className?: string }) {
  return (
    <div className={`border-t border-border-soft pt-1 ${className}`}>
      <div className="flex min-h-11 items-center text-sm">
        <SkeletonBaris className={lebar} />
      </div>
    </div>
  )
}

/** Satu sel <Metrik>: label kecil → angka besar → keterangan. */
function SkeletonMetrik({ lebarAngka }: { lebarAngka: string }) {
  return (
    <div className="flex min-w-0 flex-col bg-surface p-4 sm:p-5">
      <div className="text-xs">
        <SkeletonBaris className="w-24" />
      </div>
      <div className="mt-2 text-2xl leading-none sm:text-3xl">
        <SkeletonBaris className={lebarAngka} />
      </div>
      <div className="mt-2 text-xs">
        <SkeletonBaris className="w-4/5" />
      </div>
    </div>
  )
}

/** Satu baris <GrafikUrusan>: ikon, nama + nilai, lalu batang + porsi + per warga. */
function SkeletonBarisUrusan({ lebarNama, lebarBatang }: { lebarNama: string; lebarBatang: string }) {
  return (
    <div className="-mx-2 flex items-center gap-3 px-2 py-1.5">
      <Skeleton className="size-8 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <SkeletonBaris className={`${lebarNama} max-w-full`} />
          <SkeletonBaris className="w-16" />
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px]">
          <div className="h-1.5 min-w-12 flex-1 rounded-full bg-recessed">
            <div className={`h-full rounded-full bg-border-strong/60 motion-safe:animate-pulse ${lebarBatang}`} />
          </div>
          <SkeletonBaris className="w-8" />
          <SkeletonBaris className="w-24" />
        </div>
      </div>
    </div>
  )
}

const URUSAN = [
  { lebarNama: 'w-48', lebarBatang: 'w-full' },
  { lebarNama: 'w-36', lebarBatang: 'w-4/5' },
  { lebarNama: 'w-44', lebarBatang: 'w-3/5' },
  { lebarNama: 'w-32', lebarBatang: 'w-2/5' },
  { lebarNama: 'w-40', lebarBatang: 'w-1/3' },
  { lebarNama: 'w-28', lebarBatang: 'w-1/4' },
]

/** Tinggi batang (anggaran, realisasi) per tahun pada grafik tren tiruan. */
const BATANG_TREN = [
  ['h-[55%]', 'h-[48%]'],
  ['h-[62%]', 'h-[57%]'],
  ['h-[70%]', 'h-[63%]'],
  ['h-[82%]', 'h-[72%]'],
  ['h-[92%]', 'h-[40%]'],
]

/**
 * Dashboard /anggaran selama data dimuat: panel ringkasan 4 metrik → kartu per urusan (6 baris) +
 * kartu grafik tren → kotak jembatan ke peta. Struktur dan jaraknya sama dengan <DashboardAnggaran>.
 */
export function SkeletonDashboardAnggaran() {
  return (
    <div role="status" className="space-y-5">
      <span className="sr-only">Memuat data anggaran…</span>

      <Card className="p-0! sm:p-0!" aria-hidden>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="text-sm">
            <SkeletonBaris className="w-36" />
          </div>
          <Skeleton className="h-11 w-28" />
        </div>
        <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
          {['w-28', 'w-20', 'w-28', 'w-24'].map((lebar, i) => (
            <SkeletonMetrik key={i} lebarAngka={lebar} />
          ))}
        </div>
        <div className="space-y-1 rounded-b-lg border-t border-border bg-canvas-soft px-4 py-2.5 text-xs sm:px-5">
          <SkeletonBaris className="w-64 max-w-full" />
          <SkeletonBaris className="w-full max-w-xl" />
          <SkeletonBaris className="w-56 max-w-full" />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-5 lg:items-start" aria-hidden>
        <Card className="p-4 sm:p-5 lg:col-span-3">
          <div className="text-lg leading-tight">
            <SkeletonBaris className="w-3/4" />
          </div>
          <div className="mt-1 mb-3 text-sm">
            <SkeletonBaris className="w-11/12" />
          </div>
          {URUSAN.map((u, i) => (
            <SkeletonBarisUrusan key={i} {...u} />
          ))}
          <SkeletonTombolLipat lebar="w-48" />
          <SkeletonSumberKartu />
        </Card>

        <Card className="min-w-0 p-4 sm:p-5 lg:col-span-2">
          <div className="text-lg leading-tight">
            <SkeletonBaris className="w-4/5" />
          </div>
          <div className="mt-1 mb-3 text-sm">
            <SkeletonBaris className="w-full" />
          </div>
          {/* Area grafik setinggi <GrafikTren> (h-60 / sm:h-64): legenda, batang berpasangan, sumbu. */}
          <div className="flex h-60 flex-col sm:h-64">
            <div className="flex gap-4 pb-3 text-xs">
              <SkeletonBaris className="w-20" />
              <SkeletonBaris className="w-20" />
            </div>
            <div className="flex min-h-0 flex-1 gap-2">
              <div className="flex w-12 shrink-0 flex-col justify-between py-1">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="h-2.5 w-9" />
                ))}
              </div>
              <div className="flex flex-1 items-end justify-around gap-2 border-b border-border">
                {BATANG_TREN.map(([anggaran, realisasi], i) => (
                  <div key={i} className="flex h-full max-w-20 flex-1 items-end justify-center gap-0.5">
                    <Skeleton className={`w-full max-w-10 rounded-t-sm ${anggaran}`} />
                    <Skeleton className={`w-full max-w-10 rounded-t-sm opacity-60 ${realisasi}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-1.5 flex justify-around pl-14">
              {BATANG_TREN.map((_, i) => (
                <Skeleton key={i} className="h-2.5 w-8" />
              ))}
            </div>
          </div>
          <SkeletonTombolLipat lebar="w-36" className="mt-2" />
          <SkeletonSumberKartu />
        </Card>
      </div>

      <div
        aria-hidden
        className="flex flex-col gap-3 rounded-lg border border-border bg-canvas-blue px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          <div className="text-lg leading-tight">
            <SkeletonBaris className="w-72 max-w-full" />
          </div>
          <div className="mt-0.5 text-sm">
            <SkeletonBaris className="w-96 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-11 w-44 shrink-0 rounded-full" />
      </div>
    </div>
  )
}

/** Seluruh halaman /anggaran selama kode halamannya diunduh (fallback <Suspense>). */
export function SkeletonHalamanAnggaran() {
  return (
    <div className="space-y-8">
      <SkeletonKepalaHalaman lebarJudul="w-4/5 md:w-[34rem]" />
      <SkeletonDashboardAnggaran />
    </div>
  )
}
