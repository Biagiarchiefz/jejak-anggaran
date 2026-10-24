import { AppError } from './errors'

export const FOTO_DIMENSI_MAKS = 1600
export const FOTO_UKURAN_MAKS = 5 * 1024 * 1024
/** Batas file asli sebelum dikompres (foto kamera HP bisa > 10 MB). */
export const FOTO_UKURAN_INPUT_MAKS = 25 * 1024 * 1024

const KUALITAS = [0.85, 0.75, 0.65, 0.5]

export type FotoTerkompres = {
  blob: Blob
  tipe: 'image/webp' | 'image/jpeg'
  ekstensi: 'webp' | 'jpg'
}

/** Skala proporsional agar sisi terpanjang tidak melebihi `maks`. */
export function hitungDimensi(lebar: number, tinggi: number, maks = FOTO_DIMENSI_MAKS): { lebar: number; tinggi: number } {
  const sisiPanjang = Math.max(lebar, tinggi)
  if (sisiPanjang <= maks) return { lebar, tinggi }
  const skala = maks / sisiPanjang
  return { lebar: Math.round(lebar * skala), tinggi: Math.round(tinggi * skala) }
}

function keBlob(canvas: HTMLCanvasElement, tipe: string, kualitas: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, tipe, kualitas))
}

/**
 * Kompres foto di klien: canvas → WebP (fallback JPEG untuk browser yang tidak
 * bisa encode WebP), sisi terpanjang maks 1600px, ukuran maks 5 MB.
 * Menggambar ulang lewat canvas sekaligus membuang metadata EXIF/GPS.
 */
export async function kompresFoto(file: File): Promise<FotoTerkompres> {
  if (!file.type.startsWith('image/')) {
    throw new AppError('VALIDASI', 'File harus berupa foto (JPG, PNG, atau WebP).')
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch (e) {
    throw new AppError('VALIDASI', 'Foto tidak bisa dibaca. Coba gunakan foto berformat JPG atau PNG.', { cause: e })
  }

  const { lebar, tinggi } = hitungDimensi(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = lebar
  canvas.height = tinggi
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new AppError('TIDAK_DIKETAHUI', 'Browser Anda tidak mendukung pemrosesan foto.')
  }
  ctx.drawImage(bitmap, 0, 0, lebar, tinggi)
  bitmap.close()

  for (const kualitas of KUALITAS) {
    let blob = await keBlob(canvas, 'image/webp', kualitas)
    let tipe: FotoTerkompres['tipe'] = 'image/webp'
    // Browser yang tidak bisa encode WebP diam-diam mengembalikan PNG.
    if (!blob || blob.type !== 'image/webp') {
      blob = await keBlob(canvas, 'image/jpeg', kualitas)
      tipe = 'image/jpeg'
    }
    if (blob && blob.size <= FOTO_UKURAN_MAKS) {
      return { blob, tipe, ekstensi: tipe === 'image/webp' ? 'webp' : 'jpg' }
    }
  }
  throw new AppError('VALIDASI', 'Foto terlalu besar meski sudah dikompres. Coba foto lain.')
}
