import { useMuat } from '../../../hooks/useMuat'
import { ambilDataAdmin } from '../../../services/adminService'

export function useLaporanAdmin() {
  return useMuat(ambilDataAdmin, 'laporan-admin')
}
