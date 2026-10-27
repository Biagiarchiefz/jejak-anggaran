import { beforeEach, describe, expect, it, vi } from 'vitest'
import { adaDataDemo, aturUlangPenandaDemo, langgananDataDemo, tandaiDataDemo } from './penandaDemo'

describe('penandaDemo', () => {
  beforeEach(aturUlangPenandaDemo)

  it('tetap mati selama tidak ada baris demo', () => {
    tandaiDataDemo([{ is_demo: false }])
    tandaiDataDemo([])
    expect(adaDataDemo()).toBe(false)
  })

  it('menyala begitu ada satu baris demo, lalu tidak padam lagi', () => {
    tandaiDataDemo([{ is_demo: false }, { is_demo: true }])
    expect(adaDataDemo()).toBe(true)
    tandaiDataDemo([{ is_demo: false }])
    expect(adaDataDemo()).toBe(true)
  })

  it('memberi tahu pelanggan sekali saat menyala', () => {
    const f = vi.fn()
    const berhenti = langgananDataDemo(f)
    tandaiDataDemo([{ is_demo: true }])
    tandaiDataDemo([{ is_demo: true }])
    expect(f).toHaveBeenCalledOnce()
    berhenti()
  })
})
