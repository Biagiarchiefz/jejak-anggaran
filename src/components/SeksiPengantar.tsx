import { LabelSeksi } from './ui/LabelSeksi'
import { JudulSeksi } from './ui/JudulSeksi'

// Semua foto: Unsplash License (bebas dipakai, atribusi tidak wajib). Sumber tiap foto dicatat di data ini, tidak ditampilkan.
// Foto ilustrasi, bukan dokumentasi kegiatan Jejak Anggaran, sehingga sengaja tanpa label/keterangan
// di atas foto (agar tidak terbaca sebagai klaim proyek nyata). Deskripsi tetap ada di alt.
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

/**
 * Kolase tersebar. Ponsel: grid 2 kolom dengan rasio tetap. Desktop (lg): grid 12 kolom x 8 baris
 * dengan posisi eksplisit. Tidak ada celah di tengah; hanya pojok kanan atas yang sengaja kosong
 * (foto kanan digeser turun) agar susunannya tetap dinamis. Tanpa tombol: ajakan bertindak sudah
 * ada di hero dan kartu fitur di bawah, seksi ini fokus membangun konteks.
 *   xl: Teks (c1-5, r1-3)       | Kota Bandung (c6-9, r1-3)   | kosong r1, Pekerjaan jalan (c10-12, r2-5)
 *       Diskusi (c1-3, r4-8) | Infrastruktur (c4-9, r4-8)     | Dokumen (c10-12, r6-8)
 *   lg: teks lebih sempit sehingga lebih tinggi (r1-4); Kota Bandung r1-4, Diskusi & Infrastruktur mulai r5.
 * Urutan di sini = urutan di ponsel (dua foto vertikal berdampingan, lalu dua foto persegi).
 */
const SUSUNAN: { foto: FotoKolase; posisi: string }[] = [
  { foto: KOTA_BANDUNG, posisi: 'col-span-2 aspect-[16/10] lg:col-start-6 lg:col-end-10 lg:row-start-1 lg:row-end-5 xl:row-end-4' },
  { foto: PEKERJAAN_JALAN, posisi: 'aspect-[3/4] lg:col-start-10 lg:col-end-13 lg:row-start-2 lg:row-end-6' },
  { foto: MEMERIKSA_DOKUMEN, posisi: 'aspect-[3/4] lg:col-start-10 lg:col-end-13 lg:row-start-6 lg:row-end-9' },
  { foto: DISKUSI_BERSAMA, posisi: 'aspect-square lg:col-start-1 lg:col-end-4 lg:row-start-5 lg:row-end-9 xl:row-start-4' },
  { foto: PROYEK_INFRASTRUKTUR, posisi: 'aspect-square lg:col-start-4 lg:col-end-10 lg:row-start-5 lg:row-end-9 xl:row-start-4' },
]

const urlFoto = (id: string, lebar: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${lebar}`

function KartuFoto({ f, posisi }: { f: FotoKolase; posisi: string }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-ui border border-slate-200/80 bg-slate-200 shadow-md lg:aspect-auto ${posisi}`}
    >
      <img
        src={urlFoto(f.id, 600)}
        srcSet={`${urlFoto(f.id, 400)} 400w, ${urlFoto(f.id, 600)} 600w, ${urlFoto(f.id, 900)} 900w`}
        sizes="(min-width: 1024px) 400px, 50vw"
        alt={f.alt}
        loading="lazy"
        decoding="async"
        className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none ${f.fokus ?? ''}`}
      />
    </div>
  )
}

export function SeksiPengantar() {
  return (
    <section aria-labelledby="judul-fokus" className="space-y-20 lg:space-y-28">
      {/* Bagian atas: teks kiri atas, kolase tersebar mengisi sisanya */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[72px] lg:grid-cols-12">
        <div className="col-span-2 mb-5 lg:col-start-1 lg:col-end-6 lg:row-start-1 lg:row-end-5 lg:mb-0 xl:row-end-4">
          <JudulSeksi
            as="p"
            utama="Setiap rupiah uang publik Kota Bandung layak diikuti warga, dari APBD sampai kondisi nyatanya di lapangan."
            pelengkap="Terbuka, bersumber resmi, dan diperiksa bersama."
          />
        </div>

        {SUSUNAN.map(({ foto, posisi }) => (
          <KartuFoto key={foto.id} f={foto} posisi={posisi} />
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
