import { useId, useRef } from 'react'
import { Search, X } from 'lucide-react'

type KolomCariProps = {
  nilai: string
  onUbah: (nilai: string) => void
  placeholder: string
  /** Nama kolom untuk pembaca layar. */
  label: string
  id?: string
  /** Tinggi & lebar pembungkus, mis. `min-h-12 flex-1`. */
  className?: string
}

/**
 * Kolom cari berikon kaca pembesar. Tombol hapus (×) bawaan browser disembunyikan di index.css dan diganti
 * tombol sendiri berwarna abu-abu yang sama dengan ikon cari, muncul hanya saat kolom berisi.
 */
export function KolomCari({ nilai, onUbah, placeholder, label, id, className }: KolomCariProps) {
  const idBawaan = useId()
  const idInput = id ?? idBawaan
  const refInput = useRef<HTMLInputElement>(null)

  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-md border border-border bg-surface pr-1.5 pl-3.5 transition-colors hover:border-border-strong focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30 ${className ?? ''}`}
    >
      <Search className="size-5 shrink-0 text-ink-subtle" strokeWidth={1.5} aria-hidden />
      <label htmlFor={idInput} className="sr-only">
        {label}
      </label>
      <input
        ref={refInput}
        id={idInput}
        type="search"
        value={nilai}
        onChange={(e) => onUbah(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-ink-subtle"
      />
      {nilai !== '' && (
        <button
          type="button"
          onClick={() => {
            onUbah('')
            refInput.current?.focus()
          }}
          aria-label="Hapus kata kunci"
          className="grid size-9 shrink-0 place-items-center rounded-md text-ink-subtle transition-colors duration-150 hover:bg-recessed hover:text-ink"
        >
          <X className="size-4" strokeWidth={1.5} aria-hidden />
        </button>
      )}
    </div>
  )
}
