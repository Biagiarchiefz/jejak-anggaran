import { supabase } from './supabaseClient'
import { daftarProyek, type ProyekDenganRedFlag } from './proyekService'
import { dariErrorSupabase } from '../utils/errors'
import { tandaiDataDemo } from '../utils/penandaDemo'
import type { LaporanRapor } from '../utils/rapor'

export type DataRapor = { proyek: ProyekDenganRedFlag[]; laporan: LaporanRapor[] }

/**
 * Data untuk rapor wilayah (F10): semua proyek + ringkasan setiap laporan publik (tanpa isi, foto, atau identitas pelapor)
 * dan riwayat statusnya untuk menghitung waktu respons. Hanya kolom yang memang terbuka untuk publik.
 */
export async function ambilDataRapor(): Promise<DataRapor> {
  const [proyek, laporan, riwayat] = await Promise.all([
    daftarProyek(),
    supabase.from('v_laporan_publik').select('id, proyek_id, status, created_at, is_demo'),
    supabase.from('riwayat_status').select('laporan_id, status_lama, created_at').order('created_at').order('id'),
  ])
  if (laporan.error) throw dariErrorSupabase(laporan.error, 'ambilDataRapor: laporan')
  if (riwayat.error) throw dariErrorSupabase(riwayat.error, 'ambilDataRapor: riwayat')

  const riwayatPerLaporan = new Map<string, LaporanRapor['riwayat'][number][]>()
  for (const r of riwayat.data) {
    riwayatPerLaporan.set(r.laporan_id, [...(riwayatPerLaporan.get(r.laporan_id) ?? []), { status_lama: r.status_lama, created_at: r.created_at }])
  }

  // Kolom view bertipe nullable di tipe hasil generate; baris yang tidak lengkap dilewati.
  const daftar: LaporanRapor[] = laporan.data.flatMap((l) =>
    l.id && l.proyek_id && l.status && l.created_at
      ? [{ id: l.id, proyek_id: l.proyek_id, status: l.status, created_at: l.created_at, is_demo: !!l.is_demo, riwayat: riwayatPerLaporan.get(l.id) ?? [] }]
      : [],
  )
  tandaiDataDemo(daftar)
  return { proyek, laporan: daftar }
}
