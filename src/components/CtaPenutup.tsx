import { TautanTombol } from './ui/Button'
import { urlFotoUnsplash } from '../lib/fotoIlustrasi'

// Tangan memotret jalan kota yang ramai dengan ponsel. Reza Madani, Unsplash License (atribusi tidak wajib):
// https://unsplash.com/photos/person-photographing-busy-city-street--2dXlY2DuH8
const ID_FOTO_LATAR = '1792297261191-299c05cd9aa8'

/**
 * CTA penutup (DESIGN.md §7.14): blok band di dalam kontainer (tidak selebar layar), judul putih rata tengah,
 * satu kalimat, tombol terang + tombol outline. Latarnya foto dengan lapisan band polos (tanpa gradien)
 * agar teks putih tetap kontras. Diberi jarak ke footer.
 */
export function CtaPenutup() {
  return (
    <section
      data-muncul=""
      aria-labelledby="judul-cta"
      className="relative isolate mb-16 overflow-hidden rounded-lg bg-band px-6 py-16 text-center sm:px-10 md:mb-24 md:py-24"
    >
      <div className="absolute inset-0 -z-10" aria-hidden>
        <img
          src={urlFotoUnsplash(ID_FOTO_LATAR, 1280)}
          srcSet={[828, 1280, 1920].map((w) => `${urlFotoUnsplash(ID_FOTO_LATAR, w)} ${w}w`).join(', ')}
          sizes="(min-width: 1280px) 1216px, 100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-band/80" />
      </div>

      <h2
        id="judul-cta"
        className="mx-auto max-w-3xl text-[28px] leading-[1.12] font-medium tracking-[-0.015em] text-balance text-white md:text-[40px]"
      >
        Melihat proyek yang tidak sesuai di sekitar Anda?
      </h2>
      <p className="mx-auto mt-4 max-w-[720px] text-lg text-on-dark-muted">
        Temukan proyeknya di peta, lalu laporkan kondisinya dengan foto. Laporan bisa diteruskan ke LAPOR!.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <TautanTombol to="/peta" varian="terang">
          Laporkan kondisi
        </TautanTombol>
        <TautanTombol to="/tentang-data" varian="garisTerang">
          Pelajari datanya
        </TautanTombol>
      </div>
    </section>
  )
}
