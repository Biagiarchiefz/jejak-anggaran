/** Nilai satu sel CSV. `null`/`undefined` → sel kosong. */
export type SelCsv = string | number | boolean | null | undefined

/** Kutip sel bila berisi pemisah, tanda kutip, atau baris baru (RFC 4180); kutip ganda di dalamnya digandakan. */
function selCsv(nilai: SelCsv): string {
  if (nilai === null || nilai === undefined) return ''
  const teks = typeof nilai === 'boolean' ? (nilai ? 'ya' : 'tidak') : String(nilai)
  return /[",\r\n]/.test(teks) ? `"${teks.replace(/"/g, '""')}"` : teks
}

/**
 * Susun CSV berpemisah koma dengan baris `\r\n`. Diawali BOM UTF-8 agar Excel membaca huruf non-ASCII dengan benar.
 * Angka ditulis polos (tanpa pemisah ribuan) supaya langsung bisa dihitung di spreadsheet.
 */
export function keCsv(kolom: readonly string[], baris: readonly (readonly SelCsv[])[]): string {
  return '﻿' + [kolom, ...baris].map((b) => b.map(selCsv).join(',')).join('\r\n') + '\r\n'
}

/** `2026-11-10` dari tanggal lokal, untuk nama berkas unduhan. */
export function tanggalBerkas(tanggal: Date = new Date()): string {
  const dua = (n: number) => String(n).padStart(2, '0')
  return `${tanggal.getFullYear()}-${dua(tanggal.getMonth() + 1)}-${dua(tanggal.getDate())}`
}
