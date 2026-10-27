import type { ButtonHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

type TombolLipatProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & { terbuka: boolean }

/** Tombol teks untuk membuka/menutup <Lipatan>; chevron berputar mengikuti keadaannya. */
export function TombolLipat({ terbuka, className, children, ...rest }: TombolLipatProps) {
  return (
    <button
      type="button"
      aria-expanded={terbuka}
      className={`group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-link hover:underline ${className ?? ''}`}
      {...rest}
    >
      {children}
      <ChevronDown
        className={`size-4 transition-transform duration-300 ease-(--ease-standard) motion-reduce:transition-none ${terbuka ? 'rotate-180' : ''}`}
        strokeWidth={1.5}
        aria-hidden
      />
    </button>
  )
}
