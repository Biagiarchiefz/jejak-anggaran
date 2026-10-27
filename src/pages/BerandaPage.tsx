import { HeroBanner, type FotoLatar } from '../components/HeroBanner'
import { SeksiAnggaran } from '../components/SeksiAnggaran'
import { SeksiProyek } from '../components/SeksiProyek'
import { SeksiPengantar } from '../components/SeksiPengantar'
import { TautanTombol } from '../components/ui/Button'

// Petugas penyapu jalan di Bandung. Abdul Ridwan (@abdulridwanrr), Unsplash License.
const ID_FOTO_HERO = '1744343933200-c858f07e6407'
const urlFotoHero = (lebar: number) => `https://images.unsplash.com/photo-${ID_FOTO_HERO}?auto=format&fit=crop&q=70&w=${lebar}`
const FOTO_HERO: FotoLatar = {
  src: urlFotoHero(1280),
  srcSet: [828, 1280, 1920].map((w) => `${urlFotoHero(w)} ${w}w`).join(', '),
}

export default function BerandaPage() {
  return (
    <div>
      <title>Jejak Anggaran — Kota Bandung</title>
      {/* Hero lebih lebar dari kontainer standar: maks 86rem (sejajar Navbar), jarak 1rem dari tepi layar.
          Margin negatif = selisih lebar; 100cqw = lebar halaman tanpa scrollbar (@container di Layout). */}
      <div className="mx-[calc((100%_-_min(100cqw_-_2rem,86rem))/2)]">
        <HeroBanner
          judul="Uang Publik Kota Bandung: Terbuka, Terlacak, & Diawasi Warga"
          deskripsi="Lacak anggaran daerah, temukan proyeknya di peta, lalu lihat kondisi nyatanya di lapangan berdasarkan laporan warga."
          aksi={
            <>
              <TautanTombol to="/peta" varian="terang">
                Buka peta proyek
              </TautanTombol>
              <TautanTombol to="/anggaran" varian="garisTerang">
                Lihat anggaran kota
              </TautanTombol>
            </>
          }
          remah={[{ label: 'Beranda' }]}
          foto={FOTO_HERO}
        />
      </div>

      {/* Jarak antar seksi lega (pt-20 s.d. pt-28) agar halaman terasa lapang. */}
      <div className="pt-20 lg:pt-28">
        <SeksiPengantar />
      </div>

      {/* Urutan mengikuti alur uang publik: anggaran → proyek di lapangan. */}
      <div className="pt-20 lg:pt-28">
        <SeksiAnggaran />
      </div>

      <div className="pt-20 lg:pt-28">
        <SeksiProyek />
      </div>
    </div>
  )
}
