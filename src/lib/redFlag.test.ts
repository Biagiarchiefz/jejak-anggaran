import { describe, expect, it } from 'vitest'
import { hitungRedFlag, RED_FLAG } from './redFlag'

const SEKARANG = new Date('2026-10-23T12:00:00+07:00')
const hariLalu = (n: number) => new Date(SEKARANG.getTime() - n * 24 * 60 * 60 * 1000).toISOString()

const kerusakan = (status: 'diterima' | 'diverifikasi' | 'ditindaklanjuti' | 'selesai' | 'ditolak', hari = 10) => ({
  kategori: 'kerusakan' as const,
  status,
  created_at: hariLalu(hari),
})

describe('hitungRedFlag', () => {
  it('aktif saat proyek selesai punya 3 laporan kerusakan terverifikasi dalam 90 hari', () => {
    const hasil = hitungRedFlag('selesai', [kerusakan('diverifikasi'), kerusakan('ditindaklanjuti'), kerusakan('selesai')], SEKARANG)
    expect(hasil.aktif).toBe(true)
    expect(hasil.jumlahLaporan).toBe(3)
    expect(hasil.alasan).toContain('3 laporan kerusakan')
  })

  it('tidak aktif jika di bawah ambang', () => {
    expect(hitungRedFlag('selesai', [kerusakan('diverifikasi'), kerusakan('diverifikasi')], SEKARANG).aktif).toBe(false)
  })

  it('tidak menghitung laporan yang belum diverifikasi atau ditolak', () => {
    const hasil = hitungRedFlag(
      'selesai',
      [kerusakan('diverifikasi'), kerusakan('diverifikasi'), kerusakan('diterima'), kerusakan('ditolak')],
      SEKARANG,
    )
    expect(hasil).toEqual({ aktif: false, jumlahLaporan: 2, alasan: null })
  })

  it('tidak menghitung laporan di luar jendela 90 hari', () => {
    const laporan = [kerusakan('diverifikasi', 5), kerusakan('diverifikasi', 89), kerusakan('diverifikasi', 91)]
    expect(hitungRedFlag('selesai', laporan, SEKARANG).jumlahLaporan).toBe(2)
  })

  it('tidak menghitung kategori selain kerusakan', () => {
    const laporan = [
      kerusakan('diverifikasi'),
      kerusakan('diverifikasi'),
      { kategori: 'tidak_sesuai' as const, status: 'diverifikasi' as const, created_at: hariLalu(1) },
    ]
    expect(hitungRedFlag('selesai', laporan, SEKARANG).aktif).toBe(false)
  })

  it('hanya berlaku untuk proyek berstatus selesai', () => {
    const laporan = [kerusakan('diverifikasi'), kerusakan('diverifikasi'), kerusakan('diverifikasi')]
    expect(hitungRedFlag('berjalan', laporan, SEKARANG).aktif).toBe(false)
  })

  it('ambang sesuai PRD F7', () => {
    expect(RED_FLAG.ambangLaporan).toBe(3)
    expect(RED_FLAG.jendelaHari).toBe(90)
  })
})
