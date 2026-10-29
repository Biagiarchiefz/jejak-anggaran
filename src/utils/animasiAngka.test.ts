import { describe, expect, it } from 'vitest'
import { easeOutKubik, nilaiPadaWaktu } from './animasiAngka'

describe('easeOutKubik', () => {
  it('mulai di 0, berakhir di 1, dan sudah lewat separuh di tengah waktu', () => {
    expect(easeOutKubik(0)).toBe(0)
    expect(easeOutKubik(1)).toBe(1)
    expect(easeOutKubik(0.5)).toBeCloseTo(0.875)
  })

  it('menjepit t di luar 0–1', () => {
    expect(easeOutKubik(-1)).toBe(0)
    expect(easeOutKubik(2)).toBe(1)
  })
})

describe('nilaiPadaWaktu', () => {
  it('bergerak dari 0 ke target dan berhenti tepat di target', () => {
    expect(nilaiPadaWaktu(100, 0, 1800)).toBe(0)
    expect(nilaiPadaWaktu(100, 1800, 1800)).toBe(100)
    expect(nilaiPadaWaktu(100, 5000, 1800)).toBe(100)
  })

  it('durasi 0 langsung ke target', () => {
    expect(nilaiPadaWaktu(42, 0, 0)).toBe(42)
  })
})
