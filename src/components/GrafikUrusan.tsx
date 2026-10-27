import { useId, useState } from 'react'
import { Lipatan } from './ui/Lipatan'
import { TombolLipat } from './ui/TombolLipat'
import { formatPersen, formatRupiahRingkas } from '../lib/format'

export type BarisUrusan = { urusan: string; anggaran: number; realisasi: number | null }

type GrafikUrusanProps = {
  data: BarisUrusan[]
  /** Jumlah urusan yang tampil sebelum diperluas. */
  jumlahAwal?: number
  /** false = tanpa tombol "Tampilkan semua". */
  dapatDiperluas?: boolean
}

/** Pembagian anggaran per urusan, sebagai daftar batang HTML (terbaca baik di layar sempit, tanpa Recharts). */
export function GrafikUrusan({ data, jumlahAwal = 8, dapatDiperluas = true }: GrafikUrusanProps) {
  const idSisa = useId()
  const [semua, setSemua] = useState(false)
  const urut = [...data].sort((a, b) => b.anggaran - a.anggaran)
  const maks = urut[0]?.anggaran ?? 1
  const total = urut.reduce((s, b) => s + b.anggaran, 0)
  const bisaDiperluas = dapatDiperluas && urut.length > jumlahAwal
  const awal = bisaDiperluas ? urut.slice(0, jumlahAwal) : urut
  const sisa = bisaDiperluas ? urut.slice(jumlahAwal) : []

  const baris = (b: BarisUrusan) => (
    <li key={b.urusan}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 text-ink">{b.urusan}</span>
        <span className="shrink-0 font-medium text-ink-strong tabular-nums">{formatRupiahRingkas(b.anggaran)}</span>
      </div>
      <div className="mt-1.5 h-2 w-full rounded-full bg-recessed" aria-hidden>
        <div className="h-full rounded-full bg-seri-anggaran" style={{ width: `${Math.max((b.anggaran / maks) * 100, 1)}%` }} />
      </div>
      <p className="mt-1 text-xs text-ink-subtle tabular-nums">
        {formatPersen(b.anggaran / total)} dari total
        {b.realisasi !== null && b.anggaran > 0 && <> · terealisasi {formatPersen(b.realisasi / b.anggaran)}</>}
      </p>
    </li>
  )

  return (
    <div>
      <ol className="space-y-4">{awal.map(baris)}</ol>
      {bisaDiperluas && (
        <>
          {/* Sisa urusan dalam daftar lanjutan agar bisa dibuka-tutup dengan animasi; `start` menjaga nomor urut. */}
          <Lipatan terbuka={semua} id={idSisa}>
            <ol start={jumlahAwal + 1} className="space-y-4 pt-4">
              {sisa.map(baris)}
            </ol>
          </Lipatan>
          <TombolLipat terbuka={semua} onClick={() => setSemua((s) => !s)} aria-controls={idSisa} className="mt-2">
            {semua ? 'Tampilkan lebih sedikit' : `Tampilkan semua ${urut.length} urusan`}
          </TombolLipat>
        </>
      )}
    </div>
  )
}
