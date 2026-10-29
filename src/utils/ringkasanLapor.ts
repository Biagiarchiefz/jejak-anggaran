import { formatRupiah, formatTanggal } from './format'
import { LABEL_KATEGORI } from './label'
import type { Enums } from '../types/database'

export const URL_LAPOR = 'https://www.lapor.go.id/'

type DataRingkasan = {
  proyek: {
    nama_paket: string
    kode_rup: string | null
    satker: string
    kecamatan: string
    kelurahan: string | null
    pagu: number
    tahun_anggaran: number
  }
  laporan: {
    kategori: Enums<'kategori_laporan'>
    deskripsi: string
    created_at: string
    jumlah_konfirmasi: number
  }
  urlHalaman: string
}

/** Ringkasan laporan yang siap disalin ke formulir LAPOR! (F9). */
export function buatRingkasanLapor({ proyek, laporan, urlHalaman }: DataRingkasan): string {
  const lokasi = [proyek.kelurahan, `Kec. ${proyek.kecamatan}`, 'Kota Bandung'].filter(Boolean).join(', ')
  const baris = [
    `Judul: ${LABEL_KATEGORI[laporan.kategori]} pada proyek "${proyek.nama_paket}"`,
    '',
    `Lokasi: ${lokasi}`,
    `Satuan kerja: ${proyek.satker}`,
    `Tahun anggaran: ${proyek.tahun_anggaran}`,
    `Pagu: ${formatRupiah(proyek.pagu)}`,
    proyek.kode_rup ? `Kode RUP (SiRUP): ${proyek.kode_rup}` : null,
    '',
    `Kondisi yang dilaporkan (${formatTanggal(laporan.created_at)}):`,
    laporan.deskripsi,
    '',
    `Laporan ini sudah dikonfirmasi oleh ${laporan.jumlah_konfirmasi} warga lain.`,
    `Foto dan riwayat lengkap: ${urlHalaman}`,
  ]
  return baris.filter((b) => b !== null).join('\n')
}
