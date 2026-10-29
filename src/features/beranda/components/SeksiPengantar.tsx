import { useId } from 'react'
import { LabelSeksi } from '../../../components/common/LabelSeksi'
import { JudulSeksi } from '../../../components/common/JudulSeksi'

// Semua foto: Unsplash License (bebas dipakai, atribusi tidak wajib). Sumber tiap foto dicatat di data ini, tidak ditampilkan.
// Foto ilustrasi, bukan dokumentasi kegiatan Jejak Anggaran, sehingga tanpa keterangan foto (agar tidak
// terbaca sebagai klaim proyek nyata). Deskripsi tetap ada di alt.
type FotoKolase = {
  id: string
  alt: string
  fotografer: string
  halaman: string
  /** Fokus potongan foto (object-position) agar subjek tetap terlihat. */
  fokus?: string
}

const KOTA_BANDUNG: FotoKolase = {
  id: '1744343934252-b881283a9308',
  alt: 'Jalan raya di depan tulisan Alun-Alun Bandung yang dinaungi pepohonan',
  fotografer: 'Abdul Ridwan',
  halaman: 'https://unsplash.com/photos/the-city-sign-welcomes-visitors-to-bandung-kR3B5nwgEDM',
  fokus: 'object-[70%_center]',
}
const MEMERIKSA_DOKUMEN: FotoKolase = {
  id: '1775163024488-e88e4a71179f',
  alt: 'Dua orang memeriksa dokumen di atas meja',
  fotografer: 'Olena Kholina',
  halaman: 'https://unsplash.com/photos/two-people-reviewing-documents-at-a-table-MhqUBTxQ3Hw',
}
const PEKERJAAN_JALAN: FotoKolase = {
  id: '1665631154001-5f921d61a1a8',
  alt: 'Pekerja berompi keselamatan memperbaiki jalan',
  fotografer: 'nanang adi',
  halaman: 'https://unsplash.com/photos/a-group-of-men-wearing-safety-vests-working-on-a-road-U6U5OCxZ5cM',
  fokus: 'object-[65%_center]',
}
const DISKUSI_BERSAMA: FotoKolase = {
  id: '1672917187338-7f81ecac3d3f',
  alt: 'Sekelompok orang berdiskusi di sekitar meja putih',
  fotografer: 'Edi Kurniawan',
  halaman: 'https://unsplash.com/photos/a-group-of-people-sitting-around-a-white-table-Mq4wJuX1-OQ',
}
const PROYEK_INFRASTRUKTUR: FotoKolase = {
  id: '1523252284915-bbd9e33fdf13',
  alt: 'Tiga pekerja membangun saluran di tepi jalan pada siang hari',
  fotografer: 'Artem Beliaikin',
  halaman: 'https://unsplash.com/photos/three-men-constructing-road-during-daytime-A0GRntzimIs',
  fokus: 'object-[60%_center]',
}
const MEMOTRET_JALAN: FotoKolase = {
  id: '1792297261191-299c05cd9aa8',
  alt: 'Tangan memotret jalan kota yang ramai dengan ponsel',
  fotografer: 'Reza Madani',
  halaman: 'https://unsplash.com/photos/person-photographing-busy-city-street--2dXlY2DuH8',
}

// Ikon garis kecil (viewBox 24) untuk alur.
const ikon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden>
    <path d={d} />
  </svg>
)
const IKON_PIN = ikon('M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z')
const IKON_KOIN = ikon('M12 8.5c3.9 0 7-1.3 7-2.8S15.9 3 12 3 5 4.2 5 5.7s3.1 2.8 7 2.8ZM5 5.7v5.6c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V5.7M5 11.3v5.6c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-5.6')
const IKON_KAMERA = ikon('M4 8h3l1.5-2.5h7L17 8h3v11H4V8Zm8 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z')

/**
 * Kolase bertingkat: tepi atas foto sengaja tidak sejajar. Ponsel: grid 2 kolom dengan rasio tetap.
 * Desktop (lg): grid 12 kolom. Baris 1 (tinggi tetap) dan baris 2 (auto, ikut tinggi teks) membuat
 * foto tengah mulai di samping teks; baris berikutnya berukuran tetap untuk posisi foto lainnya.
 *   Teks (c1-6, r1-2)           | Pekerjaan jalan (c7-9, mulai r2) | ornamen cincin, lalu Dokumen (c10-12)
 *   Diskusi (c1-3) · Kota Bandung (c4-6), sedikit lebih rendah dari foto kanan
 *   kosong (c1-3) · Infrastruktur (c4-7) · Memotret jalan (c8-10), tepi atas sejajar
 * Urutan di sini = urutan di ponsel.
 */
