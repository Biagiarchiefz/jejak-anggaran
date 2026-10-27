import { Link } from 'react-router'
import { URL_LAPOR } from '../lib/ringkasanLapor'

type Tautan = { label: string; ke: string }
type Kolom = { judul: string; tautan: Tautan[] }

// Sumber resmi: hanya alamat yang sudah dipastikan. LPSE tidak dicantumkan karena tautannya ada per proyek.
const KOLOM: Kolom[] = [
  {
    judul: 'Jelajahi',
    tautan: [
      { label: 'Beranda', ke: '/' },
      { label: 'Anggaran Kota', ke: '/anggaran' },
      { label: 'Peta Proyek', ke: '/peta' },
      { label: 'Lapor Kondisi', ke: '/peta' },
      { label: 'Masuk', ke: '/masuk' },
    ],
  },
  {
    judul: 'Tentang Data',
    tautan: [
      { label: 'Sumber & Kurasi', ke: '/tentang-data#sumber' },
      { label: 'Aturan “Perlu Perhatian”', ke: '/tentang-data#red-flag' },
      { label: 'Alur Status Laporan', ke: '/tentang-data#status-laporan' },
      { label: 'Keterbatasan Data', ke: '/tentang-data#keterbatasan' },
    ],
  },
  {
    judul: 'Sumber Resmi',
    tautan: [
      { label: 'DJPK Kemenkeu', ke: 'https://djpk.kemenkeu.go.id/' },
      { label: 'SiRUP LKPP', ke: 'https://sirup.lkpp.go.id/' },
      { label: 'Open Data Bandung', ke: 'https://opendata.bandung.go.id/' },
    ],
  },
]

function IkonKeluar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-3.5 shrink-0 opacity-70" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

function TautanFooter({ t }: { t: Tautan }) {
  const kelas = 'inline-flex items-center gap-1.5 text-slate-600 transition-colors hover:text-slate-900'
  if (t.ke.startsWith('http')) {
    return (
      <a href={t.ke} target="_blank" rel="noopener noreferrer" className={kelas}>
        {t.label}
        <IkonKeluar />
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

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-sm">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-12">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/favicon.svg" alt="" className="size-9" />
              <span className="font-medium tracking-wide text-slate-900">JEJAK ANGGARAN</span>
            </Link>
            <p className="mt-4 leading-relaxed text-slate-600">
              Lacak uang publik Kota Bandung: dari anggaran, ke proyek di peta, sampai kondisi nyatanya di lapangan.
            </p>
            <a
              href={URL_LAPOR}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-ui border border-slate-200 bg-white px-4 py-2 font-medium text-slate-900 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
            >
              <span className="size-1.5 rounded-full bg-aksen" aria-hidden />
              Pengaduan resmi via LAPOR!
              <IkonKeluar />
              <span className="sr-only">(membuka tab baru)</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:contents">
            {KOLOM.map((k) => (
              <nav key={k.judul} aria-label={k.judul}>
                <h2 className="font-medium tracking-normal text-slate-900">{k.judul}</h2>
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

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200/80 pt-6 text-xs text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Jejak Anggaran · Situs warga independen, bukan situs resmi Pemerintah Kota Bandung.
            <span className="block md:ml-1 md:inline">
              Tanda “perlu perhatian” bukan tuduhan. Data dikurasi manual dari sumber resmi.
            </span>
          </p>
          <ul className="flex shrink-0 gap-5">
            <li>
              <Link to="/tentang-data#privasi" className="transition-colors hover:text-slate-900">
                Privasi
              </Link>
            </li>
            <li>
              <Link to="/tentang-data#data-demo" className="transition-colors hover:text-slate-900">
                Data Demo
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
