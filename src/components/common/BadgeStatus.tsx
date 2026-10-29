import { Badge, type NadaBadge } from './Badge'
import { LABEL_STATUS_LAPORAN, LABEL_STATUS_PROYEK } from '../../utils/label'
import type { Enums } from '../../types/database'

// DESIGN.md §7.6: direncanakan/berjalan netral, selesai hijau.
const NADA_PROYEK: Record<Enums<'status_proyek'>, NadaBadge> = {
  direncanakan: 'netral',
  berjalan: 'netral',
  selesai: 'sukses',
}

export function BadgeStatusProyek({ status, ringkas }: { status: Enums<'status_proyek'>; ringkas?: boolean }) {
  return (
    <Badge nada={NADA_PROYEK[status]} ringkas={ringkas}>
      {LABEL_STATUS_PROYEK[status]}
    </Badge>
  )
}

const NADA_LAPORAN: Record<Enums<'status_laporan'>, NadaBadge> = {
  diterima: 'netral',
  diverifikasi: 'info',
  ditindaklanjuti: 'info',
  selesai: 'sukses',
  // Merah hanya untuk red flag dan galat (DESIGN.md §2), jadi "ditolak" netral.
  ditolak: 'netral',
}

export function BadgeStatusLaporan({ status }: { status: Enums<'status_laporan'> }) {
  return <Badge nada={NADA_LAPORAN[status]}>{LABEL_STATUS_LAPORAN[status]}</Badge>
}
