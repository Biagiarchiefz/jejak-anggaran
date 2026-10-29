import { tileDiSekitar, UKURAN_TILE, urlTileOsm } from '../../../utils/petaTile'

type CuplikanPetaProps = {
  lat: number
  lng: number
  /** Deskripsi untuk pembaca layar, mis. "Peta lokasi proyek di Kec. Coblong". */
  label: string
  /** Pin red flag: merah dan sedikit lebih besar (DESIGN.md §7.10). */
  perluPerhatian?: boolean
  zoom?: number
}

/**
 * Cuplikan peta statis berpusat di lokasi proyek (tile OpenStreetMap, tanpa Leaflet).
 * Atribusi "© OpenStreetMap" wajib menurut lisensi ODbL sehingga selalu tampil.
 */
export function CuplikanPeta({ lat, lng, label, perluPerhatian, zoom = 16 }: CuplikanPetaProps) {
  const { tile, titikX, titikY, lebar, tinggi } = tileDiSekitar(lat, lng, zoom)

  return (
    <div role="img" aria-label={label} className="relative size-full overflow-hidden bg-recessed">
      {/* Grid tile digeser agar titik lokasi berada tepat di tengah wadah. Tile dibuat kalem agar pin menonjol. */}
      <div
        className="absolute top-1/2 left-1/2 brightness-[1.03] saturate-[.6]"
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
        className={`absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-white shadow-pop ${
          perluPerhatian ? 'size-6 bg-danger' : 'size-5 bg-brand'
        }`}
        aria-hidden
      >
        <span className="size-1.5 rounded-full bg-white" />
      </span>

      {/* z-10 agar tetap bisa diklik di atas tautan kartu yang diregangkan. */}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-1.5 bottom-1.5 z-10 rounded-sm bg-surface/90 px-1.5 py-0.5 text-[10px] leading-none text-ink-muted hover:underline"
      >
        © OpenStreetMap
        <span className="sr-only"> (membuka tab baru)</span>
      </a>
    </div>
  )
}
