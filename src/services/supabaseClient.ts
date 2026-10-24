import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'
import { logger } from '../lib/logger'

// Hanya anon key yang boleh ada di frontend. Service role key TIDAK PERNAH dipakai di sini.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  logger.error('VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diatur. Salin .env.example ke .env.local.')
}

// Nilai cadangan mencegah aplikasi crash saat env kosong; permintaan akan gagal
// dan tampil sebagai error jaringan yang bisa dicoba ulang.
export const supabase = createClient<Database>(url || 'http://127.0.0.1:54321', anonKey || 'anon-key-belum-diatur')

export const BUCKET_FOTO_LAPORAN = 'foto-laporan'
