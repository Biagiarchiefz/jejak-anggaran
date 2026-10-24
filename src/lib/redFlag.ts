import type { Enums } from '../types/database'

// Aturan red flag (F7). HARUS sinkron dengan view SQL public.v_red_flag_proyek
// (dijaga oleh redFlag.test.ts). Red flag hanya berarti "perlu perhatian",
// bukan tuduhan korupsi atau penyimpangan.
export const RED_FLAG = {
  statusProyek: 'selesai',
  kategoriLaporan: 'kerusakan',
  statusLaporanTerhitung: ['diverifikasi', 'ditindaklanjuti', 'selesai'],
  jendelaHari: 90,
  ambangLaporan: 3,
} as const satisfies {
  statusProyek: Enums<'status_proyek'>
  kategoriLaporan: Enums<'kategori_laporan'>
  statusLaporanTerhitung: readonly Enums<'status_laporan'>[]
  jendelaHari: number
  ambangLaporan: number
}

type LaporanUntukRedFlag = {
  kategori: Enums<'kategori_laporan'>
  status: Enums<'status_laporan'>
  created_at: string
}

export type HasilRedFlag = {
  aktif: boolean
  jumlahLaporan: number
  alasan: string | null
}

const HARI_MS = 24 * 60 * 60 * 1000

export function laporanTerhitung(laporan: LaporanUntukRedFlag, sekarang: Date): boolean {
  const batas = sekarang.getTime() - RED_FLAG.jendelaHari * HARI_MS
  return (
    laporan.kategori === RED_FLAG.kategoriLaporan &&
    (RED_FLAG.statusLaporanTerhitung as readonly string[]).includes(laporan.status) &&
    new Date(laporan.created_at).getTime() >= batas
  )
}

export function alasanRedFlag(jumlahLaporan: number): string {
  return `Proyek tercatat selesai, tetapi ada ${jumlahLaporan} laporan kerusakan yang sudah diverifikasi dalam ${RED_FLAG.jendelaHari} hari terakhir (ambang: ${RED_FLAG.ambangLaporan} laporan).`
}

/** Versi TypeScript dari v_red_flag_proyek. */
export function hitungRedFlag(
  statusProyek: Enums<'status_proyek'>,
  laporan: readonly LaporanUntukRedFlag[],
  sekarang: Date = new Date(),
): HasilRedFlag {
  if (statusProyek !== RED_FLAG.statusProyek) return { aktif: false, jumlahLaporan: 0, alasan: null }
  const jumlahLaporan = laporan.filter((l) => laporanTerhitung(l, sekarang)).length
  const aktif = jumlahLaporan >= RED_FLAG.ambangLaporan
  return { aktif, jumlahLaporan, alasan: aktif ? alasanRedFlag(jumlahLaporan) : null }
}
