import { useMuat } from '../../../hooks/useMuat'
import { ambilDetailProyek } from '../../../services/proyekService'

export function useProyekDetail(id: string) {
  return useMuat(() => ambilDetailProyek(id), `proyek/${id}`)
}
