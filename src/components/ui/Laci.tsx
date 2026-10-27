import { useEffect, useRef, useState, type ReactNode } from 'react'

type LaciProps = {
  terbuka: boolean
  onTutup: () => void
  /** Nama dialog untuk pembaca layar. */
  label: string
  /** Arah panel masuk: kiri (menu), kanan (panel samping), atas (pencarian), tengah (detail), atau bawah (bottom sheet). Animasinya di index.css. */
  arah: 'kiri' | 'kanan' | 'atas' | 'tengah' | 'bawah'
  /** Posisi dan ukuran panel. */
  className: string
  children: ReactNode
}

/**
 * Panel modal di atas halaman (menu, pencarian, detail proyek). Memakai <dialog> native: fokus terkunci di dalam panel,
 * Esc menutup, dan halaman di belakangnya tidak bisa diklik. Klik di luar panel juga menutup.
 * Isi baru dipasang saat dibuka, dan dilepas setelah animasi tutup selesai.
 */
export function Laci({ terbuka, onTutup, label, arah, className, children }: LaciProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const [isiTampil, setIsiTampil] = useState(terbuka)

  if (terbuka && !isiTampil) setIsiTampil(true)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (terbuka && !dialog.open) dialog.showModal()
    else if (!terbuka && dialog.open) dialog.close()
  }, [terbuka])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      data-laci={arah}
      onClose={onTutup}
      onClick={(e) => {
        if (e.target === e.currentTarget) onTutup()
      }}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && !terbuka) setIsiTampil(false)
      }}
      className={`max-h-none max-w-none bg-surface text-ink shadow-pop ${className}`}
    >
      {isiTampil && children}
    </dialog>
  )
}
