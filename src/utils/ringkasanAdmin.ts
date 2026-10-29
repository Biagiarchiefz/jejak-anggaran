import type { Enums } from '../types/database'
import { RED_FLAG, laporanTerhitung } from './redFlag'

type StatusLaporan = Enums<'status_laporan'>

export type LaporanUntukRingkasan = {
  id: string
  kategori: Enums<'kategori_laporan'>
  status: StatusLaporan
  created_at: string
  proyek: { id: string; status_proyek: Enums<'status_proyek'> } | null
  riwayat: readonly { status_lama: StatusLaporan | null; created_at: string }[]
}

export type RingkasanAdmin = {
  menungguVerifikasi: number
  sedangDiproses: number
  selesai: number
  ditolak: number
  redFlagAktif: number
  /** Rata-rata jam dari laporan masuk sampai pertama kali ditanggapi admin; null jika belum ada yang ditanggapi. */
  rataRataResponJam: number | null
  jumlahDitanggapi: number
}

export type AlasanPrioritas = { potensiRedFlag: boolean; menungguHari: number }

const JAM_MS = 60 * 60 * 1000

/** Jam dari laporan masuk sampai status pertama kali diubah dari `diterima`. */
export function waktuResponJam(l: Pick<LaporanUntukRingkasan, 'created_at' | 'riwayat'>): number | null {
  const tanggapan = l.riwayat.find((r) => r.status_lama === 'diterima')
  if (!tanggapan) return null
  return Math.max(0, (new Date(tanggapan.created_at).getTime() - new Date(l.created_at).getTime()) / JAM_MS)
}

export function hitungRingkasanAdmin(laporan: readonly LaporanUntukRingkasan[], proyekRedFlag: readonly string[]): RingkasanAdmin {
  const jumlah = (...status: StatusLaporan[]) => laporan.filter((l) => status.includes(l.status)).length
  const respon = laporan.map(waktuResponJam).filter((j) => j !== null)
  return {
    menungguVerifikasi: jumlah('diterima'),
    sedangDiproses: jumlah('diverifikasi', 'ditindaklanjuti'),
    selesai: jumlah('selesai'),
    ditolak: jumlah('ditolak'),
    redFlagAktif: proyekRedFlag.length,
    rataRataResponJam: respon.length ? respon.reduce((a, b) => a + b, 0) / respon.length : null,
    jumlahDitanggapi: respon.length,
  }
}

/**
 * Laporan `diterima` yang, jika diverifikasi, membuat proyeknya mencapai ambang red flag.
 * Memakai aturan yang sama dengan v_red_flag_proyek (src/utils/redFlag.ts).
 */
export function potensiRedFlag(
  l: LaporanUntukRingkasan,
  semua: readonly LaporanUntukRingkasan[],
  proyekRedFlag: readonly string[],
  sekarang: Date,
): boolean {
  if (l.status !== 'diterima' || !l.proyek) return false
  if (l.proyek.status_proyek !== RED_FLAG.statusProyek || proyekRedFlag.includes(l.proyek.id)) return false
  if (!laporanTerhitung({ ...l, status: 'diverifikasi' }, sekarang)) return false
  const sudahTerhitung = semua.filter((x) => x.proyek?.id === l.proyek?.id && laporanTerhitung(x, sekarang)).length
  return sudahTerhitung + 1 >= RED_FLAG.ambangLaporan
}

/**
 * Antrean prioritas verifikasi: laporan `diterima`, yang berpotensi memicu red flag dulu,
 * lalu yang paling lama menunggu.
 */
export function antreanPrioritas<T extends LaporanUntukRingkasan>(
  laporan: readonly T[],
  proyekRedFlag: readonly string[],
  sekarang: Date = new Date(),
): { laporan: T; alasan: AlasanPrioritas }[] {
  return laporan
    .filter((l) => l.status === 'diterima')
    .map((l) => ({
      laporan: l,
      alasan: {
        potensiRedFlag: potensiRedFlag(l, laporan, proyekRedFlag, sekarang),
        menungguHari: Math.floor((sekarang.getTime() - new Date(l.created_at).getTime()) / (24 * JAM_MS)),
      },
    }))
    .sort(
      (a, b) =>
        Number(b.alasan.potensiRedFlag) - Number(a.alasan.potensiRedFlag) ||
        new Date(a.laporan.created_at).getTime() - new Date(b.laporan.created_at).getTime(),
    )
}
