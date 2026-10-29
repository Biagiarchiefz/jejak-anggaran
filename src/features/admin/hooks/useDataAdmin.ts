import { useOutletContext } from 'react-router'
import type { StateMuat } from '../../../hooks/useMuat'
import type { DataAdmin } from '../../../services/adminService'

export type KonteksAdmin = StateMuat<DataAdmin>

/** Data panel admin dimuat sekali di `AdminLayout` dan dibagikan ke halaman-halamannya lewat `<Outlet context>`. */
export function useDataAdmin(): KonteksAdmin {
  return useOutletContext<KonteksAdmin>()
}
