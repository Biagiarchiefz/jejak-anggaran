import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatRupiah, formatRupiahRingkas } from '../lib/format'

// Sama dengan token --color-seri-* di index.css.
const WARNA_ANGGARAN = '#2a78d6'
const WARNA_REALISASI = '#eb6834'

export type TitikTren = { tahun: number; anggaran: number; realisasi: number | null }

/** Tren total anggaran vs realisasi antar tahun. Memakai Recharts, jadi hanya dimuat di halaman Anggaran. */
export function GrafikTren({ data }: { data: TitikTren[] }) {
  return (
    <figure className="min-w-0">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barGap={2}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="tahun" tickLine={false} axisLine={{ stroke: '#94a3b8' }} tick={{ fill: '#475569', fontSize: 12 }} />
            <YAxis
              width={64}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#475569', fontSize: 12 }}
              tickFormatter={(v: number) => formatRupiahRingkas(v).replace('Rp ', '')}
            />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              formatter={(nilai) => formatRupiah(Number(nilai))}
              labelFormatter={(tahun) => `Tahun ${tahun}`}
            />
            <Legend wrapperStyle={{ fontSize: 13, color: '#1e293b' }} />
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
