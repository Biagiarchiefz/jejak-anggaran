import { describe, expect, it } from 'vitest'
import { FOTO_ILUSTRASI_BAWAAN, fotoIlustrasiProyek, urlFotoUnsplash } from './fotoIlustrasi'

describe('fotoIlustrasiProyek', () => {
  it('memilih foto sesuai jenis pekerjaan', () => {
    expect(fotoIlustrasiProyek('Rehabilitasi Jalan Lingkungan').alt).toMatch(/memperbaiki jalan/)
    expect(fotoIlustrasiProyek('Pembangunan Saluran Drainase').alt).toMatch(/saluran/)
    expect(fotoIlustrasiProyek('Penataan Taman Kelurahan').alt).toMatch(/Alun-Alun/)
  })

  it('tidak peka huruf besar/kecil', () => {
    expect(fotoIlustrasiProyek('PENATAAN TAMAN')).toBe(fotoIlustrasiProyek('penataan taman'))
  })

  it('mendahulukan saluran daripada jalan pada nama yang memuat keduanya', () => {
    expect(fotoIlustrasiProyek('Saluran Drainase Jalan Merdeka').alt).toMatch(/saluran/)
  })

  it('memakai foto bawaan jika tidak ada yang cocok', () => {
    expect(fotoIlustrasiProyek('Pengadaan Komputer Kantor')).toBe(FOTO_ILUSTRASI_BAWAAN)
  })
})

describe('urlFotoUnsplash', () => {
  it('menyusun URL gambar dengan lebar tertentu', () => {
    expect(urlFotoUnsplash('123-abc', 600)).toBe('https://images.unsplash.com/photo-123-abc?auto=format&fit=crop&q=70&w=600')
  })
})
