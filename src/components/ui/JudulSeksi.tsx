import type { ReactNode } from 'react'

type JudulSeksiProps = {
  /** Kalimat utama (slate-900). */
  utama: ReactNode
  /** Kalimat pelengkap yang lebih redup (slate-500). */
  pelengkap?: ReactNode
  as?: 'h1' | 'h2' | 'p'
  id?: string
  className?: string
}

/**
 * Gaya teks judul/pengantar seksi yang seragam: ukuran besar, bobot medium,
 * dua nada warna. Dipakai paragraf pengantar dan judul seksi di Beranda.
 */
export function JudulSeksi({ utama, pelengkap, as: Tag = 'h2', id, className }: JudulSeksiProps) {
  return (
    <Tag
      id={id}
      className={`text-2xl leading-snug font-medium tracking-tight text-balance text-slate-900 sm:text-3xl ${className ?? ''}`}
    >
      {utama}
      {pelengkap && (
        <>
          {' '}
          <span className="text-slate-500">{pelengkap}</span>
        </>
      )}
    </Tag>
  )
}
