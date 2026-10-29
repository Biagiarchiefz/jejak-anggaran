import { describe, expect, it } from 'vitest'
import { panjangKarakter } from './batasLaporan'
import { daftarSchema, errorPerField, laporanFormSchema, masukSchema, ubahStatusSchema } from './schemas'

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

  it('menghitung panjang per karakter seperti char_length di Postgres', () => {
    // 10 emoji = 20 unit UTF-16, tetapi hanya 10 karakter: database akan menolaknya.
    const emoji = '🚧'.repeat(10)
    expect(emoji.length).toBe(20)
    expect(panjangKarakter(emoji)).toBe(10)
    const hasil = laporanFormSchema.safeParse({ kategori: 'kerusakan', deskripsi: emoji, foto })
    expect(errorPerField(hasil.error!).deskripsi).toMatch(/minimal 20 karakter/)
  })

  it('menerima tepat 1000 karakter walaupun berisi emoji', () => {
    const hasil = laporanFormSchema.safeParse({ kategori: 'kerusakan', deskripsi: '🚧'.repeat(1000), foto })
    expect(hasil.success).toBe(true)
  })
})

describe('masukSchema', () => {
  it('memvalidasi email dan mewajibkan kata sandi', () => {
    expect(masukSchema.safeParse({ email: 'warga@contoh.id', kataSandi: 'apa saja' }).success).toBe(true)
    expect(masukSchema.safeParse({ email: 'bukan-email', kataSandi: 'x' }).success).toBe(false)
    expect(errorPerField(masukSchema.safeParse({ email: 'warga@contoh.id', kataSandi: '' }).error!).kataSandi).toBe('Masukkan kata sandi.')
  })
})

describe('daftarSchema', () => {
  it('kata sandi minimal 8 karakter', () => {
    expect(errorPerField(daftarSchema.safeParse({ email: 'warga@contoh.id', kataSandi: 'pendek' }).error!).kataSandi).toMatch(/minimal 8/)
    expect(daftarSchema.safeParse({ email: 'warga@contoh.id', kataSandi: 'cukupPanjang1' }).success).toBe(true)
  })
})

describe('ubahStatusSchema', () => {
  it('mewajibkan alasan saat menolak laporan', () => {
    const hasil = ubahStatusSchema.safeParse({ status: 'ditolak', catatan: '' })
    expect(errorPerField(hasil.error!).catatan).toMatch(/alasan penolakan/)
  })

  it('alasan penolakan dihitung setelah spasi dipangkas', () => {
    expect(ubahStatusSchema.safeParse({ status: 'ditolak', catatan: '   pendek   ' }).success).toBe(false)
    expect(ubahStatusSchema.safeParse({ status: 'ditolak', catatan: 'Foto bukan lokasi proyek' }).success).toBe(true)
  })

  it('catatan opsional untuk status lain', () => {
    expect(ubahStatusSchema.safeParse({ status: 'diverifikasi', catatan: '' }).success).toBe(true)
  })
})
