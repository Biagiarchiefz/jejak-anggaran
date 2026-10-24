import { describe, expect, it } from 'vitest'
import { totalPerTahun, unikBerdasarkanId, urusanPadaTahun } from './anggaran'

const baris = [
  { tahun: 2025, urusan: 'Pendidikan', anggaran: 300, realisasi: 250 },
  { tahun: 2025, urusan: 'Kesehatan', anggaran: 200, realisasi: 180 },
  { tahun: 2024, urusan: 'Pendidikan', anggaran: 280, realisasi: 270 },
  { tahun: 2026, urusan: 'Pendidikan', anggaran: 320, realisasi: null },
  { tahun: 2026, urusan: 'Kesehatan', anggaran: 210, realisasi: 10 },
]

describe('totalPerTahun', () => {
  it('menjumlahkan per tahun dan mengurutkan naik', () => {
    expect(totalPerTahun(baris)).toEqual([
      { tahun: 2024, anggaran: 280, realisasi: 270 },
      { tahun: 2025, anggaran: 500, realisasi: 430 },
      { tahun: 2026, anggaran: 530, realisasi: null },
    ])
  })

  it('mengembalikan daftar kosong untuk data kosong', () => {
    expect(totalPerTahun([])).toEqual([])
  })
})

describe('urusanPadaTahun', () => {
  it('menyaring tahun dan mengurutkan dari anggaran terbesar', () => {
    expect(urusanPadaTahun(baris, 2025).map((b) => b.urusan)).toEqual(['Pendidikan', 'Kesehatan'])
  })
})

describe('unikBerdasarkanId', () => {
  it('membuang duplikat', () => {
    expect(unikBerdasarkanId([{ id: 1 }, { id: 2 }, { id: 1 }])).toEqual([{ id: 1 }, { id: 2 }])
  })
})
