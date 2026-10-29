type BarisAnggaran = {
  tahun: number
  urusan: string
  anggaran: number
  realisasi: number | null
}

export type TotalTahun = { tahun: number; anggaran: number; realisasi: number | null }

/** Jumlahkan anggaran per tahun, urut naik. Realisasi null jika ada urusan yang belum punya realisasi. */
export function totalPerTahun(baris: readonly BarisAnggaran[]): TotalTahun[] {
  const perTahun = new Map<number, TotalTahun>()
  for (const b of baris) {
    const t = perTahun.get(b.tahun) ?? { tahun: b.tahun, anggaran: 0, realisasi: 0 }
    t.anggaran += b.anggaran
    t.realisasi = t.realisasi === null || b.realisasi === null ? null : t.realisasi + b.realisasi
    perTahun.set(b.tahun, t)
  }
  return [...perTahun.values()].sort((a, b) => a.tahun - b.tahun)
}

export function urusanPadaTahun<T extends BarisAnggaran>(baris: readonly T[], tahun: number): T[] {
  return baris.filter((b) => b.tahun === tahun).sort((a, b) => b.anggaran - a.anggaran)
}

/** Daftar unik berdasarkan `id`, mis. untuk menampilkan sumber data tanpa duplikat. */
export function unikBerdasarkanId<T extends { id: number | string }>(daftar: readonly T[]): T[] {
  return [...new Map(daftar.map((d) => [d.id, d])).values()]
}

/** Total tahun tertentu beserta tahun sebelumnya (untuk menghitung kenaikan/penurunan). */
export function bandingkanTahunSebelumnya(
  tren: readonly TotalTahun[],
  tahun: number,
): { saatIni: TotalTahun; sebelumnya: TotalTahun | null } | null {
  const i = tren.findIndex((t) => t.tahun === tahun)
  if (i === -1) return null
  return { saatIni: tren[i], sebelumnya: i > 0 ? tren[i - 1] : null }
}

/**
 * Anggaran dibagi rata ke setiap warga: per tahun dan per hari (365 hari). Hanya ilustrasi skala, bukan uang yang
 * diterima tiap warga. `null` bila jumlah penduduk tidak valid.
 */
export function anggaranPerWarga(anggaran: number, penduduk: number): { perTahun: number; perHari: number } | null {
  if (!(penduduk > 0)) return null
  const perTahun = anggaran / penduduk
  return { perTahun, perHari: perTahun / 365 }
}

/** Tahun terakhir (paling lambat `tahun`) yang realisasinya sudah lengkap. */
export function realisasiTerakhir(
  tren: readonly TotalTahun[],
  tahun: number,
): (TotalTahun & { realisasi: number }) | null {
  for (let i = tren.length - 1; i >= 0; i--) {
    const t = tren[i]
    if (t.tahun <= tahun && t.realisasi !== null) return { ...t, realisasi: t.realisasi }
  }
  return null
}
