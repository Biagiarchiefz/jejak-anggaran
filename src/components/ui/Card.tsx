import type { HTMLAttributes } from 'react'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-ui border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 ${className ?? ''}`} {...rest} />
}
