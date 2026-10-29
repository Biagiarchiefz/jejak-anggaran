import { useMuat } from '../../../hooks/useMuat'
import { daftarAnggaran } from '../../../services/anggaranService'

export function useAnggaran() {
  return useMuat(daftarAnggaran, 'anggaran')
}
