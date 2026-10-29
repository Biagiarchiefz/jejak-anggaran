import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { LogOut, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '../../../components/common/Badge'
import { inisialPengguna } from '../../../utils/inisial'
import { bisaMembukaPanelAdmin, LABEL_PERAN } from '../../../utils/peran'
import type { Pengguna } from '../../../services/authService'

function Avatar({ inisial, besar }: { inisial: string; besar?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-action font-semibold text-white ${besar ? 'size-10 text-base' : 'size-9 text-sm'}`}
      aria-hidden
    >
      {inisial}
    </span>
  )
}

const KELAS_ITEM =
  'flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm text-ink outline-none transition-colors duration-150 hover:bg-brand-soft focus-visible:bg-brand-soft'

type MenuAkunProps = {
  pengguna: Pengguna
  onKeluar: () => Promise<void>
  className?: string
}

/**
 * Avatar berinisial di pojok kanan atas untuk pengguna yang sudah masuk; diklik membuka menu akun.
 * Pola menu WAI-ARIA: fokus pindah ke item pertama, ↑/↓/Home/End berpindah, Esc menutup dan mengembalikan fokus.
 * Nama dan email hanya terlihat oleh pengguna itu sendiri.
 */
export function MenuAkun({ pengguna, onKeluar, className }: MenuAkunProps) {
  const id = useId()
  const refPembungkus = useRef<HTMLDivElement>(null)
  const refTombol = useRef<HTMLButtonElement>(null)
  const refMenu = useRef<HTMLDivElement>(null)
  const [terbuka, setTerbuka] = useState(false)
  const [keluarMemuat, setKeluarMemuat] = useState(false)

  const inisial = inisialPengguna(pengguna.nama, pengguna.email)
  const namaTampil = pengguna.nama?.trim() || pengguna.email?.split('@')[0] || 'Akun Anda'
  const admin = bisaMembukaPanelAdmin(pengguna.peran)

  const itemMenu = () => Array.from(refMenu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])

  function tutup(kembalikanFokus = false) {
    setTerbuka(false)
    if (kembalikanFokus) refTombol.current?.focus()
  }

  // Saat terbuka: fokus ke item pertama; klik di luar menutup.
  useEffect(() => {
    if (!terbuka) return
    refMenu.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    function klik(e: PointerEvent) {
      if (!refPembungkus.current?.contains(e.target as Node)) setTerbuka(false)
    }
    document.addEventListener('pointerdown', klik)
    return () => document.removeEventListener('pointerdown', klik)
  }, [terbuka])

  function tekanMenu(e: KeyboardEvent<HTMLDivElement>) {
    const item = itemMenu()
    const i = item.indexOf(document.activeElement as HTMLElement)
    const ke = (j: number) => {
      e.preventDefault()
      item[(j + item.length) % item.length]?.focus()
    }
    if (e.key === 'ArrowDown') ke(i + 1)
    else if (e.key === 'ArrowUp') ke(i - 1)
    else if (e.key === 'Home') ke(0)
    else if (e.key === 'End') ke(item.length - 1)
    else if (e.key === 'Escape') {
      e.preventDefault()
      tutup(true)
    } else if (e.key === 'Tab') tutup()
  }

  async function keluar() {
    setKeluarMemuat(true)
    try {
      await onKeluar()
      tutup()
    } finally {
      setKeluarMemuat(false)
    }
  }

  return (
    <div ref={refPembungkus} className={`relative ${className ?? ''}`}>
      <button
        ref={refTombol}
        type="button"
        aria-haspopup="menu"
        aria-expanded={terbuka}
        aria-controls={terbuka ? `${id}-menu` : undefined}
        aria-label={`Akun: ${namaTampil}`}
        onClick={() => setTerbuka((t) => !t)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !terbuka) {
            e.preventDefault()
            setTerbuka(true)
          }
        }}
        className={`grid size-11 place-items-center rounded-full efek-tekan hover:ring-2 hover:ring-brand/30 ${
          terbuka ? 'ring-2 ring-brand/40' : ''
        }`}
      >
        <Avatar inisial={inisial} />
      </button>

      {terbuka && (
        <div
          ref={refMenu}
          id={`${id}-menu`}
          role="menu"
          aria-label="Menu akun"
          onKeyDown={tekanMenu}
          className="absolute top-full right-0 z-50 mt-2 w-72 origin-top-right rounded-lg border border-border bg-surface p-1.5 shadow-pop transition-[opacity,scale] duration-150 ease-(--ease-out-soft) starting:scale-95 starting:opacity-0 motion-reduce:transition-none"
        >
          {/* Identitas akun: bukan item menu, hanya informasi. */}
          <div className="flex items-center gap-3 px-3 pt-2.5 pb-3">
            <Avatar inisial={inisial} besar />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-strong">{namaTampil}</p>
              {pengguna.email && <p className="truncate text-xs text-ink-subtle">{pengguna.email}</p>}
              {admin && (
                <Badge nada="info" ringkas className="mt-1">
                  {LABEL_PERAN[pengguna.peran]}
                </Badge>
              )}
            </div>
          </div>
          <div className="my-1 border-t border-border-soft" role="separator" />

          {admin && (
            <Link to="/admin" role="menuitem" tabIndex={-1} onClick={() => tutup()} className={KELAS_ITEM}>
              <ShieldCheck className="size-4 text-ink-subtle" strokeWidth={1.5} aria-hidden />
              Panel admin
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={keluar}
            disabled={keluarMemuat}
            className={`${KELAS_ITEM} disabled:opacity-60`}
          >
            <LogOut className="size-4 text-ink-subtle" strokeWidth={1.5} aria-hidden />
            {keluarMemuat ? 'Keluar…' : 'Keluar'}
          </button>
        </div>
      )}
    </div>
  )
}
