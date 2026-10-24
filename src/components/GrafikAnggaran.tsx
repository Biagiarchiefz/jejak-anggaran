import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatPersen, formatRupiah, formatRupiahRingkas } from '../lib/format'

// Sama dengan token --color-seri-* di index.css.
const WARNA_ANGGARAN = '#2a78d6'
const WARNA_REALISASI = '#eb6834'

export type TitikTren = { tahun: number; anggaran: number; realisasi: number | null }

/** Tren total anggaran vs realisasi antar tahun. */
export function GrafikTren({ data }: { data: TitikTren[] }) {
  return (
    <figure className="min-w-0">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barGap={2}>
            <CartesianGrid vertical={false} stroke="#e7e5e4" />
            <XAxis dataKey="tahun" tickLine={false} axisLine={{ stroke: '#a8a29e' }} tick={{ fill: '#57534e', fontSize: 12 }} />
            <YAxis
              width={64}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#57534e', fontSize: 12 }}
              tickFormatter={(v: number) => formatRupiahRingkas(v).replace('Rp ', '')}
            />
            <Tooltip
              cursor={{ fill: '#f5f5f4' }}
              formatter={(nilai) => formatRupiah(Number(nilai))}
              labelFormatter={(tahun) => `Tahun ${tahun}`}
            />
            <Legend wrapperStyle={{ fontSize: 13, color: '#292524' }} />
            <Bar dataKey="anggaran" name="Anggaran" fill={WARNA_ANGGARAN} radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="realisasi" name="Realisasi" fill={WARNA_REALISASI} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer font-medium text-merek-800">Lihat dalam bentuk tabel</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-slate-600">
              <tr>
                <th className="py-1 pr-3 font-medium">Tahun</th>
                <th className="py-1 pr-3 font-medium">Anggaran</th>
                <th className="py-1 font-medium">Realisasi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t.tahun} className="border-t border-slate-200">
                  <td className="py-1 pr-3">{t.tahun}</td>
                  <td className="py-1 pr-3">{formatRupiah(t.anggaran)}</td>
                  <td className="py-1">{t.realisasi === null ? 'Belum tersedia' : formatRupiah(t.realisasi)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}

export type BarisUrusan = { urusan: string; anggaran: number; realisasi: number | null }

const JUMLAH_AWAL = 8

/** Pembagian anggaran per urusan, sebagai daftar batang HTML (terbaca baik di layar sempit). */
export function GrafikUrusan({ data }: { data: BarisUrusan[] }) {
  const [semua, setSemua] = useState(false)
  const urut = [...data].sort((a, b) => b.anggaran - a.anggaran)
  const tampil = semua ? urut : urut.slice(0, JUMLAH_AWAL)
  const maks = urut[0]?.anggaran ?? 1
  const total = urut.reduce((s, b) => s + b.anggaran, 0)

  return (
    <div>
      <ol className="space-y-3">
        {tampil.map((b) => (
          <li key={b.urusan}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 text-slate-800">{b.urusan}</span>
              <span className="shrink-0 font-medium tabular-nums">{formatRupiahRingkas(b.anggaran)}</span>
            </div>
            <div className="mt-1 h-2.5 w-full rounded-full bg-slate-100" aria-hidden>
              <div className="h-full rounded-full bg-seri-anggaran" style={{ width: `${Math.max((b.anggaran / maks) * 100, 1)}%` }} />
            </div>
            <p className="mt-0.5 text-xs text-slate-600">
              {formatPersen(b.anggaran / total)} dari total
              {b.realisasi !== null && b.anggaran > 0 && <> · terealisasi {formatPersen(b.realisasi / b.anggaran)}</>}
            </p>
          </li>
        ))}
      </ol>
      {urut.length > JUMLAH_AWAL && (
        <button
          type="button"
          onClick={() => setSemua((s) => !s)}
          className="mt-3 text-sm font-medium text-merek-800 underline underline-offset-2"
          aria-expanded={semua}
        >
          {semua ? 'Tampilkan lebih sedikit' : `Tampilkan semua ${urut.length} urusan`}
        </button>
      )}
    </div>
  )
}
