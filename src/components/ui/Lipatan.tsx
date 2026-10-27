import type { ReactNode } from 'react'

type LipatanProps = {
  terbuka: boolean
  id?: string
  className?: string
  children: ReactNode
}

/**
 * Konten yang bisa dibuka-tutup dengan animasi tinggi + memudar. Tinggi dianimasikan lewat grid-template-rows
 * 0fr → 1fr, jadi tidak perlu mengukur tinggi konten. Saat tertutup konten `inert` (tidak terfokus, tidak dibaca).
 */
export function Lipatan({ terbuka, id, className, children }: LipatanProps) {
  return (
    <div
      id={id}
      inert={!terbuka}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-(--ease-standard) motion-reduce:transition-none ${
        terbuka ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      } ${className ?? ''}`}
    >
      <div
        className={`min-h-0 overflow-hidden transition-[translate] duration-300 ease-(--ease-standard) motion-reduce:transition-none ${
          terbuka ? 'translate-y-0' : '-translate-y-2'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
