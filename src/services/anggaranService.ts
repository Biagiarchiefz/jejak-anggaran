import { supabase } from './supabaseClient'
import { dariErrorSupabase } from '../lib/errors'
import type { Tables } from '../types/database'

export type SumberData = Tables<'sumber_data'>
export type AnggaranDaerah = Tables<'anggaran_daerah'> & { sumber: SumberData }

export async function daftarAnggaran(): Promise<AnggaranDaerah[]> {
  const { data, error } = await supabase
    .from('anggaran_daerah')
    .select('*, sumber:sumber_data(*)')
    .order('tahun')
    .order('anggaran', { ascending: false })
  if (error) throw dariErrorSupabase(error, 'daftarAnggaran')
  return data
}

export async function daftarSumberData(): Promise<SumberData[]> {
  const { data, error } = await supabase.from('sumber_data').select('*').order('nama').order('diakses_pada')
  if (error) throw dariErrorSupabase(error, 'daftarSumberData')
  return data
}
