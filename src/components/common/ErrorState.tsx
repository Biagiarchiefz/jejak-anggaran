import { CircleAlert, House, RotateCw } from 'lucide-react'
import { Button, TautanBiasaTombol } from './Button'

type ErrorStateProps = {
  pesan: string
  onCobaLagi?: () => void
  judul?: string
  /**
   * `halaman`: seluruh halaman gagal (error boundary, data utama halaman). Kartu terpusat di tengah area konten,
   * dengan "Coba lagi" + "Kembali ke Beranda". Tanpa ini: kotak ringkas di dalam section.
   */
  halaman?: boolean
}

/** DESIGN.md §7.13: pesan bahasa Indonesia yang aman (bukan pesan mentah Supabase/Postgres) + jalan keluar yang jelas. */
export function ErrorState({ pesan, onCobaLagi, judul = 'Data gagal dimuat', halaman }: ErrorStateProps) {
  if (halaman) {
    return (
      <div className="grid min-h-[60vh] place-items-center py-10">
        <div role="alert" className="w-full max-w-md rounded-lg border border-border bg-surface p-6 text-center shadow-card sm:p-8">
          {/* Ikon dalam lingkaran berlapis: penanda masalah yang jelas tanpa terasa menakutkan. */}
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-danger-soft text-danger ring-8 ring-danger-soft/50" aria-hidden>
            <CircleAlert className="size-6" strokeWidth={1.5} />
          </span>
          <h2 className="mt-5 text-lg leading-tight font-semibold tracking-normal text-ink-strong">{judul}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{pesan}</p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
            {/* <a> biasa (bukan <Link>): tetap bekerja di luar Router dan memuat ulang aplikasi dari awal. */}
            <TautanBiasaTombol href="/" varian="kedua" ukuran="sm">
              <House className="size-4" strokeWidth={1.5} aria-hidden />
              Kembali ke Beranda
            </TautanBiasaTombol>
            {onCobaLagi && (
              <Button ukuran="sm" onClick={onCobaLagi}>
                <RotateCw className="size-4 transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
                Coba lagi
              </Button>
            )}
          </div>
          {/* Hanya untuk galat yang bisa dicoba lagi (jaringan, server); tidak relevan untuk "tidak ditemukan". */}
          {onCobaLagi && (
            <p className="mt-5 border-t border-border-soft pt-4 text-xs text-ink-subtle">
              Jika masalah berlanjut, periksa koneksi internet Anda atau coba beberapa saat lagi.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div role="alert" className="flex gap-3 rounded-lg border border-danger/20 bg-surface p-4 shadow-edge">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-danger-soft text-danger" aria-hidden>
        <CircleAlert className="size-5" strokeWidth={1.5} />
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-ink-strong">{judul}</p>
        <p className="mt-0.5 max-w-prose text-sm text-ink-muted">{pesan}</p>
        {onCobaLagi && (
          <Button varian="kedua" ukuran="sm" className="mt-3" onClick={onCobaLagi}>
            <RotateCw className="size-4 transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
            Coba lagi
          </Button>
        )}
      </div>
    </div>
  )
}
