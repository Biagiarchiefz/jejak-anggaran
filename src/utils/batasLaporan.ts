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
