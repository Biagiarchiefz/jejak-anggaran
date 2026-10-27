import 'leaflet/dist/leaflet.css'
import { useEffect, useEffectEvent, useRef, type RefObject } from 'react'
import type { CircleMarker as PenandaLeaflet } from 'leaflet'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router'
import { BadgeRedFlag } from './BadgeRedFlag'
import { BadgeStatusProyek } from './BadgeStatus'
import { SumberData } from './SumberData'
import { formatRupiahRingkas } from '../lib/format'
import { WARNA } from '../lib/warna'
import { BATAS_KOTA_BANDUNG, PUSAT_KOTA_BANDUNG } from '../lib/wilayah'
import type { ProyekDenganRedFlag } from '../services/proyekService'

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
    peta.flyTo([p.lat, p.lng], Math.max(peta.getZoom(), ZOOM_FOKUS), { animate: !kurangiGerak, duration: 0.6 })
    penanda.current.get(id)?.openPopup()
  })

  useEffect(() => {
    if (fokus) terbang(fokus.id)
  }, [fokus])

  return null
}

type PetaProyekProps = {
  proyek: ProyekDenganRedFlag[]
  terpilihId?: string | null
  fokus?: PermintaanFokus | null
  onPilih?: (id: string) => void
  /** Desktop: ringkasan proyek di popup peta. Ponsel: false, ringkasan tampil di bottom sheet. */
  denganPopup?: boolean
}

/** Peta proyek (DESIGN.md §7.10): pin biasa biru, pin red flag merah dan sedikit lebih besar, pin terpilih berbingkai tebal. */
export function PetaProyek({ proyek, terpilihId = null, fokus = null, onPilih, denganPopup = true }: PetaProyekProps) {
  const penanda = useRef(new Map<string, PenandaLeaflet>())
  // Proyek ber-red flag digambar terakhir agar berada di atas; proyek terpilih paling atas.
  const urut = [...proyek].sort(
    (a, b) => Number(a.id === terpilihId) - Number(b.id === terpilihId) || Number(!!a.redFlag) - Number(!!b.redFlag),
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
        <IkutiFokus fokus={fokus} proyek={proyek} penanda={penanda} />
        {urut.map((p) => {
          const terpilih = p.id === terpilihId
          return (
            <CircleMarker
              key={p.id}
              ref={(m) => {
                if (m) penanda.current.set(p.id, m)
                else penanda.current.delete(p.id)
              }}
              center={[p.lat, p.lng]}
              radius={(p.redFlag ? 10 : 8) + (terpilih ? 3 : 0)}
              eventHandlers={{ click: () => onPilih?.(p.id) }}
              pathOptions={{
                color: WARNA.canvas,
                weight: terpilih ? 4 : 2,
                fillColor: p.redFlag ? WARNA.danger : WARNA.brand,
                fillOpacity: 1,
              }}
            >
              {denganPopup && (
                <Popup>
                  <div className="space-y-2 text-sm">
                    <p className="!m-0 leading-snug font-semibold text-ink-strong">{p.nama_paket}</p>
                    <div className="flex flex-wrap gap-1">
                      <BadgeStatusProyek status={p.status_proyek} />
                      {p.redFlag && <BadgeRedFlag alasan={p.redFlag.alasan} />}
                    </div>
                    <div>
                      <p className="!m-0 text-ink">
                        Pagu <span className="font-semibold tabular-nums">{formatRupiahRingkas(p.pagu)}</span>
                      </p>
                      <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} className="!m-0" />
                    </div>
                    <Link to={`/proyek/${p.id}`} className="font-medium text-link! hover:underline">
                      Lihat detail proyek →
                    </Link>
                  </div>
                </Popup>
              )}
            </CircleMarker>
          )
        })}
      </MapContainer>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-subtle" aria-label="Keterangan warna peta">
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-full border-2 border-white bg-brand shadow-edge" aria-hidden />
          Proyek
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3.5 rounded-full border-2 border-white bg-danger shadow-edge" aria-hidden />
          Perlu perhatian
        </li>
      </ul>
    </div>
  )
}
