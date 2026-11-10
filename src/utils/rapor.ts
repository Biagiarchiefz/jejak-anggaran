import type { Enums } from '../types/database'
import { keCsv } from './csv'
import { waktuResponJam } from './ringkasanAdmin'

type StatusLaporan = Enums<'status_laporan'>

export type KelompokRapor = 'kecamatan' | 'satker'
export type JenisDataRapor = 'semua' | 'nyata'
export type UrutanRapor = 'pagu' | 'laporan' | 'nama'

export type ProyekRapor = {
  id: string
  nama_paket: string
  kecamatan: string
  satker: string
  pagu: number
  nilai_kontrak: number | null
  is_demo: boolean
  redFlag: unknown
}

export type LaporanRapor = {
  id: string
  proyek_id: string
  status: StatusLaporan
  created_at: string
  is_demo: boolean
  riwayat: readonly { status_lama: StatusLaporan | null; created_at: string }[]
}

export type BarisRapor = {
  /** Nama kecamatan atau satuan kerja. */
  nama: string
  jumlahProyek: number
  jumlahProyekDemo: number
  totalPagu: number
  /** Jumlah nilai kontrak yang sudah diketahui; `null` bila belum ada satu pun. */
  totalKontrak: number | null
  proyekPerluPerhatian: number
  jumlahLaporan: number
  menunggu: number
  diproses: number
  selesai: number
  ditolak: number
  /** Rata-rata jam dari laporan masuk sampai pertama kali ditanggapi; `null` bila belum ada yang ditanggapi. */
  rataRataResponJam: number | null
}

export type RingkasanRapor = Omit<BarisRapor, 'nama'> & { jumlahKelompok: number }

const kunciKelompok = (p: ProyekRapor, k: KelompokRapor) => (k === 'kecamatan' ? p.kecamatan : p.satker)

/** Proyek & laporan sesuai jenis data. "Data nyata" juga membuang laporan pada proyek demo. */
function saringJenis<P extends ProyekRapor>(proyek: readonly P[], laporan: readonly LaporanRapor[], jenis: JenisDataRapor) {
  const p = jenis === 'nyata' ? proyek.filter((x) => !x.is_demo) : [...proyek]
  const id = new Set(p.map((x) => x.id))
  return { proyek: p, laporan: laporan.filter((l) => id.has(l.proyek_id) && (jenis === 'semua' || !l.is_demo)) }
}

function hitungBaris(nama: string, proyek: readonly ProyekRapor[], laporan: readonly LaporanRapor[]): BarisRapor {
  const kontrak = proyek.filter((p) => p.nilai_kontrak !== null)
  const respon = laporan.map(waktuResponJam).filter((j) => j !== null)
  const jumlah = (...s: StatusLaporan[]) => laporan.filter((l) => s.includes(l.status)).length
  return {
    nama,
    jumlahProyek: proyek.length,
    jumlahProyekDemo: proyek.filter((p) => p.is_demo).length,
    totalPagu: proyek.reduce((s, p) => s + p.pagu, 0),
    totalKontrak: kontrak.length ? kontrak.reduce((s, p) => s + (p.nilai_kontrak ?? 0), 0) : null,
    proyekPerluPerhatian: proyek.filter((p) => !!p.redFlag).length,
    jumlahLaporan: laporan.length,
    menunggu: jumlah('diterima'),
    diproses: jumlah('diverifikasi', 'ditindaklanjuti'),
    selesai: jumlah('selesai'),
    ditolak: jumlah('ditolak'),
    rataRataResponJam: respon.length ? respon.reduce((a, b) => a + b, 0) / respon.length : null,
  }
}

/**
 * Rapor F10: proyek dan laporan dikelompokkan per kecamatan atau per satuan kerja (dinas/kecamatan pelaksana).
 * Laporan dihitung ke kelompok proyeknya. Urutan: total pagu, jumlah laporan (keduanya menurun), atau abjad.
 */
export function hitungRapor(
  proyek: readonly ProyekRapor[],
  laporan: readonly LaporanRapor[],
  opsi: { kelompok: KelompokRapor; jenis: JenisDataRapor; urut: UrutanRapor },
): BarisRapor[] {
  const data = saringJenis(proyek, laporan, opsi.jenis)
  const proyekPerKelompok = new Map<string, ProyekRapor[]>()
  for (const p of data.proyek) proyekPerKelompok.set(kunciKelompok(p, opsi.kelompok), [...(proyekPerKelompok.get(kunciKelompok(p, opsi.kelompok)) ?? []), p])
  const kelompokProyek = new Map(data.proyek.map((p) => [p.id, kunciKelompok(p, opsi.kelompok)]))
  const laporanPerKelompok = new Map<string, LaporanRapor[]>()
  for (const l of data.laporan) {
    const k = kelompokProyek.get(l.proyek_id)!
    laporanPerKelompok.set(k, [...(laporanPerKelompok.get(k) ?? []), l])
  }

  const baris = [...proyekPerKelompok].map(([nama, p]) => hitungBaris(nama, p, laporanPerKelompok.get(nama) ?? []))
  const abjad = (a: BarisRapor, b: BarisRapor) => a.nama.localeCompare(b.nama, 'id')
  const pembanding: Record<UrutanRapor, (a: BarisRapor, b: BarisRapor) => number> = {
    pagu: (a, b) => b.totalPagu - a.totalPagu || abjad(a, b),
    laporan: (a, b) => b.jumlahLaporan - a.jumlahLaporan || b.totalPagu - a.totalPagu || abjad(a, b),
    nama: abjad,
  }
  return baris.sort(pembanding[opsi.urut])
}

