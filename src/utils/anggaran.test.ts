import { describe, expect, it } from 'vitest'
import { anggaranKeCsv, anggaranPerWarga, bandingkanTahunSebelumnya, realisasiTerakhir, totalPerTahun, unikBerdasarkanId, urusanPadaTahun } from './anggaran'

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

describe('bandingkanTahunSebelumnya', () => {
  const tren = totalPerTahun(baris)

  it('mengembalikan tahun yang diminta dan tahun sebelumnya', () => {
    expect(bandingkanTahunSebelumnya(tren, 2025)).toEqual({ saatIni: tren[1], sebelumnya: tren[0] })
  })

  it('sebelumnya null untuk tahun pertama', () => {
    expect(bandingkanTahunSebelumnya(tren, 2024)?.sebelumnya).toBeNull()
  })

  it('null jika tahun tidak ada', () => {
    expect(bandingkanTahunSebelumnya(tren, 2030)).toBeNull()
  })
})

describe('realisasiTerakhir', () => {
  const tren = totalPerTahun(baris)

  it('melompati tahun yang realisasinya belum lengkap', () => {
    expect(realisasiTerakhir(tren, 2026)).toEqual({ tahun: 2025, anggaran: 500, realisasi: 430 })
  })

  it('tidak memakai tahun setelah tahun yang diminta', () => {
    expect(realisasiTerakhir(tren, 2024)?.tahun).toBe(2024)
  })

  it('null jika belum ada realisasi sama sekali', () => {
    expect(realisasiTerakhir(tren, 2023)).toBeNull()
  })
})

describe('anggaranPerWarga', () => {
  it('membagi anggaran ke tiap warga per tahun dan per hari', () => {
    expect(anggaranPerWarga(730_000, 100)).toEqual({ perTahun: 7_300, perHari: 20 })
  })

  it('null bila jumlah penduduk tidak valid', () => {
    expect(anggaranPerWarga(1_000, 0)).toBeNull()
    expect(anggaranPerWarga(1_000, Number.NaN)).toBeNull()
  })
})

describe('anggaranKeCsv', () => {
  const sumber = { nama: 'DJPK Kemenkeu', url: 'https://djpk.kemenkeu.go.id/?p=5412', diakses_pada: '2026-11-10' }
  it('urut tahun menurun lalu anggaran terbesar, dengan persen serapan 1 desimal', () => {
    const csv = anggaranKeCsv([
      { tahun: 2024, urusan: 'Kesehatan', anggaran: 200, realisasi: 180, is_demo: false, sumber },
      { tahun: 2025, urusan: 'Pendidikan', anggaran: 300, realisasi: null, is_demo: false, sumber },
      { tahun: 2024, urusan: 'Pendidikan', anggaran: 300, realisasi: 251, is_demo: false, sumber },
    ])
    const baris = csv.trim().split('\r\n')
    expect(baris[0]).toBe('tahun,bidang,anggaran_rp,realisasi_rp,serapan_persen,data_demo,sumber,sumber_url,diakses_pada')
    expect(baris.slice(1).map((b) => b.split(',').slice(0, 5).join(','))).toEqual([
      '2025,Pendidikan,300,,',
      '2024,Pendidikan,300,251,83.7',
      '2024,Kesehatan,200,180,90',
    ])
  })
})
