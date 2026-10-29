import type { AuthError, Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { AppError, dariErrorSupabase } from '../utils/errors'
import { logger } from '../utils/logger'
import type { Enums } from '../types/database'

export type Pengguna = {
  id: string
  email: string | null
  /** Nama tampilan dari profil (bawaannya bagian depan email). Hanya ditampilkan ke pengguna itu sendiri. */
  nama: string | null
  peran: Enums<'peran_pengguna'>
}

async function kePengguna(sesi: Session | null): Promise<Pengguna | null> {
  if (!sesi) return null
  const { data, error } = await supabase.from('profiles').select('peran, nama_tampilan').eq('id', sesi.user.id).maybeSingle()
  // Profil gagal dimuat: anggap warga biasa, RLS tetap menjaga akses admin.
  if (error) logger.error('kePengguna: profil', error)
  return { id: sesi.user.id, email: sesi.user.email ?? null, nama: data?.nama_tampilan ?? null, peran: data?.peran ?? 'warga' }
}

/** Memantau status masuk. Callback langsung dipanggil sekali dengan sesi saat ini. */
export function pantauPengguna(callback: (pengguna: Pengguna | null) => void): () => void {
  let aktif = true
  const { data } = supabase.auth.onAuthStateChange((_event, sesi) => {
    // Jangan memanggil Supabase langsung di dalam callback auth (bisa deadlock).
    setTimeout(() => {
      kePengguna(sesi).then((p) => {
        if (aktif) callback(p)
      })
    }, 0)
  })
  return () => {
    aktif = false
    data.subscription.unsubscribe()
  }
}

// Kode AuthError Supabase → pesan yang dimengerti warga. Kode lain jatuh ke pemetaan umum di errors.ts.
const PESAN_AUTH: Record<string, string> = {
  invalid_credentials: 'Email atau kata sandi salah.',
  email_not_confirmed: 'Email belum dikonfirmasi. Buka tautan konfirmasi yang kami kirim ke email Anda.',
  user_already_exists: 'Email ini sudah terdaftar. Silakan masuk.',
  email_exists: 'Email ini sudah terdaftar. Silakan masuk.',
  weak_password: 'Kata sandi terlalu lemah. Gunakan minimal 8 karakter.',
  over_request_rate_limit: 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
  over_email_send_rate_limit: 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
}

function errorAuth(error: AuthError, konteks: string): AppError {
  const pesan = error.code ? PESAN_AUTH[error.code] : undefined
  if (!pesan) return dariErrorSupabase(error, konteks)
  logger.error(konteks, error)
  return new AppError('VALIDASI', pesan, { cause: error })
}

/** Masuk dengan email + kata sandi. Mengembalikan pengguna beserta perannya untuk menentukan tujuan berikutnya. */
export async function masuk(email: string, kataSandi: string): Promise<Pengguna> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: kataSandi })
  if (error) throw errorAuth(error, 'masuk')
  const pengguna = await kePengguna(data.session)
  if (!pengguna) throw new AppError('TIDAK_DIKETAHUI')
  return pengguna
}

/**
 * Daftar akun warga baru. Jika konfirmasi email aktif di Supabase, sesi belum ada
 * sampai tautan konfirmasi dibuka: hasilnya `null`.
 */
export async function daftar(email: string, kataSandi: string, kembaliKe: string): Promise<Pengguna | null> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: kataSandi,
    options: { emailRedirectTo: `${window.location.origin}${kembaliKe}` },
  })
  if (error) throw errorAuth(error, 'daftar')
  return kePengguna(data.session)
}

export async function keluar(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw dariErrorSupabase(error, 'keluar')
}