/** Total seluruh baris rapor (untuk panel ringkasan di atas tabel). */
export function ringkasRapor(proyek: readonly ProyekRapor[], laporan: readonly LaporanRapor[], opsi: { kelompok: KelompokRapor; jenis: JenisDataRapor }): RingkasanRapor {
  const data = saringJenis(proyek, laporan, opsi.jenis)
  const total: Partial<BarisRapor> = hitungBaris('', data.proyek, data.laporan)
  delete total.nama
  return { ...(total as Omit<BarisRapor, 'nama'>), jumlahKelompok: new Set(data.proyek.map((p) => kunciKelompok(p, opsi.kelompok))).size }
}

/** CSV rapor yang sedang tampil. Waktu respons dalam jam (1 desimal) agar mudah dihitung ulang. */
export function raporKeCsv(baris: readonly BarisRapor[], kelompok: KelompokRapor): string {
  return keCsv(
    [
      kelompok === 'kecamatan' ? 'kecamatan' : 'satuan_kerja',
      'jumlah_proyek',
      'proyek_demo',
      'total_pagu_rp',
      'total_kontrak_rp',
      'proyek_perlu_perhatian',
      'laporan_total',
      'laporan_menunggu',
      'laporan_diproses',
      'laporan_selesai',
      'laporan_ditolak',
      'rata_rata_respons_jam',
    ],
    baris.map((b) => [
      b.nama,
      b.jumlahProyek,
      b.jumlahProyekDemo,
      b.totalPagu,
      b.totalKontrak,
      b.proyekPerluPerhatian,
      b.jumlahLaporan,
      b.menunggu,
      b.diproses,
      b.selesai,
      b.ditolak,
      b.rataRataResponJam === null ? null : Math.round(b.rataRataResponJam * 10) / 10,
    ]),
  )
}

export type ProyekUntukCsv = ProyekRapor & {
  kode_rup: string | null
  kelurahan: string | null
  tahun_anggaran: number
  status_proyek: Enums<'status_proyek'>
  pelaksana: string | null
  sumber_rup_url: string | null
  diakses_pada: string | null
}

/** CSV daftar proyek per baris, dengan jumlah laporan dan penanda data demo. */
export function proyekKeCsv(proyek: readonly ProyekUntukCsv[], laporan: readonly LaporanRapor[]): string {
  const jumlahLaporan = new Map<string, number>()
  for (const l of laporan) jumlahLaporan.set(l.proyek_id, (jumlahLaporan.get(l.proyek_id) ?? 0) + 1)
  return keCsv(
    [
      'id',
      'kode_rup',
      'nama_paket',
      'satuan_kerja',
      'kecamatan',
      'kelurahan',
      'tahun_anggaran',
      'status_proyek',
      'pagu_rp',
      'nilai_kontrak_rp',
      'pelaksana',
      'perlu_perhatian',
      'jumlah_laporan',
      'data_demo',
      'sumber_rup_url',
      'diakses_pada',
    ],
    proyek.map((p) => [
      p.id,
      p.kode_rup,
      p.nama_paket,
      p.satker,
      p.kecamatan,
      p.kelurahan,
      p.tahun_anggaran,
      p.status_proyek,
      p.pagu,
      p.nilai_kontrak,
      p.pelaksana,
      !!p.redFlag,
      jumlahLaporan.get(p.id) ?? 0,
      p.is_demo,
      p.sumber_rup_url,
      p.diakses_pada,
    ]),
  )
}

export type OpsiRapor = { kelompok: KelompokRapor; jenis: JenisDataRapor; urut: UrutanRapor }
export const OPSI_RAPOR_AWAL: OpsiRapor = { kelompok: 'kecamatan', jenis: 'semua', urut: 'pagu' }

// Di URL kelompok `satker` ditulis `dinas` agar mudah dibaca (`/rapor?per=dinas`).
const PER: Record<KelompokRapor, string> = { kecamatan: 'kecamatan', satker: 'dinas' }

/** Baca pilihan rapor dari URL (`?per=dinas&data=nyata&urut=laporan`). Nilai tak dikenal kembali ke bawaan. */
export function opsiRaporDariParams(params: URLSearchParams): OpsiRapor {
  const per = params.get('per')
  const data = params.get('data')
  const urut = params.get('urut')
  return {
    kelompok: per === 'dinas' ? 'satker' : OPSI_RAPOR_AWAL.kelompok,
    jenis: data === 'nyata' ? 'nyata' : OPSI_RAPOR_AWAL.jenis,
    urut: urut === 'laporan' || urut === 'nama' ? urut : OPSI_RAPOR_AWAL.urut,
  }
}

/** Tulis pilihan rapor ke URL; nilai bawaan tidak ditulis. */
export function opsiRaporKeParams(opsi: OpsiRapor): URLSearchParams {
  const p = new URLSearchParams()
  if (opsi.kelompok !== OPSI_RAPOR_AWAL.kelompok) p.set('per', PER[opsi.kelompok])
  if (opsi.jenis !== OPSI_RAPOR_AWAL.jenis) p.set('data', opsi.jenis)
  if (opsi.urut !== OPSI_RAPOR_AWAL.urut) p.set('urut', opsi.urut)
  return p
}
