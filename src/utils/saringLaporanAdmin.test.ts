import { describe, expect, it } from 'vitest'
import {
  FILTER_LAPORAN_AWAL,
  cocokKataKunci,
  filterLaporanDariParams,
  filterLaporanKeParams,
  hitungPerStatus,
  jumlahSaringanAktif,
  saringLaporanAdmin,
  type FilterLaporanAdmin,
  type LaporanDisaring,
} from './saringLaporanAdmin'

function laporan(id: string, sebagian: Partial<LaporanDisaring> = {}): LaporanDisaring {
  return {
    id,
    kategori: 'kerusakan',
    status: 'diterima',
    deskripsi: 'Aspal berlubang di depan sekolah.',
    is_demo: false,
    created_at: '2026-11-01T10:00:00+07:00',
    jumlah_konfirmasi: 0,
    proyek: { nama_paket: 'Rehabilitasi Jalan Lingkungan', kecamatan: 'Coblong' },
    ...sebagian,
  }
}

const f = (sebagian: Partial<FilterLaporanAdmin> = {}): FilterLaporanAdmin => ({ ...FILTER_LAPORAN_AWAL, ...sebagian })

describe('cocokKataKunci', () => {
  const l = laporan('a1b2c3', { kategori: 'tidak_sesuai', deskripsi: 'Taman belum dibangun.', proyek: { nama_paket: 'Penataan Taman', kecamatan: 'Cicendo' } })

  it('mencari di kategori, isi laporan, nama proyek, kecamatan, dan ID', () => {
    expect(cocokKataKunci(l, 'tidak sesuai')).toBe(true)
    expect(cocokKataKunci(l, 'dibangun')).toBe(true)
    expect(cocokKataKunci(l, 'penataan')).toBe(true)
    expect(cocokKataKunci(l, 'cicendo')).toBe(true)
    expect(cocokKataKunci(l, 'a1b2')).toBe(true)
  })

  it('semua kata harus cocok, tanpa peduli huruf besar-kecil', () => {
    expect(cocokKataKunci(l, 'TAMAN cicendo')).toBe(true)
    expect(cocokKataKunci(l, 'taman coblong')).toBe(false)
  })

  it('kata kunci kosong meloloskan semua laporan', () => {
    expect(cocokKataKunci(l, '   ')).toBe(true)
  })
})

describe('saringLaporanAdmin', () => {
  const data = [
    laporan('lama', { created_at: '2026-10-01T10:00:00+07:00', jumlah_konfirmasi: 1 }),
    laporan('baru', { created_at: '2026-11-05T10:00:00+07:00', jumlah_konfirmasi: 5 }),
    laporan('tengah', { created_at: '2026-10-20T10:00:00+07:00', jumlah_konfirmasi: 2, is_demo: true }),
    laporan('selesai', { status: 'selesai', kategori: 'belum_dikerjakan' }),
  ]

  it('bawaan: hanya laporan diterima, yang berpotensi red flag dulu lalu yang paling lama menunggu', () => {
    expect(saringLaporanAdmin(data, f(), new Set(['baru'])).map((l) => l.id)).toEqual(['baru', 'lama', 'tengah'])
  })

  it('mendukung urutan terbaru, terlama, dan konfirmasi terbanyak', () => {
    const urut = (u: FilterLaporanAdmin['urut']) => saringLaporanAdmin(data, f({ urut: u }), new Set()).map((l) => l.id)
    expect(urut('terbaru')).toEqual(['baru', 'tengah', 'lama'])
    expect(urut('terlama')).toEqual(['lama', 'tengah', 'baru'])
    expect(urut('konfirmasi')).toEqual(['baru', 'tengah', 'lama'])
  })

  it('menyaring jenis data dan kategori', () => {
    expect(saringLaporanAdmin(data, f({ jenis: 'demo' }), new Set()).map((l) => l.id)).toEqual(['tengah'])
    expect(saringLaporanAdmin(data, f({ jenis: 'nyata', status: 'semua' }), new Set())).toHaveLength(3)
    expect(saringLaporanAdmin(data, f({ status: 'semua', kategori: 'belum_dikerjakan' }), new Set()).map((l) => l.id)).toEqual(['selesai'])
  })

  it('tidak mengubah urutan larik aslinya', () => {
    const salinan = [...data]
    saringLaporanAdmin(data, f({ urut: 'terbaru' }), new Set())
    expect(data).toEqual(salinan)
  })
})

describe('hitungPerStatus', () => {
  it('angka tab status ikut menyesuaikan pencarian dan saringan lain', () => {
    const data = [laporan('a'), laporan('b', { status: 'selesai' }), laporan('c', { deskripsi: 'Lampu jalan mati.' })]
    expect(hitungPerStatus(data, f())).toMatchObject({ semua: 3, diterima: 2, selesai: 1, ditolak: 0 })
    expect(hitungPerStatus(data, f({ kata: 'lampu' }))).toMatchObject({ semua: 1, diterima: 1, selesai: 0 })
  })
})

describe('parameter URL', () => {
  it('nilai bawaan tidak ditulis, parameter lain dipertahankan', () => {
    const p = filterLaporanKeParams(f({ kata: 'jalan', urut: 'terbaru' }), new URLSearchParams('buka=xyz'))
    expect(p.toString()).toBe('buka=xyz&q=jalan&urut=terbaru')
    expect(filterLaporanKeParams(FILTER_LAPORAN_AWAL, new URLSearchParams('status=selesai')).toString()).toBe('')
  })

  it('membaca kembali saringan, dan nilai tak dikenal kembali ke bawaan', () => {
    const awal = f({ kata: 'drainase', status: 'semua', kategori: 'kerusakan', jenis: 'demo', urut: 'konfirmasi' })
    expect(filterLaporanDariParams(filterLaporanKeParams(awal, new URLSearchParams()))).toEqual(awal)
    expect(filterLaporanDariParams(new URLSearchParams('status=hapus&urut=acak&jenis=x'))).toEqual(FILTER_LAPORAN_AWAL)
  })
})

describe('jumlahSaringanAktif', () => {
  it('menghitung pencarian, kategori, dan jenis data; tab status tidak dihitung', () => {
    expect(jumlahSaringanAktif(FILTER_LAPORAN_AWAL)).toBe(0)
    expect(jumlahSaringanAktif(f({ kata: ' jalan ', kategori: 'lainnya', jenis: 'nyata', status: 'selesai' }))).toBe(3)
  })
})
