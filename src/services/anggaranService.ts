import { supabase } from './supabaseClient'
import { dariErrorSupabase } from '../utils/errors'
import { tandaiDataDemo } from '../utils/penandaDemo'
import type { Tables } from '../types/database'
import { ANGGARAN_DEMO } from './anggaranDemo'
import { env } from '../config/env'

export type SumberData = Tables<'sumber_data'>
/** `is_demo` tidak ada di tabel: selalu `false` untuk data dari database, `true` untuk data demo fiktif. */
export type AnggaranDaerah = Tables<'anggaran_daerah'> & { sumber: SumberData; is_demo: boolean }

// Selama data APBD resmi belum dikurasi, VITE_DATA_DEMO_ANGGARAN=true menampilkan data fiktif (ditandai lewat penandaDemo).
const PAKAI_DATA_DEMO = env.pakaiDataDemoAnggaran

export async function daftarAnggaran(): Promise<AnggaranDaerah[]> {
  if (PAKAI_DATA_DEMO) {
    tandaiDataDemo(ANGGARAN_DEMO)
    return ANGGARAN_DEMO
  }

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
