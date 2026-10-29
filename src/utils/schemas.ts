import { z } from 'zod'
import { Constants } from '../types/database'
import { FOTO_UKURAN_INPUT_MAKS } from './kompresFoto'
import { ALASAN_TOLAK_MIN, CATATAN_MAKS, DESKRIPSI_MAKS, DESKRIPSI_MIN, panjangKarakter } from './batasLaporan'

export const laporanFormSchema = z.object({
  kategori: z.enum(Constants.public.Enums.kategori_laporan, { error: 'Pilih kategori laporan.' }),
  deskripsi: z
    .string()
    .trim()
    .refine((s) => panjangKarakter(s) >= DESKRIPSI_MIN, `Ceritakan kondisinya minimal ${DESKRIPSI_MIN} karakter.`)
    .refine((s) => panjangKarakter(s) <= DESKRIPSI_MAKS, `Deskripsi maksimal ${DESKRIPSI_MAKS} karakter.`),
  foto: z
    .instanceof(File, { error: 'Foto kondisi proyek wajib dilampirkan.' })
    .refine((f) => f.type.startsWith('image/'), 'File harus berupa foto (JPG, PNG, atau WebP).')
    .refine((f) => f.size <= FOTO_UKURAN_INPUT_MAKS, 'Ukuran foto maksimal 25 MB.'),
})

export type LaporanForm = z.infer<typeof laporanFormSchema>

const email = z.email({ error: 'Masukkan alamat email yang valid.' })

export const KATA_SANDI_MIN = 8

export const masukSchema = z.object({
  email,
  kataSandi: z.string().min(1, 'Masukkan kata sandi.'),
})

export const daftarSchema = z.object({
  email,
  // 72 byte: batas bcrypt yang dipakai Supabase Auth.
  kataSandi: z
    .string()
    .min(KATA_SANDI_MIN, `Kata sandi minimal ${KATA_SANDI_MIN} karakter.`)
    .max(72, 'Kata sandi maksimal 72 karakter.'),
})

export const ubahStatusSchema = z
  .object({
    status: z.enum(Constants.public.Enums.status_laporan, { error: 'Pilih status baru.' }),
    catatan: z
      .string()
      .trim()
      .refine((s) => panjangKarakter(s) <= CATATAN_MAKS, `Catatan maksimal ${CATATAN_MAKS} karakter.`),
  })
  .refine((v) => v.status !== 'ditolak' || panjangKarakter(v.catatan) >= ALASAN_TOLAK_MIN, {
    path: ['catatan'],
    error: `Jelaskan alasan penolakan (minimal ${ALASAN_TOLAK_MIN} karakter).`,
  })

/** Pesan error pertama untuk setiap field, untuk ditampilkan di bawah field terkait. */
export function errorPerField(error: z.ZodError): Record<string, string> {
  const hasil: Record<string, string> = {}
  for (const issue of error.issues) {
    const kunci = String(issue.path[0] ?? '_form')
    hasil[kunci] ??= issue.message
  }
  return hasil
}
