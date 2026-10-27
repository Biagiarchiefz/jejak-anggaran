import { CircleAlert } from 'lucide-react'
import { Button } from './Button'

type ErrorStateProps = { pesan: string; onCobaLagi?: () => void; judul?: string }

/** DESIGN.md §7.13: kotak danger-soft, pesan bahasa Indonesia, tombol sekunder "Coba lagi". */
export function ErrorState({ pesan, onCobaLagi, judul = 'Data gagal dimuat' }: ErrorStateProps) {
  return (
    <div role="alert" className="flex gap-3 rounded-lg border border-danger/20 bg-danger-soft p-4">
      <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={1.5} aria-hidden />
      <div className="min-w-0">
        <p className="font-medium text-danger">{judul}</p>
        <p className="mt-1 max-w-prose text-sm text-ink-muted">{pesan}</p>
        {onCobaLagi && (
          <Button varian="kedua" ukuran="sm" className="mt-3" onClick={onCobaLagi}>
            Coba lagi
          </Button>
        )}
      </div>
    </div>
  )
}
