import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

type Varian = 'utama' | 'kedua' | 'tipis' | 'bahaya' | 'terang' | 'garisTerang'
type Ukuran = 'sm' | 'md'

// Bentuk pil untuk semua tombol aksi (design language ala Stripe).
const DASAR =
  'inline-flex items-center justify-center gap-2 rounded-ui font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60'

const VARIAN: Record<Varian, string> = {
  utama: 'bg-merek-800 text-white shadow-sm hover:bg-merek-900 hover:shadow-md',
  kedua: 'border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:shadow-md',
  tipis: 'text-merek-800 hover:bg-merek-50',
  bahaya: 'bg-redflag text-white shadow-sm hover:bg-red-900',
  // Untuk di atas latar gelap (hero).
  terang: 'bg-white text-slate-900 shadow-sm hover:bg-merek-50 hover:shadow-md',
  garisTerang: 'border border-white/50 text-white hover:border-white hover:bg-white/10',
}

const UKURAN: Record<Ukuran, string> = {
  sm: 'min-h-9 px-4 text-sm',
  md: 'min-h-11 px-6 text-base',
}

function kelas(varian: Varian, ukuran: Ukuran, tambahan?: string) {
  return [DASAR, VARIAN[varian], UKURAN[ukuran], tambahan].filter(Boolean).join(' ')
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  varian?: Varian
  ukuran?: Ukuran
  memuat?: boolean
}

export function Button({ varian = 'utama', ukuran = 'md', memuat, className, children, disabled, type, ...rest }: ButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={kelas(varian, ukuran, className)}
      disabled={disabled || memuat}
      aria-busy={memuat || undefined}
      {...rest}
    >
      {memuat && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />}
      {children}
    </button>
  )
}

type TautanTombolProps = LinkProps & { varian?: Varian; ukuran?: Ukuran; children: ReactNode }

export function TautanTombol({ varian = 'utama', ukuran = 'md', className, ...rest }: TautanTombolProps) {
  return <Link className={kelas(varian, ukuran, typeof className === 'string' ? className : undefined)} {...rest} />
}

type TautanLuarProps = { href: string; varian?: Varian; ukuran?: Ukuran; className?: string; children: ReactNode }

export function TautanLuarTombol({ href, varian = 'kedua', ukuran = 'md', className, children }: TautanLuarProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={kelas(varian, ukuran, className)}>
      {children}
      <span className="sr-only">(membuka tab baru)</span>
    </a>
  )
}
