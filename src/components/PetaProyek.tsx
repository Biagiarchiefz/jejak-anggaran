import 'leaflet/dist/leaflet.css'
import { useEffect, useEffectEvent, useRef, type RefObject } from 'react'
import { divIcon, latLngBounds, type DivIcon, type Marker as PenandaLeaflet } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { IkonPin, KartuPin } from './KartuPinProyek'
import { BATAS_KOTA_BANDUNG, PUSAT_KOTA_BANDUNG } from '../lib/wilayah'
import type { ProyekDenganRedFlag } from '../services/proyekService'

type KeadaanPin = 'biasa' | 'disorot' | 'terpilih'

// Jalur ikon lucide `MapPin` (sama dengan <IkonPin> di hero), ditulis sebagai string karena ikon Leaflet berupa HTML.
const SVG_PIN =
  '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>' +
  '<circle cx="12" cy="10" r="3"/></svg>'

const cacheIkon = new Map<string, DivIcon>()
/** Ikon pin Leaflet: ujung bawah pin tepat di koordinat proyek. Warna & ukuran per keadaan diatur di index.css (`.pin-peta`). */
function ikonPin(perluPerhatian: boolean, keadaan: KeadaanPin): DivIcon {
  const kunci = `${perluPerhatian}-${keadaan}`
  let ikon = cacheIkon.get(kunci)
  if (!ikon) {
    ikon = divIcon({
      className: `pin-peta ${perluPerhatian ? 'pin-peta-merah' : ''} pin-peta-${keadaan}`,
      html: SVG_PIN,
      iconSize: [32, 32],
      iconAnchor: [16, 31],
      popupAnchor: [0, -40],
    })
    cacheIkon.set(kunci, ikon)
  }
  return ikon
}

const MARGIN = 0.05
const BATAS_PETA: [[number, number], [number, number]] = [
  [BATAS_KOTA_BANDUNG.latMin - MARGIN, BATAS_KOTA_BANDUNG.lngMin - MARGIN],
  [BATAS_KOTA_BANDUNG.latMaks + MARGIN, BATAS_KOTA_BANDUNG.lngMaks + MARGIN],
]
const ZOOM_FOKUS = 14

/** Permintaan memusatkan peta ke satu proyek. `n` naik setiap kali diminta, jadi proyek yang sama bisa difokuskan ulang. */
export type PermintaanFokus = { id: string; n: number }

/** Terbang ke proyek yang dipilih dari daftar, lalu buka popup-nya (jika ada). */
function IkutiFokus({
  fokus,
  proyek,
  penanda,
}: {
  fokus: PermintaanFokus | null
  proyek: ProyekDenganRedFlag[]
  penanda: RefObject<Map<string, PenandaLeaflet>>
}) {
  const peta = useMap()
  const terbang = useEffectEvent((id: string) => {
    const p = proyek.find((x) => x.id === id)
    if (!p) return
    const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Popup dibuka setelah peta selesai terbang: selama animasi Leaflet tidak menggeser peta (autoPan),
    // sehingga kartu yang tinggi bisa terpotong tepi atas peta.
    peta.once('moveend', () => penanda.current.get(id)?.openPopup())
    peta.flyTo([p.lat, p.lng], Math.max(peta.getZoom(), ZOOM_FOKUS), { animate: !kurangiGerak, duration: 0.6 })
  })

  useEffect(() => {
    if (fokus) terbang(fokus.id)
  }, [fokus])

  return null
}

/**
 * Saat daftar proyek berubah (pencarian, status, kecamatan), peta menyesuaikan diri agar semua pin yang tersisa
 * terlihat. Hanya bereaksi pada perubahan kumpulan proyek, bukan pada pemilihan proyek.
 */
