import { Check } from 'lucide-react'
import { BadgeStatusLaporan } from './BadgeStatus'
import { LinimasaStatus } from './LinimasaStatus'
import { TeruskanKeLapor } from './TeruskanKeLapor'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { formatTanggal } from '../lib/format'
import { LABEL_KATEGORI } from '../lib/label'
import type { LaporanDenganRiwayat } from '../services/proyekService'

export type StatusKonfirmasi = 'tamu' | 'memuat' | 'milik-saya' | 'sudah' | 'bisa'

type KartuLaporanProps = {
  laporan: LaporanDenganRiwayat
  ringkasanLapor: string
  statusKonfirmasi: StatusKonfirmasi
  mengonfirmasi: boolean
  pesanKonfirmasi?: string
  onKonfirmasi: () => void
}

export function KartuLaporan({
  laporan,
  ringkasanLapor,
  statusKonfirmasi,
  mengonfirmasi,
  pesanKonfirmasi,
  onKonfirmasi,
}: KartuLaporanProps) {
  const ditolak = laporan.status === 'ditolak'

  return (
    <article className="rounded-lg border border-border bg-surface p-5 shadow-edge sm:p-6" aria-labelledby={`laporan-${laporan.id}`}>
      <header className="flex flex-wrap items-center gap-1.5">
        <h3 id={`laporan-${laporan.id}`} className="mr-1 text-base font-semibold">
          {LABEL_KATEGORI[laporan.kategori]}
        </h3>
        <BadgeStatusLaporan status={laporan.status} />
      </header>
      <p className="mt-1 text-xs text-ink-subtle">
        Dilaporkan warga · <time dateTime={laporan.created_at}>{formatTanggal(laporan.created_at)}</time>
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        {laporan.fotoUrl && (
          <a href={laporan.fotoUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 sm:w-40">
            <img
              src={laporan.fotoUrl}
              alt={`Foto kondisi yang dilaporkan, ${formatTanggal(laporan.created_at)}`}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-md bg-recessed object-cover"
            />
          </a>
        )}
        <p className="min-w-0 text-sm whitespace-pre-line text-ink-muted">{laporan.deskripsi}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge>{laporan.jumlah_konfirmasi} warga mengonfirmasi</Badge>
        {!ditolak && statusKonfirmasi === 'bisa' && (
          <Button ukuran="sm" onClick={onKonfirmasi} memuat={mengonfirmasi}>
            Saya juga melihat kondisi ini
          </Button>
        )}
        {!ditolak && statusKonfirmasi === 'tamu' && (
          <Button ukuran="sm" varian="kedua" onClick={onKonfirmasi}>
            Masuk untuk mengonfirmasi
          </Button>
        )}
        {statusKonfirmasi === 'sudah' && (
          <span className="inline-flex items-center gap-1 text-sm text-success">
            <Check className="size-4" strokeWidth={1.5} aria-hidden />
            Anda sudah mengonfirmasi
          </span>
        )}
        {statusKonfirmasi === 'milik-saya' && <span className="text-sm text-ink-muted">Ini laporan Anda</span>}
      </div>
      {pesanKonfirmasi && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {pesanKonfirmasi}
        </p>
      )}

      <details className="mt-4 border-t border-border-soft pt-4">
        <summary className="cursor-pointer text-sm font-medium text-link hover:underline">
          Riwayat status ({laporan.riwayat.length})
        </summary>
        <div className="mt-3">
          <LinimasaStatus riwayat={laporan.riwayat} />
          {laporan.catatan_status && laporan.riwayat.length === 0 && (
            <p className="mt-2 text-sm text-ink-muted">Catatan: {laporan.catatan_status}</p>
          )}
        </div>
      </details>

      {!ditolak && (
        <div className="mt-4">
          <TeruskanKeLapor ringkasan={ringkasanLapor} />
        </div>
      )}
    </article>
  )
}
