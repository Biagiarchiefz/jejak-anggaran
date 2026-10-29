import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, MapPin, SlidersHorizontal, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { BadgeRedFlag } from '../components/common/BadgeRedFlag'
import { BadgeStatusProyek } from '../components/common/BadgeStatus'
import { LembarProyek } from '../features/proyek/components/LembarProyek'
import { PetaProyek, type PermintaanFokus } from '../features/proyek/components/PetaProyek'
import { SumberData } from '../components/common/SumberData'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { KepalaHalaman } from '../components/common/KepalaHalaman'
import { KolomCari } from '../components/common/KolomCari'
import { Laci } from '../components/common/Laci'
import { Pilihan } from '../components/common/Pilihan'
import { Skeleton } from '../components/common/Skeleton'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useProyekList } from '../features/proyek/hooks/useProyekList'
import {
  cariProyek,
  daftarKecamatan,
  FILTER_AWAL,
  filterDariParams,
  jumlahFilterAktif,
  saringProyek,
  type FilterProyek,
} from '../utils/filterProyek'
import { formatRupiahRingkas } from '../utils/format'
import { fotoIlustrasiProyek, urlFotoUnsplash } from '../utils/fotoIlustrasi'
import { LABEL_STATUS_PROYEK } from '../utils/label'
import { Constants } from '../types/database'
import type { ProyekDenganRedFlag } from '../services/proyekService'

type DaftarProyekProps = {
  proyek: ProyekDenganRedFlag[]
  terpilihId: string | null
  onPilih: (id: string) => void
  /** Proyek yang pinnya sedang disorot di peta (atau kartunya disorot kursor). */
  sorotId: string | null
  onSorot: (id: string | null) => void
  /** Desktop: gulir daftar ke proyek yang dipilih lewat peta. */
  gulirKeTerpilih: boolean
}

/**
 * Daftar proyek ringkas yang tersinkron dua arah dengan peta: klik kartu = peta terbang ke pinnya;
 * klik pin = kartu tersorot dan digulir ke pandangan; kursor di kartu/pin = pasangannya ikut menyala.
 */
