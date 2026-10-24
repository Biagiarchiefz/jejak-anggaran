// Wilayah Kota Bandung. Dipakai peta dan validasi CSV di scripts/build-seed.ts.
// File ini dibaca langsung oleh Node, jadi jangan mengimpor nilai runtime dari modul lain.

export const BATAS_KOTA_BANDUNG = {
  latMin: -6.98,
  latMaks: -6.83,
  lngMin: 107.54,
  lngMaks: 107.75,
} as const

export const PUSAT_KOTA_BANDUNG: [number, number] = [-6.9147, 107.6098]

export const KECAMATAN_KOTA_BANDUNG = [
  'Andir',
  'Antapani',
  'Arcamanik',
  'Astanaanyar',
  'Babakan Ciparay',
  'Bandung Kidul',
  'Bandung Kulon',
  'Bandung Wetan',
  'Batununggal',
  'Bojongloa Kaler',
  'Bojongloa Kidul',
  'Buahbatu',
  'Cibeunying Kaler',
  'Cibeunying Kidul',
  'Cibiru',
  'Cicendo',
  'Cidadap',
  'Cinambo',
  'Coblong',
  'Gedebage',
  'Kiaracondong',
  'Lengkong',
  'Mandalajati',
  'Panyileukan',
  'Rancasari',
  'Regol',
  'Sukajadi',
  'Sukasari',
  'Sumur Bandung',
  'Ujungberung',
] as const

export function dalamKotaBandung(lat: number, lng: number): boolean {
  const b = BATAS_KOTA_BANDUNG
  return lat >= b.latMin && lat <= b.latMaks && lng >= b.lngMin && lng <= b.lngMaks
}