function IkutiSaringan({ proyek }: { proyek: ProyekDenganRedFlag[] }) {
  const peta = useMap()
  const kunci = proyek.map((p) => p.id).join(',')
  const sesuaikan = useEffectEvent(() => {
    if (proyek.length === 0) return
    const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    peta.flyToBounds(latLngBounds(proyek.map((p) => [p.lat, p.lng])), {
      padding: [48, 48],
      maxZoom: ZOOM_FOKUS,
      animate: !kurangiGerak,
      duration: 0.6,
    })
  })

  useEffect(() => {
    sesuaikan()
  }, [kunci])

  return null
}

type PetaProyekProps = {
  proyek: ProyekDenganRedFlag[]
  terpilihId?: string | null
  fokus?: PermintaanFokus | null
  onPilih?: (id: string) => void
  /** Proyek yang sedang disorot kursor di daftar; pinnya ikut membesar. */
  sorotId?: string | null
  /** Kursor masuk/keluar pin: daftar ikut menyorot kartunya. */
  onSorot?: (id: string | null) => void
  /** Desktop: ringkasan proyek di popup peta. Ponsel: false, ringkasan tampil di bottom sheet. */
  denganPopup?: boolean
}

/**
 * Peta proyek (DESIGN.md §7.10) dengan pin dan kartu tooltip yang sama dengan hero Beranda: pin biru untuk proyek,
 * merah untuk yang perlu perhatian; pin yang disorot/terpilih membesar.
 */
export function PetaProyek({ proyek, terpilihId = null, fokus = null, onPilih, sorotId = null, onSorot, denganPopup = true }: PetaProyekProps) {
  const penanda = useRef(new Map<string, PenandaLeaflet>())
  // Proyek ber-red flag digambar terakhir agar berada di atas; proyek terpilih paling atas.
  const urut = [...proyek].sort(
    (a, b) =>
      Number(a.id === terpilihId) - Number(b.id === terpilihId) ||
      Number(a.id === sorotId) - Number(b.id === sorotId) ||
      Number(!!a.redFlag) - Number(!!b.redFlag),
  )

  return (
    <div>
      <MapContainer
        center={PUSAT_KOTA_BANDUNG}
        zoom={12}
        minZoom={11}
        maxBounds={BATAS_PETA}
        scrollWheelZoom={false}
        className="h-[50vh] min-h-80 w-full rounded-lg border border-border md:h-[60vh]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <IkutiSaringan proyek={proyek} />
        <IkutiFokus fokus={fokus} proyek={proyek} penanda={penanda} />
        {urut.map((p) => {
          const terpilih = p.id === terpilihId
          const disorot = p.id === sorotId
          return (
            <Marker
              key={p.id}
              ref={(m) => {
                if (m) penanda.current.set(p.id, m)
                else penanda.current.delete(p.id)
              }}
              position={[p.lat, p.lng]}
              icon={ikonPin(!!p.redFlag, terpilih ? 'terpilih' : disorot ? 'disorot' : 'biasa')}
              title={p.nama_paket}
              alt={`${p.nama_paket}${p.redFlag ? ', perlu perhatian' : ''}`}
              riseOnHover
              eventHandlers={{
                click: () => onPilih?.(p.id),
                mouseover: () => onSorot?.(p.id),
                mouseout: () => onSorot?.(null),
              }}
            >
              {/* Popup = kartu tooltip yang sama dengan hero Beranda; bingkai bawaan Leaflet dihilangkan (index.css). */}
              {denganPopup && (
                <Popup className="popup-kartu" closeButton={false} autoPanPadding={[24, 24]}>
                  <KartuPin proyek={p} id={`popup-${p.id}`} ekor="bawah" onTutup={() => penanda.current.get(p.id)?.closePopup()} className="relative w-64" />
                </Popup>
              )}
            </Marker>
          )
        })}
      </MapContainer>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-subtle" aria-label="Keterangan warna peta">
        <li className="flex items-center gap-1">
          <IkonPin className="size-4" />
          Proyek
        </li>
        <li className="flex items-center gap-1">
          <IkonPin perluPerhatian className="size-4" />
          Perlu perhatian
        </li>
      </ul>
    </div>
  )
}
