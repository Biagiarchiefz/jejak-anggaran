import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, MapPin, X } from 'lucide-react'
import { Link } from 'react-router'
import { BadgeRedFlag } from './BadgeRedFlag'
import { BadgeStatusProyek } from './BadgeStatus'
import { SumberData } from './SumberData'
import { Button } from './ui/Button'
import { LabelSeksi } from './ui/LabelSeksi'
import { PitaPenuh } from './ui/PitaPenuh'
import { BATAS_POLIGON_KOTA_BANDUNG } from '../data/batasKotaBandung'
import type { StateMuat } from '../hooks/useMuat'
import { formatRupiahRingkas } from '../lib/format'
import { posisiRelatif, titikDarat, type Batas, type TitikPeta } from '../lib/petaTitik'
import type { ProyekDenganRedFlag } from '../services/proyekService'

// Kotak di sekeliling batas Kota Bandung + sedikit ruang tepi (rasio ±10:7). SVG dan pin memakai kotak yang sama.
const BATAS_PETA: Batas = { lngMin: 107.538, lngMaks: 107.748, latMin: -6.978, latMaks: -6.831 }
const LANGKAH = 0.0042

let cacheTitik: TitikPeta[] | null = null
/** Titik di dalam batas kota dihitung sekali per sesi (±1.700 sel grid). */
function titikPeta(): TitikPeta[] {
  cacheTitik ??= titikDarat([{ kode: 'BDG', poligon: [[BATAS_POLIGON_KOTA_BANDUNG]] }], BATAS_PETA, LANGKAH)
  return cacheTitik
}

/** Peta Kota Bandung bergaya dot-matrix (SVG). Satuan viewBox = derajat. Dekoratif. */
function PetaTitik() {
  const lebar = BATAS_PETA.lngMaks - BATAS_PETA.lngMin
  const tinggi = BATAS_PETA.latMaks - BATAS_PETA.latMin
  return (
    <svg viewBox={`0 0 ${lebar} ${tinggi}`} className="absolute inset-0 size-full" aria-hidden>
      {titikPeta().map((t) => (
        <circle
          key={`${t.lng},${t.lat}`}
          cx={t.lng - BATAS_PETA.lngMin}
          cy={BATAS_PETA.latMaks - t.lat}
          r={LANGKAH * 0.33}
          className="fill-ink-subtle/30"
        />
      ))}
    </svg>
  )
}

/** Ikon pin berisi warna: oranye untuk proyek, merah untuk yang perlu perhatian. */
function IkonPin({ perluPerhatian, className }: { perluPerhatian?: boolean; className?: string }) {
  return (
    <MapPin
      className={`stroke-white [&>circle]:fill-white ${perluPerhatian ? 'fill-danger' : 'fill-brand'} ${className ?? ''}`}
      strokeWidth={1.5}
      aria-hidden
    />
  )
}

type PinProyekProps = {
  proyek: ProyekDenganRedFlag
  aktif: boolean
  idKartu: string
  onPilih: () => void
}

/** Pin peta di koordinat proyek. Klik/ketuk membuka kartu keterangan; klik lagi menutupnya. */
function PinProyek({ proyek: p, aktif, idKartu, onPilih }: PinProyekProps) {
  const { x, y } = posisiRelatif(p.lat, p.lng, BATAS_PETA)

  return (
    // Titik nol = koordinat proyek; ujung bawah pin jatuh tepat di sini.
    <div className={`absolute ${aktif ? 'z-20' : 'z-10'}`} style={{ left: `${x * 100}%`, top: `${y * 100}%` }}>
      <span className="absolute top-0 left-0 h-1 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-strong/20 blur-[1px]" aria-hidden />
      <button
        type="button"
        onClick={onPilih}
        aria-expanded={aktif}
        aria-controls={aktif ? idKartu : undefined}
        aria-label={`${p.nama_paket}${p.redFlag ? ', perlu perhatian' : ''}`}
        className="group absolute bottom-0 left-0 flex size-11 -translate-x-1/2 items-end justify-center"
      >
        <IkonPin
          perluPerhatian={!!p.redFlag}
          className={`size-8 origin-bottom drop-shadow-[0_2px_3px_rgb(0_0_0/0.25)] transition-transform duration-150 group-hover:scale-110 motion-reduce:transition-none ${
            aktif ? 'scale-125 group-hover:scale-125' : ''
          }`}
        />
      </button>
    </div>
  )
}

type KartuPinProps = { proyek: ProyekDenganRedFlag; id: string; onTutup: () => void; className?: string }

/** Kartu keterangan proyek yang pinnya diklik, seperti label lokasi pada peta. */
function KartuPin({ proyek: p, id, onTutup, className }: KartuPinProps) {
  return (
    <div
      id={id}
      role="region"
      aria-label={`Keterangan ${p.nama_paket}`}
      className={`relative flex gap-3 rounded-lg border border-border bg-surface p-4 pr-11 shadow-pop ${className ?? ''}`}
    >
      <button
        type="button"
        onClick={onTutup}
        aria-label="Tutup keterangan"
        className="absolute top-1 right-1 grid size-9 place-items-center rounded-full text-ink-subtle efek-tekan hover:bg-canvas-soft hover:text-ink"
      >
        <X className="size-4" strokeWidth={1.5} aria-hidden />
      </button>
      <IkonPin perluPerhatian={!!p.redFlag} className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm leading-snug font-semibold text-ink-strong">{p.nama_paket}</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          Kec. {p.kecamatan} · Pagu <span className="font-semibold whitespace-nowrap text-ink tabular-nums">{formatRupiahRingkas(p.pagu)}</span>
        </p>
        <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} dalamKartu />
        <div className="mt-2 flex flex-wrap gap-1">
          <BadgeStatusProyek status={p.status_proyek} ringkas />
          {p.redFlag && <BadgeRedFlag alasan={p.redFlag.alasan} ringkas />}
        </div>
        <Link to={`/proyek/${p.id}`} className="group mt-2 inline-flex items-center gap-1 text-sm font-medium text-link hover:underline">
          Lihat detail proyek
          <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
        </Link>
      </div>
    </div>
  )
}

