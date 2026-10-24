import { describe, expect, it } from 'vitest'
import { buatRingkasanLapor } from './ringkasanLapor'

describe('buatRingkasanLapor', () => {
  const dasar = {
    proyek: {
      nama_paket: 'Rehabilitasi Jalan X',
      kode_rup: '12345678',
      satker: 'Dinas Contoh',
      kecamatan: 'Coblong',
      kelurahan: 'Dago',
      pagu: 1_250_000_000,
      tahun_anggaran: 2025,
    },
    laporan: {
      kategori: 'kerusakan' as const,
      deskripsi: 'Aspal berlubang di depan sekolah.',
      created_at: '2026-10-20T08:00:00+07:00',
      jumlah_konfirmasi: 4,
    },
    urlHalaman: 'https://jejak-anggaran.example/proyek/x',
  }

  it('memuat informasi penting untuk formulir LAPOR!', () => {
    const teks = buatRingkasanLapor(dasar)
    expect(teks).toContain('Kerusakan pada proyek "Rehabilitasi Jalan X"')
    expect(teks).toContain('Lokasi: Dago, Kec. Coblong, Kota Bandung')
    expect(teks).toContain('Pagu: Rp 1.250.000.000')
    expect(teks).toContain('Kode RUP (SiRUP): 12345678')
    expect(teks).toContain('20 Oktober 2026')
    expect(teks).toContain('dikonfirmasi oleh 4 warga lain')
    expect(teks).toContain(dasar.urlHalaman)
  })

  it('melewati kode RUP yang kosong', () => {
    const teks = buatRingkasanLapor({ ...dasar, proyek: { ...dasar.proyek, kode_rup: null, kelurahan: null } })
    expect(teks).not.toContain('Kode RUP')
    expect(teks).toContain('Lokasi: Kec. Coblong, Kota Bandung')
  })
})
