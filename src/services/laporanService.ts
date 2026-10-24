import { BUCKET_FOTO_LAPORAN, supabase } from './supabaseClient'
import { AppError, dariErrorSupabase } from '../lib/errors'
import { logger } from '../lib/logger'
import type { FotoTerkompres } from '../lib/kompresFoto'
import type { Enums, Tables } from '../types/database'

type Wajib<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }

/** Laporan versi publik: tanpa identitas pelapor. */
export type LaporanPublik = Wajib<
  Tables<'v_laporan_publik'>,
  'id' | 'proyek_id' | 'kategori' | 'deskripsi' | 'status' | 'is_demo' | 'created_at' | 'updated_at' | 'jumlah_konfirmasi'
> & { fotoUrl: string | null }

/** Riwayat status versi publik: hanya mencatat apakah perubahan dilakukan admin. */
export type RiwayatPublik = Omit<Tables<'riwayat_status'>, 'diubah_oleh'> & { olehAdmin: boolean }

/** Foto laporan demo memakai path absolut ke public/foto-proyek, sisanya ada di Storage. */
export function urlFotoLaporan(path: string | null): string | null {
  if (!path) return null
  if (path.startsWith('/')) return path
  return supabase.storage.from(BUCKET_FOTO_LAPORAN).getPublicUrl(path).data.publicUrl
}

export function keLaporanPublik(baris: Tables<'v_laporan_publik'>): LaporanPublik {
  return { ...(baris as LaporanPublik), fotoUrl: urlFotoLaporan(baris.foto_path) }
}

export function keRiwayatPublik({ diubah_oleh, ...baris }: Tables<'riwayat_status'>): RiwayatPublik {
  return { ...baris, olehAdmin: diubah_oleh !== null }
}

async function idPenggunaAktif(): Promise<string> {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw dariErrorSupabase(error, 'idPenggunaAktif')
  if (!data.session) throw new AppError('TIDAK_BERWENANG', 'Silakan masuk terlebih dahulu.')
  return data.session.user.id
}

type DataLaporanBaru = {
  proyekId: string
  kategori: Enums<'kategori_laporan'>
  deskripsi: string
  foto: FotoTerkompres
}

/**
 * Upload foto ke Storage lalu insert laporan (status awal `diterima`).
 * Jika insert gagal setelah upload berhasil, foto yatim dihapus.
 */
export async function buatLaporan({ proyekId, kategori, deskripsi, foto }: DataLaporanBaru): Promise<string> {
  const penggunaId = await idPenggunaAktif()
  const path = `${penggunaId}/${crypto.randomUUID()}.${foto.ekstensi}`

  const upload = await supabase.storage
    .from(BUCKET_FOTO_LAPORAN)
    .upload(path, foto.blob, { contentType: foto.tipe, upsert: false })
  if (upload.error) {
    logger.error('buatLaporan: upload foto', upload.error)
    throw new AppError('UPLOAD_GAGAL', undefined, { cause: upload.error })
  }

  const { data, error } = await supabase
    .from('laporan')
    .insert({ proyek_id: proyekId, pelapor_id: penggunaId, kategori, deskripsi, foto_path: path })
    .select('id')
    .single()

  if (error) {
    const hapus = await supabase.storage.from(BUCKET_FOTO_LAPORAN).remove([path])
    if (hapus.error) logger.error('buatLaporan: gagal menghapus foto yatim', hapus.error)
    throw dariErrorSupabase(error, 'buatLaporan: insert laporan')
  }
  return data.id
}

export async function konfirmasiLaporan(laporanId: string): Promise<void> {
  const penggunaId = await idPenggunaAktif()
  const { error } = await supabase.from('konfirmasi').insert({ laporan_id: laporanId, warga_id: penggunaId })
  if (error) {
    throw dariErrorSupabase(error, 'konfirmasiLaporan', {
      VALIDASI: 'Anda sudah mengonfirmasi laporan ini.',
      TIDAK_BERWENANG: 'Anda tidak bisa mengonfirmasi laporan Anda sendiri.',
    })
  }
}

export type StatusPengguna = {
  milikSaya: Set<string>
  sudahDikonfirmasi: Set<string>
}

/** Laporan mana yang dibuat atau sudah dikonfirmasi pengguna yang sedang masuk. */
export async function ambilStatusPengguna(laporanIds: readonly string[]): Promise<StatusPengguna> {
  const kosong: StatusPengguna = { milikSaya: new Set(), sudahDikonfirmasi: new Set() }
  const { data: sesi } = await supabase.auth.getSession()
  const penggunaId = sesi.session?.user.id
  if (!penggunaId || laporanIds.length === 0) return kosong

  const [milik, konfirmasi] = await Promise.all([
    supabase.from('laporan').select('id').eq('pelapor_id', penggunaId).in('id', laporanIds),
    supabase.from('konfirmasi').select('laporan_id').eq('warga_id', penggunaId).in('laporan_id', laporanIds),
  ])
  if (milik.error) throw dariErrorSupabase(milik.error, 'ambilStatusPengguna: laporan')
  if (konfirmasi.error) throw dariErrorSupabase(konfirmasi.error, 'ambilStatusPengguna: konfirmasi')
  return {
    milikSaya: new Set(milik.data.map((l) => l.id)),
    sudahDikonfirmasi: new Set(konfirmasi.data.map((k) => k.laporan_id)),
  }
}
