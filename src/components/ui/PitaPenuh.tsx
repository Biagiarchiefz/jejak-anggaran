import type { ReactNode } from 'react'

type PitaPenuhProps = {
  /** Latar + jarak vertikal section, mis. `bg-band py-24`. */
  className?: string
  children: ReactNode
  'aria-labelledby'?: string
  id?: string
}

/**
 * Section yang latarnya selebar layar sementara isinya tetap di kontainer 1280px.
 * Margin negatif = selisih lebar kontainer dan 100cqw (lebar halaman tanpa scrollbar, dari @container di Layout).
 */
export function PitaPenuh({ className, children, ...rest }: PitaPenuhProps) {
  return (
    <section className={`mx-[calc((100%_-_100cqw)/2)] ${className ?? ''}`} {...rest}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
