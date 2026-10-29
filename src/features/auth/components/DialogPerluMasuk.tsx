import { LogIn, ShieldCheck, ThumbsUp, X } from 'lucide-react'
import { Button, TautanTombol } from '../../../components/common/Button'
import { Laci } from '../../../components/common/Laci'

type DialogPerluMasukProps = {
  terbuka: boolean
  onTutup: () => void
  /** Halaman tujuan setelah berhasil masuk (path internal). */
  kembaliKe: string
}

/**
 * Dialog ramah untuk tamu yang menekan tombol konfirmasi laporan: menjelaskan kenapa perlu masuk,
 * lalu menawarkan "Masuk" (kembali ke halaman ini setelahnya) atau "Nanti saja".
 */
export function DialogPerluMasuk({ terbuka, onTutup, kembaliKe }: DialogPerluMasukProps) {
  return (
    <Laci
      terbuka={terbuka}
      onTutup={onTutup}
      label="Masuk untuk mengonfirmasi laporan"
      arah="tengah"
      className="m-auto w-[calc(100%-2rem)] max-w-sm! rounded-lg border border-border p-0"
    >
      <div className="relative p-6">
        <button
          type="button"
          onClick={onTutup}
          aria-label="Tutup"
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-md text-ink-subtle efek-tekan hover:bg-recessed hover:text-ink"
        >
          <X className="size-4" strokeWidth={1.5} aria-hidden />
        </button>

        <span className="grid size-11 place-items-center rounded-lg bg-brand-soft text-action" aria-hidden>
          <ThumbsUp className="size-5" strokeWidth={1.5} />
        </span>
        <h2 className="mt-4 text-lg leading-tight font-semibold text-ink-strong">Masuk dulu untuk mengonfirmasi</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
          Konfirmasi warga membantu menentukan laporan mana yang perlu ditindaklanjuti. Agar satu orang hanya bisa
          mengonfirmasi sekali, Anda perlu masuk terlebih dahulu.
        </p>
        <p className="mt-3 flex items-start gap-2 rounded-md bg-canvas-soft px-3 py-2 text-xs text-ink-muted">
          <ShieldCheck className="mt-px size-4 shrink-0 text-ink-subtle" strokeWidth={1.5} aria-hidden />
          Cukup email dan kata sandi. Identitas Anda tidak pernah ditampilkan ke publik.
        </p>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button varian="tipis" ukuran="sm" onClick={onTutup}>
            Nanti saja
          </Button>
          <TautanTombol to={`/masuk?kembali=${encodeURIComponent(kembaliKe)}`} ukuran="sm">
            <LogIn className="size-4" strokeWidth={1.5} aria-hidden />
            Masuk
          </TautanTombol>
        </div>
      </div>
    </Laci>
  )
}
