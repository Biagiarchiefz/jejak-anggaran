/**
 * Hex token warna untuk pustaka yang butuh nilai warna langsung (Recharts, Leaflet, SVG).
 * Nilainya sama persis dengan `@theme` di src/index.css (DESIGN.md §3). Komponen lain memakai kelas Tailwind.
 */
export const WARNA = {
  /** Bingkai pin peta. */
  canvas: '#ffffff',
  surface: '#fbfcfe',
  brand: '#2b8cff',
  brandLight: '#8cc8ff',
  danger: '#c81e1e',
  inkSubtle: '#4b5563',
  ink: '#1f2937',
  borderSoft: '#edf1f6',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  recessed: '#e9eef4',
  /** Anggaran selalu biru tua, realisasi biru cerah, di semua grafik. */
  seriAnggaran: '#0f3b6e',
  seriRealisasi: '#2b8cff',
} as const
