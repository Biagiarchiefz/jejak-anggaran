import type { ReactNode } from 'react'
import { SumberAnggaran } from './SumberAnggaran'
import { SumberData } from './SumberData'
import { ErrorState } from './ui/ErrorState'
import { LabelSeksi } from './ui/LabelSeksi'
import { PitaPenuh } from './ui/PitaPenuh'
import { useAngkaBergerak } from '../hooks/useAngkaBergerak'
import type { StateMuat } from '../hooks/useMuat'
import { totalPerTahun, urusanPadaTahun } from '../lib/anggaran'
import { formatRupiahRingkasSatuan } from '../lib/format'
import type { AnggaranDaerah } from '../services/anggaranService'
import type { ProyekDenganRedFlag } from '../services/proyekService'

const KELAS_ANGKA = 'text-[36px] leading-none font-semibold tracking-[-0.02em] text-white tabular-nums md:text-5xl'

/**
 * Angka statistik yang berhitung naik saat pita terlihat. Pembaca layar langsung mendapat angka akhir;
 * angka yang bergerak disembunyikan darinya agar tidak dibacakan berulang.
 */
function AngkaBergerak({ target, format }: { target: number; format: (nilai: number) => string }) {
  const { ref, nilai } = useAngkaBergerak<HTMLParagraphElement>(target)
  return (
    <p ref={ref} className={KELAS_ANGKA}>
      <span aria-hidden>{format(nilai)}</span>
      <span className="sr-only">{format(target)}</span>
    </p>
  )
}

type StatistikProps = {
  /** Angka akhir yang dianimasikan; `null` = tidak ada data (tampil "–"). */
  target: number | null
  format: (nilai: number) => string
  label: string
  sumber: ReactNode
}

function Statistik({ target, format, label, sumber }: StatistikProps) {
  return (
    <div className="border-t border-white/15 pt-6">
      {target === null ? <p className={KELAS_ANGKA}>–</p> : <AngkaBergerak target={target} format={format} />}
      <p className="mt-3 text-sm text-on-dark-muted">{label}</p>
      {sumber}
    </div>
  )
}

const formatBulat = (n: number) => String(Math.round(n))

function SkeletonStatistik() {
  return (
    <div className="border-t border-white/15 pt-6" aria-hidden>
      <div className="h-12 w-32 animate-pulse rounded-md bg-white/10" />
      <div className="mt-3 h-4 w-40 animate-pulse rounded-md bg-white/10" />
    </div>
  )
}

type PitaStatistikProps = {
  anggaran: StateMuat<AnggaranDaerah[]>
  proyek: StateMuat<ProyekDenganRedFlag[]>
}

/** Pita statistik "angka besar" (DESIGN.md §7.4): latar band, 4 angka, masing-masing dengan sumbernya. */
export function PitaStatistik({ anggaran, proyek }: PitaStatistikProps) {
  const dataAnggaran = anggaran.data ?? []
  const dataProyek = proyek.data ?? []
  const tren = totalPerTahun(dataAnggaran)
  const terakhir = tren.at(-1)
  const barisTerakhir = terakhir ? urusanPadaTahun(dataAnggaran, terakhir.tahun) : []
  const totalPagu = dataProyek.reduce((s, p) => s + p.pagu, 0)
  const proyekDemo = dataProyek.some((p) => p.is_demo)

  const sumberProyek = (
    <SumberData nama="SiRUP LKPP dan LPSE Kota Bandung (kurasi tim)" demo={proyekDemo} variant="dark" className="mt-3" />
  )

  return (
    <PitaPenuh className="bg-band py-16 text-white md:py-24" aria-labelledby="judul-statistik">
      <div data-muncul="" className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <LabelSeksi terang>Dalam angka</LabelSeksi>
          <h2 id="judul-statistik" className="mt-3 text-[28px] leading-[1.12] font-medium tracking-[-0.015em] text-white md:text-[40px]">
            Uang publik Kota Bandung yang kami lacak
          </h2>
        </div>
      </div>

      <div data-muncul-anak="" className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {anggaran.memuat && !anggaran.data ? (
          <SkeletonStatistik />
        ) : anggaran.error ? (
          <div className="sm:col-span-2 lg:col-span-1">
            <ErrorState pesan={anggaran.error.pesan} onCobaLagi={anggaran.muatUlang} />
          </div>
        ) : terakhir ? (
          <Statistik
            target={terakhir.anggaran}
            format={(n) => formatRupiahRingkasSatuan(n, terakhir.anggaran)}
            label={`Total APBD ${terakhir.tahun}`}
            sumber={<SumberAnggaran baris={barisTerakhir} variant="dark" className="mt-3" />}
          />
        ) : (
          <Statistik target={null} format={formatBulat} label="Data APBD belum tersedia" sumber={null} />
        )}

        {proyek.memuat && !proyek.data ? (
          <>
            <SkeletonStatistik />
            <SkeletonStatistik />
            <SkeletonStatistik />
          </>
        ) : proyek.error ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <ErrorState pesan={proyek.error.pesan} onCobaLagi={proyek.muatUlang} />
          </div>
        ) : (
          <>
            <Statistik target={dataProyek.length} format={formatBulat} label="Paket proyek dipantau" sumber={sumberProyek} />
            <Statistik
              target={totalPagu}
              format={(n) => formatRupiahRingkasSatuan(n, totalPagu)}
              label="Total pagu proyek dipantau"
              sumber={sumberProyek}
            />
            <Statistik
              target={dataProyek.filter((p) => p.redFlag).length}
              format={formatBulat}
              label="Proyek perlu perhatian"
              sumber={<p className="mt-3 text-xs font-medium text-on-dark-muted">Dihitung dari laporan warga terverifikasi.</p>}
            />
          </>
        )}
      </div>
    </PitaPenuh>
  )
}
