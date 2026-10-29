import { Link } from 'react-router'
import { useAdaDataDemo } from '../../hooks/useAdaDataDemo'
import { URL_LAPOR } from '../../utils/ringkasanLapor'

type Tautan = { label: string; ke: string }
type Kolom = { judul: string; tautan: Tautan[] }

// Sumber resmi: hanya alamat yang sudah dipastikan. LPSE tidak dicantumkan karena tautannya ada per proyek.
const KOLOM: Kolom[] = [
  {
    judul: 'Jelajahi',
    tautan: [
      { label: 'Beranda', ke: '/' },
      { label: 'Anggaran kota', ke: '/anggaran' },
      { label: 'Peta proyek', ke: '/peta' },
      { label: 'Laporkan kondisi', ke: '/peta' },
    ],
  },
  {
    judul: 'Data',
    tautan: [
      { label: 'Sumber & kurasi', ke: '/tentang-data#sumber' },
      { label: 'Aturan “perlu perhatian”', ke: '/tentang-data#red-flag' },
      { label: 'Alur status laporan', ke: '/tentang-data#status-laporan' },
      { label: 'Keterbatasan data', ke: '/tentang-data#keterbatasan' },
    ],
  },
  {
    judul: 'Sumber resmi',
    tautan: [
      { label: 'DJPK Kemenkeu', ke: 'https://djpk.kemenkeu.go.id/' },
      { label: 'SiRUP LKPP', ke: 'https://sirup.lkpp.go.id/' },
      { label: 'Open Data Bandung', ke: 'https://opendata.bandung.go.id/' },
    ],
  },
  {
    judul: 'Kontak',
    tautan: [
      { label: 'Pengaduan resmi LAPOR!', ke: URL_LAPOR },
      { label: 'Privasi', ke: '/tentang-data#privasi' },
      { label: 'Data demo', ke: '/tentang-data#data-demo' },
      { label: 'Masuk', ke: '/masuk' },
    ],
  },
]

function TautanFooter({ t }: { t: Tautan }) {
  const kelas = 'text-on-dark-muted transition-colors duration-150 hover:text-white'
  if (t.ke.startsWith('http')) {
    return (
      <a href={t.ke} target="_blank" rel="noopener noreferrer" className={kelas}>
        {t.label} <span aria-hidden>↗</span>
        <span className="sr-only">(membuka tab baru)</span>
      </a>
    )
  }
  return (
    <Link to={t.ke} className={kelas}>
      {t.label}
    </Link>
  )
}

/** DESIGN.md §7.14: latar band-deep, teks on-dark-muted 14px, 4 kolom tautan, baris bawah dipisah garis white/10. */
export function Footer() {
  const adaDemo = useAdaDataDemo()

  return (
    <footer className="bg-band-deep text-sm text-on-dark-muted">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-10">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src="/favicon.svg" alt="" className="size-7" />
              <span className="text-lg font-medium text-white">Jejak Anggaran</span>
            </Link>
            <p className="mt-4 leading-relaxed">
              Lacak uang publik Kota Bandung: dari anggaran, ke proyek di peta, sampai kondisi nyatanya di lapangan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:contents">
            {KOLOM.map((k) => (
              <nav key={k.judul} aria-label={k.judul}>
                <h2 className="text-sm font-medium tracking-normal text-white">{k.judul}</h2>
                <ul className="mt-4 space-y-2.5">
                  {k.tautan.map((t) => (
                    <li key={t.label}>
                      <TautanFooter t={t} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Jejak Anggaran · Situs warga independen, bukan situs resmi Pemerintah Kota Bandung.
            Tanda “perlu perhatian” bukan tuduhan.
          </p>
          <p className="shrink-0">Dibuat untuk WIA MIA 2026</p>
        </div>

        {/* Pengganti label per item: satu catatan data demo, hanya saat ada data demo yang tampil. */}
        {adaDemo && (
          <p className="mt-4 text-xs text-on-dark-muted">
            <span className="font-medium text-white">Catatan data demo:</span> sebagian angka anggaran, proyek, dan laporan
            yang tampil di situs ini adalah data fiktif untuk demonstrasi, bukan data resmi atau laporan warga sungguhan.{' '}
            <Link to="/tentang-data#data-demo" className="font-medium text-brand-light hover:underline">
              Pelajari selengkapnya
            </Link>
          </p>
        )}
      </div>
    </footer>
  )
}
