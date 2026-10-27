import { describe, expect, it } from 'vitest'
import { dalamCincin, dalamPoligon, posisiRelatif, titikDarat } from './petaTitik'
import type { Negara } from '../data/negaraAsiaPasifik'

// Persegi 0–10 dengan lubang persegi 4–6.
const LUAR = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
  [0, 0],
]
const LUBANG = [
  [4, 4],
  [6, 4],
  [6, 6],
  [4, 6],
  [4, 4],
]

describe('dalamCincin', () => {
  it('membedakan titik di dalam dan di luar', () => {
    expect(dalamCincin(5, 5, LUAR)).toBe(true)
    expect(dalamCincin(11, 5, LUAR)).toBe(false)
    expect(dalamCincin(-1, -1, LUAR)).toBe(false)
  })
})

describe('dalamPoligon', () => {
  it('titik di lubang dianggap di luar', () => {
    expect(dalamPoligon(5, 5, [LUAR, LUBANG])).toBe(false)
    expect(dalamPoligon(2, 2, [LUAR, LUBANG])).toBe(true)
  })

  it('poligon kosong tidak berisi apa pun', () => {
    expect(dalamPoligon(0, 0, [])).toBe(false)
  })
})

describe('titikDarat', () => {
  const negara: Negara[] = [{ kode: 'AAA', poligon: [[LUAR]] }]

  it('mengisi grid hanya di daratan, di tengah sel', () => {
    // Batas 0–20 × 0–10, langkah 5: sel tengah (2,5|7,5) × (2,5|7,5|12,5|17,5); hanya bujur < 10 di darat.
    const titik = titikDarat(negara, { lngMin: 0, lngMaks: 20, latMin: 0, latMaks: 10 }, 5)
    expect(titik).toEqual([
      { lng: 2.5, lat: 7.5, kode: 'AAA' },
      { lng: 7.5, lat: 7.5, kode: 'AAA' },
      { lng: 2.5, lat: 2.5, kode: 'AAA' },
      { lng: 7.5, lat: 2.5, kode: 'AAA' },
    ])
  })

  it('tanpa negara tidak ada titik', () => {
    expect(titikDarat([], { lngMin: 0, lngMaks: 10, latMin: 0, latMaks: 10 }, 1)).toEqual([])
  })
})

describe('posisiRelatif', () => {
  const batas = { lngMin: 100, lngMaks: 110, latMin: -10, latMaks: 0 }

  it('x dari barat, y dari utara', () => {
    expect(posisiRelatif(0, 100, batas)).toEqual({ x: 0, y: 0 })
    expect(posisiRelatif(-10, 110, batas)).toEqual({ x: 1, y: 1 })
    expect(posisiRelatif(-5, 105, batas)).toEqual({ x: 0.5, y: 0.5 })
  })

  it('koordinat di luar batas dijepit ke tepi', () => {
    expect(posisiRelatif(5, 120, batas)).toEqual({ x: 1, y: 0 })
  })
})