/**
 * Peta titik Kota Bandung dengan pin proyek beranggaran. Keterangan proyek baru tampil setelah pinnya diklik:
 * di desktop menempel di pojok kanan atas peta (area tanpa proyek, jadi tidak menutupi pin), di ponsel di bawah peta.
 */
function PetaKotaBandung({ proyek }: { proyek: StateMuat<ProyekDenganRedFlag[]> }) {
  const idKartu = useId()
  const refPeta = useRef<HTMLDivElement>(null)
  const [idPilihan, setIdPilihan] = useState<string | null>(null)
  const daftar = proyek.data ?? []
  const pilihan = daftar.find((p) => p.id === idPilihan)

  // Kartu ditutup dengan Esc atau klik di luar peta.
  useEffect(() => {
    if (!idPilihan) return
    function tekan(e: KeyboardEvent) {
      if (e.key === 'Escape') setIdPilihan(null)
    }
    function klik(e: PointerEvent) {
      if (!refPeta.current?.contains(e.target as Node)) setIdPilihan(null)
    }
    window.addEventListener('keydown', tekan)
    document.addEventListener('pointerdown', klik)
    return () => {
      window.removeEventListener('keydown', tekan)
      document.removeEventListener('pointerdown', klik)
    }
  }, [idPilihan])

  return (
    <div ref={refPeta} className="relative">
      <div className="relative aspect-10/7">
        <PetaTitik />

        {proyek.memuat && !proyek.data ? (
          <div role="status" className="absolute inset-0 grid place-items-center">
            <span className="animate-pulse rounded-full bg-surface px-3 py-1 text-xs text-ink-muted shadow-edge">Memuat proyek…</span>
          </div>
        ) : proyek.error ? (
          <div role="alert" className="absolute inset-0 grid place-items-center p-4 text-center">
            <div className="rounded-md bg-surface p-3 shadow-edge">
              <p className="text-sm text-danger">Proyek gagal dimuat.</p>
              <Button varian="kedua" ukuran="sm" className="mt-2" onClick={proyek.muatUlang}>
                Coba lagi
              </Button>
            </div>
          </div>
        ) : daftar.length === 0 ? (
          <p className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-ink-muted">
            Belum ada proyek yang dipantau.
          </p>
        ) : (
          <ul aria-label="Proyek di Kota Bandung">
            {daftar.map((p) => (
              <li key={p.id}>
                <PinProyek
                  proyek={p}
                  aktif={p.id === idPilihan}
                  idKartu={idKartu}
                  onPilih={() => setIdPilihan((id) => (id === p.id ? null : p.id))}
                />
              </li>
            ))}
          </ul>
        )}

        {/* Atribusi batas wilayah OSM: wajib menurut lisensi ODbL, dibuat kecil di pojok seperti peta pada umumnya. */}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          title="Batas wilayah © kontributor OpenStreetMap"
          className="absolute right-0 bottom-0 text-[10px] leading-none text-ink-subtle hover:underline"
        >
          © OSM
          <span className="sr-only"> (batas wilayah © kontributor OpenStreetMap, membuka tab baru)</span>
        </a>
      </div>

      {pilihan && (
        <KartuPin
          proyek={pilihan}
          id={idKartu}
          onTutup={() => setIdPilihan(null)}
          className="mt-4 lg:absolute lg:top-0 lg:right-0 lg:z-30 lg:mt-0 lg:w-72"
        />
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-subtle">
        <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Keterangan pin">
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
    </div>
  )
}

type FlatProjectMapProps = {
  judul: ReactNode
  deskripsi?: ReactNode
  /** Satu tombol utama + satu tombol sekunder. */
  aksi?: ReactNode
  proyek: StateMuat<ProyekDenganRedFlag[]>
}

/**
 * Hero Beranda: teks di kiri, peta dot-matrix berbentuk wilayah Kota Bandung di kanan (desktop) dengan pin
 * proyek beranggaran yang interaktif. Di ponsel peta turun ke bawah teks.
 */
export function FlatProjectMap({ judul, deskripsi, aksi, proyek }: FlatProjectMapProps) {
  return (
    <PitaPenuh className="border-b border-border-soft bg-canvas-blue py-16 md:py-24" aria-labelledby="judul-hero">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10">
        <div>
          <LabelSeksi>Region: Indonesia (Bandung)</LabelSeksi>
          <h1
            id="judul-hero"
            className="mt-4 text-[36px] leading-[1.05] font-medium tracking-[-0.02em] text-balance text-ink-strong md:text-[56px] lg:text-[48px] xl:text-[56px]"
          >
            {judul}
          </h1>
          {deskripsi && <p className="mt-6 max-w-[640px] text-lg leading-[1.55] text-ink-muted">{deskripsi}</p>}
          {aksi && <div className="mt-8 flex flex-wrap gap-3">{aksi}</div>}
          <p className="mt-8 text-xs text-ink-subtle">
            Fokus pemantauan: Kota Bandung, Jawa Barat · <span className="tabular-nums">6,92° LS 107,62° BT</span>
          </p>
        </div>

        <PetaKotaBandung proyek={proyek} />
      </div>
    </PitaPenuh>
  )
}
