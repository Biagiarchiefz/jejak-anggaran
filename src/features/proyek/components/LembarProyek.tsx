import { useEffect } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { BadgeRedFlag } from '../../../components/common/BadgeRedFlag'
import { BadgeStatusProyek } from '../../../components/common/BadgeStatus'
import { SumberData } from '../../../components/common/SumberData'
import { TautanTombol } from '../../../components/common/Button'
import { formatRupiahRingkas } from '../../../utils/format'
import type { ProyekDenganRedFlag } from '../../../services/proyekService'

/**
 * Bottom sheet ringkasan proyek di peta versi ponsel (DESIGN.md §7.10): kartu bergaya §7.5 yang naik dari bawah,
 * menempel di atas bottom navigation. Esc atau tombol tutup menutupnya. Peta di belakangnya tetap bisa dipakai.
 */
export function LembarProyek({ proyek: p, onTutup }: { proyek: ProyekDenganRedFlag; onTutup: () => void }) {
  useEffect(() => {
    function tombol(e: KeyboardEvent) {
      if (e.key === 'Escape') onTutup()
    }
    window.addEventListener('keydown', tombol)
    return () => window.removeEventListener('keydown', tombol)
  }, [onTutup])

  return (
    <section
      aria-label={`Ringkasan proyek ${p.nama_paket}`}
      className="fixed inset-x-0 bottom-16 z-[1050] max-h-[60dvh] overflow-y-auto rounded-t-xl border-t border-border bg-surface px-4 pt-2 pb-4 shadow-pop transition-[translate] duration-[320ms] ease-(--ease-out-soft) starting:translate-y-full motion-reduce:transition-none lg:hidden"
    >
      <div className="mx-auto h-1 w-10 rounded-full bg-border-strong" aria-hidden />
      <div className="mt-3 flex items-start justify-between gap-3">
        <h2 className="text-base leading-snug font-semibold tracking-normal">{p.nama_paket}</h2>
        <button
          type="button"
          onClick={onTutup}
          aria-label="Tutup ringkasan proyek"
          className="-mt-1 -mr-1 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-recessed"
        >
          <X className="size-5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      <p className="text-sm text-ink-muted">
        Kec. {p.kecamatan} · {p.satker}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <BadgeStatusProyek status={p.status_proyek} />
        {p.redFlag && <BadgeRedFlag alasan={p.redFlag.alasan} />}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-4">
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
      <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} dalamKartu />
      <TautanTombol to={`/proyek/${p.id}`} ukuran="sm" className="mt-4 w-full">
        Lihat detail proyek
        <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
      </TautanTombol>
    </section>
  )
}
