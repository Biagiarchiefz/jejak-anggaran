import { describe, expect, it } from 'vitest'
import { LAPORAN_PER_HARI, hitungBatasLaporan, panjangKarakter, type LaporanSaya } from './batasLaporan'

const SEKARANG = new Date('2026-11-11T12:00:00Z')
const jamLalu = (jam: number) => new Date(SEKARANG.getTime() - jam * 3_600_000).toISOString()
const lap = (proyek_id: string, jam: number, status = 'diterima'): LaporanSaya => ({ proyek_id, status, created_at: jamLalu(jam) })

describe('hitungBatasLaporan', () => {
  it('boleh melapor bila kuota masih ada dan proyek ini belum dilaporkan', () => {
    expect(hitungBatasLaporan([lap('a', 1), lap('b', 2)], 'c', SEKARANG)).toEqual({ terpakai: 2, sisa: 3, alasan: null, bisaLagiPada: null })
  })

  it('laporan lebih dari 24 jam lalu dan laporan ditolak tidak dihitung', () => {
    const r = hitungBatasLaporan([lap('a', 25), lap('b', 3, 'ditolak'), lap('c', 1)], 'x', SEKARANG)
    expect(r.terpakai).toBe(1)
    expect(r.alasan).toBeNull()
  })

  it(`diblokir setelah ${LAPORAN_PER_HARI} laporan; kuota kembali saat laporan terlama di jendela berumur 24 jam`, () => {
    const r = hitungBatasLaporan([lap('a', 20), lap('b', 10), lap('c', 5), lap('d', 3), lap('e', 1)], 'x', SEKARANG)
    expect(r.alasan).toBe('harian')
    expect(r.sisa).toBe(0)
    // Laporan 20 jam lalu keluar dari jendela 4 jam lagi.
    expect(r.bisaLagiPada?.toISOString()).toBe(new Date(SEKARANG.getTime() + 4 * 3_600_000).toISOString())
  })

  it('satu proyek hanya sekali dalam 24 jam, walau kuota harian masih ada', () => {
    const r = hitungBatasLaporan([lap('a', 6), lap('b', 2)], 'a', SEKARANG)
    expect(r.alasan).toBe('proyek')
    expect(r.sisa).toBe(3)
    expect(r.bisaLagiPada?.toISOString()).toBe(new Date(SEKARANG.getTime() + 18 * 3_600_000).toISOString())
  })

  it('laporan ditolak pada proyek yang sama tidak menghalangi melapor ulang', () => {
    expect(hitungBatasLaporan([lap('a', 2, 'ditolak')], 'a', SEKARANG).alasan).toBeNull()
  })
})

describe('panjangKarakter', () => {
  it('menghitung emoji sebagai satu karakter', () => {
    expect(panjangKarakter('ab😀')).toBe(3)
  })
})
