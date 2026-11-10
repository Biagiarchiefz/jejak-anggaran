import { Constants, type Enums } from '../types/database'
import { LABEL_KATEGORI } from './label'

type StatusLaporan = Enums<'status_laporan'>
type KategoriLaporan = Enums<'kategori_laporan'>

export type UrutanLaporan = 'prioritas' | 'terbaru' | 'terlama' | 'konfirmasi'
export type JenisData = 'semua' | 'nyata' | 'demo'

export type FilterLaporanAdmin = {
  kata: string
  status: StatusLaporan | 'semua'
  kategori: KategoriLaporan | 'semua'
  jenis: JenisData
  urut: UrutanLaporan
}

/** Bawaan antrean: laporan yang menunggu verifikasi, yang berpotensi red flag lalu yang paling lama menunggu dulu. */
export const FILTER_LAPORAN_AWAL: FilterLaporanAdmin = { kata: '', status: 'diterima', kategori: 'semua', jenis: 'semua', urut: 'prioritas' }

export const URUTAN_LAPORAN: readonly UrutanLaporan[] = ['prioritas', 'terbaru', 'terlama', 'konfirmasi']
export const JENIS_DATA: readonly JenisData[] = ['semua', 'nyata', 'demo']

export type LaporanDisaring = {
  id: string
  kategori: KategoriLaporan
  status: StatusLaporan
  deskripsi: string
  is_demo: boolean
  created_at: string
  jumlah_konfirmasi: number
  proyek: { nama_paket: string; kecamatan: string } | null
}

const normalkan = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const waktu = (l: { created_at: string }) => new Date(l.created_at).getTime()

/** Setiap kata kunci harus muncul di kategori, isi laporan, nama proyek, kecamatan, atau ID laporan. */
export function cocokKataKunci(l: LaporanDisaring, kataKunci: string): boolean {
  const kata = normalkan(kataKunci).split(/\s+/).filter(Boolean)
  if (kata.length === 0) return true
  const teks = normalkan([LABEL_KATEGORI[l.kategori], l.deskripsi, l.proyek?.nama_paket, l.proyek?.kecamatan, l.id].filter(Boolean).join(' '))
  return kata.every((k) => teks.includes(k))
}

/** Saringan selain status: dipakai juga untuk menghitung angka di tab status agar ikut menyesuaikan pencarian. */
function lolosSelainStatus(l: LaporanDisaring, f: FilterLaporanAdmin): boolean {
  return (
    (f.kategori === 'semua' || l.kategori === f.kategori) &&
    (f.jenis === 'semua' || l.is_demo === (f.jenis === 'demo')) &&
    cocokKataKunci(l, f.kata)
  )
}

/**
 * Saring lalu urutkan laporan untuk antrean admin. `potensi` = ID laporan yang bila diverifikasi
 * membuat proyeknya mencapai ambang red flag (dihitung di utils/ringkasanAdmin).
 */
export function saringLaporanAdmin<T extends LaporanDisaring>(laporan: readonly T[], f: FilterLaporanAdmin, potensi: ReadonlySet<string>): T[] {
  const hasil = laporan.filter((l) => (f.status === 'semua' || l.status === f.status) && lolosSelainStatus(l, f))
  const pembanding: Record<UrutanLaporan, (a: T, b: T) => number> = {
    prioritas: (a, b) => Number(potensi.has(b.id)) - Number(potensi.has(a.id)) || waktu(a) - waktu(b),
    terbaru: (a, b) => waktu(b) - waktu(a),
    terlama: (a, b) => waktu(a) - waktu(b),
    konfirmasi: (a, b) => b.jumlah_konfirmasi - a.jumlah_konfirmasi || waktu(b) - waktu(a),
  }
  return hasil.sort(pembanding[f.urut])
}

/** Jumlah laporan per status (plus `semua`) setelah saringan lain diterapkan. */
export function hitungPerStatus(laporan: readonly LaporanDisaring[], f: FilterLaporanAdmin): Record<StatusLaporan | 'semua', number> {
  const jumlah = Object.fromEntries([['semua', 0], ...Constants.public.Enums.status_laporan.map((s) => [s, 0])]) as Record<
    StatusLaporan | 'semua',
    number
  >
  for (const l of laporan) {
    if (!lolosSelainStatus(l, f)) continue
    jumlah.semua++
    jumlah[l.status]++
  }
  return jumlah
}

/** Banyaknya saringan tambahan yang aktif (pencarian, kategori, jenis data); tab status tidak dihitung. */
export function jumlahSaringanAktif(f: FilterLaporanAdmin): number {
  return Number(f.kata.trim() !== '') + Number(f.kategori !== 'semua') + Number(f.jenis !== 'semua')
}

const salahSatu = <T extends string>(nilai: string | null, daftar: readonly T[], bawaan: T): T =>
  nilai !== null && (daftar as readonly string[]).includes(nilai) ? (nilai as T) : bawaan

/** Baca saringan dari URL (`?q=&status=&kategori=&jenis=&urut=`). Nilai tak dikenal kembali ke bawaan. */
export function filterLaporanDariParams(params: URLSearchParams): FilterLaporanAdmin {
  const awal = FILTER_LAPORAN_AWAL
  return {
    kata: params.get('q') ?? '',
    status: salahSatu(params.get('status'), ['semua', ...Constants.public.Enums.status_laporan], awal.status),
    kategori: salahSatu(params.get('kategori'), ['semua', ...Constants.public.Enums.kategori_laporan], awal.kategori),
    jenis: salahSatu(params.get('jenis'), JENIS_DATA, awal.jenis),
    urut: salahSatu(params.get('urut'), URUTAN_LAPORAN, awal.urut),
  }
}

/** Tulis saringan ke URL; nilai bawaan tidak ditulis agar URL tetap pendek. Parameter lain (mis. `buka`) dipertahankan. */
export function filterLaporanKeParams(f: FilterLaporanAdmin, lama: URLSearchParams): URLSearchParams {
  const baru = new URLSearchParams(lama)
  const tulis = (kunci: string, nilai: string, bawaan: string) => (nilai && nilai !== bawaan ? baru.set(kunci, nilai) : baru.delete(kunci))
  tulis('q', f.kata, '')
  tulis('status', f.status, FILTER_LAPORAN_AWAL.status)
  tulis('kategori', f.kategori, FILTER_LAPORAN_AWAL.kategori)
  tulis('jenis', f.jenis, FILTER_LAPORAN_AWAL.jenis)
  tulis('urut', f.urut, FILTER_LAPORAN_AWAL.urut)
  return baru
}
