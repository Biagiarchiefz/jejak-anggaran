import { supabase } from './supabaseClient'
import { KOLOM_RIWAYAT_PUBLIK, keLaporanPublik, type LaporanPublik, type RiwayatPublik } from './laporanService'
import { AppError, dariErrorSupabase } from '../utils/errors'
import { tandaiDataDemo } from '../utils/penandaDemo'
import type { Tables } from '../types/database'

export type Proyek = Tables<'proyek'>
export type RedFlag = { jumlahLaporan: number; alasan: string }
export type ProyekDenganRedFlag = Proyek & { redFlag: RedFlag | null }
export type LaporanDenganRiwayat = LaporanPublik & { riwayat: RiwayatPublik[] }
export type DetailProyek = {
  proyek: ProyekDenganRedFlag
  laporan: LaporanDenganRiwayat[]
}

function keRedFlag(baris: Tables<'v_red_flag_proyek'> | null | undefined): RedFlag | null {
  if (!baris?.proyek_id) return null
  return { jumlahLaporan: baris.jumlah_laporan ?? 0, alasan: baris.alasan ?? '' }
}

export async function daftarProyek(): Promise<ProyekDenganRedFlag[]> {
  const [proyek, redFlag] = await Promise.all([
    supabase.from('proyek').select('*').order('is_demo').order('nama_paket'),
    supabase.from('v_red_flag_proyek').select('*'),
  ])
  if (proyek.error) throw dariErrorSupabase(proyek.error, 'daftarProyek')
  if (redFlag.error) throw dariErrorSupabase(redFlag.error, 'daftarProyek: red flag')

  tandaiDataDemo(proyek.data)
  const redFlagPerProyek = new Map(redFlag.data.map((r) => [r.proyek_id, keRedFlag(r)]))
  return proyek.data.map((p) => ({ ...p, redFlag: redFlagPerProyek.get(p.id) ?? null }))
}

export async function ambilDetailProyek(id: string): Promise<DetailProyek> {
  const [proyek, redFlag, laporan] = await Promise.all([
    supabase.from('proyek').select('*').eq('id', id).maybeSingle(),
    supabase.from('v_red_flag_proyek').select('*').eq('proyek_id', id).maybeSingle(),
    supabase.from('v_laporan_publik').select('*').eq('proyek_id', id).order('created_at', { ascending: false }),
  ])
  if (proyek.error) throw dariErrorSupabase(proyek.error, 'ambilDetailProyek')
  if (!proyek.data) throw new AppError('TIDAK_DITEMUKAN', 'Proyek tidak ditemukan. Mungkin tautannya sudah berubah.')
  if (redFlag.error) throw dariErrorSupabase(redFlag.error, 'ambilDetailProyek: red flag')
  if (laporan.error) throw dariErrorSupabase(laporan.error, 'ambilDetailProyek: laporan')

  const daftarLaporan = laporan.data.map(keLaporanPublik)
  tandaiDataDemo([proyek.data, ...daftarLaporan])
  const riwayat = await ambilRiwayat(daftarLaporan.map((l) => l.id))

  return {
    proyek: { ...proyek.data, redFlag: keRedFlag(redFlag.data) },
    laporan: daftarLaporan.map((l) => ({ ...l, riwayat: riwayat.get(l.id) ?? [] })),
  }
}

async function ambilRiwayat(laporanIds: string[]): Promise<Map<string, RiwayatPublik[]>> {
  const hasil = new Map<string, RiwayatPublik[]>()
  if (laporanIds.length === 0) return hasil
  const { data, error } = await supabase
    .from('riwayat_status')
    .select(KOLOM_RIWAYAT_PUBLIK)
    .in('laporan_id', laporanIds)
    .order('created_at')
    .order('id')
  if (error) throw dariErrorSupabase(error, 'ambilRiwayat')
  for (const baris of data) {
    const daftar = hasil.get(baris.laporan_id) ?? []
    daftar.push(baris)
    hasil.set(baris.laporan_id, daftar)
  }
  return hasil
}
