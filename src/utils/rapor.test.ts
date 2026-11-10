import { describe, expect, it } from 'vitest'
import {
  OPSI_RAPOR_AWAL,
  hitungRapor,
  opsiRaporDariParams,
  opsiRaporKeParams,
  proyekKeCsv,
  raporKeCsv,
  ringkasRapor,
  type LaporanRapor,
  type ProyekUntukCsv,
} from './rapor'

function proyek(id: string, sebagian: Partial<ProyekUntukCsv> = {}): ProyekUntukCsv {
  return {
    id,
    nama_paket: `Paket ${id}`,
    kecamatan: 'Cicendo',
    satker: 'Kecamatan Cicendo',
    pagu: 100,
    nilai_kontrak: null,
    is_demo: false,
    redFlag: null,
    kode_rup: '123',
    kelurahan: null,
    tahun_anggaran: 2025,
    status_proyek: 'selesai',
    pelaksana: null,
    sumber_rup_url: 'https://sirup.inaproc.id/x',
    diakses_pada: '2026-11-10',
    ...sebagian,
  }
}

function laporan(id: string, proyekId: string, sebagian: Partial<LaporanRapor> = {}): LaporanRapor {
  return { id, proyek_id: proyekId, status: 'diterima', created_at: '2026-11-01T00:00:00Z', is_demo: false, riwayat: [], ...sebagian }
}

const PROYEK = [
  proyek('a', { pagu: 300, nilai_kontrak: 250 }),
  proyek('b', { pagu: 200, redFlag: { alasan: 'x' } }),
  proyek('c', { kecamatan: 'Regol', satker: 'Dinas Perumahan', pagu: 1000 }),
  proyek('d', { kecamatan: 'Coblong', satker: 'Dinas Perumahan', pagu: 50, is_demo: true }),
]
const LAPORAN = [
  // Ditanggapi 10 jam kemudian.
  laporan('l1', 'a', { status: 'diverifikasi', riwayat: [{ status_lama: 'diterima', created_at: '2026-11-01T10:00:00Z' }] }),
  laporan('l2', 'b', { status: 'selesai', riwayat: [{ status_lama: 'diterima', created_at: '2026-11-01T20:00:00Z' }] }),
  laporan('l3', 'b'),
  laporan('l4', 'd', { is_demo: true, status: 'ditolak' }),
]

describe('hitungRapor', () => {
  it('per kecamatan: jumlah proyek, pagu, kontrak, laporan per status, dan rata-rata respons', () => {
    const [cicendo] = hitungRapor(PROYEK, LAPORAN, { kelompok: 'kecamatan', jenis: 'semua', urut: 'nama' }).filter((b) => b.nama === 'Cicendo')
    expect(cicendo).toEqual({
      nama: 'Cicendo',
      jumlahProyek: 2,
      jumlahProyekDemo: 0,
      totalPagu: 500,
      totalKontrak: 250,
      proyekPerluPerhatian: 1,
      jumlahLaporan: 3,
      menunggu: 1,
      diproses: 1,
      selesai: 1,
      ditolak: 0,
      rataRataResponJam: 15,
    })
  })

  it('kontrak null bila belum ada satu pun, dan respons null bila belum ada yang ditanggapi', () => {
    const [regol] = hitungRapor(PROYEK, LAPORAN, { kelompok: 'kecamatan', jenis: 'semua', urut: 'nama' }).filter((b) => b.nama === 'Regol')
    expect(regol.totalKontrak).toBeNull()
    expect(regol.rataRataResponJam).toBeNull()
  })

  it('per satuan kerja mengelompokkan proyek lintas kecamatan', () => {
    const baris = hitungRapor(PROYEK, LAPORAN, { kelompok: 'satker', jenis: 'semua', urut: 'pagu' })
    expect(baris.map((b) => [b.nama, b.jumlahProyek, b.totalPagu])).toEqual([
      ['Dinas Perumahan', 2, 1050],
      ['Kecamatan Cicendo', 2, 500],
    ])
  })

  it('"data nyata" membuang proyek demo beserta laporannya', () => {
    const baris = hitungRapor(PROYEK, LAPORAN, { kelompok: 'kecamatan', jenis: 'nyata', urut: 'nama' })
    expect(baris.map((b) => b.nama)).toEqual(['Cicendo', 'Regol'])
    expect(baris.some((b) => b.jumlahProyekDemo > 0)).toBe(false)
  })

  it('urutan pagu, laporan, dan abjad', () => {
    const urut = (u: 'pagu' | 'laporan' | 'nama') => hitungRapor(PROYEK, LAPORAN, { kelompok: 'kecamatan', jenis: 'semua', urut: u }).map((b) => b.nama)
    expect(urut('pagu')).toEqual(['Regol', 'Cicendo', 'Coblong'])
    expect(urut('laporan')).toEqual(['Cicendo', 'Coblong', 'Regol'])
    expect(urut('nama')).toEqual(['Cicendo', 'Coblong', 'Regol'])
  })
})

