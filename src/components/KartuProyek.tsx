import { useState } from 'react'
import { CalendarDays, MapPin } from 'lucide-react'
import { BadgeRedFlag } from './BadgeRedFlag'
import { BadgeStatusProyek } from './BadgeStatus'
import { DialogProyek } from './DialogProyek'
import { SumberData } from './SumberData'
import { fotoIlustrasiProyek, urlFotoUnsplash } from '../lib/fotoIlustrasi'
import { formatRupiahRingkas } from '../lib/format'
import type { ProyekDenganRedFlag } from '../services/proyekService'

/**
 * Kartu proyek ringkas (DESIGN.md §7.5): thumbnail pendek berisi badge → nama paket → kecamatan & tahun →
 * panel pagu & kontrak → sumber. Foto = foto lapangan tim bila ada; selain itu foto ilustrasi sesuai jenis
 * pekerjaan, selalu berlabel "Foto ilustrasi" agar tidak disangka foto proyek tersebut.
 * Seluruh kartu bisa diklik (tombol nama diregangkan) dan membuka dialog berisi peta lokasi dan detail proyek.
 */
export function KartuProyek({ proyek: p }: { proyek: ProyekDenganRedFlag }) {
  const [terbuka, setTerbuka] = useState(false)
  const ilustrasi = p.foto_path ? null : fotoIlustrasiProyek(p.nama_paket)

  return (
    <li
      className={`group relative flex flex-col rounded-lg border bg-surface p-3 shadow-edge transition-[border-color,box-shadow,translate] duration-240 ease-(--ease-standard) outline-offset-2 outline-brand has-[button:focus-visible]:outline-2 hover:-translate-y-0.5 hover:shadow-card motion-reduce:hover:translate-y-0 ${
        p.redFlag ? 'border-danger/30 hover:border-danger/50' : 'border-border hover:border-border-strong'
      }`}
    >
      {/* Thumbnail pendek (5:2) agar kartu padat; badge menumpang di atas foto, bukan baris sendiri. */}
      <div className="relative aspect-5/2 overflow-hidden rounded-md bg-recessed">
        {ilustrasi ? (
          <img
            src={urlFotoUnsplash(ilustrasi.id, 600)}
            srcSet={[400, 600, 900].map((w) => `${urlFotoUnsplash(ilustrasi.id, w)} ${w}w`).join(', ')}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            alt={`Foto ilustrasi: ${ilustrasi.alt}`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 ease-(--ease-standard) group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <img
            src={p.foto_path ?? undefined}
            alt={`Foto lapangan proyek ${p.nama_paket}`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 ease-(--ease-standard) group-hover:scale-105 motion-reduce:transition-none"
          />
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <BadgeStatusProyek status={p.status_proyek} ringkas />
          {p.redFlag && <BadgeRedFlag alasan={p.redFlag.alasan} ringkas />}
        </div>
        {ilustrasi && (
          <span className="absolute right-2 bottom-2 rounded-sm bg-surface/90 px-1.5 text-[11px] leading-4.5 font-medium text-ink-muted">
            Foto ilustrasi
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3">
        <h3 className="line-clamp-2 min-h-[2lh] text-sm leading-snug font-semibold tracking-normal text-ink-strong">
          <button
            type="button"
            onClick={() => setTerbuka(true)}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
          >
            {p.nama_paket}
          </button>
        </h3>
        <p className="mt-1.5 flex items-center gap-3 text-xs text-ink-muted">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0 text-ink-subtle" strokeWidth={1.5} aria-hidden />
            <span className="truncate">Kec. {p.kecamatan}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <CalendarDays className="size-3.5 text-ink-subtle" strokeWidth={1.5} aria-hidden />
            TA {p.tahun_anggaran}
          </span>
        </p>

        {/* Panel angka bergaya dashboard: dua kolom dipisah garis tipis. */}
        <dl className="mt-3 grid grid-cols-2 divide-x divide-border rounded-md bg-canvas-soft py-2">
          <div className="px-3">
            <dt className="text-[11px] font-medium tracking-[0.04em] text-ink-subtle uppercase">Pagu</dt>
            <dd className="mt-0.5 text-sm font-semibold text-ink-strong tabular-nums">{formatRupiahRingkas(p.pagu)}</dd>
          </div>
          <div className="px-3">
            <dt className="text-[11px] font-medium tracking-[0.04em] text-ink-subtle uppercase">Kontrak</dt>
            <dd className="mt-0.5 text-sm font-semibold text-ink-strong tabular-nums">
              {p.nilai_kontrak === null ? <span className="font-normal text-ink-subtle">Belum ada</span> : formatRupiahRingkas(p.nilai_kontrak)}
            </dd>
          </div>
        </dl>

        {/* Tautan sumber di atas tombol yang diregangkan agar tetap bisa diklik sendiri. */}
        <div className="relative z-1 mt-auto">
          <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} dalamKartu />
          {p.nilai_kontrak !== null && !p.is_demo && (
            <SumberData nama="LPSE Kota Bandung" url={p.sumber_lpse_url} diaksesPada={p.diakses_pada} className="mt-1" />
          )}
        </div>
      </div>

      <DialogProyek proyek={p} terbuka={terbuka} onTutup={() => setTerbuka(false)} />
    </li>
  )
}
