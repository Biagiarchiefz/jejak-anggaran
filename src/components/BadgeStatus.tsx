import { Badge, type NadaBadge } from './ui/Badge'
import { LABEL_STATUS_LAPORAN, LABEL_STATUS_PROYEK } from '../lib/label'
import type { Enums } from '../types/database'

const WARNA_TITIK: Record<Enums<'status_proyek'>, string> = {
  direncanakan: 'bg-status-direncanakan',
  berjalan: 'bg-status-berjalan',
  selesai: 'bg-status-selesai',
}

export function BadgeStatusProyek({ status }: { status: Enums<'status_proyek'> }) {
  return (
    <Badge>
      <span className={`size-2 rounded-full ${WARNA_TITIK[status]}`} aria-hidden />
      {LABEL_STATUS_PROYEK[status]}
    </Badge>
  )
}

const NADA_LAPORAN: Record<Enums<'status_laporan'>, NadaBadge> = {
  diterima: 'netral',
  diverifikasi: 'info',
  ditindaklanjuti: 'peringatan',
  selesai: 'sukses',
  ditolak: 'bahaya',
}

export function BadgeStatusLaporan({ status }: { status: Enums<'status_laporan'> }) {
  return <Badge nada={NADA_LAPORAN[status]}>{LABEL_STATUS_LAPORAN[status]}</Badge>
}
