// Logger sederhana. Detail error hanya dicetak saat development,
// supaya pesan teknis tidak pernah bocor ke pengguna di produksi.
const aktif = import.meta.env.DEV

export const logger = {
  error(pesan: string, detail?: unknown): void {
    if (aktif) console.error(`[jejak-anggaran] ${pesan}`, detail ?? '')
  },
  warn(pesan: string, detail?: unknown): void {
    if (aktif) console.warn(`[jejak-anggaran] ${pesan}`, detail ?? '')
  },
}