const SUSUNAN: { foto: FotoKolase; posisi: string; lebarPonsel: '50vw' | '100vw' }[] = [
  {
    foto: KOTA_BANDUNG,
    posisi: 'col-span-2 aspect-[16/10] sm:aspect-[2/1] lg:col-start-4 lg:col-end-7 lg:row-start-5 lg:row-end-18',
    lebarPonsel: '100vw',
  },
  {
    foto: PEKERJAAN_JALAN,
    posisi: 'aspect-[3/4] lg:col-start-7 lg:col-end-10 lg:row-start-2 lg:row-end-18',
    lebarPonsel: '50vw',
  },
  {
    foto: MEMERIKSA_DOKUMEN,
    posisi: 'aspect-[3/4] lg:col-start-10 lg:col-end-13 lg:row-start-3 lg:row-end-17',
    lebarPonsel: '50vw',
  },
  {
    foto: DISKUSI_BERSAMA,
    posisi: 'aspect-square lg:col-start-1 lg:col-end-4 lg:row-start-6 lg:row-end-18',
    lebarPonsel: '50vw',
  },
  {
    foto: MEMOTRET_JALAN,
    posisi: 'aspect-square lg:col-start-8 lg:col-end-11 lg:row-start-19 lg:row-end-28',
    lebarPonsel: '50vw',
  },
  {
    foto: PROYEK_INFRASTRUKTUR,
    posisi: 'col-span-2 aspect-[16/10] sm:aspect-[2/1] lg:col-start-4 lg:col-end-8 lg:row-start-19 lg:row-end-31',
    lebarPonsel: '100vw',
  },
]

const urlFoto = (id: string, lebar: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${lebar}`

function KartuFoto({ f, posisi, lebarPonsel }: Omit<(typeof SUSUNAN)[number], 'foto'> & { f: FotoKolase }) {
  return (
    <div className={`group relative overflow-hidden rounded-ui bg-slate-200 shadow-sm ring-1 ring-slate-900/5 lg:aspect-auto ${posisi}`}>
      {/* img absolut agar ukuran aslinya tidak ikut membesarkan baris auto di grid desktop. */}
      <img
        src={urlFoto(f.id, 600)}
        srcSet={`${urlFoto(f.id, 400)} 400w, ${urlFoto(f.id, 600)} 600w, ${urlFoto(f.id, 900)} 900w`}
        sizes={`(min-width: 1024px) 400px, ${lebarPonsel}`}
        alt={f.alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none ${f.fokus ?? ''}`}
      />
    </div>
  )
}

/** Alur singkat di bawah teks pengantar: anggaran → proyek di peta → kondisi nyata. */
const ALUR = [
  { label: 'Anggaran', ikon: IKON_KOIN },
  { label: 'Proyek di peta', ikon: IKON_PIN },
  { label: 'Kondisi nyata', ikon: IKON_KAMERA },
]

function Alur() {
  return (
    // Di ponsel daftar bisa terlipat, jadi panah penghubung baru tampil mulai sm.
    <ol className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 sm:gap-x-2" aria-label="Alur uang publik">
      {ALUR.map((a, i) => (
        <li key={a.label} className="flex items-center gap-2">
          {i > 0 && (
            <svg viewBox="0 0 32 8" className="hidden h-2 w-8 text-slate-300 sm:block" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden>
              <path d="M1 4h26" strokeDasharray="2 3" />
              <path d="m27 1 3 3-3 3" />
            </svg>
          )}
          <span className="grid size-7 place-items-center rounded-ui bg-white text-merek-700 shadow-sm ring-1 ring-slate-200/80">{a.ikon}</span>
          {a.label}
        </li>
      ))}
    </ol>
  )
}

/*
 * Ornamen latar (SVG inline, aria-hidden, pointer-events-none, di belakang konten lewat -z-10).
 * Warna: titik slate, cahaya navy muda, cincin emas (aksen hanya untuk dekorasi).
 */

