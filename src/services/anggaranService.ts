import { supabase } from './supabaseClient'
import { dariErrorSupabase } from '../lib/errors'
import type { Tables } from '../types/database'
import { ANGGARAN_DEMO } from './anggaranDemo'

export type SumberData = Tables<'sumber_data'>
/** `is_demo` tidak ada di tabel: selalu `false` untuk data dari database, `true` untuk data demo fiktif. */
export type AnggaranDaerah = Tables<'anggaran_daerah'> & { sumber: SumberData; is_demo: boolean }

// Selama data APBD resmi belum dikurasi, VITE_DATA_DEMO_ANGGARAN=true menampilkan data fiktif berlabel.
const PAKAI_DATA_DEMO = import.meta.env.VITE_DATA_DEMO_ANGGARAN === 'true'

export async function daftarAnggaran(): Promise<AnggaranDaerah[]> {
  if (PAKAI_DATA_DEMO) return ANGGARAN_DEMO

  const { data, error } = await supabase
    .from('anggaran_daerah')
    .select('*, sumber:sumber_data(*)')
    .order('tahun')
    .order('anggaran', { ascending: false })
  if (error) throw dariErrorSupabase(error, 'daftarAnggaran')
  return data.map((b) => ({ ...b, is_demo: false }))
}

export async function daftarSumberData(): Promise<SumberData[]> {
  const { data, error } = await supabase.from('sumber_data').select('*').order('nama').order('diakses_pada')
  if (error) throw dariErrorSupabase(error, 'daftarSumberData')
  return data
}
