import type { ReactNode } from 'react'

export type NadaBadge = 'netral' | 'info' | 'sukses' | 'peringatan' | 'bahaya'

// DESIGN.md §7.6.
const NADA: Record<NadaBadge, string> = {
  netral: 'bg-recessed text-ink-muted',
  info: 'bg-brand-soft text-link',
  sukses: 'bg-success-soft text-success',
  peringatan: 'bg-warning-soft text-warning',
  bahaya: 'bg-danger-soft text-danger',
}

type BadgeProps = {
  nada?: NadaBadge
  children: ReactNode
  title?: string
  className?: string
  /** Versi kecil untuk baris badge yang padat. */
  ringkas?: boolean
}

export function Badge({ nada = 'netral', children, title, className, ringkas }: BadgeProps) {
  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full font-semibold whitespace-nowrap ${ringkas ? 'px-2 text-[11px] leading-[18px]' : 'px-2.5 py-0.5 text-xs'} ${NADA[nada]} ${className ?? ''}`}
    >
      {children}
    </span>
  )
}
