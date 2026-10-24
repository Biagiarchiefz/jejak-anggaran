import { z } from 'zod'
import { Constants } from '../types/database'
import { FOTO_UKURAN_INPUT_MAKS } from './kompresFoto'

export const DESKRIPSI_MIN = 20
export const DESKRIPSI_MAKS = 1000

export const laporanFormSchema = z.object({
  kategori: z.enum(Constants.public.Enums.kategori_laporan, { error: 'Pilih kategori laporan.' }),
  deskripsi: z
    .string()
    .trim()
    .min(DESKRIPSI_MIN, `Ceritakan kondisinya minimal ${DESKRIPSI_MIN} karakter.`)
    .max(DESKRIPSI_MAKS, `Deskripsi maksimal ${DESKRIPSI_MAKS} karakter.`),
  foto: z
    .instanceof(File, { error: 'Foto kondisi proyek wajib dilampirkan.' })
    .refine((f) => f.type.startsWith('image/'), 'File harus berupa foto (JPG, PNG, atau WebP).')
    .refine((f) => f.size <= FOTO_UKURAN_INPUT_MAKS, 'Ukuran foto maksimal 25 MB.'),
})

export type LaporanForm = z.infer<typeof laporanFormSchema>

export const masukSchema = z.object({
  email: z.email({ error: 'Masukkan alamat email yang valid.' }),
})

export const ubahStatusSchema = z
  .object({
    status: z.enum(Constants.public.Enums.status_laporan, { error: 'Pilih status baru.' }),
    catatan: z.string().trim().max(500, 'Catatan maksimal 500 karakter.'),
  })
  .refine((v) => v.status !== 'ditolak' || v.catatan.length >= 10, {
    path: ['catatan'],
    error: 'Jelaskan alasan penolakan (minimal 10 karakter).',
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
