import { logger } from './logger'

export type KodeError =
  | 'JARINGAN'
  | 'TIDAK_DITEMUKAN'
  | 'TIDAK_BERWENANG'
  | 'VALIDASI'
  | 'UPLOAD_GAGAL'
  | 'TIDAK_DIKETAHUI'

const PESAN_BAWAAN: Record<KodeError, string> = {
  JARINGAN: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.',
  TIDAK_DITEMUKAN: 'Data yang Anda cari tidak ditemukan.',
  TIDAK_BERWENANG: 'Anda tidak memiliki izin untuk melakukan tindakan ini.',
  VALIDASI: 'Data yang dikirim belum sesuai. Periksa kembali isian Anda.',
  UPLOAD_GAGAL: 'Foto gagal diunggah. Data Anda masih tersimpan, silakan coba lagi.',
  TIDAK_DIKETAHUI: 'Terjadi kesalahan. Silakan coba lagi beberapa saat lagi.',
}

/** Error yang aman ditampilkan ke pengguna: `pesan` selalu bahasa Indonesia. */
export class AppError extends Error {
  readonly code: KodeError
  readonly pesan: string

  constructor(code: KodeError, pesan?: string, options?: { cause?: unknown }) {
    const teks = pesan ?? PESAN_BAWAAN[code]
    super(teks, options)
    this.name = 'AppError'
    this.code = code
    this.pesan = teks
  }
}

/** Bentuk minimum error dari Supabase (PostgrestError, AuthError, StorageError). */
type ErrorSupabase = {
  message?: string
  code?: string
  status?: number
  statusCode?: string | number
}

function kodeDari(error: ErrorSupabase): KodeError {
  const pesan = (error.message ?? '').toLowerCase()
  const status = Number(error.status ?? error.statusCode)

  if (pesan.includes('failed to fetch') || pesan.includes('fetch failed') || pesan.includes('network')) {
    return 'JARINGAN'
  }
  switch (error.code) {
    case 'PGRST116':
      return 'TIDAK_DITEMUKAN'
    case '42501':
    case 'PGRST301':
      return 'TIDAK_BERWENANG'
    case '23505':
    case '23514':
    case '23503':
    case '22P02':
      return 'VALIDASI'
  }
  if (status === 401 || status === 403) return 'TIDAK_BERWENANG'
  if (status === 404) return 'TIDAK_DITEMUKAN'
  if (status === 400 || status === 422) return 'VALIDASI'
  return 'TIDAK_DIKETAHUI'
}

/**
 * Mengubah error mentah Supabase menjadi AppError. Detail asli hanya dicatat
 * lewat logger, tidak pernah ditampilkan ke pengguna.
 */
export function dariErrorSupabase(
  error: unknown,
  konteks: string,
  pesanKhusus?: Partial<Record<KodeError, string>>,
): AppError {
  if (error instanceof AppError) return error
  logger.error(konteks, error)
  const kode = typeof error === 'object' && error !== null ? kodeDari(error as ErrorSupabase) : 'TIDAK_DIKETAHUI'
  return new AppError(kode, pesanKhusus?.[kode], { cause: error })
}

/** Pesan aman untuk UI dari error apa pun. */
export function pesanError(error: unknown): string {
  if (error instanceof AppError) return error.pesan
  return PESAN_BAWAAN.TIDAK_DIKETAHUI
}
