import { useState } from 'react'
import { BadgeRedFlag } from './BadgeRedFlag'
import { BadgeStatusProyek } from './BadgeStatus'
import { DialogProyek } from './DialogProyek'
import { SumberData } from './SumberData'
import { fotoIlustrasiProyek, urlFotoUnsplash } from '../lib/fotoIlustrasi'
import { formatRupiahRingkas } from '../lib/format'
import type { ProyekDenganRedFlag } from '../services/proyekService'

/**
 * Kartu proyek (DESIGN.md §7.5): thumbnail 16:9 → nama paket → wilayah + dinas → badge → pagu & kontrak → sumber.
 * Foto = foto lapangan tim bila ada; selain itu foto ilustrasi sesuai jenis pekerjaan, selalu berlabel
 * "Foto ilustrasi" agar tidak disangka foto proyek tersebut.
 * Seluruh kartu bisa diklik (tombol nama diregangkan) dan membuka dialog berisi peta lokasi dan detail proyek.
 */
export function KartuProyek({ proyek: p }: { proyek: ProyekDenganRedFlag }) {
  const [terbuka, setTerbuka] = useState(false)
  const ilustrasi = p.foto_path ? null : fotoIlustrasiProyek(p.nama_paket)

  return (
    <li className="group relative flex flex-col rounded-lg border border-border bg-surface p-4 shadow-edge transition-[border-color,box-shadow,translate] duration-[240ms] ease-(--ease-standard) outline-offset-2 outline-brand has-[button:focus-visible]:outline-2 hover:border-border-strong hover:-translate-y-0.5 hover:shadow-card motion-reduce:hover:translate-y-0">
      <div className="relative aspect-video overflow-hidden rounded-md bg-recessed">
        {ilustrasi ? (
          <img
            src={urlFotoUnsplash(ilustrasi.id, 600)}
            srcSet={[400, 600, 900].map((w) => `${urlFotoUnsplash(ilustrasi.id, w)} ${w}w`).join(', ')}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            alt={`Foto ilustrasi: ${ilustrasi.alt}`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        ) : (
          <img
            src={p.foto_path ?? undefined}
            alt={`Foto lapangan proyek ${p.nama_paket}`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        )}
        {ilustrasi && (
          <span className="absolute bottom-2 left-2 rounded-sm bg-surface/90 px-1.5 text-[11px] leading-[18px] font-medium text-ink-muted">
            Foto ilustrasi
          </span>
        )}
      </div>

      <h3 className="mt-4 line-clamp-2 text-base leading-snug font-semibold">
        <button
          type="button"
          onClick={() => setTerbuka(true)}
          aria-haspopup="dialog"
          className="text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
        >
          {p.nama_paket}
        </button>
      </h3>
      <p className="mt-1 line-clamp-1 text-sm text-ink-muted">
        Kec. {p.kecamatan} · {p.satker}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <BadgeStatusProyek status={p.status_proyek} />
        {p.redFlag && <BadgeRedFlag alasan={p.redFlag.alasan} />}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border-soft pt-4">
        <div>
          <dt className="text-xs text-ink-subtle">Pagu</dt>
          <dd className="mt-0.5 font-semibold text-ink-strong tabular-nums">{formatRupiahRingkas(p.pagu)}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-subtle">Nilai kontrak</dt>
          <dd className="mt-0.5 font-semibold text-ink-strong tabular-nums">
            {p.nilai_kontrak === null ? <span className="font-normal text-ink-subtle">Belum ada</span> : formatRupiahRingkas(p.nilai_kontrak)}
          </dd>
        </div>
      </dl>

      {/* Tautan sumber di atas tombol yang diregangkan agar tetap bisa diklik sendiri. */}
      <div className="relative z-[1] mt-auto">
        <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} dalamKartu />
        {p.nilai_kontrak !== null && !p.is_demo && (
          <SumberData nama="LPSE Kota Bandung" url={p.sumber_lpse_url} diaksesPada={p.diakses_pada} className="mt-1" />
        )}
      </div>

      <DialogProyek proyek={p} terbuka={terbuka} onTutup={() => setTerbuka(false)} />
    </li>
  )
}
