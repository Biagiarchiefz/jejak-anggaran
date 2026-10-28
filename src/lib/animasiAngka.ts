/** Kurva ease-out kubik: cepat di awal lalu melambat menjelang akhir. `t` dijepit ke 0–1. */
export function easeOutKubik(t: number): number {
  const p = Math.min(1, Math.max(0, t))
  return 1 - (1 - p) ** 3
}

/** Nilai animasi angka pada waktu `lewatMs` dari `durasiMs`, bergerak dari 0 ke `target`. */
export function nilaiPadaWaktu(target: number, lewatMs: number, durasiMs: number): number {
  if (durasiMs <= 0) return target
  return target * easeOutKubik(lewatMs / durasiMs)
}
