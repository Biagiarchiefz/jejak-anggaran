import { supabase } from './supabaseClient'
import { KOLOM_RIWAYAT_PUBLIK, keLaporanPublik, type LaporanPublik, type RiwayatPublik } from './laporanService'
import { AppError, dariErrorSupabase } from '../utils/errors'
import { tandaiDataDemo } from '../utils/penandaDemo'
import type { Enums } from '../types/database'

export type LaporanAdmin = LaporanPublik & {
  proyek: { id: string; nama_paket: string; kecamatan: string; status_proyek: Enums<'status_proyek'>; is_demo: boolean } | null
  riwayat: RiwayatPublik[]
}

export type DataAdmin = {
  laporan: LaporanAdmin[]
  /** ID proyek yang sedang terkena red flag. */
  proyekRedFlag: string[]
}

/** Semua laporan untuk dashboard dan antrean verifikasi. Identitas pelapor tetap tidak ditampilkan. */
export async function ambilDataAdmin(): Promise<DataAdmin> {
  const [laporan, proyek, riwayat, redFlag] = await Promise.all([
    supabase.from('v_laporan_publik').select('*').order('created_at', { ascending: false }),
    supabase.from('proyek').select('id, nama_paket, kecamatan, status_proyek, is_demo'),
    supabase.from('riwayat_status').select(KOLOM_RIWAYAT_PUBLIK).order('created_at').order('id'),
    supabase.from('v_red_flag_proyek').select('proyek_id'),
  ])
  if (laporan.error) throw dariErrorSupabase(laporan.error, 'ambilDataAdmin: laporan')
  if (proyek.error) throw dariErrorSupabase(proyek.error, 'ambilDataAdmin: proyek')
  if (riwayat.error) throw dariErrorSupabase(riwayat.error, 'ambilDataAdmin: riwayat')
  if (redFlag.error) throw dariErrorSupabase(redFlag.error, 'ambilDataAdmin: red flag')

  tandaiDataDemo(proyek.data)
  const proyekPerId = new Map(proyek.data.map((p) => [p.id, p]))
  const riwayatPerLaporan = new Map<string, RiwayatPublik[]>()
  for (const r of riwayat.data) riwayatPerLaporan.set(r.laporan_id, [...(riwayatPerLaporan.get(r.laporan_id) ?? []), r])

  return {
    laporan: laporan.data.map((baris) => {
      const l = keLaporanPublik(baris)
      return { ...l, proyek: proyekPerId.get(l.proyek_id) ?? null, riwayat: riwayatPerLaporan.get(l.id) ?? [] }
    }),
    proyekRedFlag: redFlag.data.flatMap((r) => (r.proyek_id ? [r.proyek_id] : [])),
  }
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
  // RLS menyaring baris secara diam-diam: 0 baris berarti tidak berwenang atas laporan ini
  // (bukan admin, atau admin demo yang mencoba mengubah laporan sungguhan).
  if (data.length === 0) throw new AppError('TIDAK_BERWENANG', 'Akun Anda tidak berwenang mengubah status laporan ini.')
}
