import L from 'leaflet'
import { describe, expect, it } from 'vitest'
import { keKoordinatTile, tileDiSekitar, UKURAN_TILE, urlTileOsm } from './petaTile'

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

describe('urlTileOsm', () => {
  it('memakai server tile resmi OpenStreetMap', () => {
    expect(urlTileOsm(16, 52357, 34029)).toBe('https://tile.openstreetmap.org/16/52357/34029.png')
  })
})
