import { useId, useState } from 'react'
import { Button, TautanLuarTombol } from '../../../components/common/Button'
import { URL_LAPOR } from '../../../utils/ringkasanLapor'

/**
 * F9: isi panel "Teruskan ke LAPOR!": ringkasan siap salin + tautan keluar ke LAPOR!. Tidak ada pengiriman data otomatis.
 * Tombol pembukanya dipasang oleh pemakai (mis. baris aksi di KartuLaporan) atau lewat <TeruskanKeLapor>.
 */
export function PanelTeruskanLapor({ ringkasan, id, className }: { ringkasan: string; id?: string; className?: string }) {
  const [status, setStatus] = useState<'awal' | 'tersalin' | 'gagal'>('awal')
  const idBawaan = useId()
  const idPanel = id ?? idBawaan

  async function salin() {
    try {
      await navigator.clipboard.writeText(ringkasan)
      setStatus('tersalin')
    } catch {
      setStatus('gagal')
    }
  }

  return (
    <div className={`space-y-3 rounded-lg border border-border bg-canvas-soft p-4 ${className ?? ''}`}>
      <p className="text-sm text-ink-muted">
        Tindak lanjut resmi dilakukan lewat LAPOR!. Salin ringkasan ini, lalu tempelkan di formulir pengaduan LAPOR!.
      </p>
      <label className="block text-sm font-medium text-ink" htmlFor={`${idPanel}-teks`}>
        Ringkasan laporan
      </label>
      <textarea
        id={`${idPanel}-teks`}
        readOnly
        value={ringkasan}
        rows={8}
        className="w-full rounded-md border border-border bg-recessed p-3 font-mono text-xs text-ink"
        onFocus={(e) => e.currentTarget.select()}
      />
      <div className="flex flex-wrap gap-2">
        <Button ukuran="sm" onClick={salin}>
          Salin ringkasan
        </Button>
        <TautanLuarTombol href={URL_LAPOR} ukuran="sm">
          Buka lapor.go.id
        </TautanLuarTombol>
      </div>
      <p className="text-xs text-ink-subtle" role="status">
        {status === 'tersalin' && 'Ringkasan sudah disalin.'}
        {status === 'gagal' && 'Gagal menyalin otomatis. Pilih teks di atas lalu salin manual.'}
      </p>
    </div>
  )
}

/** Tombol + panel ringkasan LAPOR! dalam satu komponen. */
export function TeruskanKeLapor({ ringkasan }: { ringkasan: string }) {
  const [terbuka, setTerbuka] = useState(false)
  const idPanel = useId()

  return (
    <div>
      <Button varian="kedua" ukuran="sm" aria-expanded={terbuka} aria-controls={idPanel} onClick={() => setTerbuka((t) => !t)}>
        Teruskan ke LAPOR!
      </Button>
      {terbuka && (
        <div id={idPanel}>
          <PanelTeruskanLapor ringkasan={ringkasan} className="mt-3" />
        </div>
      )}
    </div>
  )
}
