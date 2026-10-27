import { useState } from 'react'
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
  const [semua, setSemua] = useState(false)
  const urut = [...data].sort((a, b) => b.anggaran - a.anggaran)
  const tampil = semua ? urut : urut.slice(0, jumlahAwal)
  const maks = urut[0]?.anggaran ?? 1
  const total = urut.reduce((s, b) => s + b.anggaran, 0)

  return (
    <div>
      <ol className="space-y-4">
        {tampil.map((b) => (
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
        ))}
      </ol>
      {dapatDiperluas && urut.length > jumlahAwal && (
        <button
          type="button"
          onClick={() => setSemua((s) => !s)}
          className="mt-4 text-sm font-medium text-link hover:underline"
          aria-expanded={semua}
        >
          {semua ? 'Tampilkan lebih sedikit' : `Tampilkan semua ${urut.length} urusan`}
        </button>
      )}
    </div>
  )
}
