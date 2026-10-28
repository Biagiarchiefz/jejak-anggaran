import { ArrowRight, Camera, Landmark, MapPin, type LucideIcon } from 'lucide-react'
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

/**
 * "Cara kerja Jejak Anggaran" (DESIGN.md §8): 3 kartu langkah bernomor yang terangkat saat disorot, dengan angka
 * watermark, lencana langkah, dan panah penghubung antarkartu di desktop.
 */
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
          <li
            key={l.judul}
            className="group relative rounded-lg border border-border bg-surface p-6 shadow-card transition-[translate,box-shadow,border-color] duration-300 ease-(--ease-standard) hover:-translate-y-1 hover:border-brand/40 hover:shadow-pop motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7"
          >
            {/* Angka besar transparan di pojok sebagai watermark alur; dipotong oleh pembungkus agar tidak keluar kartu. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg" aria-hidden>
              <span className="absolute -top-3 right-3 text-[112px] leading-none font-semibold tracking-[-0.04em] text-brand/8 tabular-nums transition-colors duration-300 select-none group-hover:text-brand/15">
                {i + 1}
              </span>
              {/* Garis aksen tipis di tepi atas yang menyala saat disorot. */}
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-action transition-transform duration-300 ease-(--ease-standard) group-hover:scale-x-100 motion-reduce:transition-none" />
            </div>

            <div className="relative">
              <span className="grid size-12 place-items-center rounded-lg bg-brand-soft text-action ring-1 ring-brand/15 transition-colors duration-300 group-hover:bg-action group-hover:text-white">
                <l.ikon className="size-6" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="mt-5 inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold tracking-[0.04em] text-action uppercase tabular-nums">
                Langkah {i + 1}
              </span>
              <h3 className="mt-3 text-xl leading-tight font-semibold text-ink-strong">{l.judul}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">{l.isi}</p>
            </div>

            {/* Panah penghubung antarkartu (desktop): menegaskan bahwa ketiganya satu alur berurutan. */}
            {i < LANGKAH.length - 1 && (
              <span
                className="absolute top-1/2 -right-7 z-10 hidden size-8 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface text-action shadow-edge md:grid"
                aria-hidden
              >
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
