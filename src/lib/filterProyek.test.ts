import { describe, expect, it } from 'vitest'
import { daftarKecamatan, FILTER_AWAL, pilihProyekSorotan, saringProyek } from './filterProyek'

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
