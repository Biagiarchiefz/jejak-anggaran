import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { dariErrorSupabase } from '../lib/errors'
import { logger } from '../lib/logger'
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

/** Kirim tautan masuk (magic link) ke email. Tidak ada kata sandi. */
export async function kirimTautanMasuk(email: string, kembaliKe: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}${kembaliKe}` },
  })
  if (error) {
    throw dariErrorSupabase(error, 'kirimTautanMasuk', {
      VALIDASI: 'Email tidak valid atau terlalu sering meminta tautan. Tunggu sebentar lalu coba lagi.',
    })
  }
}

export async function keluar(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw dariErrorSupabase(error, 'keluar')
}