function DaftarProyek({ proyek, terpilihId, onPilih, sorotId, onSorot, gulirKeTerpilih }: DaftarProyekProps) {
  const refTerpilih = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (gulirKeTerpilih && terpilihId) refTerpilih.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [terpilihId, gulirKeTerpilih])

  return (
    <ul className="space-y-2">
      {proyek.map((p) => {
        const terpilih = p.id === terpilihId
        const disorot = !terpilih && p.id === sorotId
        const ilustrasi = p.foto_path ? null : fotoIlustrasiProyek(p.nama_paket)
        return (
          <li
            key={p.id}
            ref={terpilih ? refTerpilih : undefined}
            onPointerEnter={() => onSorot(p.id)}
            onPointerLeave={() => onSorot(null)}
            className={`relative flex scroll-my-2 gap-3 rounded-md border p-2.5 transition-[border-color,box-shadow,background-color] duration-200 outline-offset-2 outline-brand has-[button:focus-visible]:outline-2 ${
              terpilih
                ? 'border-brand bg-brand-soft/50 shadow-card'
                : disorot
                  ? 'border-border-strong bg-surface shadow-card'
                  : 'border-border bg-surface'
            }`}
          >
            {/* Garis aksen kiri menandai proyek yang sedang dipilih di peta. */}
            {terpilih && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-action" aria-hidden />}

            <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-recessed">
              <img
                src={ilustrasi ? urlFotoUnsplash(ilustrasi.id, 160) : (p.foto_path ?? undefined)}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
              <span
                className={`absolute right-1 bottom-1 size-2.5 rounded-full border-2 border-white ${p.redFlag ? 'bg-danger' : 'bg-brand'}`}
                aria-hidden
              />
            </div>

            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onPilih(p.id)}
                aria-pressed={terpilih}
                className="block w-full pr-7 text-left after:absolute after:inset-0 after:rounded-md focus-visible:outline-none"
              >
                <span className="line-clamp-2 text-sm leading-snug font-semibold text-ink-strong">{p.nama_paket}</span>
                <span className="sr-only">. Tampilkan di peta.</span>
              </button>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                <MapPin className="size-3 shrink-0 text-ink-subtle" strokeWidth={1.5} aria-hidden />
                <span className="truncate">
                  Kec. {p.kecamatan} · TA {p.tahun_anggaran}
                </span>
              </p>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-wrap gap-1">
                  <BadgeStatusProyek status={p.status_proyek} ringkas />
                  {p.redFlag && <BadgeRedFlag alasan={p.redFlag.alasan} ringkas />}
                </div>
                <span className="shrink-0 text-sm font-semibold text-ink-strong tabular-nums">{formatRupiahRingkas(p.pagu)}</span>
              </div>
              {/* Di atas tombol yang diregangkan agar tautan sumber tetap bisa diklik sendiri. */}
              <div className="relative z-1">
                <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} className="mt-1" />
              </div>
            </div>

            <Link
              to={`/proyek/${p.id}`}
              aria-label={`Detail proyek ${p.nama_paket}`}
              className="absolute top-1.5 right-1.5 z-1 grid size-8 place-items-center rounded-md text-ink-subtle efek-tekan hover:bg-recessed hover:text-action"
            >
              <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** Chip filter (DESIGN.md §7.6): aktif bg-ink teks putih; tidak aktif putih berborder. */
function Chip({ aktif, onClick, children }: { aktif: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium efek-tekan ${
        aktif ? 'bg-action text-white' : 'border border-border bg-surface text-ink hover:border-border-strong'
      }`}
    >
      {children}
    </button>
  )
}

type ChipStatusProps = { filter: FilterProyek; setFilter: (ubah: (f: FilterProyek) => FilterProyek) => void }

/** Chip "Semua status" + satu chip per status proyek. Dipakai di baris saringan desktop dan lembar saringan ponsel. */
function ChipStatus({ filter, setFilter }: ChipStatusProps) {
  return (
    <>
      <Chip aktif={filter.status === 'semua'} onClick={() => setFilter((f) => ({ ...f, status: 'semua' }))}>
        Semua status
      </Chip>
      {Constants.public.Enums.status_proyek.map((s) => (
        <Chip key={s} aktif={filter.status === s} onClick={() => setFilter((f) => ({ ...f, status: s }))}>
          {LABEL_STATUS_PROYEK[s]}
        </Chip>
      ))}
    </>
  )
}

export default function PetaPage() {
  const { data, error, memuat, muatUlang } = useProyekList()
  // Kata kunci dan saringan awal dari URL (`?cari=…&kecamatan=…&status=…`, mis. dari panel cari
  // di header). Bila URL berubah saat halaman ini sudah terbuka, kolom cari dan saringan ikut diperbarui.
  const [params] = useSearchParams()
  const kunciUrl = params.toString()
  const [kunciUrlSebelumnya, setKunciUrlSebelumnya] = useState(kunciUrl)
  const [kata, setKata] = useState(params.get('cari') ?? '')
  const [filter, setFilter] = useState<FilterProyek>(() => filterDariParams(params))
  if (kunciUrl !== kunciUrlSebelumnya) {
    setKunciUrlSebelumnya(kunciUrl)
    setKata(params.get('cari') ?? '')
    setFilter(filterDariParams(params))
  }
  const [terpilihId, setTerpilihId] = useState<string | null>(null)
  const [fokus, setFokus] = useState<PermintaanFokus | null>(null)
  const [lembarFilter, setLembarFilter] = useState(false)
  // Sorotan hover bersama peta ↔ daftar (tidak memilih, hanya menyalakan pasangannya).
  const [sorotId, setSorotId] = useState<string | null>(null)
  const desktop = useMediaQuery('(min-width: 1024px)')
  // Mulai `sm` saringan tampil langsung di halaman, jadi lembar saringan ditutup bila layar melebar.
  const layarSm = useMediaQuery('(min-width: 640px)')
  const refPeta = useRef<HTMLDivElement>(null)

  const semua = data ?? []
  const tersaringFilter = saringProyek(semua, filter)
  const tersaring = kata.trim() ? cariProyek(tersaringFilter, kata) : tersaringFilter
  const kecamatan = daftarKecamatan(semua)
  const jumlahRedFlag = tersaring.filter((p) => p.redFlag).length
  const jumlahAktif = jumlahFilterAktif(filter)
  // Proyek yang tersaring keluar otomatis tidak lagi terpilih.
  const terpilih = tersaring.find((p) => p.id === terpilihId) ?? null

  const tutupLembar = useCallback(() => setTerpilihId(null), [])

  function hapusSaringan() {
    setFilter(FILTER_AWAL)
    setKata('')
  }

  function pilihDariDaftar(id: string) {
    setTerpilihId(id)
    setFokus((f) => ({ id, n: (f?.n ?? 0) + 1 }))
    // Ponsel: daftar ada di bawah peta, jadi gulir kembali ke peta agar pin dan bottom sheet terlihat.
    if (!desktop) refPeta.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <div className="space-y-6">
      <title>Peta Proyek — Jejak Anggaran</title>
      <KepalaHalaman
        eyebrow="Proyek beranggaran"
        judul="Peta proyek Kota Bandung"
        deskripsi="Pilih titik di peta untuk melihat pagu, status, dan laporan warga. Semua proyek juga tersedia dalam bentuk daftar."
      />

      <form className="space-y-3" onSubmit={(e) => e.preventDefault()} aria-label="Saring proyek">
        <div className="flex gap-2 sm:gap-3">
          <KolomCari
            label="Cari proyek"
            nilai={kata}
            onUbah={setKata}
            placeholder="Cari nama proyek, kelurahan, atau pelaksana…"
            className="min-h-11 flex-1"
          />

          {/* Ponsel: kecamatan dan status dipindah ke lembar saringan, dibuka lewat satu ikon di samping kolom cari. */}
          <button
            type="button"
            onClick={() => setLembarFilter(true)}
            aria-haspopup="dialog"
            aria-label={`Saringan${jumlahAktif > 0 ? `, ${jumlahAktif} aktif` : ''}`}
            className={`relative grid size-11 shrink-0 place-items-center rounded-md border efek-tekan sm:hidden ${
              jumlahAktif > 0 ? 'border-brand bg-brand-soft text-action' : 'border-border bg-surface text-ink hover:border-border-strong'
            }`}
          >
            <SlidersHorizontal className="size-5" strokeWidth={1.5} aria-hidden />
            {jumlahAktif > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-action text-[11px] font-medium text-white tabular-nums ring-2 ring-canvas"
                aria-hidden
              >
                {jumlahAktif}
              </span>
            )}
          </button>

          <Pilihan
            label="Kecamatan"
            labelTersembunyi
            nilai={filter.kecamatan}
            opsi={[{ nilai: 'semua', label: 'Semua kecamatan' }, ...kecamatan.map((k) => ({ nilai: k, label: k }))]}
            onUbah={(k) => setFilter((f) => ({ ...f, kecamatan: k }))}
            className="hidden sm:block sm:w-56"
          />
        </div>
        <div className="hidden flex-wrap items-center gap-2 sm:flex" role="group" aria-label="Status proyek">
          <ChipStatus filter={filter} setFilter={setFilter} />
        </div>
      </form>

      <Laci
        terbuka={lembarFilter && !layarSm}
        onTutup={() => setLembarFilter(false)}
        label="Saringan proyek"
        arah="bawah"
        className="mx-0 mt-auto mb-0 max-h-[85dvh]! w-full overflow-y-auto rounded-t-xl p-0"
      >
        <div className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto h-1 w-10 rounded-full bg-border-strong" aria-hidden />
          <div className="mt-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-normal">Saringan</h2>
            <button
              type="button"
              onClick={() => setLembarFilter(false)}
              aria-label="Tutup saringan"
              className="-mr-2 grid size-11 place-items-center rounded-full text-ink hover:bg-recessed"
            >
              <X className="size-5" strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          <fieldset className="mt-3">
            <legend className="text-sm font-medium text-ink">Status proyek</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <ChipStatus filter={filter} setFilter={setFilter} />
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-ink">Kecamatan</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip aktif={filter.kecamatan === 'semua'} onClick={() => setFilter((f) => ({ ...f, kecamatan: 'semua' }))}>
                Semua kecamatan
              </Chip>
              {kecamatan.map((k) => (
                <Chip key={k} aktif={filter.kecamatan === k} onClick={() => setFilter((f) => ({ ...f, kecamatan: k }))}>
                  {k}
                </Chip>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            <Button varian="tipis" className="px-4" onClick={() => setFilter(FILTER_AWAL)} disabled={jumlahAktif === 0}>
              Atur ulang
            </Button>
            <Button className="flex-1 whitespace-nowrap" onClick={() => setLembarFilter(false)}>
              Tampilkan {tersaring.length} proyek
            </Button>
          </div>
        </div>
      </Laci>

      {memuat && !data ? (
        <div role="status" className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
          <span className="sr-only">Memuat peta proyek…</span>
          <Skeleton className="h-[50vh] min-h-80 rounded-lg md:h-[60vh]" />
          <Skeleton className="hidden h-[60vh] rounded-lg lg:block" />
        </div>
      ) : error ? (
        <ErrorState halaman pesan={error.pesan} onCobaLagi={muatUlang} />
      ) : semua.length === 0 ? (
        <EmptyState judul="Belum ada data proyek" pesan="Data proyek sedang dikurasi dari SiRUP dan LPSE Kota Bandung." />
      ) : (
        <>
          <p className="text-sm text-ink-muted" role="status">
            Menampilkan <span className="font-medium text-ink tabular-nums">{tersaring.length}</span> dari {semua.length} proyek
            {jumlahRedFlag > 0 && <>, {jumlahRedFlag} perlu perhatian</>}.
          </p>
          {/* Split-screen desktop: peta lebar di kiri, panel daftar setinggi peta di kanan (bergulir sendiri). */}
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
            <div ref={refPeta} className="min-w-0 scroll-mt-20 lg:sticky lg:top-20 lg:self-start">
              <PetaProyek
                proyek={tersaring}
                terpilihId={terpilih?.id ?? null}
                fokus={fokus}
                onPilih={setTerpilihId}
                sorotId={sorotId}
                onSorot={setSorotId}
                denganPopup={desktop}
              />
            </div>
            <section
              aria-labelledby="judul-daftar"
              className="min-w-0 rounded-lg border border-border bg-surface shadow-edge lg:flex lg:h-[max(60vh,20rem)] lg:flex-col"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 id="judul-daftar" className="text-base font-semibold tracking-normal text-ink-strong">
                  Daftar proyek
                </h2>
                <span className="rounded-full bg-recessed px-2 py-0.5 text-xs font-medium text-ink-muted tabular-nums">
                  {tersaring.length} dari {semua.length}
                </span>
              </div>
              {tersaring.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    judul="Tidak ada proyek yang cocok"
                    pesan="Coba ubah kata kunci atau hapus saringan status dan kecamatan."
                    aksi={
                      <Button varian="kedua" onClick={hapusSaringan}>
                        Hapus saringan
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="p-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                  <DaftarProyek
                    proyek={tersaring}
                    terpilihId={terpilih?.id ?? null}
                    onPilih={pilihDariDaftar}
                    sorotId={sorotId}
                    onSorot={setSorotId}
                    gulirKeTerpilih={desktop}
                  />
                </div>
              )}
            </section>
          </div>
        </>
      )}

      {/* Ponsel & tablet: ringkasan proyek terpilih sebagai bottom sheet. */}
      {!desktop && terpilih && <LembarProyek key={terpilih.id} proyek={terpilih} onTutup={tutupLembar} />}
    </div>
  )
}
