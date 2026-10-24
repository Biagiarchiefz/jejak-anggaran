import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { LabelSeksi } from './ui/LabelSeksi'
import { JudulSeksi } from './ui/JudulSeksi'
import { RED_FLAG } from '../lib/redFlag'
import { URL_LAPOR } from '../lib/ringkasanLapor'

// Semua foto: Unsplash License (bebas dipakai, atribusi tidak wajib). Sumber tiap foto dicatat di data ini, tidak ditampilkan.
type Foto = { id: string; alt: string; fotografer: string; halaman: string }

type Layanan = {
  judul: string
  isi: string
  /** Path internal, `#anchor` di halaman ini, atau URL eksternal (https://). */
  ke: string
  ikon: ReactNode
  foto: Foto
  unggulan?: boolean
}

const LAYANAN: Layanan[] = [
  {
    judul: 'Dashboard Anggaran',
    isi: 'Total APBD Kota Bandung, pembagian per urusan, dan tren antar tahun.',
    ke: '#anggaran',
    ikon: <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />,
    foto: {
      id: '1762427354397-854a52e0ded7',
      alt: 'Meja dengan kalkulator, grafik, dan pensil',
      fotografer: 'Cht Gsml',
      halaman: 'https://unsplash.com/photos/desk-with-calculator-charts-and-pencil-dspKrJYp644',
    },
  },
  {
    judul: 'Lapor Kondisi Proyek',
    isi: 'Melihat jalan atau fasilitas yang rusak? Pilih proyeknya di peta, lalu kirim foto kondisinya.',
    ke: '/peta',
    unggulan: true,
    ikon: <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Zm13-3a5 5 0 0 1 0 8" />,
    foto: {
      id: '1792297261191-299c05cd9aa8',
      alt: 'Tangan memotret jalan kota yang ramai dengan ponsel',
      fotografer: 'Reza Madani',
      halaman: 'https://unsplash.com/photos/person-photographing-busy-city-street--2dXlY2DuH8',
    },
  },
  {
    judul: 'Peta Proyek Kota',
    isi: 'Proyek beranggaran sebagai titik di peta, bisa disaring per status dan kecamatan.',
    ke: '/peta',
    ikon: <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
    foto: {
      id: '1786876838490-76e288bf04e1',
      alt: 'Pemandangan padatnya Kota Bandung dari ketinggian',
      fotografer: 'Abdul Ridwan',
      halaman: 'https://unsplash.com/photos/hotel-building-overlooking-bandung-city-eTG3fSMkhgc',
    },
  },
  {
    judul: 'Konfirmasi Laporan Warga',
    isi: 'Melihat kondisi yang sama? Konfirmasi laporan warga lain agar suaranya lebih kuat.',
    ke: '/peta',
    ikon: (
      <path d="M15 19.5v-1.25A3.25 3.25 0 0 0 11.75 15h-5.5A3.25 3.25 0 0 0 3 18.25v1.25M9 11.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 8.25v-1.25a3.25 3.25 0 0 0-2.4-3.14M15.6 5.36a3 3 0 0 1 0 5.78" />
    ),
    foto: {
      id: '1754279492625-2fe09a8842e8',
      alt: 'Warga membeli makanan dari pedagang kaki lima di pinggir jalan',
      fotografer: 'Reyhan Aviseno',
      halaman: 'https://unsplash.com/photos/people-are-buying-food-from-a-street-vendor-bGAvuns_V0E',
    },
  },
  {
    judul: 'Tanda Perlu Perhatian',
    isi: `Proyek selesai dengan ${RED_FLAG.ambangLaporan} atau lebih laporan kerusakan terverifikasi dalam ${RED_FLAG.jendelaHari} hari ditandai otomatis.`,
    ke: '/tentang-data#red-flag',
    ikon: <path d="M5 21V4m0 0h11l-2 4 2 4H5" />,
    foto: {
      id: '1657811146442-0d66d65dbe92',
      alt: 'Lubang berisi genangan air di permukaan aspal',
      fotografer: 'ACatInABox',
      halaman: 'https://unsplash.com/photos/a-muddy-area-with-a-hole-in-it-g9gr38rDrlA',
    },
  },
  {
    judul: 'Riwayat Status Terbuka',
    isi: 'Setiap perubahan status laporan tercatat: kapan, oleh siapa, dan apa catatannya.',
    ke: '/tentang-data#status-laporan',
    ikon: <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    foto: {
      id: '1768055105012-4c53791b2877',
      alt: 'Tangan mencentang daftar tugas di buku catatan',
      fotografer: 'Jakub Żerdzicki',
      halaman: 'https://unsplash.com/photos/hand-checking-off-items-on-a-to-do-list-fXlL5I0IvK0',
    },
  },
  {
    judul: 'Teruskan ke LAPOR!',
    isi: 'Ringkasan laporan siap salin untuk kanal pengaduan resmi pemerintah.',
    ke: URL_LAPOR,
    ikon: <path d="m21 3-10 10M21 3l-6.5 18-3.5-8-8-3.5L21 3Z" />,
    foto: {
      id: '1758874573138-f3dd1ed25c7e',
      alt: 'Tangan mengetik di keyboard laptop',
      fotografer: 'Vitaly Gariev',
      halaman: 'https://unsplash.com/photos/hands-typing-on-a-laptop-computer-keyboard-AnB0zwEeuYU',
    },
  },
  {
    judul: 'Sumber & Keterbatasan Data',
    isi: 'Dari mana setiap angka berasal, kapan diakses, dan apa saja batasannya.',
    ke: '/tentang-data#sumber',
    ikon: (
      <path d="M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3Zm0 0v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    ),
    foto: {
      id: '1768158989131-64cbff67f292',
      alt: 'Rak berisi deretan map dan binder arsip',
      fotografer: 'Richard Heinen',
      halaman: 'https://unsplash.com/photos/shelves-filled-with-colorful-binders-and-folders-vT7r4YYbX0w',
    },
  },
]

const urlFoto = (id: string, lebar: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${lebar}&ar=16:10`

/** Tautan judul yang diregangkan menutupi seluruh kartu, sehingga kartu bisa diklik di mana saja. */
function TautanKartu({ ke, children }: { ke: string; children: ReactNode }) {
  const kelas = 'after:absolute after:inset-0 after:rounded-ui focus-visible:outline-none'
  if (ke.startsWith('http')) {
    return (
      <a href={ke} target="_blank" rel="noopener noreferrer" className={kelas}>
        {children}
        <span className="sr-only"> (membuka tab baru)</span>
      </a>
    )
  }
  if (ke.startsWith('#')) {
    return (
      <a href={ke} className={kelas}>
        {children}
      </a>
    )
  }
  return (
    <Link to={ke} className={kelas}>
      {children}
    </Link>
  )
}

function KartuLayanan({ layanan: l, urutan }: { layanan: Layanan; urutan: number }) {
  const u = l.unggulan
  return (
    <li
      className={`group relative flex flex-col rounded-ui px-5 pt-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-offset-2 motion-reduce:hover:translate-y-0 ${
        u
          ? 'bg-merek-800 text-white shadow-lg shadow-merek-900/20 focus-within:ring-merek-700'
          : 'border border-slate-200/80 bg-white shadow-sm focus-within:ring-merek-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className={`text-lg leading-snug font-medium ${u ? 'text-white' : 'text-slate-900'}`}>
            <TautanKartu ke={l.ke}>{l.judul}</TautanKartu>
          </h3>
        </div>
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-ui transition-colors duration-300 ${
            u ? 'bg-white text-merek-800' : 'bg-slate-100 text-merek-800 group-hover:bg-merek-800 group-hover:text-white'
          }`}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-5 transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
      </div>
      <p className={`mt-2 mb-5 text-sm leading-relaxed ${u ? 'text-merek-100' : 'text-slate-600'}`}>{l.isi}</p>

      {/* Foto menempel ke tepi bawah kartu: tanpa padding bawah, sudut bawah tidak dibulatkan. */}
      <div className="relative mt-auto overflow-hidden rounded-t-ui bg-slate-200">
        <img
          src={urlFoto(l.foto.id, 600)}
          srcSet={`${urlFoto(l.foto.id, 400)} 400w, ${urlFoto(l.foto.id, 600)} 600w, ${urlFoto(l.foto.id, 800)} 800w`}
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
          alt={l.foto.alt}
          loading="lazy"
          decoding="async"
          width={600}
          height={375}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        <span
          className={`absolute bottom-3 left-3 flex size-11 items-center justify-center rounded-ui shadow-md ring-4 ring-white/60 ${
            u ? 'bg-aksen text-merek-900' : urutan % 2 === 0 ? 'bg-merek-800 text-white' : 'bg-emerald-600 text-white'
          }`}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="size-5">
            {l.ikon}
          </svg>
        </span>
      </div>
    </li>
  )
}

export function SeksiLayanan() {
  return (
    <section aria-labelledby="judul-layanan">
      <header className="mx-auto max-w-3xl text-center">
        <LabelSeksi>Fitur Jejak Anggaran</LabelSeksi>
        <JudulSeksi
          id="judul-layanan"
          className="mt-3"
          utama="Satu tempat untuk memantau, melapor, dan mengawasi uang publik."
          pelengkap="Setiap fitur terhubung ke data bersumber resmi."
        />
      </header>

      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LAYANAN.map((l, i) => (
          <KartuLayanan key={l.judul} layanan={l} urutan={i} />
        ))}
      </ul>

    </section>
  )
}
