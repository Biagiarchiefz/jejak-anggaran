import { describe, expect, it } from 'vitest'
import { AppError } from './errors'
import { hitungDimensi, kompresFoto } from './kompresFoto'

describe('hitungDimensi', () => {
  it('tidak mengubah foto yang sudah kecil', () => {
    expect(hitungDimensi(800, 600)).toEqual({ lebar: 800, tinggi: 600 })
  })

  it('menyusutkan sisi terpanjang menjadi 1600px secara proporsional', () => {
    expect(hitungDimensi(4000, 3000)).toEqual({ lebar: 1600, tinggi: 1200 })
    expect(hitungDimensi(3000, 4000)).toEqual({ lebar: 1200, tinggi: 1600 })
  })
})

describe('kompresFoto', () => {
  it('menolak file yang bukan gambar', async () => {
    const file = new File(['halo'], 'catatan.txt', { type: 'text/plain' })
    await expect(kompresFoto(file)).rejects.toBeInstanceOf(AppError)
    await expect(kompresFoto(file)).rejects.toMatchObject({ code: 'VALIDASI' })
  })
})
