import { useMuat } from './useMuat'
import { ambilStatusPengguna } from '../services/laporanService'

/** Laporan mana yang milik pengguna atau sudah ia konfirmasi. */
export function useStatusPengguna(laporanIds: readonly string[], penggunaId: string | null) {
  return useMuat(() => ambilStatusPengguna(laporanIds), `${penggunaId ?? 'tamu'}|${laporanIds.join(',')}`)
}
