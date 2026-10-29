import { FileText } from 'lucide-react'
import { formatTanggal } from '../../utils/format'

type SumberDataProps = {
  nama: string
  url?: string | null
  diaksesPada?: string | null
  /** Angka berasal dari data demo (fiktif): tidak diberi baris sumber. */
  demo?: boolean
  /** `dark` untuk di atas pita gelap (`band`). */
  variant?: 'light' | 'dark'
  /** Di dalam kartu: dipisah garis putus-putus dari angka di atasnya (DESIGN.md §7.7). */
  dalamKartu?: boolean
  className?: string
}

/**
 * Sumber setiap angka anggaran, pagu, atau kontrak: nama sumber, tanggal akses, dan tautan.
 * Data demo tidak diberi baris sumber; penandanya satu catatan global di footer (utils/penandaDemo).
 */
export function SumberData({ nama, url, diaksesPada, demo, variant = 'light', dalamKartu, className }: SumberDataProps) {
  if (demo) return null

  const gelap = variant === 'dark'
  const kelasTautan = `${gelap ? 'text-brand-light' : 'text-link'} hover:underline underline-offset-2`

  return (
    <p
      className={`flex items-start gap-1.5 text-xs font-medium ${gelap ? 'text-on-dark-muted' : 'text-ink-subtle'} ${
        dalamKartu ? `mt-3 border-t border-dashed pt-2 ${gelap ? 'border-white/15' : 'border-border'}` : ''
      } ${className ?? ''}`}
    >
      <FileText className="mt-px size-3 shrink-0" strokeWidth={1.5} aria-hidden />
      <span>
        Sumber:{' '}
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className={kelasTautan}>
            {nama}
            <span aria-hidden> ↗</span>
            <span className="sr-only"> (membuka tab baru)</span>
          </a>
        ) : (
          nama
        )}
        {diaksesPada && <> · diakses {formatTanggal(diaksesPada)}</>}
      </span>
    </p>
  )
}
