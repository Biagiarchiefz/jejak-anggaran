import { formatTanggalJam } from '../lib/format'
import { LABEL_STATUS_LAPORAN } from '../lib/label'
import type { RiwayatPublik } from '../services/laporanService'

/** Audit trail perubahan status laporan (F8). Tampil publik. */
export function LinimasaStatus({ riwayat }: { riwayat: RiwayatPublik[] }) {
  if (riwayat.length === 0) return <p className="text-sm text-slate-600">Belum ada riwayat status.</p>

  return (
    <ol className="relative space-y-3 border-l-2 border-slate-200 pl-4">
      {riwayat.map((r) => (
        <li key={r.id} className="relative">
          <span className="absolute top-1.5 -left-[23px] size-3 rounded-full border-2 border-white bg-merek-700" aria-hidden />
          <p className="text-sm">
            {r.status_lama ? (
              <>
                <span className="text-slate-600">{LABEL_STATUS_LAPORAN[r.status_lama]}</span>
                <span aria-label="menjadi"> → </span>
                <strong>{LABEL_STATUS_LAPORAN[r.status_baru]}</strong>
              </>
            ) : (
              <strong>{LABEL_STATUS_LAPORAN[r.status_baru]}</strong>
            )}
          </p>
          <p className="text-xs text-slate-600">
            <time dateTime={r.created_at}>{formatTanggalJam(r.created_at)}</time> ·{' '}
            {r.olehAdmin ? 'Admin (simulasi instansi)' : 'Sistem'}
          </p>
          {r.catatan && <p className="mt-0.5 text-sm text-slate-600">“{r.catatan}”</p>}
        </li>
      ))}
    </ol>
  )
}
