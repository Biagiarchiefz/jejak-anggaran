import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { IkonPin, KartuPin } from '../../proyek/components/KartuPinProyek'
import { Button } from '../../../components/common/Button'
import { LabelSeksi } from '../../../components/common/LabelSeksi'
import { PitaPenuh } from '../../../components/common/PitaPenuh'
import { BATAS_POLIGON_KOTA_BANDUNG } from '../../../data/batasKotaBandung'
import type { StateMuat } from '../../../hooks/useMuat'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { pilihProyekSorotan } from '../../../utils/filterProyek'
import { kotakBatas, pikselDalamSusunan, skalaAgarMuat, susunanTile, UKURAN_TILE, urlTileOsm, type Ukuran } from '../../../utils/petaTile'
import type { ProyekDenganRedFlag } from '../../../services/proyekService'

// Peta dipusatkan di tengah kotak batas kota (bukan alun-alun, yang terletak di barat) agar seluruh wilayah tampil seimbang.
const KOTAK_KOTA = kotakBatas(BATAS_POLIGON_KOTA_BANDUNG)
const LAT_TENGAH = (KOTAK_KOTA.selatan + KOTAK_KOTA.utara) / 2
const LNG_TENGAH = (KOTAK_KOTA.barat + KOTAK_KOTA.timur) / 2
// Zoom 12: wilayah kota ±565 × 390 px pada skala 1. Di wadah yang lebih sempit seluruh peta diperkecil (lihat `skala`),
// sedangkan pin tetap berukuran penuh agar mudah diketuk.
const ZOOM = 12
// 8 × 5 tile (2.048 × 1.280 px) menutup lapisan peta di sekitar titik jangkar sampai layar sangat lebar.
const SUSUNAN = susunanTile(LAT_TENGAH, LNG_TENGAH, ZOOM, 8, 5)
const SUDUT_BARAT_LAUT = pikselDalamSusunan(KOTAK_KOTA.utara, KOTAK_KOTA.barat, ZOOM, SUSUNAN)
const SUDUT_TENGGARA = pikselDalamSusunan(KOTAK_KOTA.selatan, KOTAK_KOTA.timur, ZOOM, SUSUNAN)
const UKURAN_KOTA: Ukuran = { lebar: SUDUT_TENGGARA.x - SUDUT_BARAT_LAUT.x, tinggi: SUDUT_TENGGARA.y - SUDUT_BARAT_LAUT.y }
// Ruang kosong di sekitar wilayah kota: kiri+kanan, atas+bawah (badan pin menjulang 32px di atas titiknya).
const JARAK_X = 48
const JARAK_Y = 88
// Desktop: 20% kiri lapisan tertutup gradien ke arah kolom teks, 64px atas tertutup header; kota dipusatkan di sisanya.
const KELAS_JANGKAR = 'absolute top-1/2 left-1/2 lg:top-[calc(50%+2rem)] lg:left-[60%]'

/** Posisi koordinat terhadap titik jangkar (pusat kota) setelah peta diskalakan. */
function posisiDiPeta(lat: number, lng: number, skala: number) {
  const { x, y } = pikselDalamSusunan(lat, lng, ZOOM, SUSUNAN)
  return { x: (x - SUSUNAN.titikX) * skala, y: (y - SUSUNAN.titikY) * skala }
}

/** Mengukur elemen (ResizeObserver). `null` sampai pengukuran pertama, atau bila browser tidak mendukungnya. */
function useUkuranElemen<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [ukuran, setUkuran] = useState<Ukuran | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const pengamat = new ResizeObserver(([entri]) => setUkuran({ lebar: entri.contentRect.width, tinggi: entri.contentRect.height }))
    pengamat.observe(el)
    return () => pengamat.disconnect()
  }, [])
  return [ref, ukuran] as const
}

