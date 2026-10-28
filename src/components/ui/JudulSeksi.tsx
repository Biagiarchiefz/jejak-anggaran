import type { ReactNode } from 'react'

type JudulSeksiProps = {
  /** Kalimat utama (ink-strong). */
  utama: ReactNode
  /** Kalimat pelengkap berwarna biru aksi, senada dengan eyebrow <LabelSeksi> di atasnya. */
  pelengkap?: ReactNode
  as?: 'h1' | 'h2' | 'p'
  id?: string
  className?: string
}

/** Judul section H2 (DESIGN.md §4): 28/40px, bobot 500, line-height 1.12, tracking -0.015em. */
export function JudulSeksi({ utama, pelengkap, as: Tag = 'h2', id, className }: JudulSeksiProps) {
  return (
    <Tag
      id={id}
      className={`text-[28px] leading-[1.12] font-medium tracking-[-0.015em] text-balance text-ink-strong md:text-[40px] ${className ?? ''}`}
    >
      {utama}
      {pelengkap && (
        <>
          {' '}
          <span className="text-action">{pelengkap}</span>
        </>
      )}
    </Tag>
  )
}
