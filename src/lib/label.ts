import type { Enums } from '../types/database'

export const LABEL_STATUS_PROYEK: Record<Enums<'status_proyek'>, string> = {
  direncanakan: 'Direncanakan',
  berjalan: 'Sedang dikerjakan',
  selesai: 'Selesai',
}

export const LABEL_KATEGORI: Record<Enums<'kategori_laporan'>, string> = {
  kerusakan: 'Kerusakan',
  belum_dikerjakan: 'Belum dikerjakan',
  tidak_sesuai: 'Tidak sesuai rencana',
  lainnya: 'Lainnya',
}

export const PENJELASAN_KATEGORI: Record<Enums<'kategori_laporan'>, string> = {
  kerusakan: 'Hasil proyek rusak, retak, berlubang, atau tidak berfungsi.',
  belum_dikerjakan: 'Proyek tercatat berjalan atau selesai, tetapi belum terlihat dikerjakan.',
  tidak_sesuai: 'Hasil di lapangan berbeda dari nama atau rencana paket.',
  lainnya: 'Masalah lain terkait proyek ini.',
}

export const LABEL_STATUS_LAPORAN: Record<Enums<'status_laporan'>, string> = {
  diterima: 'Diterima',
  diverifikasi: 'Diverifikasi',
  ditindaklanjuti: 'Ditindaklanjuti',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
}
