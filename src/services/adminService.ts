import { supabase } from './supabaseClient'
import { keLaporanPublik, type LaporanPublik } from './laporanService'
import { AppError, dariErrorSupabase } from '../lib/errors'
import type { Enums } from '../types/database'

export type LaporanAdmin = LaporanPublik & {
  proyek: { id: string; nama_paket: string; kecamatan: string; is_demo: boolean } | null
}

/** Semua laporan untuk antrean verifikasi. Identitas pelapor tetap tidak ditampilkan. */
export async function daftarLaporanAdmin(): Promise<LaporanAdmin[]> {
  const [laporan, proyek] = await Promise.all([
    supabase.from('v_laporan_publik').select('*').order('created_at', { ascending: false }),
    supabase.from('proyek').select('id, nama_paket, kecamatan, is_demo'),
  ])
  if (laporan.error) throw dariErrorSupabase(laporan.error, 'daftarLaporanAdmin')
  if (proyek.error) throw dariErrorSupabase(proyek.error, 'daftarLaporanAdmin: proyek')

  const proyekPerId = new Map(proyek.data.map((p) => [p.id, p]))
  return laporan.data.map((baris) => {
    const l = keLaporanPublik(baris)
    return { ...l, proyek: proyekPerId.get(l.proyek_id) ?? null }
  })
}

/** Trigger database mencatat perubahan ini ke riwayat_status beserta catatannya. */
export async function ubahStatusLaporan(
  laporanId: string,
  status: Enums<'status_laporan'>,
  catatan: string,
): Promise<void> {
  const { data, error } = await supabase
    .from('laporan')
    .update({ status, catatan_status: catatan.trim() || null })
    .eq('id', laporanId)
    .select('id')
  if (error) {
    throw dariErrorSupabase(error, 'ubahStatusLaporan', {
      VALIDASI: 'Perubahan status ini tidak diizinkan. Muat ulang halaman lalu coba lagi.',
    })
  }
  // RLS menyaring baris secara diam-diam: 0 baris berarti bukan admin.
  if (data.length === 0) throw new AppError('TIDAK_BERWENANG', 'Hanya admin yang dapat mengubah status laporan.')
}
