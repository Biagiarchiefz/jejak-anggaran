import { describe, expect, it } from 'vitest'
import { keCsv, tanggalBerkas } from './csv'

describe('keCsv', () => {
  it('diawali BOM, berpemisah koma, dan diakhiri baris baru', () => {
    expect(keCsv(['a', 'b'], [[1, 'x']])).toBe('﻿a,b\r\n1,x\r\n')
  })

  it('mengutip sel yang berisi koma, kutip, atau baris baru', () => {
    const csv = keCsv(['nama'], [['Drainase, RW 02'], ['Taman "Tongkeng"'], ['baris\nkedua']])
    expect(csv).toContain('"Drainase, RW 02"')
    expect(csv).toContain('"Taman ""Tongkeng"""')
    expect(csv).toContain('"baris\nkedua"')
  })

  it('null/undefined jadi sel kosong, boolean jadi ya/tidak, angka tetap polos', () => {
    expect(keCsv(['a', 'b', 'c', 'd'], [[null, undefined, true, 4411467450]])).toBe('﻿a,b,c,d\r\n,,ya,4411467450\r\n')
  })
})

describe('tanggalBerkas', () => {
  it('format YYYY-MM-DD dengan nol di depan', () => {
    expect(tanggalBerkas(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})
