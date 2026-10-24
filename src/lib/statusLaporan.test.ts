import { describe, expect, it } from 'vitest'
import { jalurStatus, statusAkhir, statusBerikutnya, transisiValid } from './statusLaporan'

describe('statusLaporan', () => {
  it('mengikuti alur diterima → diverifikasi → ditindaklanjuti → selesai', () => {
    expect(transisiValid('diterima', 'diverifikasi')).toBe(true)
    expect(transisiValid('diverifikasi', 'ditindaklanjuti')).toBe(true)
    expect(transisiValid('ditindaklanjuti', 'selesai')).toBe(true)
  })

  it('melarang lompatan dan mundur', () => {
    expect(transisiValid('diterima', 'selesai')).toBe(false)
    expect(transisiValid('diverifikasi', 'diterima')).toBe(false)
  })

  it('penolakan hanya sebelum ditindaklanjuti', () => {
    expect(statusBerikutnya('diterima')).toContain('ditolak')
    expect(statusBerikutnya('diverifikasi')).toContain('ditolak')
    expect(statusBerikutnya('ditindaklanjuti')).not.toContain('ditolak')
  })

  it('selesai dan ditolak adalah status akhir', () => {
    expect(statusAkhir('selesai')).toBe(true)
    expect(statusAkhir('ditolak')).toBe(true)
    expect(statusAkhir('diterima')).toBe(false)
  })

  it('jalurStatus menyusun langkah dari awal', () => {
    expect(jalurStatus('diterima')).toEqual(['diterima'])
    expect(jalurStatus('ditindaklanjuti')).toEqual(['diterima', 'diverifikasi', 'ditindaklanjuti'])
    expect(jalurStatus('ditolak')).toEqual(['diterima', 'ditolak'])
  })
})
