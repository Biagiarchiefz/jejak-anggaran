import { ArrowUpRight, Flag } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '../../../components/common/Badge'
import { FILTER_AWAL, urlPeta } from '../../../utils/filterProyek'
import { formatDurasiJam, formatRupiahRingkas } from '../../../utils/format'
import type { BarisRapor, KelompokRapor } from '../../../utils/rapor'

/** Kecamatan → peta tersaring ke kecamatan itu; satuan kerja → peta dengan kata kunci nama satkernya. */
function urlBaris(b: BarisRapor, kelompok: KelompokRapor) {
  return kelompok === 'kecamatan' ? urlPeta({ filter: { ...FILTER_AWAL, kecamatan: b.nama } }) : urlPeta({ cari: b.nama })
}

/** `1 menunggu · 2 diproses · 1 selesai`; status bernilai 0 tidak ditulis. */
function rincianStatus(b: BarisRapor): string {
  if (b.jumlahLaporan === 0) return 'Belum ada laporan'
  return [
    [b.menunggu, 'menunggu'],
    [b.diproses, 'diproses'],
    [b.selesai, 'selesai'],
    [b.ditolak, 'ditolak'],
  ]
    .filter(([n]) => Number(n) > 0)
    .map(([n, label]) => `${n} ${label}`)
    .join(' · ')
}

function TandaPerhatian({ jumlah }: { jumlah: number }) {
  if (jumlah === 0) return <span className="text-ink-subtle">—</span>
  return (
    <Badge nada="bahaya" ringkas>
      <Flag className="size-3" strokeWidth={1.5} aria-hidden />
      {jumlah} proyek
    </Badge>
  )
}

type TabelRaporProps = {
  baris: BarisRapor[]
  kelompok: KelompokRapor
  /** Total pagu seluruh baris, untuk batang porsi. */
  totalPagu: number
}

/**
 * Rapor per kecamatan / per satuan kerja. Tabel di layar lebar dan saat dicetak, kartu di ponsel (tanpa scroll horizontal).
 * Nama baris menaut ke Peta proyek yang sudah tersaring.
 */
export function TabelRapor({ baris, kelompok, totalPagu }: TabelRaporProps) {
  const judulKolom = kelompok === 'kecamatan' ? 'Kecamatan' : 'Satuan kerja'
  const porsi = (b: BarisRapor) => (totalPagu > 0 ? (b.totalPagu / totalPagu) * 100 : 0)

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface md:block print:block">
        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-20" />
            <col className="w-[20%]" />
            <col />
            <col className="w-28" />
            <col className="w-28" />
          </colgroup>
          <thead className="border-b border-border bg-canvas-soft text-[11px] font-semibold tracking-[0.05em] text-ink-subtle uppercase">
            <tr>
              <th className="px-4 py-2.5">{judulKolom}</th>
              <th className="px-3 py-2.5 text-right">Proyek</th>
              <th className="px-3 py-2.5">Total pagu</th>
              <th className="px-3 py-2.5">Laporan warga</th>
              <th className="px-3 py-2.5">Respons rata-rata</th>
              <th className="px-3 py-2.5">Perlu perhatian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {baris.map((b) => (
              <tr key={b.nama} className="align-top hover:bg-canvas-soft">
                <td className="px-4 py-3">
                  <Link to={urlBaris(b, kelompok)} className="group inline-flex items-start gap-1 font-medium text-ink-strong hover:text-link hover:underline">
                    {b.nama}
                    <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-ink-subtle group-hover:text-link print:hidden" strokeWidth={1.5} aria-hidden />
                    <span className="sr-only"> (lihat di peta)</span>
                  </Link>
                </td>
                <td className="px-3 py-3 text-right text-ink tabular-nums">{b.jumlahProyek}</td>
                <td className="px-3 py-3">
                  <span className="font-semibold text-ink-strong tabular-nums">{formatRupiahRingkas(b.totalPagu)}</span>
                  <span className="mt-1.5 block h-1.5 rounded-full bg-recessed" aria-hidden>
                    <span className="block h-full rounded-full bg-seri-anggaran" style={{ width: `${Math.max(porsi(b), 1)}%` }} />
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="font-semibold text-ink-strong tabular-nums">{b.jumlahLaporan}</span>
                  <span className="block text-xs text-ink-subtle">{rincianStatus(b)}</span>
                </td>
                <td className="px-3 py-3 text-ink-muted tabular-nums">{b.rataRataResponJam === null ? '—' : formatDurasiJam(b.rataRataResponJam)}</td>
                <td className="px-3 py-3">
                  <TandaPerhatian jumlah={b.proyekPerluPerhatian} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden print:hidden">
        {baris.map((b) => (
          <li key={b.nama} className="rounded-lg border border-border bg-surface p-4 shadow-edge">
            <div className="flex items-start justify-between gap-3">
              <Link to={urlBaris(b, kelompok)} className="group inline-flex min-w-0 items-start gap-1 font-semibold text-ink-strong hover:text-link">
                <span className="min-w-0">{b.nama}</span>
                <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-ink-subtle group-hover:text-link" strokeWidth={1.5} aria-hidden />
                <span className="sr-only"> (lihat di peta)</span>
              </Link>
              {b.proyekPerluPerhatian > 0 && <TandaPerhatian jumlah={b.proyekPerluPerhatian} />}
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-border">
              <div className="bg-canvas-soft px-3 py-2">
                <dt className="text-[11px] text-ink-subtle">Proyek</dt>
                <dd className="text-sm font-semibold text-ink-strong tabular-nums">{b.jumlahProyek}</dd>
              </div>
              <div className="bg-canvas-soft px-3 py-2">
                <dt className="text-[11px] text-ink-subtle">Total pagu</dt>
                <dd className="text-sm font-semibold text-ink-strong tabular-nums">{formatRupiahRingkas(b.totalPagu)}</dd>
              </div>
              <div className="bg-canvas-soft px-3 py-2">
                <dt className="text-[11px] text-ink-subtle">Laporan warga</dt>
                <dd className="text-sm font-semibold text-ink-strong tabular-nums">{b.jumlahLaporan}</dd>
              </div>
              <div className="bg-canvas-soft px-3 py-2">
                <dt className="text-[11px] text-ink-subtle">Respons rata-rata</dt>
                <dd className="text-sm font-semibold text-ink-strong tabular-nums">{b.rataRataResponJam === null ? '—' : formatDurasiJam(b.rataRataResponJam)}</dd>
              </div>
            </dl>
            {b.jumlahLaporan > 0 && <p className="mt-2 text-xs text-ink-subtle">{rincianStatus(b)}</p>}
          </li>
        ))}
      </ul>
    </>
  )
}
