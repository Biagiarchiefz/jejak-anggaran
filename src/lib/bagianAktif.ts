export type PosisiBagian = { id: string; /** Jarak tepi atas bagian ke tepi atas layar (px). */ atas: number }

/**
 * Bagian yang sedang dibaca untuk daftar isi (scroll-spy): bagian terakhir yang tepi atasnya sudah melewati
 * garis `batas` (px dari atas layar, mis. tinggi header). Sebelum bagian pertama tercapai, bagian pertama dianggap aktif.
 * Di dasar halaman, bagian terakhir selalu aktif walau tepinya belum sampai garis (bagian pendek di akhir halaman).
 */
export function bagianAktif(posisi: readonly PosisiBagian[], batas: number, diDasarHalaman: boolean): string | null {
  if (posisi.length === 0) return null
  if (diDasarHalaman) return posisi[posisi.length - 1].id
  let aktif = posisi[0].id
  for (const p of posisi) {
    if (p.atas <= batas) aktif = p.id
    else break
  }
  return aktif
}
