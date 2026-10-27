import type { Negara } from '../data/negaraAsiaPasifik'

/** Kotak batas dalam derajat. */
export type Batas = { lngMin: number; lngMaks: number; latMin: number; latMaks: number }

/** Satu titik peta dot-matrix di daratan, dengan kode negara tempatnya berada. */
export type TitikPeta = { lng: number; lat: number; kode: string }

/** Ray casting: apakah titik berada di dalam satu cincin poligon ([bujur, lintang][]). */
export function dalamCincin(lng: number, lat: number, cincin: readonly number[][]): boolean {
  let dalam = false
  for (let i = 0, j = cincin.length - 1; i < cincin.length; j = i++) {
    const [xi, yi] = cincin[i]
    const [xj, yj] = cincin[j]
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) dalam = !dalam
  }
  return dalam
}

/** Poligon GeoJSON: cincin pertama = batas luar, sisanya = lubang. */
export function dalamPoligon(lng: number, lat: number, poligon: readonly number[][][]): boolean {
  if (poligon.length === 0 || !dalamCincin(lng, lat, poligon[0])) return false
  return !poligon.slice(1).some((lubang) => dalamCincin(lng, lat, lubang))
}

function batasNegara(n: Negara): Batas {
  let lngMin = Infinity
  let lngMaks = -Infinity
  let latMin = Infinity
  let latMaks = -Infinity
  for (const poligon of n.poligon)
    for (const [lng, lat] of poligon[0]) {
      lngMin = Math.min(lngMin, lng)
      lngMaks = Math.max(lngMaks, lng)
      latMin = Math.min(latMin, lat)
      latMaks = Math.max(latMaks, lat)
    }
  return { lngMin, lngMaks, latMin, latMaks }
}

/**
 * Grid titik berjarak `langkah` derajat di dalam `batas`, hanya yang jatuh di daratan.
 * Titik berada di tengah sel grid, diurutkan dari utara ke selatan lalu barat ke timur.
 */
export function titikDarat(negara: readonly Negara[], batas: Batas, langkah: number): TitikPeta[] {
  const calon = negara.map((n) => ({ n, b: batasNegara(n) }))
  const kolom = Math.round((batas.lngMaks - batas.lngMin) / langkah)
  const baris = Math.round((batas.latMaks - batas.latMin) / langkah)
  const hasil: TitikPeta[] = []

  for (let r = 0; r < baris; r++) {
    const lat = batas.latMaks - (r + 0.5) * langkah
    for (let c = 0; c < kolom; c++) {
      const lng = batas.lngMin + (c + 0.5) * langkah
      const kena = calon.find(
        ({ n, b }) =>
          lng >= b.lngMin && lng <= b.lngMaks && lat >= b.latMin && lat <= b.latMaks && n.poligon.some((p) => dalamPoligon(lng, lat, p)),
      )
      if (kena) hasil.push({ lng, lat, kode: kena.n.kode })
    }
  }
  return hasil
}

/** Posisi relatif (0–1, dibatasi) sebuah koordinat di dalam `batas`: x dari barat, y dari utara. */
export function posisiRelatif(lat: number, lng: number, batas: Batas): { x: number; y: number } {
  const jepit = (v: number) => Math.min(1, Math.max(0, v))
  return {
    x: jepit((lng - batas.lngMin) / (batas.lngMaks - batas.lngMin)),
    y: jepit((batas.latMaks - lat) / (batas.latMaks - batas.latMin)),
  }
}
