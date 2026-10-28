import { useId, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Lipatan } from './ui/Lipatan'
import { TombolLipat } from './ui/TombolLipat'
import { formatRupiah, formatRupiahRingkas } from '../lib/format'
import { WARNA } from '../lib/warna'

export type TitikTren = { tahun: number; anggaran: number; realisasi: number | null }

const SUMBU = { fill: WARNA.inkSubtle, fontSize: 12 }

/** Tren total anggaran vs realisasi antar tahun. Memakai Recharts, jadi hanya dimuat di halaman Anggaran. */
export function GrafikTren({ data }: { data: TitikTren[] }) {
  const idTabel = useId()
  const [tabel, setTabel] = useState(false)

  return (
    <figure className="min-w-0">
      <div className="h-60 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barGap={2}>
            <CartesianGrid vertical={false} stroke={WARNA.border} />
            <XAxis dataKey="tahun" tickLine={false} axisLine={{ stroke: WARNA.border }} tick={SUMBU} />
            <YAxis
              width={64}
              tickLine={false}
              axisLine={false}
              tick={SUMBU}
              tickFormatter={(v: number) => formatRupiahRingkas(v).replace('Rp ', '')}
            />
            {/* Tooltip: kartu putih rounded-md, border, bayangan pop, angka tabular. */}
            <Tooltip
              cursor={{ fill: WARNA.recessed }}
              contentStyle={{
                backgroundColor: WARNA.surface,
                borderRadius: 8,
                border: `1px solid ${WARNA.border}`,
                boxShadow: '0 12px 32px -8px rgb(15 59 110 / 0.16)',
                fontSize: 13,
                fontVariantNumeric: 'tabular-nums',
              }}
              labelStyle={{ color: WARNA.ink, fontWeight: 500 }}
              formatter={(nilai) => formatRupiah(Number(nilai))}
              labelFormatter={(tahun) => `Tahun ${tahun}`}
            />
            {/* Legenda di atas grafik, rata kiri, 12px. */}
            <Legend
              verticalAlign="top"
              align="left"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: WARNA.inkSubtle, paddingBottom: 12 }}
            />
            <Bar dataKey="anggaran" name="Anggaran" fill={WARNA.seriAnggaran} radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="realisasi" name="Realisasi" fill={WARNA.seriRealisasi} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Tombol tabel di kaki kartu grafik, dipisah garis tipis dari plot. */}
      <div className="mt-2 border-t border-border-soft pt-1">
        <TombolLipat terbuka={tabel} onClick={() => setTabel((t) => !t)} aria-controls={idTabel}>
          {tabel ? 'Sembunyikan tabel' : 'Lihat dalam bentuk tabel'}
        </TombolLipat>
      </div>
      <Lipatan terbuka={tabel} id={idTabel} className="text-sm">
        <div className="mt-1 overflow-hidden rounded-md border border-border">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-canvas-soft text-xs tracking-[0.04em] text-ink-muted uppercase">
              <tr>
                <th className="px-3 py-2">Tahun</th>
                <th className="px-3 py-2 text-right">Anggaran</th>
                <th className="px-3 py-2 text-right">Realisasi</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {data.map((t) => (
                <tr key={t.tahun} className="border-b border-border-soft last:border-0 hover:bg-brand-soft/60">
                  <td className="px-3 py-2">{t.tahun}</td>
                  <td className="px-3 py-2 text-right">{formatRupiahRingkas(t.anggaran)}</td>
                  <td className="px-3 py-2 text-right">{t.realisasi === null ? 'Belum ada' : formatRupiahRingkas(t.realisasi)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Lipatan>
    </figure>
  )
}
