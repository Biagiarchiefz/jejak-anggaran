import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { BadgeDemo } from './BadgeDemo'
import { BadgeRedFlag } from './BadgeRedFlag'
import { BadgeStatusProyek } from './BadgeStatus'
import { CuplikanPeta } from './CuplikanPeta'
import { SumberData } from './SumberData'
import { formatRupiahRingkas } from '../lib/format'
import type { ProyekDenganRedFlag } from '../services/proyekService'
import type { Enums } from '../types/database'

// Warna sama dengan titik status di peta (token --color-status-*).
const WARNA_STATUS: Record<Enums<'status_proyek'>, string> = {
  direncanakan: 'bg-status-direncanakan',
  berjalan: 'bg-status-berjalan',
  selesai: 'bg-status-selesai',
}

const IKON_STATUS: Record<Enums<'status_proyek'>, ReactNode> = {
  direncanakan: <path d="M8 3v4m8-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />,
  berjalan: (
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.6 17.4a1.4 1.4 0 0 0 2 2l5.7-5.7a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.4-.4-2.1 2.5-2.5Z" />
  ),
  selesai: <path d="m5 12.5 4.5 4.5L19 7.5" />,
}

/**
 * Kartu proyek dengan bentuk yang sama seperti kartu fitur sebelumnya: teks di atas,
 * gambar menempel ke tepi bawah. Gambar = foto lapangan tim bila ada, selain itu cuplikan
 * peta lokasi (juga untuk proyek demo, agar tidak ada foto yang disangka foto proyek nyata).
 * Proyek yang perlu perhatian diberi aksen merah lembut. Seluruh kartu bisa diklik.
 */
export function KartuProyek({ proyek: p }: { proyek: ProyekDenganRedFlag }) {
  const perhatian = !!p.redFlag

  return (
    <li
      className={`group relative flex flex-col rounded-ui px-5 pt-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-merek-700 focus-within:ring-offset-2 hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0 ${
        perhatian ? 'border border-red-200 bg-redflag-bg' : 'border border-slate-200/80 bg-white shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <BadgeStatusProyek status={p.status_proyek} />
          {perhatian && <BadgeRedFlag alasan={p.redFlag?.alasan} />}
          {p.is_demo && <BadgeDemo />}
        </div>
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-ui bg-slate-100 text-merek-800 transition-colors duration-300 group-hover:bg-merek-800 group-hover:text-white"
          aria-hidden
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-5 transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
      </div>

      <h3 className="mt-3 text-lg leading-snug font-medium text-slate-900">
        {/* Tautan diregangkan menutupi seluruh kartu (z-[1] agar berada di atas area gambar). */}
        <Link
          to={`/proyek/${p.id}`}
          className="after:absolute after:inset-0 after:z-[1] after:rounded-ui focus-visible:outline-none"
        >
          {p.nama_paket}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Kec. {p.kecamatan} · Tahun anggaran {p.tahun_anggaran}
      </p>

      <div className="mt-4 mb-5">
        <p className="text-xs text-slate-500">Pagu anggaran</p>
        <p className="mt-0.5 text-2xl font-medium tracking-tight text-slate-900">{formatRupiahRingkas(p.pagu)}</p>
        {/* z-10 agar tautan sumber tetap bisa diklik di atas tautan kartu. */}
        <SumberData
          nama="SiRUP LKPP"
          url={p.sumber_rup_url}
          diaksesPada={p.diakses_pada}
          demo={p.is_demo}
          className="relative z-10 mt-1"
        />
      </div>

      {/* Gambar menempel ke tepi bawah kartu: tanpa padding bawah, hanya sudut atas yang membulat. */}
      <div className="relative mt-auto aspect-[16/10] overflow-hidden rounded-t-ui bg-slate-200">
        {p.foto_path ? (
          <img
            src={p.foto_path}
            alt={`Foto lapangan proyek ${p.nama_paket}`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <CuplikanPeta
            lat={p.lat}
            lng={p.lng}
            label={`Peta lokasi proyek di Kec. ${p.kecamatan}`}
            warnaTitik={WARNA_STATUS[p.status_proyek]}
            perluPerhatian={perhatian}
          />
        )}
        <span
          className={`absolute bottom-3 left-3 flex size-11 items-center justify-center rounded-ui text-white shadow-md ring-4 ring-white/60 ${WARNA_STATUS[p.status_proyek]}`}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
            {IKON_STATUS[p.status_proyek]}
          </svg>
        </span>
      </div>
    </li>
  )
}
