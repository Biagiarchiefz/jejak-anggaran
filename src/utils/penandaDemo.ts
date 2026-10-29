/**
 * Penanda global "situs sedang menampilkan data demo". Service memanggil `tandaiDataDemo()` setiap kali memuat data;
 * begitu ada satu baris `is_demo`, penanda menyala sampai halaman dimuat ulang. Footer membacanya
 * (lewat `useAdaDataDemo`) untuk menampilkan satu catatan data demo, pengganti label per item.
 */
let adaDemo = false
const pendengar = new Set<() => void>()

export function tandaiDataDemo(baris: readonly { is_demo: boolean }[]): void {
  if (adaDemo || !baris.some((b) => b.is_demo)) return
  adaDemo = true
  pendengar.forEach((f) => f())
}

export function adaDataDemo(): boolean {
  return adaDemo
}

export function langgananDataDemo(f: () => void): () => void {
  pendengar.add(f)
  return () => pendengar.delete(f)
}

/** Hanya untuk test. */
export function aturUlangPenandaDemo(): void {
  adaDemo = false
}
