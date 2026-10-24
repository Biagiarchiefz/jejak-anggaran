import type { Enums } from '../types/database'

export type StatusLaporan = Enums<'status_laporan'>

// Harus sinkron dengan fungsi SQL public.transisi_status_valid.
const TRANSISI: Record<StatusLaporan, readonly StatusLaporan[]> = {
  diterima: ['diverifikasi', 'ditolak'],
  diverifikasi: ['ditindaklanjuti', 'ditolak'],
  ditindaklanjuti: ['selesai'],
  selesai: [],
  ditolak: [],
}

/** Urutan alur normal laporan. */
export const ALUR_STATUS: readonly StatusLaporan[] = ['diterima', 'diverifikasi', 'ditindaklanjuti', 'selesai']

export function statusBerikutnya(status: StatusLaporan): readonly StatusLaporan[] {
  return TRANSISI[status]
}

export function transisiValid(lama: StatusLaporan, baru: StatusLaporan): boolean {
  return TRANSISI[lama].includes(baru)
}

export function statusAkhir(status: StatusLaporan): boolean {
  return TRANSISI[status].length === 0
}

/** Jalur dari `diterima` ke status target, dipakai untuk menyusun riwayat data demo. */
export function jalurStatus(target: StatusLaporan): StatusLaporan[] {
  if (target === 'ditolak') return ['diterima', 'ditolak']
  return ALUR_STATUS.slice(0, ALUR_STATUS.indexOf(target) + 1)
}
