// Batas isian laporan. Harus sinkron dengan constraint SQL di supabase/migrations
// (dijaga scripts/sinkronAturan.test.ts). Tanpa dependensi agar bisa diimpor oleh scripts/.
export const DESKRIPSI_MIN = 20
export const DESKRIPSI_MAKS = 1000
export const CATATAN_MAKS = 500
export const ALASAN_TOLAK_MIN = 10

/** Jumlah karakter seperti `char_length` di Postgres (code point), bukan `.length` (unit UTF-16, emoji dihitung 2). */
export function panjangKarakter(teks: string): number {
  return [...teks].length
}

// Anti-spam. Harus sinkron dengan trigger laporan_batas_harian (migrasi batas_laporan_harian).
/** Maksimal laporan per akun dalam 24 jam terakhir (laporan yang ditolak tidak dihitung). */
export const LAPORAN_PER_HARI = 5
/** Maksimal laporan per akun untuk satu proyek dalam 24 jam terakhir. */
export const LAPORAN_PER_PROYEK_PER_HARI = 1
const JENDELA_MS = 24 * 60 * 60 * 1000

export type LaporanSaya = { proyek_id: string; status: string; created_at: string }

export type StatusBatasLaporan = {
  /** Laporan terhitung dalam 24 jam terakhir. */
  terpakai: number
  sisa: number
  /** `null` = boleh melapor; selain itu alasan diblokir. */
  alasan: 'harian' | 'proyek' | null
  /** Kapan kuota kembali (laporan terlama di jendela keluar dari 24 jam); `null` bila boleh melapor. */
  bisaLagiPada: Date | null
}

/**
 * Hitung sisa kuota laporan akun ini, dengan aturan yang sama dengan trigger database.
 * Dipakai halaman Lapor untuk memberi tahu warga sebelum mengisi form (database tetap penentu akhirnya).
 */
export function hitungBatasLaporan(laporanSaya: readonly LaporanSaya[], proyekId: string, sekarang: Date = new Date()): StatusBatasLaporan {
  const batasBawah = sekarang.getTime() - JENDELA_MS
  const terhitung = laporanSaya
    .filter((l) => l.status !== 'ditolak' && new Date(l.created_at).getTime() > batasBawah)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  const diProyek = terhitung.filter((l) => l.proyek_id === proyekId)
  const kembali = (daftar: LaporanSaya[], batas: number) => new Date(new Date(daftar[daftar.length - batas].created_at).getTime() + JENDELA_MS)

  const alasan = terhitung.length >= LAPORAN_PER_HARI ? 'harian' : diProyek.length >= LAPORAN_PER_PROYEK_PER_HARI ? 'proyek' : null
  return {
    terpakai: terhitung.length,
    sisa: Math.max(0, LAPORAN_PER_HARI - terhitung.length),
    alasan,
    bisaLagiPada:
      alasan === 'harian' ? kembali(terhitung, LAPORAN_PER_HARI) : alasan === 'proyek' ? kembali(diProyek, LAPORAN_PER_PROYEK_PER_HARI) : null,
  }
}
