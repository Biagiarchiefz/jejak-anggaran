import { tileDiSekitar, UKURAN_TILE, urlTileOsm } from '../lib/petaTile'

type CuplikanPetaProps = {
  lat: number
  lng: number
  /** Deskripsi untuk pembaca layar, mis. "Peta lokasi proyek di Kec. Coblong". */
  label: string
  /** Kelas warna titik lokasi, mis. `bg-status-selesai`. */
  warnaTitik: string
  perluPerhatian?: boolean
  zoom?: number
}

/**
 * Cuplikan peta statis berpusat di lokasi proyek (tile OpenStreetMap, tanpa Leaflet).
 * Atribusi "© OpenStreetMap" wajib menurut lisensi ODbL sehingga selalu tampil.
 */
export function CuplikanPeta({ lat, lng, label, warnaTitik, perluPerhatian, zoom = 16 }: CuplikanPetaProps) {
  const { tile, titikX, titikY, lebar, tinggi } = tileDiSekitar(lat, lng, zoom)

  return (
    <div role="img" aria-label={label} className="relative size-full overflow-hidden bg-slate-200">
      {/* Grid tile digeser agar titik lokasi berada tepat di tengah wadah. */}
      <div
        className="absolute top-1/2 left-1/2 saturate-[.8]"
        style={{ width: lebar, height: tinggi, transform: `translate(${-titikX}px, ${-titikY}px)` }}
        aria-hidden
      >
        {tile.map((t) => (
          <img
            key={`${t.x}-${t.y}`}
            src={urlTileOsm(zoom, t.x, t.y)}
            alt=""
            width={UKURAN_TILE}
            height={UKURAN_TILE}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute max-w-none select-none"
            style={{ left: t.kiri, top: t.atas, width: UKURAN_TILE, height: UKURAN_TILE }}
          />
        ))}
      </div>

      <span
        className={`absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md ${warnaTitik} ${
          perluPerhatian ? 'border-[3px] border-redflag' : 'border-2 border-white'
        }`}
        aria-hidden
      />

      {/* z-10 agar tetap bisa diklik di atas tautan kartu yang diregangkan. */}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-1.5 bottom-1.5 z-10 rounded-[3px] bg-white/85 px-1.5 py-0.5 text-[10px] leading-none text-slate-700 hover:underline"
      >
        © OpenStreetMap
        <span className="sr-only"> (membuka tab baru)</span>
      </a>
    </div>
  )
}