/** Pola titik yang memudar ke tepi, di belakang sisi kanan kolase. Ukuran ubin tetap (px) agar titik tidak ikut melar. */
function PolaTitik() {
  const id = useId()
  return (
    <svg aria-hidden className="pointer-events-none absolute top-0 right-0 -z-10 h-full w-full sm:w-3/4">
      <defs>
        <pattern id={`${id}-titik`} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="var(--color-slate-300)" />
        </pattern>
        <radialGradient id={`${id}-pudar`} cx="65%" cy="35%" r="65%">
          <stop offset="0" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-topeng`}>
          <rect width="100%" height="100%" fill={`url(#${id}-pudar)`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-titik)`} mask={`url(#${id}-topeng)`} />
    </svg>
  )
}

/** Cahaya gradien lembut di balik bagian tengah kolase. Sengaja melar (preserveAspectRatio none) menjadi elips. */
function Cahaya() {
  const id = useId()
  return (
    <svg aria-hidden viewBox="0 0 600 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-3/4 w-full">
      <defs>
        <radialGradient id={id} cx="55%" cy="45%" r="50%">
          <stop offset="0" stopColor="var(--color-merek-200)" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="var(--color-merek-100)" stopOpacity="0.25" />
          <stop offset="1" stopColor="var(--color-merek-100)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill={`url(#${id})`} />
    </svg>
  )
}

/** Cincin konsentris emas di pojok kanan atas yang kosong (desktop). */
function OrnamenCincin() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 160"
      preserveAspectRatio="xMaxYMid meet"
      className="pointer-events-none absolute inset-0 -z-10 hidden size-full lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-3 lg:block"
      fill="none"
      stroke="var(--color-aksen)"
    >
      <circle cx="140" cy="80" r="26" strokeOpacity="0.55" />
      <circle cx="140" cy="80" r="44" strokeOpacity="0.35" strokeDasharray="2 5" strokeLinecap="round" />
      <circle cx="140" cy="80" r="62" strokeOpacity="0.2" />
      <circle cx="140" cy="80" r="4" fill="var(--color-aksen)" stroke="none" />
      <circle cx="96" cy="80" r="3.5" fill="var(--color-merek-600)" stroke="none" />
      <circle cx="184" cy="38" r="3" fill="var(--color-aksen)" stroke="none" fillOpacity="0.7" />
    </svg>
  )
}

export function SeksiPengantar() {
  return (
    <section aria-labelledby="judul-fokus" className="space-y-20 lg:space-y-28">
      {/* Bagian atas: teks kiri atas, kolase bertingkat di bawah dan sampingnya, ornamen SVG di belakang */}
      <div className="relative isolate grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-[4rem_auto_repeat(28,16px)] lg:gap-x-6 lg:gap-y-0 xl:grid-rows-[5rem_auto_repeat(28,20px)]">
        <PolaTitik />
        <Cahaya />
        <OrnamenCincin />

        <div className="col-span-2 mb-5 lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-3 lg:mb-0 lg:pb-6">
          <JudulSeksi
            as="p"
            utama="Setiap rupiah uang publik Kota Bandung layak diikuti warga, dari APBD sampai kondisi nyatanya di lapangan."
            pelengkap="Terbuka, bersumber resmi, dan diperiksa bersama."
          />
          <Alur />
        </div>

        {SUSUNAN.map(({ foto, ...sisa }) => (
          <KartuFoto key={foto.id} f={foto} {...sisa} />
        ))}
      </div>

      {/* Bagian bawah: dua kolom fokus */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <LabelSeksi>Fokus kami</LabelSeksi>
          <JudulSeksi
            id="judul-fokus"
            className="mt-3"
            utama="Keterbukaan anggaran yang akuntabel."
            pelengkap="Mudah dipahami warga."
          />
        </div>
        <div className="space-y-5">
          {/* Paragraf utama bergaya heading (satu tingkat di bawah judul kiri), paragraf kedua teks biasa. */}
          <p className="text-xl leading-snug font-medium tracking-tight text-balance text-slate-900 sm:text-2xl">
            Data anggaran sudah terbuka, tetapi tersebar dan tidak terhubung ke kondisi lapangan. Jejak Anggaran
            menyatukannya: setiap angka bersumber resmi, setiap proyek ada di peta, dan setiap laporan bisa diperiksa
            bersama.
          </p>
          <p className="leading-relaxed text-slate-600">
            Semangat kami sejalan dengan Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik: informasi
            anggaran adalah hak warga. Kami tidak mengelola data kependudukan. Identitas pelapor tidak pernah tampil di halaman
            publik, data lokasi GPS di foto dihapus otomatis sebelum diunggah, dan tindak lanjut resmi tetap melalui LAPOR!.
          </p>
        </div>
      </div>
    </section>
  )
}
