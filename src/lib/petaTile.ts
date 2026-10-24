// Perhitungan tile peta (Web Mercator / skema "slippy map" OpenStreetMap) untuk
// cuplikan peta statis di kartu proyek, tanpa memuat Leaflet.

export const UKURAN_TILE = 256

/** Koordinat tile pecahan untuk satu titik. Bagian bulat = nomor tile, pecahan = posisi di dalam tile. */
export function keKoordinatTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const n = 2 ** zoom
  const latRad = (lat * Math.PI) / 180
  return {
    x: ((lng + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  }
}

export type SusunanTile = {
  tile: { x: number; y: number; kiri: number; atas: number }[]
  /** Posisi titik (px) di dalam grid; grid digeser sebesar ini agar titik berada di tengah wadah. */
  titikX: number
  titikY: number
  lebar: number
  tinggi: number
}

/**
 * Grid `jumlah` x `jumlah` tile di sekitar titik, dengan titik selalu berada di tile tengah.
 * Grid 3x3 (768px) cukup menutup wadah hingga sekitar 512px di setiap arah dari titik.
 */
export function tileDiSekitar(lat: number, lng: number, zoom: number, jumlah = 3): SusunanTile {
  const { x, y } = keKoordinatTile(lat, lng, zoom)
  const tengah = Math.floor(jumlah / 2)
  const awalX = Math.floor(x) - tengah
  const awalY = Math.floor(y) - tengah
  const tile: SusunanTile['tile'] = []
  for (let baris = 0; baris < jumlah; baris++) {
    for (let kolom = 0; kolom < jumlah; kolom++) {
      tile.push({ x: awalX + kolom, y: awalY + baris, kiri: kolom * UKURAN_TILE, atas: baris * UKURAN_TILE })
    }
  }
  return {
    tile,
    titikX: (x - awalX) * UKURAN_TILE,
    titikY: (y - awalY) * UKURAN_TILE,
    lebar: jumlah * UKURAN_TILE,
    tinggi: jumlah * UKURAN_TILE,
  }
}

export function urlTileOsm(zoom: number, x: number, y: number): string {
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`
}
