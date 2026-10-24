import { useMuat } from './useMuat'
import { daftarLaporanAdmin } from '../services/adminService'

export function useLaporanAdmin() {
  return useMuat(daftarLaporanAdmin, 'laporan-admin')
}
