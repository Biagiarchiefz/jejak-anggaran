import { describe, expect, it } from 'vitest'
import {
  cariProyek,
  daftarKecamatan,
  FILTER_AWAL,
  filterDariParams,
  jumlahFilterAktif,
  pilihProyekSorotan,
  saringProyek,
  urlPeta,
} from './filterProyek'

const proyek = [
  { id: 'a', status_proyek: 'selesai' as const, kecamatan: 'Coblong' },
  { id: 'b', status_proyek: 'berjalan' as const, kecamatan: 'Coblong' },
  { id: 'c', status_proyek: 'selesai' as const, kecamatan: 'Andir' },
]

describe('saringProyek', () => {
  it('tanpa saringan mengembalikan semua', () => {
    expect(saringProyek(proyek, FILTER_AWAL)).toHaveLength(3)
  })

  it('menyaring status dan kecamatan bersamaan', () => {
    expect(saringProyek(proyek, { status: 'selesai', kecamatan: 'Coblong' }).map((p) => p.id)).toEqual(['a'])
  })
})

describe('pilihProyekSorotan', () => {
  const daftar = [
    { nama_paket: 'Taman Demo', is_demo: true, redFlag: null },
    { nama_paket: 'Jalan Nyata B', is_demo: false, redFlag: null },
    { nama_paket: 'Jalan Demo Rusak', is_demo: true, redFlag: { jumlahLaporan: 3 } },
    { nama_paket: 'Jalan Nyata A', is_demo: false, redFlag: null },
  ]

  it('mendahulukan yang perlu perhatian, lalu proyek nyata, lalu abjad', () => {
    expect(pilihProyekSorotan(daftar, 10).map((p) => p.nama_paket)).toEqual([
      'Jalan Demo Rusak',
      'Jalan Nyata A',
      'Jalan Nyata B',
      'Taman Demo',
    ])
  })

  it('membatasi jumlah kartu dan tidak mengubah daftar asli', () => {
    const salinan = [...daftar]
    expect(pilihProyekSorotan(daftar, 2)).toHaveLength(2)
    expect(daftar).toEqual(salinan)
  })
})

describe('daftarKecamatan', () => {
  it('unik dan urut abjad', () => {
    expect(daftarKecamatan(proyek)).toEqual(['Andir', 'Coblong'])
  })
})

describe('cariProyek', () => {
  const daftar = [
    { id: 'a', nama_paket: 'Rehabilitasi Jalan Dago', kecamatan: 'Coblong', kelurahan: null, satker: 'Dinas SDABM', pelaksana: 'CV Maju' },
    { id: 'b', nama_paket: 'Pembangunan Taman', kecamatan: 'Andir', kelurahan: 'Ciroyom', satker: 'DPKP', pelaksana: null },
  ]

  it('kata kunci kosong mengembalikan daftar kosong', () => {
    expect(cariProyek(daftar, '   ')).toEqual([])
  })

  it('tidak peka huruf besar dan mencari di wilayah serta pelaksana', () => {
    expect(cariProyek(daftar, 'JALAN').map((p) => p.id)).toEqual(['a'])
    expect(cariProyek(daftar, 'ciroyom').map((p) => p.id)).toEqual(['b'])
    expect(cariProyek(daftar, 'maju').map((p) => p.id)).toEqual(['a'])
  })

  it('semua kata harus cocok', () => {
    expect(cariProyek(daftar, 'jalan andir')).toEqual([])
    expect(cariProyek(daftar, 'taman andir').map((p) => p.id)).toEqual(['b'])
  })
})

describe('jumlahFilterAktif', () => {
  it('menghitung saringan selain "semua"', () => {
    expect(jumlahFilterAktif(FILTER_AWAL)).toBe(0)
    expect(jumlahFilterAktif({ status: 'selesai', kecamatan: 'semua' })).toBe(1)
    expect(jumlahFilterAktif({ status: 'selesai', kecamatan: 'Coblong' })).toBe(2)
  })
})

describe('filterDariParams', () => {
  it('membaca kecamatan dan status dari URL', () => {
    expect(filterDariParams(new URLSearchParams('kecamatan=Coblong&status=berjalan'))).toEqual({ kecamatan: 'Coblong', status: 'berjalan' })
  })

  it('nilai kosong atau status tak dikenal menjadi "semua"', () => {
    expect(filterDariParams(new URLSearchParams(''))).toEqual(FILTER_AWAL)
    expect(filterDariParams(new URLSearchParams('kecamatan=%20&status=rusak'))).toEqual(FILTER_AWAL)
  })
})

describe('urlPeta', () => {
  it('tanpa saringan → /peta', () => {
    expect(urlPeta({})).toBe('/peta')
    expect(urlPeta({ cari: '  ', filter: FILTER_AWAL })).toBe('/peta')
  })

  it('menulis kata kunci dan saringan yang dipakai saja', () => {
    expect(urlPeta({ cari: ' jalan dago ', filter: { kecamatan: 'Coblong', status: 'semua' } })).toBe('/peta?cari=jalan+dago&kecamatan=Coblong')
  })

  it('bolak-balik dengan filterDariParams', () => {
    const filter = { kecamatan: 'Bandung Kidul', status: 'selesai' } as const
    const url = urlPeta({ filter })
    expect(filterDariParams(new URLSearchParams(url.split('?')[1]))).toEqual(filter)
  })
})
