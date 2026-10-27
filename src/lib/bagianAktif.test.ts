import { describe, expect, it } from 'vitest'
import { bagianAktif } from './bagianAktif'

const POSISI = (atas: number[]) => atas.map((a, i) => ({ id: `b${i + 1}`, atas: a }))

describe('bagianAktif', () => {
  it('bagian terakhir yang sudah melewati garis batas', () => {
    expect(bagianAktif(POSISI([-400, -50, 90, 700]), 120, false)).toBe('b3')
    expect(bagianAktif(POSISI([-400, -50, 300, 700]), 120, false)).toBe('b2')
  })

  it('sebelum bagian pertama tercapai, bagian pertama aktif', () => {
    expect(bagianAktif(POSISI([400, 900]), 120, false)).toBe('b1')
  })

  it('di dasar halaman, bagian terakhir aktif', () => {
    expect(bagianAktif(POSISI([-900, -300, 400, 650]), 120, true)).toBe('b4')
  })

  it('tanpa bagian menghasilkan null', () => {
    expect(bagianAktif([], 120, false)).toBeNull()
  })
})
