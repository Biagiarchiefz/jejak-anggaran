import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

type Varian = 'utama' | 'kedua' | 'tipis' | 'bahaya' | 'terang' | 'garisTerang'
type Ukuran = 'sm' | 'md'

// DESIGN.md §7.1: semua tombol berbentuk pil, tinggi minimum 44px, maksimal satu tombol utama per section.
// `group`: ikon panah di dalam tombol bergeser saat hover; `efek-tekan`: transisi warna + mengecil saat ditekan.
const DASAR =
  'group inline-flex items-center justify-center gap-2 rounded-full font-medium efek-tekan disabled:cursor-not-allowed disabled:opacity-60'

const VARIAN: Record<Varian, string> = {
  utama: 'bg-action text-white hover:bg-action-hover',
  kedua: 'border border-border-strong bg-surface text-ink hover:bg-canvas-soft',
  tipis: 'text-ink hover:bg-recessed',
  bahaya: 'bg-danger text-white hover:bg-danger/90',
  // Untuk di atas pita gelap (`band`).
  terang: 'bg-surface text-band hover:bg-brand-soft',
  garisTerang: 'border border-white/40 text-white hover:border-white hover:bg-white/10',
}

const UKURAN: Record<Ukuran, string> = {
  sm: 'min-h-11 px-4 text-sm',
  md: 'min-h-11 px-6 py-3 text-base',
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

/** Tautan keluar (SiRUP, LPSE, LAPOR!) bergaya tombol, dengan ikon ↗. */
export function TautanLuarTombol({ href, varian = 'kedua', ukuran = 'md', className, children }: TautanLuarProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={kelas(varian, ukuran, className)}>
      {children}
      <span aria-hidden>↗</span>
      <span className="sr-only">(membuka tab baru)</span>
    </a>
  )
}

type TautanBiasaTombolProps = { href: string; varian?: Varian; ukuran?: Ukuran; className?: string; children: ReactNode }

/**
 * Tautan internal bergaya tombol yang memakai <a href> biasa (bukan <Link>): dipakai di tempat yang bisa berada di luar
 * Router (mis. error boundary), dan sengaja memuat ulang aplikasi dari awal.
 */
export function TautanBiasaTombol({ href, varian = 'utama', ukuran = 'md', className, children }: TautanBiasaTombolProps) {
  return (
    <a href={href} className={kelas(varian, ukuran, className)}>
      {children}
    </a>
  )
}
