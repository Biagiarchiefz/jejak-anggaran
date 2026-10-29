import type { ReactNode } from 'react'

/** Kepala halaman panel admin: lebih ringkas dari `KepalaHalaman` publik agar data cepat terlihat. */
export function KepalaAdmin({ judul, deskripsi }: { judul: string; deskripsi?: ReactNode }) {
  return (
    <header>
      <h1 className="text-2xl leading-tight font-medium tracking-[-0.015em] text-ink-strong">{judul}</h1>
      {deskripsi && <p className="mt-1 max-w-[720px] text-sm leading-relaxed text-ink-muted">{deskripsi}</p>}
    </header>
  )
}
