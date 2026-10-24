import { describe, expect, it } from 'vitest'
import { formatPersen, formatRupiah, formatRupiahRingkas, formatTanggal } from './format'

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
