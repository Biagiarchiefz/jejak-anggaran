import { describe, expect, it } from 'vitest'
import { errorPerField, laporanFormSchema, masukSchema, ubahStatusSchema } from './schemas'

const foto = new File(['x'], 'jalan.jpg', { type: 'image/jpeg' })

describe('laporanFormSchema', () => {
  it('menerima laporan lengkap', () => {
    const hasil = laporanFormSchema.safeParse({ kategori: 'kerusakan', deskripsi: '  Jalan berlubang di depan sekolah dasar  ', foto })
    expect(hasil.success).toBe(true)
    expect(hasil.data?.deskripsi).toBe('Jalan berlubang di depan sekolah dasar')
  })

  it('memberi pesan per field dalam bahasa Indonesia', () => {
    const hasil = laporanFormSchema.safeParse({ kategori: undefined, deskripsi: 'pendek', foto: undefined })
    expect(hasil.success).toBe(false)
    const error = errorPerField(hasil.error!)
    expect(error.kategori).toBe('Pilih kategori laporan.')
    expect(error.deskripsi).toMatch(/minimal 20 karakter/)
    expect(error.foto).toBe('Foto kondisi proyek wajib dilampirkan.')
  })

  it('menolak file yang bukan foto', () => {
    const pdf = new File(['x'], 'dokumen.pdf', { type: 'application/pdf' })
    const hasil = laporanFormSchema.safeParse({ kategori: 'lainnya', deskripsi: 'a'.repeat(30), foto: pdf })
    expect(errorPerField(hasil.error!).foto).toMatch(/harus berupa foto/)
  })
})

describe('masukSchema', () => {
  it('memvalidasi email', () => {
    expect(masukSchema.safeParse({ email: 'warga@contoh.id' }).success).toBe(true)
    expect(masukSchema.safeParse({ email: 'bukan-email' }).success).toBe(false)
  })
})

describe('ubahStatusSchema', () => {
  it('mewajibkan alasan saat menolak laporan', () => {
    const hasil = ubahStatusSchema.safeParse({ status: 'ditolak', catatan: '' })
    expect(errorPerField(hasil.error!).catatan).toMatch(/alasan penolakan/)
  })

  it('catatan opsional untuk status lain', () => {
    expect(ubahStatusSchema.safeParse({ status: 'diverifikasi', catatan: '' }).success).toBe(true)
  })
})
