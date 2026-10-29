import { describe, expect, it } from 'vitest'
import { antreanPrioritas, hitungRingkasanAdmin, potensiRedFlag, waktuResponJam, type LaporanUntukRingkasan } from './ringkasanAdmin'

const SEKARANG = new Date('2026-10-29T12:00:00Z')
const hariLalu = (n: number) => new Date(SEKARANG.getTime() - n * 24 * 60 * 60 * 1000).toISOString()

const PROYEK_SELESAI = { id: 'jalan', status_proyek: 'selesai' as const }

function laporan(sebagian: Partial<LaporanUntukRingkasan> & { id: string }): LaporanUntukRingkasan {
  return { kategori: 'kerusakan', status: 'diterima', created_at: hariLalu(1), proyek: PROYEK_SELESAI, riwayat: [], ...sebagian }
}

describe('waktuResponJam', () => {
  it('menghitung sampai status pertama kali berubah dari diterima', () => {
    const l = laporan({
      id: 'a',
      created_at: '2026-10-01T00:00:00Z',
      riwayat: [
        { status_lama: null, created_at: '2026-10-01T00:00:00Z' },
        { status_lama: 'diterima', created_at: '2026-10-01T06:00:00Z' },
        { status_lama: 'diverifikasi', created_at: '2026-10-03T00:00:00Z' },
      ],
    })
    expect(waktuResponJam(l)).toBe(6)
  })

  it('null jika belum ditanggapi', () => {
    expect(waktuResponJam(laporan({ id: 'a', riwayat: [{ status_lama: null, created_at: hariLalu(1) }] }))).toBeNull()
  })
})

describe('hitungRingkasanAdmin', () => {
  it('menjumlahkan status, red flag, dan rata-rata waktu respons', () => {
    const ditanggapi = (id: string, jam: number, status: LaporanUntukRingkasan['status']) =>
      laporan({
        id,
        status,
        created_at: '2026-10-01T00:00:00Z',
        riwayat: [{ status_lama: 'diterima', created_at: new Date(Date.parse('2026-10-01T00:00:00Z') + jam * 3_600_000).toISOString() }],
      })
    const hasil = hitungRingkasanAdmin(
      [laporan({ id: 'a' }), ditanggapi('b', 2, 'diverifikasi'), ditanggapi('c', 10, 'selesai'), ditanggapi('d', 6, 'ditolak')],
      ['jalan'],
    )
    expect(hasil).toEqual({
      menungguVerifikasi: 1,
      sedangDiproses: 1,
      selesai: 1,
      ditolak: 1,
      redFlagAktif: 1,
      rataRataResponJam: 6,
      jumlahDitanggapi: 3,
    })
  })

  it('rata-rata null jika belum ada laporan ditanggapi', () => {
    expect(hitungRingkasanAdmin([laporan({ id: 'a' })], []).rataRataResponJam).toBeNull()
  })
})

describe('potensiRedFlag', () => {
  const terverifikasi = (id: string) => laporan({ id, status: 'diverifikasi' })

  it('true jika verifikasi laporan ini mencapai ambang', () => {
    const target = laporan({ id: 'baru' })
    const semua = [terverifikasi('a'), terverifikasi('b'), target]
    expect(potensiRedFlag(target, semua, [], SEKARANG)).toBe(true)
  })

  it('false jika belum mencapai ambang', () => {
    const target = laporan({ id: 'baru' })
    expect(potensiRedFlag(target, [terverifikasi('a'), target], [], SEKARANG)).toBe(false)
  })

  it('false jika proyek sudah red flag, belum selesai, kategori lain, atau di luar jendela 90 hari', () => {
    const semua = (t: LaporanUntukRingkasan) => [terverifikasi('a'), terverifikasi('b'), t]
    const t1 = laporan({ id: 't1' })
    expect(potensiRedFlag(t1, semua(t1), ['jalan'], SEKARANG)).toBe(false)
    const t2 = laporan({ id: 't2', proyek: { id: 'jalan', status_proyek: 'berjalan' } })
    expect(potensiRedFlag(t2, semua(t2), [], SEKARANG)).toBe(false)
    const t3 = laporan({ id: 't3', kategori: 'lainnya' })
    expect(potensiRedFlag(t3, semua(t3), [], SEKARANG)).toBe(false)
    const t4 = laporan({ id: 't4', created_at: hariLalu(120) })
    expect(potensiRedFlag(t4, semua(t4), [], SEKARANG)).toBe(false)
  })
})

describe('antreanPrioritas', () => {
  it('hanya laporan diterima; potensi red flag dulu, lalu yang paling lama menunggu', () => {
    const lama = laporan({ id: 'lama', kategori: 'lainnya', created_at: hariLalu(10) })
    const baru = laporan({ id: 'baru', kategori: 'lainnya', created_at: hariLalu(2) })
    const kritis = laporan({ id: 'kritis', created_at: hariLalu(1) })
    const semua = [
      lama,
      baru,
      kritis,
      laporan({ id: 'v1', status: 'diverifikasi' }),
      laporan({ id: 'v2', status: 'diverifikasi' }),
    ]
    const hasil = antreanPrioritas(semua, [], SEKARANG)
    expect(hasil.map((h) => h.laporan.id)).toEqual(['kritis', 'lama', 'baru'])
    expect(hasil[0].alasan.potensiRedFlag).toBe(true)
    expect(hasil[1].alasan.menungguHari).toBe(10)
  })
})
