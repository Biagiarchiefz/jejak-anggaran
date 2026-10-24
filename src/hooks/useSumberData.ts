import { useMuat } from './useMuat'
import { daftarSumberData } from '../services/anggaranService'

export function useSumberData() {
  return useMuat(daftarSumberData, 'sumber-data')
}
