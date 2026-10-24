import { useMuat } from './useMuat'
import { daftarAnggaran } from '../services/anggaranService'

export function useAnggaran() {
  return useMuat(daftarAnggaran, 'anggaran')
}