describe('ringkasRapor', () => {
  it('menjumlahkan semua kelompok', () => {
    const r = ringkasRapor(PROYEK, LAPORAN, { kelompok: 'kecamatan', jenis: 'semua' })
    expect(r).toMatchObject({ jumlahKelompok: 3, jumlahProyek: 4, jumlahProyekDemo: 1, totalPagu: 1550, jumlahLaporan: 4, ditolak: 1 })
  })
})

describe('CSV', () => {
  it('rapor: kolom sesuai kelompok, respons 1 desimal, kontrak kosong bila belum ada', () => {
    const csv = raporKeCsv(hitungRapor(PROYEK, LAPORAN, { kelompok: 'kecamatan', jenis: 'semua', urut: 'nama' }), 'kecamatan')
    const baris = csv.trim().split('\r\n')
    // .trim() ikut membuang BOM di awal; keberadaan BOM diuji di csv.test.ts.
    expect(baris[0]).toBe(
      'kecamatan,jumlah_proyek,proyek_demo,total_pagu_rp,total_kontrak_rp,proyek_perlu_perhatian,laporan_total,laporan_menunggu,laporan_diproses,laporan_selesai,laporan_ditolak,rata_rata_respons_jam',
    )
    expect(baris[1]).toBe('Cicendo,2,0,500,250,1,3,1,1,1,0,15')
    expect(baris[3]).toBe('Regol,1,0,1000,,0,0,0,0,0,0,')
    expect(raporKeCsv([], 'satker')).toContain('satuan_kerja,')
  })

  it('daftar proyek: jumlah laporan per proyek dan penanda data demo', () => {
    const baris = proyekKeCsv(PROYEK, LAPORAN).trim().split('\r\n')
    expect(baris).toHaveLength(5)
    expect(baris[2]).toContain(',ya,2,tidak,') // proyek b: perlu perhatian, 2 laporan, bukan demo
    expect(baris[4]).toContain(',tidak,1,ya,') // proyek d: demo
  })
})

describe('opsi rapor di URL', () => {
  it('bawaan tidak ditulis; per dinas ditulis "dinas"', () => {
    expect(opsiRaporKeParams(OPSI_RAPOR_AWAL).toString()).toBe('')
    expect(opsiRaporKeParams({ kelompok: 'satker', jenis: 'nyata', urut: 'laporan' }).toString()).toBe('per=dinas&data=nyata&urut=laporan')
  })

  it('membaca kembali, dan nilai tak dikenal kembali ke bawaan', () => {
    const opsi = { kelompok: 'satker', jenis: 'nyata', urut: 'nama' } as const
    expect(opsiRaporDariParams(opsiRaporKeParams(opsi))).toEqual(opsi)
    expect(opsiRaporDariParams(new URLSearchParams('per=x&data=y&urut=z'))).toEqual(OPSI_RAPOR_AWAL)
  })
})
