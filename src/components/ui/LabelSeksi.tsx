import type { ReactNode } from 'react'

/** Eyebrow di atas judul section (DESIGN.md §4): 12px, 600, kapital, tracking 0.06em. `terang` untuk di atas pita gelap. */
export function LabelSeksi({ children, terang }: { children: ReactNode; terang?: boolean }) {
  return (
    <p className={`text-xs font-semibold tracking-[0.06em] uppercase ${terang ? 'text-brand-light' : 'text-action'}`}>{children}</p>
  )
}
