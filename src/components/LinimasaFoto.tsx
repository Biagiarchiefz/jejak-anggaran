import { formatTanggal } from '../lib/format'
import { LABEL_KATEGORI } from '../lib/label'
import type { LaporanPublik } from '../services/laporanService'

/** Foto kondisi proyek dari laporan warga, urut dari yang terlama (DESIGN.md §7.12: strip gulir horizontal 4:3). */
export function LinimasaFoto({ laporan }: { laporan: LaporanPublik[] }) {
  const berfoto = laporan
    .filter((l) => l.fotoUrl)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))

  if (berfoto.length === 0) {
    return <p className="text-sm text-ink-muted">Belum ada foto kondisi lapangan untuk proyek ini.</p>
  }

  return (
    <ol className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {berfoto.map((l) => (
        <li key={l.id} className="w-56 shrink-0 snap-start">
          <figure>
            {/* Foto warga tanpa border. */}
            <a href={l.fotoUrl!} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-md">
              <img
                src={l.fotoUrl!}
                alt={`Foto laporan ${LABEL_KATEGORI[l.kategori].toLowerCase()}, ${formatTanggal(l.created_at)}`}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full bg-recessed object-cover"
              />
            </a>
            <figcaption className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-ink-subtle">
              <span className="font-medium text-ink-muted">Foto warga</span>·
              <time dateTime={l.created_at}>{formatTanggal(l.created_at)}</time>
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  )
}
