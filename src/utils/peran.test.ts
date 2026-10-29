import { describe, expect, it } from 'vitest'
import { bisaMembukaPanelAdmin, bisaUbahLaporan, halamanSetelahMasuk } from './peran'

describe('bisaMembukaPanelAdmin', () => {
  it('hanya admin dan admin demo', () => {
    expect(bisaMembukaPanelAdmin('admin')).toBe(true)
    expect(bisaMembukaPanelAdmin('admin_demo')).toBe(true)
    expect(bisaMembukaPanelAdmin('warga')).toBe(false)
    expect(bisaMembukaPanelAdmin(null)).toBe(false)
  })
})

describe('bisaUbahLaporan', () => {
  it('admin bisa mengubah semua laporan', () => {
    expect(bisaUbahLaporan('admin', { is_demo: false })).toBe(true)
    expect(bisaUbahLaporan('admin', { is_demo: true })).toBe(true)
  })

  it('admin demo hanya laporan demo', () => {
    expect(bisaUbahLaporan('admin_demo', { is_demo: true })).toBe(true)
    expect(bisaUbahLaporan('admin_demo', { is_demo: false })).toBe(false)
  })

  it('warga tidak bisa', () => {
    expect(bisaUbahLaporan('warga', { is_demo: true })).toBe(false)
  })
})

describe('halamanSetelahMasuk', () => {
  it('memakai path kembali yang aman', () => {
    expect(halamanSetelahMasuk('admin', '/proyek/abc/lapor')).toBe('/proyek/abc/lapor')
  })

  it('menolak redirect ke situs lain', () => {
    expect(halamanSetelahMasuk('warga', '//evil.example')).toBe('/peta')
    expect(halamanSetelahMasuk('warga', 'https://evil.example')).toBe('/peta')
  })

  it('tanpa path kembali: admin ke panel, warga ke peta', () => {
    expect(halamanSetelahMasuk('admin', null)).toBe('/admin')
    expect(halamanSetelahMasuk('admin_demo', null)).toBe('/admin')
    expect(halamanSetelahMasuk('warga', null)).toBe('/peta')
  })
})
