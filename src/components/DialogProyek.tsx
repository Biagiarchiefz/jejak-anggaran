import type { ReactNode } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { Link } from 'react-router'
import { BadgeRedFlag, IkonBendera } from './BadgeRedFlag'
import { BadgeStatusProyek } from './BadgeStatus'
import { CuplikanPeta } from './CuplikanPeta'
import { SumberData } from './SumberData'
import { Button, TautanTombol } from './ui/Button'
import { Laci } from './ui/Laci'
import { formatRupiah } from '../lib/format'
import type { ProyekDenganRedFlag } from '../services/proyekService'

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-ink-subtle">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{children}</dd>
    </div>
  )
}

type DialogProyekProps = {
  proyek: ProyekDenganRedFlag
  terbuka: boolean
  onTutup: () => void
}

/** Ringkasan proyek dalam dialog: peta lokasi + informasi utama, dengan tautan ke halaman detail lengkap. */
export function DialogProyek({ proyek: p, terbuka, onTutup }: DialogProyekProps) {
  const wilayah = [p.kelurahan, `Kec. ${p.kecamatan}`].filter(Boolean).join(', ')

  return (
    <Laci
      terbuka={terbuka}
      onTutup={onTutup}
      label={`Detail proyek ${p.nama_paket}`}
      arah="tengah"
      className="m-auto max-h-[calc(100dvh-2rem)]! w-[calc(100%-2rem)] max-w-lg! overflow-y-auto rounded-lg border border-border p-0"
    >
      <div className="relative aspect-video bg-recessed">
        <CuplikanPeta lat={p.lat} lng={p.lng} label={`Peta lokasi proyek di ${wilayah}`} perluPerhatian={!!p.redFlag} />
        <button
          type="button"
          onClick={onTutup}
          aria-label="Tutup"
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full border border-border-strong bg-surface text-ink efek-tekan hover:bg-canvas-soft"
        >
          <X className="size-5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-1.5">
          <BadgeStatusProyek status={p.status_proyek} />
          {p.redFlag && <BadgeRedFlag />}
        </div>
        <h2 className="mt-3 text-xl leading-[1.25] font-semibold tracking-[-0.005em] text-balance">{p.nama_paket}</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {wilayah} · Tahun anggaran {p.tahun_anggaran}
        </p>

        {p.redFlag && (
          <div className="mt-4 rounded-lg border border-danger/20 bg-danger-soft p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-danger">
              <IkonBendera className="size-4" />
              Perlu perhatian
            </p>
            <p className="mt-1 text-sm text-ink-muted">{p.redFlag.alasan}</p>
            <p className="mt-1.5 text-xs text-ink-muted">
              Dihitung otomatis dari laporan warga, <strong>bukan tuduhan</strong>.{' '}
              <Link to="/tentang-data#red-flag" className="text-link hover:underline">
                Pelajari aturannya
              </Link>
            </p>
          </div>
        )}

        <dl className="mt-5 grid gap-x-6 gap-y-4 border-t border-border-soft pt-5 sm:grid-cols-2">
          <Info label="Pagu anggaran">
            <span className="text-base font-semibold text-ink-strong tabular-nums">{formatRupiah(p.pagu)}</span>
            <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} className="mt-1" />
          </Info>
          <Info label="Nilai kontrak">
            {p.nilai_kontrak === null ? (
              <span className="text-ink-subtle">Belum ada data kontrak</span>
            ) : (
              <>
                <span className="text-base font-semibold text-ink-strong tabular-nums">{formatRupiah(p.nilai_kontrak)}</span>
                <SumberData nama="LPSE Kota Bandung" url={p.sumber_lpse_url} diaksesPada={p.diakses_pada} demo={p.is_demo} className="mt-1" />
              </>
            )}
          </Info>
          <Info label="Pelaksana">{p.pelaksana ?? <span className="text-ink-subtle">Belum diketahui</span>}</Info>
          <Info label="Satuan kerja">{p.satker}</Info>
        </dl>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button varian="tipis" ukuran="sm" onClick={onTutup}>
            Tutup
          </Button>
          <TautanTombol to={`/proyek/${p.id}`} ukuran="sm">
            Lihat detail proyek
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
          </TautanTombol>
        </div>
      </div>
    </Laci>
  )
}
