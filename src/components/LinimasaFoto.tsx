import { BadgeDemo } from './BadgeDemo'
import { formatTanggal } from '../lib/format'
import { LABEL_KATEGORI } from '../lib/label'
import type { LaporanPublik } from '../services/laporanService'

/** Foto kondisi proyek dari laporan warga, urut dari yang terlama. */
export function LinimasaFoto({ laporan }: { laporan: LaporanPublik[] }) {
  const berfoto = laporan
    .filter((l) => l.fotoUrl)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))

  if (berfoto.length === 0) {
    return <p className="text-sm text-slate-600">Belum ada foto kondisi lapangan untuk proyek ini.</p>
  }

  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {berfoto.map((l) => (
        <li key={l.id}>
          <figure>
            <a href={l.fotoUrl!} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-ui border border-slate-200">
              <img
                src={l.fotoUrl!}
                alt={`Foto laporan ${LABEL_KATEGORI[l.kategori].toLowerCase()}, ${formatTanggal(l.created_at)}`}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full bg-slate-100 object-cover"
              />
            </a>
            <figcaption className="mt-1 flex flex-wrap items-center gap-1 text-xs text-slate-600">
              <time dateTime={l.created_at}>{formatTanggal(l.created_at)}</time>
              {l.is_demo && <BadgeDemo />}
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  )
}
