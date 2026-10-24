import { Link } from 'react-router'
import { KartuProyek } from './KartuProyek'
import { EmptyState } from './ui/EmptyState'
import { ErrorState } from './ui/ErrorState'
import { JudulSeksi } from './ui/JudulSeksi'
import { LabelSeksi } from './ui/LabelSeksi'
import { Skeleton } from './ui/Skeleton'
import { useProyekList } from '../hooks/useProyekList'
import { pilihProyekSorotan } from '../lib/filterProyek'

const JUMLAH_KARTU = 6

/** Seksi Beranda yang menampilkan proyek nyata (bukan daftar fitur): langsung ke isi. */
export function SeksiProyek() {
  const { data, error, memuat, muatUlang } = useProyekList()
  const sorotan = pilihProyekSorotan(data ?? [], JUMLAH_KARTU)

  return (
    <section aria-labelledby="judul-proyek">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <LabelSeksi>Proyek dipantau</LabelSeksi>
          <JudulSeksi
            id="judul-proyek"
            className="mt-3"
            utama="Proyek beranggaran di Kota Bandung."
            pelengkap="Pilih proyek untuk melihat pagu, pelaksana, dan laporan warga."
          />
        </div>
        {data && data.length > 0 && (
          <Link
            to="/peta"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-merek-800 hover:text-merek-900"
          >
            <span className="underline decoration-merek-200 underline-offset-4 transition-colors group-hover:decoration-merek-800">
              Lihat semua {data.length} proyek di peta
            </span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
              →
            </span>
          </Link>
        )}
      </div>

      <div className="mt-10">
        {memuat && !data ? (
          <div role="status" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <span className="sr-only">Memuat daftar proyek…</span>
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-60 rounded-ui" />
            ))}
          </div>
        ) : error ? (
          <ErrorState pesan={error.pesan} onCobaLagi={muatUlang} />
        ) : sorotan.length === 0 ? (
          <EmptyState judul="Belum ada proyek yang dipantau" pesan="Data proyek sedang dikurasi dari SiRUP dan LPSE Kota Bandung." />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorotan.map((p) => (
              <KartuProyek key={p.id} proyek={p} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
