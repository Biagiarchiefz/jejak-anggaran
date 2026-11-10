import { useMuat } from '../../../hooks/useMuat'
import { ambilDataRapor } from '../../../services/raporService'

export function useRapor() {
  return useMuat(ambilDataRapor, 'rapor')
}
