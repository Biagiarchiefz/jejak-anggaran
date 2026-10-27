import type { AnggaranDaerah, SumberData } from './anggaranService'

/**
 * Data APBD FIKTIF untuk melihat tampilan dashboard selama data resmi dari DJPK belum dikurasi.
 * Angka hanya meniru skala APBD kota besar, BUKAN angka Kota Bandung. Setiap baris `is_demo: true`
 * sehingga UI selalu menampilkan <BadgeDemo> dan sumber "data demo (fiktif)".
 * Aktif hanya jika VITE_DATA_DEMO_ANGGARAN=true.
 */

const SUMBER_DEMO: SumberData = { id: -1, nama: 'Data demo (fiktif)', url: '', diakses_pada: '2026-10-27' }

// Anggaran 2026 (miliar rupiah) dan pertumbuhan per tahun, agar urutan urusan sedikit berubah antar tahun.
const URUSAN: { urusan: string; anggaran2026: number; tumbuh: number; serapan: number }[] = [
  { urusan: 'Pendidikan', anggaran2026: 1_850, tumbuh: 0.05, serapan: 0.95 },
  { urusan: 'Penunjang Urusan Pemerintahan', anggaran2026: 1_420, tumbuh: 0.03, serapan: 0.93 },
  { urusan: 'Kesehatan', anggaran2026: 1_180, tumbuh: 0.07, serapan: 0.92 },
  { urusan: 'Pekerjaan Umum dan Penataan Ruang', anggaran2026: 820, tumbuh: 0.1, serapan: 0.86 },
  { urusan: 'Perumahan dan Kawasan Permukiman', anggaran2026: 340, tumbuh: 0.04, serapan: 0.84 },
  { urusan: 'Lingkungan Hidup', anggaran2026: 310, tumbuh: 0.09, serapan: 0.9 },
  { urusan: 'Perhubungan', anggaran2026: 260, tumbuh: 0.02, serapan: 0.88 },
  { urusan: 'Ketenteraman, Ketertiban Umum, dan Pelindungan Masyarakat', anggaran2026: 190, tumbuh: 0.03, serapan: 0.94 },
  { urusan: 'Sosial', anggaran2026: 150, tumbuh: 0.06, serapan: 0.96 },
  { urusan: 'Kebudayaan dan Pariwisata', anggaran2026: 95, tumbuh: 0.08, serapan: 0.89 },
  { urusan: 'Kepemudaan dan Olahraga', anggaran2026: 80, tumbuh: -0.02, serapan: 0.87 },
  { urusan: 'Kependudukan dan Pencatatan Sipil', anggaran2026: 70, tumbuh: 0.01, serapan: 0.97 },
]

const TAHUN = [2022, 2023, 2024, 2025, 2026]
const TAHUN_BERJALAN = 2026
// Variasi serapan per tahun (2022 → 2025).
const KOREKSI_SERAPAN: Record<number, number> = { 2022: -0.03, 2023: -0.01, 2024: -0.02, 2025: 0 }

const MILIAR = 1e9
const bulatkanJuta = (n: number) => Math.round(n / 1e6) * 1e6

export const ANGGARAN_DEMO: AnggaranDaerah[] = TAHUN.flatMap((tahun) =>
  URUSAN.map((u, i) => {
    const anggaran = bulatkanJuta(u.anggaran2026 * MILIAR * (1 + u.tumbuh) ** (tahun - TAHUN_BERJALAN))
    return {
      id: -(tahun * 100 + i),
      tahun,
      urusan: u.urusan,
      anggaran,
      // Tahun berjalan belum punya realisasi lengkap.
      realisasi: tahun === TAHUN_BERJALAN ? null : bulatkanJuta(anggaran * Math.min(u.serapan + KOREKSI_SERAPAN[tahun], 0.99)),
      sumber_id: SUMBER_DEMO.id,
      sumber: SUMBER_DEMO,
      is_demo: true,
    }
  }),
)
