import { UsersRound } from 'lucide-react'
import { SumberData } from '../../../components/common/SumberData'
import { PENDUDUK_KOTA_BANDUNG } from '../../../data/pendudukKotaBandung'
import { anggaranPerWarga } from '../../../utils/anggaran'
import { formatRupiah, formatRupiahRingkas } from '../../../utils/format'

const jutaJiwa = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 })

type KonteksWargaProps = {
  /** Total anggaran yang dibagi rata. */
  anggaran: number
  tahun: number
  /** `lebar`: pita satu baris di halaman Anggaran; `ringkas`: kotak di dalam kartu. */
  varian?: 'lebar' | 'ringkas'
  className?: string
}

/**
 * Menerjemahkan APBD triliunan rupiah ke skala warga: anggaran dibagi rata per penduduk, per tahun dan per hari.
 * Selalu disertai catatan bahwa ini ilustrasi skala (bukan uang yang diterima warga) dan sumber jumlah penduduk.
 */
export function KonteksWarga({ anggaran, tahun, varian = 'ringkas', className }: KonteksWargaProps) {
  const p = PENDUDUK_KOTA_BANDUNG
  const perWarga = anggaranPerWarga(anggaran, p.jumlah)
  if (!perWarga) return null
  const lebar = varian === 'lebar'

  return (
    <div
      className={`rounded-lg border border-brand/15 bg-brand-soft/50 ${lebar ? 'p-5 sm:flex sm:items-center sm:gap-6 sm:p-6' : 'flex items-start gap-3 p-4'} ${className ?? ''}`}
    >
      <span
        className={`grid shrink-0 place-items-center rounded-md bg-surface text-action shadow-edge ${lebar ? 'size-12' : 'size-10'}`}
        aria-hidden
      >
        <UsersRound className={lebar ? 'size-6' : 'size-5'} strokeWidth={1.5} />
      </span>
      <div className={`min-w-0 ${lebar ? 'mt-4 sm:mt-0' : ''}`}>
        <p className={`text-ink ${lebar ? 'text-base sm:text-lg' : 'text-sm'}`}>
          Jika dibagi rata, APBD {tahun} setara{' '}
          <strong className="font-semibold whitespace-nowrap text-ink-strong tabular-nums">
            {formatRupiahRingkas(perWarga.perTahun)} per warga
          </strong>{' '}
          setahun, atau sekitar{' '}
          <strong className="font-semibold whitespace-nowrap text-ink-strong tabular-nums">
            {formatRupiah(Math.round(perWarga.perHari / 100) * 100)} per hari
          </strong>
          .
        </p>
        <p className="mt-1 text-xs text-ink-subtle">
          Ilustrasi skala, bukan uang yang diterima tiap warga. Dihitung dari{' '}
          <span className="tabular-nums">{jutaJiwa.format(p.jumlah / 1e6)} juta</span> penduduk ({p.tahun}).
        </p>
        <SumberData nama={p.sumber.nama} url={p.sumber.url} diaksesPada={p.sumber.diakses_pada} className="mt-1" />
      </div>
    </div>
  )
}
