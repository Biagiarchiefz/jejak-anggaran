import { useMuat } from '../../../hooks/useMuat'
import { laporanSaya24Jam } from '../../../services/laporanService'

/** Laporan milik pengguna dalam 24 jam terakhir, untuk menghitung sisa kuota. Tamu → daftar kosong tanpa permintaan. */
export function useBatasLaporan(penggunaId: string | null) {
  return useMuat(() => (penggunaId ? laporanSaya24Jam(penggunaId) : Promise.resolve([])), `batas-laporan:${penggunaId ?? 'tamu'}`)
}
