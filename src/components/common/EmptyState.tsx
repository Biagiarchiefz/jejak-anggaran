import type { ReactNode } from 'react'
import { Inbox, type LucideIcon } from 'lucide-react'

type EmptyStateProps = { judul: string; pesan?: string; aksi?: ReactNode; ikon?: LucideIcon }

/** DESIGN.md §7.13: ikon garis 40px, judul 16px, satu kalimat, satu aksi; rata tengah di dalam kartu. */
export function EmptyState({ judul, pesan, aksi, ikon: Ikon = Inbox }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-10 text-center">
      <Ikon className="mx-auto size-10 text-ink-subtle" strokeWidth={1.5} aria-hidden />
      <p className="mt-3 font-medium text-ink-strong">{judul}</p>
      {pesan && <p className="mx-auto mt-1 max-w-prose text-sm text-ink-muted">{pesan}</p>}
      {aksi && <div className="mt-5 flex justify-center">{aksi}</div>}
    </div>
  )
}
