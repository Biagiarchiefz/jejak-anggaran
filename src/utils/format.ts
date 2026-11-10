const angka = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })
const desimal = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })

/** `1234567` → `Rp 1.234.567` */
export function formatRupiah(nilai: number): string {
  const tanda = nilai < 0 ? '-' : ''
  return `${tanda}Rp ${angka.format(Math.abs(Math.round(nilai)))}`
}

const SATUAN = [
  { batas: 1e12, akhiran: 'T' },
  { batas: 1e9, akhiran: 'M' },
  { batas: 1e6, akhiran: 'jt' },
  { batas: 1e3, akhiran: 'rb' },
] as const

/** `1_200_000_000` → `Rp 1,2 M`. Akhiran: rb, jt, M (miliar), T (triliun). */
export function formatRupiahRingkas(nilai: number): string {
  const tanda = nilai < 0 ? '-' : ''
  const mutlak = Math.abs(nilai)
  for (const { batas, akhiran } of SATUAN) {
    if (mutlak >= batas) return `${tanda}Rp ${desimal.format(mutlak / batas)} ${akhiran}`
  }
  return `${tanda}Rp ${angka.format(Math.round(mutlak))}`
}

/**
 * Seperti `formatRupiahRingkas`, tetapi satuannya mengikuti `acuan`, mis. `(2.4e12, 6.8e12)` → `Rp 2,4 T`
 * (bukan `Rp 2.400 M`). Dipakai animasi angka agar satuan tidak berganti-ganti selama angka naik.
 */
export function formatRupiahRingkasSatuan(nilai: number, acuan: number): string {
  const satuan = SATUAN.find(({ batas }) => Math.abs(acuan) >= batas)
  if (!satuan) return formatRupiahRingkas(nilai)
  const tanda = nilai < 0 ? '-' : ''
  return `${tanda}Rp ${desimal.format(Math.abs(nilai) / satuan.batas)} ${satuan.akhiran}`
}

const tanggal = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
})

const tanggalJam = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Jakarta',
})

function keDate(nilai: string | Date): Date {
  // Tanggal polos (`2026-10-23`) dibaca sebagai siang hari WIB agar tidak bergeser sehari.
  if (typeof nilai === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(nilai)) return new Date(`${nilai}T12:00:00+07:00`)
  return new Date(nilai)
}

/** → `23 Oktober 2026` */
export function formatTanggal(nilai: string | Date): string {
  return tanggal.format(keDate(nilai))
}

/** → `23 Okt 2026, 14.05` */
export function formatTanggalJam(nilai: string | Date): string {
  return tanggalJam.format(keDate(nilai))
}

/** `0.873` → `87%` */
export function formatPersen(rasio: number): string {
  return `${Math.round(rasio * 100)}%`
}

/**
 * Waktu relatif untuk daftar yang padat: `baru saja`, `5 menit lalu`, `3 jam lalu`, `kemarin`, `4 hari lalu`,
 * `2 minggu lalu`. Lebih dari 30 hari → tanggal biasa (`23 Oktober 2026`).
 */
export function formatWaktuRelatif(nilai: string | Date, sekarang: Date = new Date()): string {
  const menit = Math.floor((sekarang.getTime() - keDate(nilai).getTime()) / 60_000)
  if (menit < 1) return 'baru saja'
  if (menit < 60) return `${menit} menit lalu`
  const jam = Math.floor(menit / 60)
  if (jam < 24) return `${jam} jam lalu`
  const hari = Math.floor(jam / 24)
  if (hari === 1) return 'kemarin'
  if (hari < 7) return `${hari} hari lalu`
  if (hari <= 30) return `${Math.floor(hari / 7)} minggu lalu`
  return formatTanggal(nilai)
}

const satuDesimal = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })

/** Durasi dalam jam → `45 menit`, `5 jam`, `2,5 hari`. */
export function formatDurasiJam(jam: number): string {
  if (jam < 1) return `${Math.max(1, Math.round(jam * 60))} menit`
  if (jam < 24) return `${satuDesimal.format(jam)} jam`
  return `${satuDesimal.format(jam / 24)} hari`
}
