import { Link } from 'react-router'
import { formatTanggal } from '../lib/format'

type SumberDataProps = {
  nama: string
  url?: string | null
  diaksesPada?: string | null
  /** Angka berasal dari data demo (fiktif). */
  demo?: boolean
  className?: string
}

/**
 * Sumber setiap angka anggaran, pagu, atau kontrak: nama sumber, tanggal akses,
 * dan tautan. Wajib menyertai setiap angka uang yang tampil.
 */
export function SumberData({ nama, url, diaksesPada, demo, className }: SumberDataProps) {
  if (demo) {
    return (
      <p className={`text-xs text-slate-600 ${className ?? ''}`}>
        Sumber: <span className="font-medium">data demo (fiktif)</span>, bukan data resmi.{' '}
        <Link to="/tentang-data#data-demo" className="underline underline-offset-2 hover:text-slate-900">
          Apa artinya?
        </Link>
      </p>
    )
  }

  return (
    <p className={`text-xs text-slate-600 ${className ?? ''}`}>
      Sumber:{' '}
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-merek-800 underline underline-offset-2 hover:text-merek-900"
        >
          {nama}
          <span className="sr-only"> (membuka tab baru)</span>
        </a>
      ) : (
        <span className="font-medium">{nama}</span>
      )}
      {diaksesPada && <> · diakses {formatTanggal(diaksesPada)}</>}
    </p>
  )
}