/** Tile OSM grayscale yang dipusatkan di Kota Bandung. Dekoratif; titik pusat jatuh di `left`/`top` pembungkus. */
function TilePeta({ gayaGrid }: { gayaGrid: CSSProperties }) {
  return (
    <div className="absolute grayscale contrast-[1.05] brightness-[1.04] opacity-60" style={gayaGrid} aria-hidden>
      {SUSUNAN.tile.map((t) => (
        <img
          key={`${ZOOM}/${t.x}/${t.y}`}
          src={urlTileOsm(ZOOM, t.x, t.y)}
          alt=""
          width={UKURAN_TILE}
          height={UKURAN_TILE}
          decoding="async"
          fetchPriority="low"
          draggable={false}
          className="absolute max-w-none select-none"
          style={{ left: t.kiri, top: t.atas, width: UKURAN_TILE, height: UKURAN_TILE }}
        />
      ))}
    </div>
  )
}

/** Garis batas administratif Kota Bandung di atas tile, agar wilayah pantauan terbaca jelas. */
function GarisBatasKota({ gayaGrid }: { gayaGrid: CSSProperties }) {
  const titik = BATAS_POLIGON_KOTA_BANDUNG.map(([lng, lat]) => {
    const { x, y } = pikselDalamSusunan(lat, lng, ZOOM, SUSUNAN)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return (
    <svg
      viewBox={`0 0 ${SUSUNAN.lebar} ${SUSUNAN.tinggi}`}
      className="pointer-events-none absolute"
      style={gayaGrid}
      aria-hidden
    >
      {/* non-scaling-stroke: tebal garis dan putus-putusnya tetap sama walau peta diperkecil. */}
      <polygon
        points={titik.join(' ')}
        className="fill-brand/5 stroke-brand/60"
        strokeWidth={1.5}
        strokeDasharray="5 4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

type PinProyekProps = {
  proyek: ProyekDenganRedFlag
  x: number
  y: number
  aktif: boolean
  idKartu: string
  onPilih: () => void
}

/** Pin di koordinat proyek (relatif terhadap titik jangkar). Klik/ketuk membuka kartu keterangan; klik lagi menutupnya. */
function PinProyek({ proyek: p, x, y, aktif, idKartu, onPilih }: PinProyekProps) {
  return (
    // Titik nol = koordinat proyek; ujung bawah pin jatuh tepat di sini.
    <div className={`absolute ${aktif ? 'z-20' : 'z-10'}`} style={{ left: x, top: y }}>
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

/** Pesan di tengah peta untuk state memuat, galat, dan kosong. */
function PesanPeta({ children, peran }: { children: ReactNode; peran?: 'status' | 'alert' }) {
  return (
    <div role={peran} className="absolute inset-0 z-30 grid place-items-center p-4 text-center">
      <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-muted shadow-card">{children}</div>
    </div>
  )
}

type FlatProjectMapProps = {
  judul: ReactNode
  deskripsi?: ReactNode
  /** Satu tombol utama (DESIGN.md §7.1). Pencarian proyek ada di header. */
  aksi?: ReactNode
  proyek: StateMuat<ProyekDenganRedFlag[]>
}

/**
 * Hero Beranda. Latarnya peta OpenStreetMap grayscale yang berpusat di Kota Bandung (tile statis, tanpa Leaflet),
 * diberi gradien `canvas` agar teks tetap terbaca, dengan pin proyek dari Supabase.
 *
 * Desktop: teks di kiri, peta mengisi 60% kanan section, kartu proyek melayang di samping pinnya.
 * Ponsel/tablet: teks → strip peta selebar layar → kartu proyek.
 * Di setiap lebar layar seluruh wilayah kota diperkecil seperlunya agar semua pin terlihat dan tidak tertutup teks.
 */
export function FlatProjectMap({ judul, deskripsi, aksi, proyek }: FlatProjectMapProps) {
  const idKartu = useId()
  const refPeta = useRef<HTMLDivElement>(null)
  const [refLapisan, ukuranLapisan] = useUkuranElemen<HTMLDivElement>()
  const desktop = useMediaQuery('(min-width: 1024px)')

  // Ruang yang benar-benar terlihat di lapisan peta (lihat KELAS_JANGKAR), dikurangi jarak tepi.
  const ruang: Ukuran = ukuranLapisan
    ? {
        lebar: ukuranLapisan.lebar * (desktop ? 0.8 : 1) - JARAK_X,
        tinggi: ukuranLapisan.tinggi - (desktop ? 64 : 0) - JARAK_Y,
      }
    : { lebar: 0, tinggi: 0 }
  const skala = skalaAgarMuat(ruang, UKURAN_KOTA)
  const gayaGrid: CSSProperties = {
    width: SUSUNAN.lebar,
    height: SUSUNAN.tinggi,
    transformOrigin: '0 0',
    transform: `translate(${-SUSUNAN.titikX * skala}px, ${-SUSUNAN.titikY * skala}px) scale(${skala})`,
  }

  // undefined = belum disentuh, null = ditutup pengguna. Sebelum disentuh, kartu proyek sorotan hanya terbuka di
  // ponsel/tablet (di bawah peta); di desktop kartu melayang baru muncul saat pin diklik agar tidak menutupi pin lain.
  const [idPilihan, setIdPilihan] = useState<string | null | undefined>(undefined)

  const semua = proyek.data ?? []
  const idAktif = idPilihan === undefined ? (desktop ? undefined : pilihProyekSorotan(semua, 1)[0]?.id) : idPilihan
  const pilihan = semua.find((p) => p.id === idAktif)
  const memuatAwal = proyek.memuat && !proyek.data

  // Kartu ditutup dengan Esc atau klik di luar peta.
  const kartuTerbuka = !!pilihan
  useEffect(() => {
    if (!kartuTerbuka) return
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
  }, [kartuTerbuka])

  // Tooltip berpusat di pin dan condong ke pusat kota agar tidak keluar dari lapisan peta:
  // pin di selatan pusat → kartu di atas pin (ekor di bawah), pin di utara → kartu di bawah pin (ekor di atas).
  const posisiPilihan = pilihan && posisiDiPeta(pilihan.lat, pilihan.lng, skala)
  const kartuDiAtas = !!posisiPilihan && posisiPilihan.y > 0

  return (
    // -mt-16: hero ditarik ke belakang header (64px) yang transparan di Beranda, jadi latar peta menerus sampai atas layar.
    // Padding atas ditambah 64px agar isi tidak tertutup header.
    // Setinggi layar (dvh: tidak terpotong bilah alamat ponsel); isinya di tengah secara vertikal. Desktop minimal 40rem
    // agar peta dan tooltip tetap lega di layar yang pendek. `[&>div]:w-full`: kontainer PitaPenuh tidak menyusut di flex.
    <PitaPenuh
      className="relative -mt-16 flex min-h-dvh flex-col justify-center border-b border-border-soft bg-canvas pt-26 pb-10 md:pt-32 md:pb-14 lg:h-dvh lg:min-h-160 lg:pt-16 lg:pb-0 [&>div]:w-full"
      aria-labelledby="judul-hero"
    >
      {/* Tanpa `relative` di grid: di desktop lapisan peta diposisikan terhadap section (selebar layar). */}
      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:py-10">
        <div className="relative z-10 max-w-xl">
          <LabelSeksi>Pemantauan anggaran Kota Bandung</LabelSeksi>
          <h1
            id="judul-hero"
            className="mt-4 text-[36px] leading-[1.05] font-medium tracking-[-0.02em] text-balance text-ink-strong md:text-[56px] lg:text-[48px] xl:text-[56px]"
          >
            {judul}
          </h1>
          {deskripsi && <p className="mt-6 max-w-[560px] text-lg leading-[1.55] text-ink-muted">{deskripsi}</p>}
          {aksi && <div className="mt-8">{aksi}</div>}
        </div>

        <div ref={refPeta} className="lg:contents">
          {/* Lapisan peta. Ponsel/tablet: strip selebar layar di bawah teks. Desktop: 60% kanan section, setinggi section. */}
          <div
            ref={refLapisan}
            className="relative z-0 -mx-4 h-80 overflow-hidden bg-canvas sm:-mx-6 sm:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:left-[40%] lg:mx-0 lg:h-auto"
          >
            <div className={KELAS_JANGKAR}>
              <TilePeta gayaGrid={gayaGrid} />
            </div>

            {/* Gradien ke warna kanvas: tepi atas/bawah selalu, tepi kiri di desktop (menyatu dengan kolom teks). */}
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-canvas),transparent_22%,transparent_78%,var(--color-canvas))] lg:bg-[linear-gradient(to_right,var(--color-canvas),transparent_32%),linear-gradient(to_bottom,var(--color-canvas),transparent_18%,transparent_70%,var(--color-canvas))]"
              aria-hidden
            />

            <div className={KELAS_JANGKAR}>
              <GarisBatasKota gayaGrid={gayaGrid} />
              {semua.length > 0 && (
                <ul aria-label="Proyek di Kota Bandung">
                  {semua.map((p) => {
                    const { x, y } = posisiDiPeta(p.lat, p.lng, skala)
                    return (
                      <li key={p.id}>
                        <PinProyek
                          proyek={p}
                          x={x}
                          y={y}
                          aktif={p.id === pilihan?.id}
                          idKartu={idKartu}
                          onPilih={() => setIdPilihan((id) => (id === p.id || (id === undefined && p.id === idAktif) ? null : p.id))}
                        />
                      </li>
                    )
                  })}
                </ul>
              )}

              {desktop && pilihan && posisiPilihan && (
                <KartuPin
                  proyek={pilihan}
                  id={idKartu}
                  onTutup={() => setIdPilihan(null)}
                  ekor={kartuDiAtas ? 'bawah' : 'atas'}
                  className={`absolute z-30 w-64 -translate-x-1/2 ${kartuDiAtas ? '-translate-y-full' : ''}`}
                  // Ujung pin di (x, y), badannya 32px di atasnya (membesar saat aktif); ekor tooltip 12px dari pin.
                  style={{ left: posisiPilihan.x, top: kartuDiAtas ? posisiPilihan.y - 52 : posisiPilihan.y + 12 }}
                />
              )}
            </div>

            {memuatAwal ? (
              <PesanPeta peran="status">
                <span className="animate-pulse">Memuat proyek…</span>
              </PesanPeta>
            ) : proyek.error ? (
              <PesanPeta peran="alert">
                <p className="text-danger">Proyek gagal dimuat.</p>
                <Button varian="kedua" ukuran="sm" className="mt-2" onClick={proyek.muatUlang}>
                  Coba lagi
                </Button>
              </PesanPeta>
            ) : semua.length === 0 ? (
              <PesanPeta>Belum ada proyek yang dipantau.</PesanPeta>
            ) : null}

            <div className="absolute right-2 bottom-2 z-30 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 rounded-full bg-surface/90 px-3 py-1 text-[11px] text-ink-subtle lg:right-4 lg:bottom-4">
              <ul className="flex gap-x-3" aria-label="Keterangan pin">
                <li className="flex items-center gap-1">
                  <IkonPin className="size-3.5" />
                  Proyek
                </li>
                <li className="flex items-center gap-1">
                  <IkonPin perluPerhatian className="size-3.5" />
                  Perlu perhatian
                </li>
              </ul>
              {/* Atribusi tile dan batas wilayah: wajib menurut lisensi ODbL. */}
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">
                © OpenStreetMap
                <span className="sr-only"> (membuka tab baru)</span>
              </a>
            </div>
          </div>

          {!desktop && pilihan && (
            <KartuPin proyek={pilihan} id={idKartu} onTutup={() => setIdPilihan(null)} className="relative mx-auto mt-3 max-w-sm" />
          )}
        </div>
      </div>
    </PitaPenuh>
  )
}
