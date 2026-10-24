import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router'
import { BadgeDemo } from './BadgeDemo'
import { BadgeRedFlag } from './BadgeRedFlag'
import { BadgeStatusProyek } from './BadgeStatus'
import { SumberData } from './SumberData'
import { formatRupiahRingkas } from '../lib/format'
import { LABEL_STATUS_PROYEK } from '../lib/label'
import { BATAS_KOTA_BANDUNG, PUSAT_KOTA_BANDUNG } from '../lib/wilayah'
import type { ProyekDenganRedFlag } from '../services/proyekService'
import type { Enums } from '../types/database'

// Sama dengan token --color-status-* di index.css.
const WARNA_STATUS: Record<Enums<'status_proyek'>, string> = {
  direncanakan: '#2a78d6',
  berjalan: '#eb6834',
  selesai: '#1baf7a',
}
const WARNA_RED_FLAG = '#b42318'

const MARGIN = 0.05
const BATAS_PETA: [[number, number], [number, number]] = [
  [BATAS_KOTA_BANDUNG.latMin - MARGIN, BATAS_KOTA_BANDUNG.lngMin - MARGIN],
  [BATAS_KOTA_BANDUNG.latMaks + MARGIN, BATAS_KOTA_BANDUNG.lngMaks + MARGIN],
]

export function PetaProyek({ proyek }: { proyek: ProyekDenganRedFlag[] }) {
  // Proyek ber-red flag digambar terakhir agar berada di atas.
  const urut = [...proyek].sort((a, b) => Number(!!a.redFlag) - Number(!!b.redFlag))

  return (
    <div>
      <MapContainer
        center={PUSAT_KOTA_BANDUNG}
        zoom={12}
        minZoom={11}
        maxBounds={BATAS_PETA}
        scrollWheelZoom={false}
        className="h-[55vh] min-h-80 w-full rounded-ui border border-slate-200"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {urut.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={p.redFlag ? 11 : 9}
            pathOptions={{
              color: p.redFlag ? WARNA_RED_FLAG : '#ffffff',
              weight: p.redFlag ? 4 : 2,
              fillColor: WARNA_STATUS[p.status_proyek],
              fillOpacity: 0.95,
            }}
          >
            <Popup>
              <div className="space-y-1.5 text-sm">
                <p className="font-medium leading-snug text-slate-900">{p.nama_paket}</p>
                <div className="flex flex-wrap gap-1">
                  <BadgeStatusProyek status={p.status_proyek} />
                  {p.redFlag && <BadgeRedFlag alasan={p.redFlag.alasan} />}
                  {p.is_demo && <BadgeDemo />}
                </div>
                <div>
                  <p className="!m-0 text-slate-800">
                    Pagu: <strong>{formatRupiahRingkas(p.pagu)}</strong>
                  </p>
                  <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} className="!m-0" />
                </div>
                <Link to={`/proyek/${p.id}`} className="font-medium text-merek-800 underline">
                  Lihat detail proyek
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700" aria-label="Keterangan warna peta">
        {(Object.keys(WARNA_STATUS) as Enums<'status_proyek'>[]).map((s) => (
          <li key={s} className="flex items-center gap-1.5">
            <span className="size-3 rounded-full border-2 border-white shadow" style={{ background: WARNA_STATUS[s] }} aria-hidden />
            {LABEL_STATUS_PROYEK[s]}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="size-3.5 rounded-full border-[3px] bg-white" style={{ borderColor: WARNA_RED_FLAG }} aria-hidden />
          Lingkar merah = perlu perhatian
        </li>
      </ul>
    </div>
  )
}
