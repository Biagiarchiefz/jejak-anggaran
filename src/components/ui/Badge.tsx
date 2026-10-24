import type { ReactNode } from 'react'

export type NadaBadge = 'netral' | 'info' | 'sukses' | 'peringatan' | 'bahaya'

const NADA: Record<NadaBadge, string> = {
  netral: 'bg-slate-100 text-slate-800 ring-slate-300',
  info: 'bg-blue-50 text-blue-900 ring-blue-200',
  sukses: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
  peringatan: 'bg-amber-50 text-amber-900 ring-amber-300',
  bahaya: 'bg-redflag-bg text-redflag ring-red-200',
}

type BadgeProps = { nada?: NadaBadge; children: ReactNode; title?: string; className?: string }

export function Badge({ nada = 'netral', children, title, className }: BadgeProps) {
  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-ui px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${NADA[nada]} ${className ?? ''}`}
    >
      {children}
    </span>
  )
}
