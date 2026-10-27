import { Camera, Landmark, MapPin, type LucideIcon } from 'lucide-react'
import { JudulSeksi } from './ui/JudulSeksi'
import { LabelSeksi } from './ui/LabelSeksi'

const LANGKAH: { judul: string; isi: string; ikon: LucideIcon }[] = [
  {
    judul: 'Lihat anggarannya',
    isi: 'Total APBD Kota Bandung dan pembagiannya per urusan, lengkap dengan sumber resmi dan tanggal aksesnya.',
    ikon: Landmark,
  },
  {
    judul: 'Temukan proyeknya di peta',
    isi: 'Setiap paket proyek beranggaran tampil sebagai titik di peta, dengan pagu, pelaksana, dan statusnya.',
    ikon: MapPin,
  },
  {
    judul: 'Laporkan kondisi nyatanya',
    isi: 'Kirim foto kondisi di lapangan atau konfirmasi laporan warga lain. Identitas pelapor tidak pernah tampil.',
    ikon: Camera,
  },
]

/** "Cara kerja Jejak Anggaran" (DESIGN.md §8): 3 kartu langkah bernomor. */
export function SeksiCaraKerja() {
  return (
    <section aria-labelledby="judul-cara-kerja" className="py-16 md:py-24">
      <div data-muncul="" className="max-w-[720px]">
        <LabelSeksi>Cara kerja</LabelSeksi>
        <JudulSeksi
          id="judul-cara-kerja"
          className="mt-3"
          utama="Dari anggaran ke kondisi di lapangan."
          pelengkap="Tiga langkah untuk mengikuti uang publik."
        />
      </div>

      <ol data-muncul-anak="" className="mt-12 grid gap-6 md:grid-cols-3">
        {LANGKAH.map((l, i) => (
          <li key={l.judul} className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-md bg-brand-soft text-action">
                <l.ikon className="size-6" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="text-sm font-medium text-ink-subtle tabular-nums">Langkah {i + 1}</span>
            </div>
            <h3 className="mt-5 text-xl leading-[1.25] font-semibold">{l.judul}</h3>
            <p className="mt-2 text-ink-muted">{l.isi}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
