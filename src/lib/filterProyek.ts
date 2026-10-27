import type { Enums } from '../types/database'

export type FilterProyek = {
  status: Enums<'status_proyek'> | 'semua'
  kecamatan: string | 'semua'
}

export const FILTER_AWAL: FilterProyek = { status: 'semua', kecamatan: 'semua' }

type ProyekTersaring = { status_proyek: Enums<'status_proyek'>; kecamatan: string }

export function saringProyek<T extends ProyekTersaring>(proyek: readonly T[], filter: FilterProyek): T[] {
  return proyek.filter(
    (p) =>
      (filter.status === 'semua' || p.status_proyek === filter.status) &&
      (filter.kecamatan === 'semua' || p.kecamatan === filter.kecamatan),
  )
}

type ProyekSorotan = { nama_paket: string; is_demo: boolean; redFlag: unknown }

/**
 * Proyek untuk disorot di Beranda: yang perlu perhatian lebih dulu, lalu proyek nyata
 * sebelum proyek demo, lalu abjad nama. Dibatasi `jumlah` kartu.
 */
export function pilihProyekSorotan<T extends ProyekSorotan>(proyek: readonly T[], jumlah: number): T[] {
  return [...proyek]
    .sort(
      (a, b) =>
        Number(!!b.redFlag) - Number(!!a.redFlag) ||
        Number(a.is_demo) - Number(b.is_demo) ||
        a.nama_paket.localeCompare(b.nama_paket, 'id'),
    )
    .slice(0, jumlah)
}

/** Kecamatan yang punya proyek, urut abjad. */
export function daftarKecamatan(proyek: readonly { kecamatan: string }[]): string[] {
  return [...new Set(proyek.map((p) => p.kecamatan))].sort((a, b) => a.localeCompare(b, 'id'))
}

type ProyekDicari = { nama_paket: string; kecamatan: string; kelurahan: string | null; satker: string; pelaksana: string | null }

const normalkan = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

/**
 * Pencarian cepat di navbar: setiap kata harus muncul di nama paket, wilayah, satker, atau pelaksana.
 * Urutan asli dipertahankan. Kata kunci kosong → daftar kosong.
 */
export function cariProyek<T extends ProyekDicari>(proyek: readonly T[], kataKunci: string): T[] {
  const kata = normalkan(kataKunci).split(/\s+/).filter(Boolean)
  if (kata.length === 0) return []
  return proyek.filter((p) => {
    const teks = normalkan([p.nama_paket, p.kecamatan, p.kelurahan, p.satker, p.pelaksana].filter(Boolean).join(' '))
    return kata.every((k) => teks.includes(k))
  })
}
