import { formatTanggalJam } from '../lib/format'
import { LABEL_STATUS_LAPORAN } from '../lib/label'
import type { RiwayatPublik } from '../services/laporanService'

/** Audit trail perubahan status laporan (F8). Tampil publik. Titik 10px tersambung garis 2px. */
export function LinimasaStatus({ riwayat }: { riwayat: RiwayatPublik[] }) {
  if (riwayat.length === 0) return <p className="text-sm text-ink-muted">Belum ada riwayat status.</p>

  return (
    <ol className="relative space-y-4 border-l-2 border-border pl-5">
      {riwayat.map((r, i) => (
        <li key={r.id} className="relative">
          {/* Tahap terakhir = cincin brand isi surface; tahap sebelumnya = titik action terisi. */}
          <span
            className={`absolute top-1.5 -left-[26px] size-2.5 rounded-full ${
              i === riwayat.length - 1 ? 'border-2 border-brand bg-surface' : 'bg-action'
            }`}
            aria-hidden
          />
          <p className="text-sm text-ink">
            {r.status_lama ? (
              <>
                <span className="text-ink-muted">{LABEL_STATUS_LAPORAN[r.status_lama]}</span>
                <span aria-label="menjadi"> → </span>
                <span className="font-medium text-ink-strong">{LABEL_STATUS_LAPORAN[r.status_baru]}</span>
              </>
            ) : (
              <span className="font-medium text-ink-strong">{LABEL_STATUS_LAPORAN[r.status_baru]}</span>
            )}
          </p>
          <p className="text-xs text-ink-subtle">
            <time dateTime={r.created_at}>{formatTanggalJam(r.created_at)}</time> ·{' '}
            {r.olehAdmin ? 'Admin (simulasi instansi)' : 'Sistem'}
          </p>
          {r.catatan && <p className="mt-0.5 text-sm text-ink-muted">“{r.catatan}”</p>}
        </li>
      ))}
    </ol>
  )
}
