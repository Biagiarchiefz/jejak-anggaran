import { useId, useState, type CSSProperties } from 'react'
import { IkonUrusan } from './IkonUrusan'
import { Lipatan } from '../../../components/common/Lipatan'
import { TombolLipat } from '../../../components/common/TombolLipat'
import { PENDUDUK_KOTA_BANDUNG } from '../../../data/pendudukKotaBandung'
import { anggaranPerWarga } from '../../../utils/anggaran'
import { formatPersen, formatRupiahRingkas } from '../../../utils/format'

export type BarisUrusan = { urusan: string; anggaran: number; realisasi: number | null }

type GrafikUrusanProps = {
  data: BarisUrusan[]
  /** Jumlah urusan yang tampil sebelum diperluas. */
  jumlahAwal?: number
  /** false = tanpa tombol "Tampilkan semua". */
  dapatDiperluas?: boolean
}

/**
 * Pembagian anggaran per urusan, sebagai daftar batang HTML (terbaca baik di layar sempit, tanpa Recharts).
 * Tiap baris: ikon + peringkat, nilai, batang yang mengisi saat kartu muncul, porsi, anggaran per warga, dan serapan.
 */
export function GrafikUrusan({ data, jumlahAwal = 8, dapatDiperluas = true }: GrafikUrusanProps) {
  const idSisa = useId()
  const [semua, setSemua] = useState(false)
  const urut = [...data].sort((a, b) => b.anggaran - a.anggaran)
  const maks = urut[0]?.anggaran ?? 1
  const total = urut.reduce((s, b) => s + b.anggaran, 0)
  const bisaDiperluas = dapatDiperluas && urut.length > jumlahAwal
  const awal = bisaDiperluas ? urut.slice(0, jumlahAwal) : urut
  const sisa = bisaDiperluas ? urut.slice(jumlahAwal) : []

  // Baris padat dua tingkat: nama + nilai, lalu batang + porsi + per warga (+ serapan di layar lebar).
  const baris = (b: BarisUrusan, i: number) => {
    const perWarga = anggaranPerWarga(b.anggaran, PENDUDUK_KOTA_BANDUNG.jumlah)
    return (
      <li
        key={b.urusan}
        className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors duration-200 hover:bg-brand-soft/50"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-brand-soft text-action transition-colors duration-200 group-hover:bg-action group-hover:text-white">
          <IkonUrusan urusan={b.urusan} className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="line-clamp-2 min-w-0 font-medium text-ink sm:line-clamp-1" title={b.urusan}>
              {b.urusan}
            </span>
            <span className="shrink-0 font-semibold text-ink-strong tabular-nums">{formatRupiahRingkas(b.anggaran)}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-subtle tabular-nums">
            <div className="h-1.5 min-w-12 flex-1 rounded-full bg-recessed" aria-hidden>
              <div
                className="animasi-batang h-full rounded-full bg-seri-anggaran"
                style={{ width: `${Math.max((b.anggaran / maks) * 100, 1)}%`, '--tunda': `${Math.min(i, 8) * 60}ms` } as CSSProperties}
              />
            </div>
            <span className="w-8 shrink-0 text-right font-semibold text-ink-muted">{formatPersen(b.anggaran / total)}</span>
            {perWarga && <span className="w-28 shrink-0">≈ {formatRupiahRingkas(perWarga.perTahun)}/warga</span>}
            {b.realisasi !== null && b.anggaran > 0 && (
              <span className="hidden w-24 shrink-0 sm:inline">serapan {formatPersen(b.realisasi / b.anggaran)}</span>
            )}
          </div>
        </div>
      </li>
    )
  }

  return (
    <div>
      <ol>{awal.map(baris)}</ol>
      {bisaDiperluas && (
        <>
          {/* Sisa urusan dalam daftar lanjutan agar bisa dibuka-tutup dengan animasi; `start` menjaga nomor urut. */}
          <Lipatan terbuka={semua} id={idSisa}>
            <ol start={jumlahAwal + 1} className="px-2">
              {sisa.map((b, i) => baris(b, i))}
            </ol>
          </Lipatan>
          <div className="mt-1 border-t border-border-soft pt-1">
            <TombolLipat terbuka={semua} onClick={() => setSemua((s) => !s)} aria-controls={idSisa}>
              {semua ? 'Tampilkan lebih sedikit' : `Tampilkan ${sisa.length} urusan lainnya`}
            </TombolLipat>
          </div>
        </>
      )}
    </div>
  )
}
