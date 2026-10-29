import { describe, expect, it } from 'vitest'
import { formatDurasiJam, formatPersen, formatRupiah, formatRupiahRingkas, formatRupiahRingkasSatuan, formatTanggal } from './format'

describe('formatRupiah', () => {
  it('memakai titik sebagai pemisah ribuan', () => {
    expect(formatRupiah(1234567)).toBe('Rp 1.234.567')
    expect(formatRupiah(0)).toBe('Rp 0')
  })

  it('membulatkan pecahan dan menangani nilai negatif', () => {
    expect(formatRupiah(999.6)).toBe('Rp 1.000')
    expect(formatRupiah(-5000)).toBe('-Rp 5.000')
  })
})

describe('formatRupiahRingkas', () => {
  it.each([
    [1_200_000_000, 'Rp 1,2 M'],
    [7_450_000_000_000, 'Rp 7,5 T'],
    [850_000_000, 'Rp 850 jt'],
    [12_500, 'Rp 12,5 rb'],
    [999, 'Rp 999'],
    [1_000_000_000, 'Rp 1 M'],
    [-2_500_000, '-Rp 2,5 jt'],
  ])('%d → %s', (nilai, hasil) => {
    expect(formatRupiahRingkas(nilai)).toBe(hasil)
  })
})

describe('formatTanggal', () => {
  it('menulis tanggal dalam bahasa Indonesia', () => {
    expect(formatTanggal('2026-10-23')).toBe('23 Oktober 2026')
  })

  it('tidak bergeser hari untuk timestamp WIB larut malam', () => {
    expect(formatTanggal('2026-01-31T23:30:00+07:00')).toBe('31 Januari 2026')
  })
})

describe('formatPersen', () => {
  it('membulatkan ke persen terdekat', () => {
    expect(formatPersen(0.873)).toBe('87%')
  })
})

describe('formatRupiahRingkasSatuan', () => {
  it('memakai satuan milik acuan, bukan milik nilainya sendiri', () => {
    expect(formatRupiahRingkasSatuan(2_400_000_000_000, 6_800_000_000_000)).toBe('Rp 2,4 T')
    expect(formatRupiahRingkasSatuan(300_000_000_000, 6_800_000_000_000)).toBe('Rp 0,3 T')
    expect(formatRupiahRingkasSatuan(0, 9_000_000_000)).toBe('Rp 0 M')
  })

  it('sama dengan formatRupiahRingkas saat nilai = acuan', () => {
    expect(formatRupiahRingkasSatuan(6_765_000_000_000, 6_765_000_000_000)).toBe(formatRupiahRingkas(6_765_000_000_000))
  })

  it('acuan di bawah seribu → format biasa', () => {
    expect(formatRupiahRingkasSatuan(500, 900)).toBe('Rp 500')
  })
})

describe('formatDurasiJam', () => {
  it('memilih satuan yang mudah dibaca', () => {
    expect(formatDurasiJam(0.75)).toBe('45 menit')
    expect(formatDurasiJam(0.001)).toBe('1 menit')
    expect(formatDurasiJam(5)).toBe('5 jam')
    expect(formatDurasiJam(60)).toBe('2,5 hari')
  })
})
