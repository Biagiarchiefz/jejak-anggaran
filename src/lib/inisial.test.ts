import { describe, expect, it } from 'vitest'
import { inisialPengguna } from './inisial'

describe('inisialPengguna', () => {
  it('mengambil huruf pertama dari dua kata pertama nama', () => {
    expect(inisialPengguna('Ayu Rizky Pratiwi', 'x@y.id')).toBe('AR')
    expect(inisialPengguna('  budi santoso ', null)).toBe('BS')
  })

  it('nama satu kata menghasilkan satu huruf', () => {
    expect(inisialPengguna('ayurizky', null)).toBe('A')
  })

  it('pemisah titik, garis bawah, dan angka diabaikan', () => {
    expect(inisialPengguna('ayu.rizky_99', null)).toBe('AR')
  })

  it('tanpa nama memakai bagian depan email', () => {
    expect(inisialPengguna(null, 'siti.nur@contoh.id')).toBe('SN')
    expect(inisialPengguna('', 'warga@contoh.id')).toBe('W')
  })

  it('tanpa huruf sama sekali menghasilkan tanda tanya', () => {
    expect(inisialPengguna('123', null)).toBe('?')
    expect(inisialPengguna(null, null)).toBe('?')
  })
})
