// Jumlah penduduk Kota Bandung, dipakai untuk menerjemahkan APBD menjadi "anggaran per warga".
// Dikurasi manual seperti data di data/raw/. Perbarui angka, tahun, dan tanggal akses bersamaan.
//
// PERLU DIVERIFIKASI sebelum rilis: 2.506.603 jiwa adalah perkiraan penduduk pertengahan tahun BPS yang dikutip
// ulang sumber sekunder; cocokkan dengan tabel resmi di tautan sumber (Kota Bandung Dalam Angka / proyeksi SP2020).

export const PENDUDUK_KOTA_BANDUNG = {
  jumlah: 2_506_603,
  tahun: 2024,
  sumber: {
    nama: 'BPS Kota Bandung',
    url: 'https://bandungkota.bps.go.id/id/publication/2023/08/21/9b1e1a07cb0cb93b1b05ad28/proyeksi-penduduk-kota-bandung-2020---2035-hasil-sensus-penduduk-2020.html',
    diakses_pada: '2026-10-28',
  },
} as const
