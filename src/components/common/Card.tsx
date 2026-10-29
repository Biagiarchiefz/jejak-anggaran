import type { HTMLAttributes } from 'react'

/** Kartu default (DESIGN.md §7.5): putih, border tipis, rounded-lg, bayangan tepi. */
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-lg border border-border bg-surface p-5 shadow-edge sm:p-6 ${className ?? ''}`} {...rest} />
}
