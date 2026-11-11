/** Chip pilihan pil (DESIGN.md §7.6): dipakai di baris saringan dan lembar saringan ponsel (Peta, Rapor, Admin). */
export function Chip({ aktif, onClick, children }: { aktif: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium efek-tekan ${
        aktif ? 'bg-action text-white' : 'border border-border bg-surface text-ink hover:border-border-strong'
      }`}
    >
      {children}
    </button>
  )
}
