/** Kata-kata huruf dari sebuah nama; pemisah apa pun (spasi, titik, garis bawah, angka) diabaikan. */
function kataHuruf(teks: string): string[] {
  return teks.match(/\p{L}+/gu) ?? []
}

/**
 * Inisial untuk avatar pengguna: dua huruf dari dua kata pertama nama tampilan ("Ayu Rizky" → "AR"),
 * satu huruf bila namanya satu kata ("ayurizky" → "A"). Tanpa nama, dipakai bagian depan email.
 * Tidak ada huruf sama sekali → "?".
 */
export function inisialPengguna(nama: string | null, email: string | null): string {
  const sumber = nama?.trim() || email?.split('@')[0] || ''
  const kata = kataHuruf(sumber)
  if (kata.length === 0) return '?'
  return kata
    .slice(0, 2)
    .map((k) => Array.from(k)[0])
    .join('')
    .toLocaleUpperCase('id')
}
