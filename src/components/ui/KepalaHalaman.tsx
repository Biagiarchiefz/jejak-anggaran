import type { ReactNode } from 'react'
import { LabelSeksi } from './LabelSeksi'

type KepalaHalamanProps = {
  judul: ReactNode
  deskripsi?: ReactNode
  eyebrow?: string
  /** Badge di samping judul, mis. status. */
  badge?: ReactNode
  className?: string
}

/** Kepala halaman dengan H1 (DESIGN.md §4): 32/48px, bobot 500, line-height 1.1, tracking -0.018em. */
export function KepalaHalaman({ judul, deskripsi, eyebrow, badge, className }: KepalaHalamanProps) {
  return (
    <header className={className}>
      {eyebrow && <LabelSeksi>{eyebrow}</LabelSeksi>}
      <div className={`flex flex-wrap items-center gap-3 ${eyebrow ? 'mt-3' : ''}`}>
        <h1 className="text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-balance md:text-[48px]">{judul}</h1>
        {badge}
      </div>
      {deskripsi && <p className="mt-4 max-w-[720px] text-lg leading-[1.55] text-ink-muted">{deskripsi}</p>}
    </header>
  )
}
