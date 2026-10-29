import L from 'leaflet'
import { describe, expect, it } from 'vitest'
import { keKoordinatTile, kotakBatas, pikselDalamSusunan, skalaAgarMuat, susunanTile, tileDiSekitar, UKURAN_TILE, urlTileOsm } from './petaTile'

describe('keKoordinatTile', () => {
  it('titik (0, 0) berada tepat di tengah dunia', () => {
    expect(keKoordinatTile(0, 0, 1)).toEqual({ x: 1, y: 1 })
    expect(keKoordinatTile(0, 0, 3)).toEqual({ x: 4, y: 4 })
  })

  it.each([
    [-6.9147, 107.6098, 16],
    [-6.8935, 107.613, 16],
    [-6.948, 107.653, 15],
  ])('sama dengan proyeksi Leaflet untuk (%f, %f) zoom %i', (lat, lng, zoom) => {
    // Pembanding independen: proyeksi EPSG:3857 milik Leaflet (dipakai peta utama).
    const piksel = L.CRS.EPSG3857.latLngToPoint(L.latLng(lat, lng), zoom)
    const { x, y } = keKoordinatTile(lat, lng, zoom)
    expect(x * UKURAN_TILE).toBeCloseTo(piksel.x, 3)
    expect(y * UKURAN_TILE).toBeCloseTo(piksel.y, 3)
  })
})

describe('tileDiSekitar', () => {
  const susunan = tileDiSekitar(-6.8935, 107.613, 16)

  it('membuat grid 3x3 dengan titik di tile tengah', () => {
    expect(susunan.tile).toHaveLength(9)
    expect(susunan.titikX).toBeGreaterThanOrEqual(UKURAN_TILE)
    expect(susunan.titikX).toBeLessThan(2 * UKURAN_TILE)
    expect(susunan.titikY).toBeGreaterThanOrEqual(UKURAN_TILE)
    expect(susunan.titikY).toBeLessThan(2 * UKURAN_TILE)
    expect(susunan.lebar).toBe(3 * UKURAN_TILE)
  })

  it('menyusun tile berurutan dari kiri atas', () => {
    const [kiriAtas, , , , tengah] = susunan.tile
    const { x, y } = keKoordinatTile(-6.8935, 107.613, 16)
    expect(tengah).toMatchObject({ x: Math.floor(x), y: Math.floor(y), kiri: UKURAN_TILE, atas: UKURAN_TILE })
    expect(kiriAtas).toMatchObject({ x: Math.floor(x) - 1, y: Math.floor(y) - 1, kiri: 0, atas: 0 })
  })
})

describe('susunanTile', () => {
  const susunan = susunanTile(-6.9147, 107.6098, 13, 7, 4)

  it('membuat grid persegi panjang dengan titik di tile tengah', () => {
    expect(susunan.tile).toHaveLength(28)
    expect(susunan.lebar).toBe(7 * UKURAN_TILE)
    expect(susunan.tinggi).toBe(4 * UKURAN_TILE)
    expect(Math.floor(susunan.titikX / UKURAN_TILE)).toBe(3)
    expect(Math.floor(susunan.titikY / UKURAN_TILE)).toBe(2)
  })

  it('tile terakhir berada di kanan bawah grid', () => {
    expect(susunan.tile.at(-1)).toMatchObject({ x: susunan.asalX + 6, y: susunan.asalY + 3, kiri: 6 * UKURAN_TILE, atas: 3 * UKURAN_TILE })
  })
})

describe('pikselDalamSusunan', () => {
  const susunan = susunanTile(-6.9147, 107.6098, 13, 7, 4)

  it('titik pusat jatuh tepat di titikX/titikY', () => {
    expect(pikselDalamSusunan(-6.9147, 107.6098, 13, susunan)).toEqual({ x: susunan.titikX, y: susunan.titikY })
  })

  it('selisih piksel antartitik sama dengan proyeksi Leaflet', () => {
    const a = L.CRS.EPSG3857.latLngToPoint(L.latLng(-6.9147, 107.6098), 13)
    const b = L.CRS.EPSG3857.latLngToPoint(L.latLng(-6.948, 107.653), 13)
    const p = pikselDalamSusunan(-6.948, 107.653, 13, susunan)
    expect(p.x - susunan.titikX).toBeCloseTo(b.x - a.x, 3)
    expect(p.y - susunan.titikY).toBeCloseTo(b.y - a.y, 3)
  })
})

describe('urlTileOsm', () => {
  it('memakai server tile resmi OpenStreetMap', () => {
    expect(urlTileOsm(16, 52357, 34029)).toBe('https://tile.openstreetmap.org/16/52357/34029.png')
  })
})

describe('kotakBatas', () => {
  it('mengambil bujur/lintang terkecil dan terbesar dari titik [bujur, lintang]', () => {
    expect(
      kotakBatas([
        [107.6, -6.9],
        [107.55, -6.95],
        [107.74, -6.84],
      ]),
    ).toEqual({ barat: 107.55, timur: 107.74, selatan: -6.95, utara: -6.84 })
  })
})

describe('skalaAgarMuat', () => {
  const isi = { lebar: 500, tinggi: 400 }

  it('mengecilkan isi mengikuti sisi wadah yang paling sempit', () => {
    expect(skalaAgarMuat({ lebar: 250, tinggi: 400 }, isi)).toBe(0.5)
    expect(skalaAgarMuat({ lebar: 1000, tinggi: 100 }, isi)).toBe(0.25)
  })

  it('tidak membesarkan melebihi batas maksimum', () => {
    expect(skalaAgarMuat({ lebar: 2000, tinggi: 2000 }, isi)).toBe(1)
    expect(skalaAgarMuat({ lebar: 2000, tinggi: 2000 }, isi, 1.5)).toBe(1.5)
  })

  it('wadah yang belum terukur memakai skala maksimum', () => {
    expect(skalaAgarMuat({ lebar: 0, tinggi: 0 }, isi)).toBe(1)
    expect(skalaAgarMuat({ lebar: -20, tinggi: 300 }, isi)).toBe(1)
  })
})
