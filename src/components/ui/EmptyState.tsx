import type { ReactNode } from 'react'

type EmptyStateProps = { judul: string; pesan?: string; aksi?: ReactNode }

export function EmptyState({ judul, pesan, aksi }: EmptyStateProps) {
  return (
    <div className="rounded-ui border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
      <p className="font-medium text-slate-900">{judul}</p>
      {pesan && <p className="mx-auto mt-1 max-w-prose text-sm text-slate-600">{pesan}</p>}
      {aksi && <div className="mt-4 flex justify-center">{aksi}</div>}
    </div>
  )
}
