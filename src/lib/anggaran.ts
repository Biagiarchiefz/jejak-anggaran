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
