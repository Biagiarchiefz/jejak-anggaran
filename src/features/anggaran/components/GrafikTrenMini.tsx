import { useState } from 'react'
import { formatRupiahRingkas } from '../../../utils/format'
import type { TotalTahun } from '../../../utils/anggaran'

// Koordinat viewBox. SVG diskalakan seragam (h-auto), jadi persentase posisi tooltip/label tetap tepat.
const LEBAR = 320
const TINGGI = 96
const PAD_X = 22
const PAD_ATAS = 10

/**
 * Tren total anggaran antartahun: garis + area tipis (SVG inline, tanpa Recharts).
 * Sumbu y sengaja tidak mulai dari nol: grafik ini menunjukkan arah tren, angkanya ada di tooltip.
 * Arahkan kursor/ketuk untuk melihat nilai per tahun.
 */
export function GrafikTrenMini({ tren }: { tren: TotalTahun[] }) {
  const [aktif, setAktif] = useState<number | null>(null)

  const nilai = tren.map((t) => t.anggaran)
  const maks = Math.max(...nilai)
  const rentang = maks - Math.min(...nilai) || maks || 1
  const dasar = Math.min(...nilai) - rentang * 0.6
  const langkah = (LEBAR - 2 * PAD_X) / Math.max(tren.length - 1, 1)
  const titik = tren.map((t, i) => ({
    x: PAD_X + i * langkah,
    y: PAD_ATAS + (1 - (t.anggaran - dasar) / (maks - dasar)) * (TINGGI - PAD_ATAS),
  }))
  const garis = titik.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ')
  const area = `${garis} L${titik[titik.length - 1].x},${TINGGI} L${titik[0].x},${TINGGI} Z`
  const terakhir = titik.length - 1

  const ringkasan = tren.map((t) => `${t.tahun}: ${formatRupiahRingkas(t.anggaran)}`).join(', ')

  return (
    <figure className="relative select-none" onPointerLeave={() => setAktif(null)}>
      <svg viewBox={`0 0 ${LEBAR} ${TINGGI}`} className="block h-auto w-full overflow-visible" role="img" aria-label={`Tren total anggaran. ${ringkasan}.`}>
        {/* Garis grid tipis. */}
        {[0.33, 0.66].map((r) => (
          <line key={r} x1={0} x2={LEBAR} y1={TINGGI * r} y2={TINGGI * r} stroke="var(--color-border-soft)" vectorEffect="non-scaling-stroke" />
        ))}
        <line x1={0} x2={LEBAR} y1={TINGGI - 0.5} y2={TINGGI - 0.5} stroke="var(--color-border)" vectorEffect="non-scaling-stroke" />
        {/* Area polos tipis, tanpa gradien. */}
        <path d={area} fill="var(--color-seri-anggaran)" fillOpacity={0.06} />
        {aktif !== null && (
          <line
            x1={titik[aktif].x}
            x2={titik[aktif].x}
            y1={titik[aktif].y}
            y2={TINGGI}
            stroke="var(--color-border-strong)"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        )}
        <path
          d={garis}
          fill="none"
          stroke="var(--color-seri-anggaran)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Titik hanya saat hover (DESIGN.md §7.11). */}
        {aktif !== null && (
          <circle cx={titik[aktif].x} cy={titik[aktif].y} r={4.5} fill="var(--color-seri-anggaran)" stroke="white" strokeWidth={2} />
        )}
      </svg>

      {aktif !== null && (
        <div
          className={`pointer-events-none absolute -translate-y-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs whitespace-nowrap text-ink-strong tabular-nums shadow-pop ${
            aktif === 0 ? '-translate-x-3' : aktif === terakhir ? '-translate-x-[calc(100%-0.75rem)]' : '-translate-x-1/2'
          }`}
          style={{ left: `${(titik[aktif].x / LEBAR) * 100}%`, top: `calc(${(titik[aktif].y / TINGGI) * 100}% - 0.6rem)` }}
          aria-hidden
        >
          <span className="text-ink-subtle">{tren[aktif].tahun}</span> {formatRupiahRingkas(tren[aktif].anggaran)}
        </div>
      )}

      {/* Area sentuh per tahun: selebar kolomnya, jauh lebih besar dari titiknya. */}
      <div className="absolute inset-0 flex" aria-hidden>
        {tren.map((t, i) => (
          <div key={t.tahun} className="h-full flex-1 cursor-crosshair" onPointerEnter={() => setAktif(i)} onPointerDown={() => setAktif(i)} />
        ))}
      </div>

      <div className="relative mt-2 h-4 text-xs text-ink-subtle tabular-nums" aria-hidden>
        {tren.map((t, i) => (
          <span
            key={t.tahun}
            className={`absolute -translate-x-1/2 transition-colors duration-150 ${i === (aktif ?? terakhir) ? 'text-ink-strong' : ''}`}
            style={{ left: `${(titik[i].x / LEBAR) * 100}%` }}
          >
            {t.tahun}
          </span>
        ))}
      </div>
    </figure>
  )
}
