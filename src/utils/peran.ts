import type { Enums } from '../types/database'

export type Peran = Enums<'peran_pengguna'>

/** Admin dan admin demo sama-sama bisa membuka panel admin. */
export function bisaMembukaPanelAdmin(peran: Peran | null | undefined): boolean {
  return peran === 'admin' || peran === 'admin_demo'
}

/**
 * Admin demo hanya boleh mengubah laporan demo, karena kredensialnya dibagikan terbuka.
 * Harus sinkron dengan kebijakan RLS di migrasi akses_admin_demo.
 */
export function bisaUbahLaporan(peran: Peran | null | undefined, laporan: { is_demo: boolean }): boolean {
  return peran === 'admin' || (peran === 'admin_demo' && laporan.is_demo)
}

export const LABEL_PERAN: Record<Peran, string> = {
  warga: 'Warga',
  admin: 'Admin (simulasi instansi)',
  admin_demo: 'Admin demo (khusus laporan demo)',
}

/**
 * Tujuan setelah masuk. `kembali` hanya dipakai jika path internal (bukan `//situs-lain`),
 * selain itu admin ke panel admin dan warga ke peta.
 */
export function halamanSetelahMasuk(peran: Peran, kembali: string | null): string {
  if (kembali && kembali.startsWith('/') && !kembali.startsWith('//')) return kembali
  return bisaMembukaPanelAdmin(peran) ? '/admin' : '/peta'
}
