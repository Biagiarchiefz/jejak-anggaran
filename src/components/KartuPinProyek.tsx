import type { CSSProperties } from 'react'
import { ArrowRight, CalendarDays, HardHat, MapPin, X } from 'lucide-react'
import { BadgeRedFlag } from './BadgeRedFlag'
import { BadgeStatusProyek } from './BadgeStatus'
import { SumberData } from './SumberData'
import { TautanTombol } from './ui/Button'
import { fotoIlustrasiProyek, urlFotoUnsplash } from '../lib/fotoIlustrasi'
import { formatRupiahRingkas } from '../lib/format'
import type { ProyekDenganRedFlag } from '../services/proyekService'

// Pin dan kartu tooltip proyek yang dipakai bersama oleh hero Beranda (FlatProjectMap) dan halaman Peta (PetaProyek),
// agar tampilan pin dan keterangannya konsisten di seluruh situs.

/** Ikon pin berisi warna: biru untuk proyek, merah untuk yang perlu perhatian. */
export function IkonPin({ perluPerhatian, className }: { perluPerhatian?: boolean; className?: string }) {
  return (
    <MapPin
      className={`stroke-white [&>circle]:fill-white ${perluPerhatian ? 'fill-danger' : 'fill-brand'} ${className ?? ''}`}
      strokeWidth={1.5}
      aria-hidden
    />
  )
}

export type KartuPinProps = {
  proyek: ProyekDenganRedFlag
  id: string
  onTutup: () => void
  /** Letak ekor tooltip: kartu di atas pin → ekor di bawah, dan sebaliknya. Tanpa ekor bila kartu tidak menempel ke pin. */
  ekor?: 'bawah' | 'atas'
  className?: string
  style?: CSSProperties
}

/**
 * Kartu tooltip proyek yang pinnya dipilih: foto, nama, lokasi, tahun & pelaksana, lalu pagu + tombol detail.
 * Desktop: melayang di atas/bawah pin dengan ekor yang menunjuk ke pin. Ponsel/tablet: di bawah peta.
 * Foto = foto lapangan bila ada, selain itu foto ilustrasi sesuai jenis pekerjaan yang selalu diberi label.
 */
export function KartuPin({ proyek: p, id, onTutup, ekor, className, style }: KartuPinProps) {
  const ilustrasi = p.foto_path ? null : fotoIlustrasiProyek(p.nama_paket)

  return (
    <div
      id={id}
      role="region"
      aria-label={`Keterangan ${p.nama_paket}`}
      className={`rounded-lg border border-border bg-surface p-2 shadow-pop transition-[opacity,scale] duration-200 ease-(--ease-out-soft) starting:scale-95 starting:opacity-0 motion-reduce:transition-none ${
        ekor === 'atas' ? 'origin-top' : 'origin-bottom'
      } ${className ?? ''}`}
      style={style}
    >
      {ekor && (
        <span
          className={`absolute left-1/2 size-3 -translate-x-1/2 rotate-45 border-border bg-surface ${
            ekor === 'bawah' ? '-bottom-1.75 border-r border-b' : '-top-1.75 border-t border-l'
          }`}
          aria-hidden
        />
      )}

      <div className="relative aspect-16/10 overflow-hidden rounded-md bg-recessed">
        <img
          src={ilustrasi ? urlFotoUnsplash(ilustrasi.id, 480) : (p.foto_path ?? undefined)}
          alt={ilustrasi ? `Foto ilustrasi: ${ilustrasi.alt}` : `Foto lapangan proyek ${p.nama_paket}`}
          decoding="async"
          className="size-full object-cover"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <BadgeStatusProyek status={p.status_proyek} ringkas />
          {p.redFlag && <BadgeRedFlag alasan={p.redFlag.alasan} ringkas />}
        </div>
        <button
          type="button"
          onClick={onTutup}
          aria-label="Tutup keterangan"
          className="absolute top-1.5 right-1.5 grid size-8 place-items-center rounded-md bg-surface/90 text-ink shadow-edge efek-tekan hover:bg-surface"
        >
          <X className="size-4" strokeWidth={1.5} aria-hidden />
        </button>
        {ilustrasi && (
          <span className="absolute bottom-2 left-2 rounded-sm bg-surface/90 px-1.5 text-[11px] leading-4.5 font-medium text-ink-muted">
            Foto ilustrasi
          </span>
        )}
      </div>

      <div className="px-1.5 pt-3 pb-1">
        <p className="line-clamp-2 text-sm leading-snug font-semibold text-ink-strong">{p.nama_paket}</p>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-muted">
          <MapPin className="size-3.5 shrink-0 text-ink-subtle" strokeWidth={1.5} aria-hidden />
          <span className="truncate">{[p.kelurahan, `Kec. ${p.kecamatan}`].filter(Boolean).join(', ')}</span>
        </p>
        <ul className="mt-2 flex items-center gap-3 text-xs text-ink-subtle">
          <li className="flex shrink-0 items-center gap-1">
            <CalendarDays className="size-3.5" strokeWidth={1.5} aria-hidden />
            TA {p.tahun_anggaran}
          </li>
          <li className="flex min-w-0 items-center gap-1">
            <HardHat className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
            <span className="truncate">{p.pelaksana ?? 'Pelaksana belum ada'}</span>
          </li>
        </ul>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border-soft pt-3">
          <p className="min-w-0">
            <span className="block text-base leading-tight font-semibold text-ink-strong tabular-nums">{formatRupiahRingkas(p.pagu)}</span>
            <span className="text-xs text-ink-subtle">Pagu anggaran</span>
          </p>
          <TautanTombol to={`/proyek/${p.id}`} ukuran="sm" className="shrink-0">
            Detail
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
          </TautanTombol>
        </div>
        <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} dalamKartu />
      </div>
    </div>
  )
}
