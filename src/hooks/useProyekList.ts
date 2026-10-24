import { useMuat } from './useMuat'
import { daftarProyek } from '../services/proyekService'

export function useProyekList() {
  return useMuat(daftarProyek, 'proyek')
}
