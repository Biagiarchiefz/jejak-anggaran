import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { KELAS_LABEL } from './gayaForm'

export type OpsiPilihan<T extends string | number> = { nilai: T; label: string }

type PilihanProps<T extends string | number> = {
  nilai: T
  opsi: readonly OpsiPilihan<T>[]
  onUbah: (nilai: T) => void
  /** Nama field. Tampil di atas tombol, atau hanya untuk pembaca layar bila `labelTersembunyi`. */
  label: string
  labelTersembunyi?: boolean
  /** Lebar & posisi pembungkus, mis. `w-40` atau `w-full sm:w-56`. */
  className?: string
}

const TINGGI_OPSI = 36 // px: tinggi satu opsi (py-2 + text-sm).
const TINGGI_MAKS_DAFTAR = 256 // px: max-h-64.

/**
 * Dropdown kustom pengganti <select> bawaan, mengikuti pola "select-only combobox" WAI-ARIA:
 * fokus tetap di tombol, opsi yang disorot diumumkan lewat aria-activedescendant.
 * Keyboard: ↑/↓, Home/End, Enter/Spasi memilih, Esc menutup, Tab memilih lalu pindah, ketik huruf untuk melompat.
 */
export function Pilihan<T extends string | number>({ nilai, opsi, onUbah, label, labelTersembunyi, className }: PilihanProps<T>) {
  const id = useId()
  const refPembungkus = useRef<HTMLDivElement>(null)
  const refDaftar = useRef<HTMLUListElement>(null)
  const ketikan = useRef({ teks: '', waktu: 0 })
  const [terbuka, setTerbuka] = useState(false)
  const [sorot, setSorot] = useState(0)
  const [keAtas, setKeAtas] = useState(false)

  const indeksTerpilih = Math.max(
    0,
    opsi.findIndex((o) => o.nilai === nilai),
  )
  const terpilih = opsi[indeksTerpilih]
  const idOpsi = (i: number) => `${id}-opsi-${i}`

  function buka(indeks = indeksTerpilih) {
    const kotak = refPembungkus.current?.getBoundingClientRect()
    if (kotak) {
      // Buka ke atas hanya jika daftar tidak muat di bawah dan ruang di atas lebih lega.
      const perluRuang = Math.min(opsi.length * TINGGI_OPSI + 8, TINGGI_MAKS_DAFTAR) + 12
      const bawah = window.innerHeight - kotak.bottom
      setKeAtas(bawah < perluRuang && kotak.top > bawah)
    }
    setSorot(indeks)
    setTerbuka(true)
  }

  function pilih(indeks: number) {
    const o = opsi[indeks]
    if (o && o.nilai !== nilai) onUbah(o.nilai)
    setTerbuka(false)
  }

  // Klik di luar menutup daftar.
  useEffect(() => {
    if (!terbuka) return
    function klik(e: PointerEvent) {
      if (!refPembungkus.current?.contains(e.target as Node)) setTerbuka(false)
    }
    document.addEventListener('pointerdown', klik)
    return () => document.removeEventListener('pointerdown', klik)
  }, [terbuka])

  // Opsi yang disorot selalu terlihat di dalam daftar yang bisa digulir.
  useEffect(() => {
    if (!terbuka) return
    const daftar = refDaftar.current
    const el = daftar?.children[sorot] as HTMLElement | undefined
    if (!daftar || !el) return
    if (el.offsetTop < daftar.scrollTop) daftar.scrollTop = el.offsetTop
    else if (el.offsetTop + el.offsetHeight > daftar.scrollTop + daftar.clientHeight)
      daftar.scrollTop = el.offsetTop + el.offsetHeight - daftar.clientHeight
  }, [sorot, terbuka])

  /** Lompat ke opsi yang labelnya diawali huruf yang diketik (bisa beberapa huruf berturut-turut). */
  function cariKetikan(huruf: string): number | null {
    const sekarang = Date.now()
    const k = ketikan.current
    k.teks = sekarang - k.waktu > 700 ? huruf : k.teks + huruf
    k.waktu = sekarang
    const mulai = terbuka ? sorot : indeksTerpilih
    const urutan = [...opsi.slice(mulai + 1), ...opsi.slice(0, mulai + 1)]
    const cocok = urutan.find((o) => o.label.toLocaleLowerCase('id').startsWith(k.teks.toLocaleLowerCase('id')))
    return cocok ? opsi.indexOf(cocok) : null
  }

  function tekanTombol(e: KeyboardEvent<HTMLButtonElement>) {
    const akhir = opsi.length - 1
    if (!terbuka) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        buka()
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault()
        buka(e.key === 'Home' ? 0 : akhir)
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const i = cariKetikan(e.key)
        if (i !== null) buka(i)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSorot((s) => Math.min(s + 1, akhir))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSorot((s) => Math.max(s - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setSorot(0)
        break
      case 'End':
        e.preventDefault()
        setSorot(akhir)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        pilih(sorot)
        break
      case 'Tab':
        pilih(sorot)
        break
      case 'Escape':
        e.preventDefault()
        setTerbuka(false)
        break
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const i = cariKetikan(e.key)
          if (i !== null) setSorot(i)
        }
    }
  }

  return (
    <div ref={refPembungkus} className={`relative ${className ?? ''}`}>
      <span id={`${id}-label`} className={labelTersembunyi ? 'sr-only' : `mb-1.5 ${KELAS_LABEL}`}>
        {label}
      </span>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={terbuka}
        aria-controls={`${id}-daftar`}
        aria-labelledby={`${id}-label`}
        aria-activedescendant={terbuka ? idOpsi(sorot) : undefined}
        onClick={() => (terbuka ? setTerbuka(false) : buka())}
        onKeyDown={tekanTombol}
        className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-md border bg-surface px-3.5 text-left text-base text-ink transition-[border-color,box-shadow] duration-150 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
          terbuka ? 'border-brand ring-2 ring-brand/30' : 'border-border hover:border-border-strong'
        }`}
      >
        <span className="truncate">{terpilih?.label ?? ''}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-ink-subtle transition-transform duration-150 motion-reduce:transition-none ${terbuka ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>

      {terbuka && (
        <ul
          ref={refDaftar}
          id={`${id}-daftar`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          tabIndex={-1}
          className={`absolute inset-x-0 z-50 max-h-64 min-w-max overflow-y-auto rounded-md border border-border bg-surface p-1 shadow-pop transition-[opacity,translate] duration-150 ease-(--ease-out-soft) starting:opacity-0 motion-reduce:transition-none ${
            keAtas ? 'bottom-full mb-1.5 starting:translate-y-1' : 'top-full mt-1.5 starting:-translate-y-1'
          }`}
        >
          {opsi.map((o, i) => {
            const dipilih = i === indeksTerpilih
            return (
              <li
                key={String(o.nilai)}
                id={idOpsi(i)}
                role="option"
                aria-selected={dipilih}
                onPointerMove={() => setSorot(i)}
                // pointerdown dicegah agar fokus tidak pindah dari tombol sebelum klik selesai.
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pilih(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-2 text-sm ${
                  i === sorot ? 'bg-brand-soft text-ink-strong' : 'text-ink'
                } ${dipilih ? 'font-medium' : ''}`}
              >
                <span className="truncate">{o.label}</span>
                <Check className={`size-4 shrink-0 text-action ${dipilih ? '' : 'invisible'}`} strokeWidth={1.5} aria-hidden />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
