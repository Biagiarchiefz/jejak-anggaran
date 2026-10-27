import { ArrowRight } from 'lucide-react'
import { KartuProyek } from './KartuProyek'
import { TautanTombol } from './ui/Button'
import { EmptyState } from './ui/EmptyState'
import { ErrorState } from './ui/ErrorState'
import { JudulSeksi } from './ui/JudulSeksi'
import { LabelSeksi } from './ui/LabelSeksi'
import { PitaPenuh } from './ui/PitaPenuh'
import { Skeleton } from './ui/Skeleton'
import type { StateMuat } from '../hooks/useMuat'
import { pilihProyekSorotan } from '../lib/filterProyek'
import type { ProyekDenganRedFlag } from '../services/proyekService'

const JUMLAH_KARTU = 6

/** "Proyek perlu perhatian" di Beranda: proyek ber-red flag lebih dulu, lalu proyek lain yang dipantau. */
export function SeksiProyek({ proyek }: { proyek: StateMuat<ProyekDenganRedFlag[]> }) {
  const { data, error, memuat, muatUlang } = proyek
  const sorotan = pilihProyekSorotan(data ?? [], JUMLAH_KARTU)

  return (
    <PitaPenuh className="border-y border-border-soft bg-canvas-soft py-16 md:py-24" aria-labelledby="judul-proyek">
      <div data-muncul="" className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[720px]">
          <LabelSeksi>Proyek dipantau</LabelSeksi>
          <JudulSeksi
            id="judul-proyek"
            className="mt-3"
            utama="Proyek perlu perhatian."
            pelengkap="Ditandai otomatis dari laporan warga, bersama proyek lain yang sedang dipantau."
          />
        </div>
        {data && data.length > 0 && (
          <TautanTombol to="/peta" varian="kedua" className="shrink-0 self-start sm:self-auto">
            Lihat {data.length} proyek di peta
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
          </TautanTombol>
        )}
      </div>

      <div className="mt-12">
        {memuat && !data ? (
          <div role="status" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <span className="sr-only">Memuat daftar proyek…</span>
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-96 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <ErrorState pesan={error.pesan} onCobaLagi={muatUlang} />
        ) : sorotan.length === 0 ? (
          <EmptyState judul="Belum ada proyek yang dipantau" pesan="Data proyek sedang dikurasi dari SiRUP dan LPSE Kota Bandung." />
        ) : (
          <ul data-muncul-anak="" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorotan.map((p) => (
              <KartuProyek key={p.id} proyek={p} />
            ))}
          </ul>
        )}
      </div>
    </PitaPenuh>
  )
}
