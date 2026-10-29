// Perhitungan tile peta (Web Mercator / skema "slippy map" OpenStreetMap) untuk peta statis tanpa Leaflet:
// cuplikan peta di kartu proyek dan peta latar hero Beranda.

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
  /** Nomor tile kiri atas grid; titik lain dipetakan ke piksel grid lewat `pikselDalamSusunan()`. */
  asalX: number
  asalY: number
  /** Posisi titik (px) di dalam grid; grid digeser sebesar ini agar titik berada di tengah wadah. */
  titikX: number
  titikY: number
  lebar: number
  tinggi: number
}

/**
 * Grid `kolom` x `baris` tile di sekitar titik, dengan titik selalu berada di tile tengah
 * (untuk jumlah genap, tile tepat di kanan/bawah tengah).
 */
export function susunanTile(lat: number, lng: number, zoom: number, kolom: number, baris: number): SusunanTile {
  const { x, y } = keKoordinatTile(lat, lng, zoom)
  const asalX = Math.floor(x) - Math.floor(kolom / 2)
  const asalY = Math.floor(y) - Math.floor(baris / 2)
  const tile: SusunanTile['tile'] = []
  for (let b = 0; b < baris; b++) {
    for (let k = 0; k < kolom; k++) {
      tile.push({ x: asalX + k, y: asalY + b, kiri: k * UKURAN_TILE, atas: b * UKURAN_TILE })
    }
  }
  return {
    tile,
    asalX,
    asalY,
    titikX: (x - asalX) * UKURAN_TILE,
    titikY: (y - asalY) * UKURAN_TILE,
    lebar: kolom * UKURAN_TILE,
    tinggi: baris * UKURAN_TILE,
  }
}

/**
 * Grid `jumlah` x `jumlah` tile di sekitar titik, dengan titik selalu berada di tile tengah.
 * Grid 3x3 (768px) cukup menutup wadah hingga sekitar 512px di setiap arah dari titik.
 */
export function tileDiSekitar(lat: number, lng: number, zoom: number, jumlah = 3): SusunanTile {
  return susunanTile(lat, lng, zoom, jumlah, jumlah)
}

/** Posisi piksel sebuah koordinat di dalam grid `susunan` (bisa di luar grid bila titiknya jauh). */
export function pikselDalamSusunan(lat: number, lng: number, zoom: number, susunan: SusunanTile): { x: number; y: number } {
  const { x, y } = keKoordinatTile(lat, lng, zoom)
  return { x: (x - susunan.asalX) * UKURAN_TILE, y: (y - susunan.asalY) * UKURAN_TILE }
}

export function urlTileOsm(zoom: number, x: number, y: number): string {
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`
}

export type Kotak = { barat: number; timur: number; selatan: number; utara: number }

/** Kotak pembatas sekumpulan titik [bujur, lintang] (urutan GeoJSON), mis. untuk memusatkan peta pada satu wilayah. */
export function kotakBatas(titik: readonly (readonly number[])[]): Kotak {
  const bujur = titik.map(([lng]) => lng)
  const lintang = titik.map(([, lat]) => lat)
  return {
    barat: Math.min(...bujur),
    timur: Math.max(...bujur),
    selatan: Math.min(...lintang),
    utara: Math.max(...lintang),
  }
}

export type Ukuran = { lebar: number; tinggi: number }

/**
 * Skala (paling besar `maks`) agar `isi` muat utuh di dalam `wadah` tanpa mengubah perbandingan sisinya.
 * Wadah yang belum terukur (lebar/tinggi ≤ 0) → `maks`.
 */
export function skalaAgarMuat(wadah: Ukuran, isi: Ukuran, maks = 1): number {
  if (wadah.lebar <= 0 || wadah.tinggi <= 0) return maks
  return Math.min(maks, wadah.lebar / isi.lebar, wadah.tinggi / isi.tinggi)
}
