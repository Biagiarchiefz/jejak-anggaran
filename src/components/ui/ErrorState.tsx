import { Button } from './Button'

type ErrorStateProps = { pesan: string; onCobaLagi?: () => void; judul?: string }

export function ErrorState({ pesan, onCobaLagi, judul = 'Data gagal dimuat' }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-ui border border-red-200 bg-redflag-bg px-4 py-6 text-center">
      <p className="font-medium text-redflag">{judul}</p>
      <p className="mx-auto mt-1 max-w-prose text-sm text-slate-600">{pesan}</p>
      {onCobaLagi && (
        <Button varian="kedua" ukuran="sm" className="mt-4" onClick={onCobaLagi}>
          Coba lagi
        </Button>
      )}
    </div>
  )
}
