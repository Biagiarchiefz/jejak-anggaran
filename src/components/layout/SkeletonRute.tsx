import type { ReactNode } from 'react'
import { Skeleton, SkeletonBaris, SkeletonDaftarSumber, SkeletonEmptyState, SkeletonKepalaHalaman } from '../common/Skeleton'
import { SkeletonHalamanAnggaran } from '../../features/anggaran/components/SkeletonAnggaran'
import { SkeletonBeranda } from '../../features/beranda/components/SkeletonBeranda'
import { SkeletonLapor } from '../../features/laporan/components/SkeletonLapor'
import { SkeletonHalamanRapor } from '../../features/rapor/components/SkeletonRapor'
import { SkeletonProyekDetail } from '../../features/proyek/components/SkeletonProyekDetail'
import { SkeletonHalamanPeta } from '../../features/proyek/components/SkeletonPeta'

/** Satu <Bagian> Tentang Data: judul H2 lalu isi. */
function SkeletonBagian({ children, lebarJudul }: { children: ReactNode; lebarJudul: string }) {
  return (
    <div className="space-y-4">
      <div className="text-2xl leading-[1.25]">
        <SkeletonBaris className={lebarJudul} />
      </div>
      <div className="space-y-4 leading-[1.55]">{children}</div>
    </div>
  )
}

/** /tentang-data: kepala → daftar isi menempel (desktop) + artikel (tabel sumber, daftar kurasi, kotak aturan). */
function SkeletonTentangData() {
  return (
    <div role="status" className="space-y-12">
      <span className="sr-only">Memuat halaman…</span>
      <SkeletonKepalaHalaman lebarJudul="w-3/5 md:w-80" />

      <div className="grid gap-12 lg:grid-cols-[14rem_minmax(0,720px)] lg:gap-16" aria-hidden>
        <div className="hidden lg:block">
          <div className="text-xs">
            <SkeletonBaris className="w-24" />
          </div>
          <ul className="mt-3 space-y-1 border-l border-border">
            {['w-24', 'w-24', 'w-40', 'w-32', 'w-20', 'w-32', 'w-16'].map((lebar, i) => (
              <li key={i} className="py-1.5 pl-4 text-sm">
                <SkeletonBaris className={lebar} />
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 space-y-12">
          <SkeletonBagian lebarJudul="w-40">
            {/* Tabel dataset (sm ke atas) / daftar kartu (ponsel). */}
            <div className="hidden overflow-hidden rounded-lg border border-border text-sm sm:block">
              <div className="grid grid-cols-[1fr_1.4fr_1.6fr] gap-4 border-b border-border bg-canvas-soft px-4 py-3 text-xs">
                <SkeletonBaris className="w-10" />
                <SkeletonBaris className="w-10" />
                <SkeletonBaris className="w-8" />
              </div>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.4fr_1.6fr] gap-4 border-b border-border-soft px-4 py-3 last:border-0">
                  <SkeletonBaris className="w-4/5" />
                  <div>
                    <SkeletonBaris className="w-full" />
                    <SkeletonBaris className="w-1/2" />
                  </div>
                  <div>
                    <SkeletonBaris className="w-full" />
                    <SkeletonBaris className="w-2/3" />
                  </div>
                </div>
              ))}
            </div>
            <ul className="space-y-3 sm:hidden">
              {Array.from({ length: 4 }, (_, i) => (
                <li key={i} className="rounded-lg border border-border bg-surface p-4 text-sm">
                  <SkeletonBaris className="w-1/2" />
                  <div className="mt-1">
                    <SkeletonBaris className="w-11/12" />
                  </div>
                  <div className="mt-1">
                    <SkeletonBaris className="w-4/5" />
                  </div>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-base">
              <SkeletonBaris className="w-80 max-w-full" />
            </div>
            <SkeletonDaftarSumber />
          </SkeletonBagian>

          <SkeletonBagian lebarJudul="w-36">
            <ol className="space-y-2 pl-5">
              {['w-11/12', 'w-4/5', 'w-full', 'w-3/4'].map((lebar, i) => (
                <li key={i}>
                  <SkeletonBaris className={lebar} />
                </li>
              ))}
            </ol>
          </SkeletonBagian>

          <SkeletonBagian lebarJudul="w-64">
            <Skeleton className="h-6 w-36 rounded-full" />
            <div className="rounded-r-lg border-l-4 border-brand/40 bg-canvas-soft p-5">
              <SkeletonBaris className="w-4/5" />
              <ul className="mt-3 space-y-1.5 pl-5">
                {['w-2/3', 'w-3/4', 'w-full', 'w-1/2'].map((lebar, i) => (
                  <li key={i}>
                    <SkeletonBaris className={lebar} />
                  </li>
                ))}
              </ul>
            </div>
          </SkeletonBagian>
        </div>
      </div>
    </div>
  )
}

/**
 * Fallback <Suspense> selama kode halaman diunduh: kerangka yang menyerupai halaman tujuan,
 * atau kerangka umum untuk halaman lain.
 */
export function SkeletonRute({ pathname }: { pathname: string }) {
  if (/^\/proyek\/[^/]+\/lapor\/?$/.test(pathname)) return <SkeletonLapor />
  if (/^\/proyek\/[^/]+\/?$/.test(pathname)) return <SkeletonProyekDetail />
  switch (pathname) {
    case '/':
      return <SkeletonBeranda />
    case '/anggaran':
      return <SkeletonHalamanAnggaran />
    case '/peta':
      return <SkeletonHalamanPeta />
    case '/rapor':
      return <SkeletonHalamanRapor />
    case '/tentang-data':
      return <SkeletonTentangData />
    default:
      // Semua rute lain di Layout publik jatuh ke halaman 404 (<TidakDitemukanPage> = satu <EmptyState>).
      return (
        <div role="status">
          <span className="sr-only">Memuat halaman…</span>
          <SkeletonEmptyState />
        </div>
      )
  }
}
