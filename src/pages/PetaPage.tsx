import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Link } from 'react-router'
import { BadgeRedFlag } from '../components/BadgeRedFlag'
import { BadgeStatusProyek } from '../components/BadgeStatus'
import { LembarProyek } from '../components/LembarProyek'
import { PetaProyek, type PermintaanFokus } from '../components/PetaProyek'
import { SumberData } from '../components/SumberData'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { KepalaHalaman } from '../components/ui/KepalaHalaman'
import { Pilihan } from '../components/ui/Pilihan'
import { Skeleton } from '../components/ui/Skeleton'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useProyekList } from '../hooks/useProyekList'
import { cariProyek, daftarKecamatan, FILTER_AWAL, saringProyek, type FilterProyek } from '../lib/filterProyek'
import { formatRupiahRingkas } from '../lib/format'
import { LABEL_STATUS_PROYEK } from '../lib/label'
import { Constants } from '../types/database'
import type { ProyekDenganRedFlag } from '../services/proyekService'

type DaftarProyekProps = {
  proyek: ProyekDenganRedFlag[]
  terpilihId: string | null
  onPilih: (id: string) => void
  /** Desktop: gulir daftar ke proyek yang dipilih lewat peta. */
  gulirKeTerpilih: boolean
}

/** Daftar proyek yang tersinkron dengan peta: klik kartu = sorot dan pusatkan pin-nya di peta. */
function DaftarProyek({ proyek, terpilihId, onPilih, gulirKeTerpilih }: DaftarProyekProps) {
  const refTerpilih = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (gulirKeTerpilih && terpilihId) refTerpilih.current?.scrollIntoView({ block: 'nearest' })
  }, [terpilihId, gulirKeTerpilih])

  return (
    <ul className="space-y-3">
      {proyek.map((p) => {
        const terpilih = p.id === terpilihId
        return (
          <li
            key={p.id}
            ref={terpilih ? refTerpilih : undefined}
            className={`relative rounded-lg border p-4 transition-[border-color,box-shadow,background-color,translate] duration-[240ms] outline-offset-2 outline-brand has-[button:focus-visible]:outline-2 ${
              terpilih ? 'border-brand bg-brand-soft/40 shadow-card' : 'border-border bg-surface hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card motion-reduce:hover:translate-y-0'
            }`}
          >
            <button
              type="button"
              onClick={() => onPilih(p.id)}
              aria-pressed={terpilih}
              className="block w-full text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
            >
              <span className="block leading-snug font-semibold text-ink-strong">{p.nama_paket}</span>
              <span className="mt-1 block text-sm text-ink-muted">
                Kec. {p.kecamatan} · Pagu <span className="font-semibold text-ink tabular-nums">{formatRupiahRingkas(p.pagu)}</span>
              </span>
              <span className="sr-only">. Tampilkan di peta.</span>
            </button>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <BadgeStatusProyek status={p.status_proyek} />
              {p.redFlag && <BadgeRedFlag alasan={p.redFlag.alasan} />}
            </div>
            {/* Di atas tombol yang diregangkan agar tautan tetap bisa diklik sendiri. */}
            <div className="relative z-[1]">
              <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} dalamKartu />
              <Link
                to={`/proyek/${p.id}`}
                className="group mt-2 inline-flex items-center gap-1 text-sm font-medium text-link hover:underline"
              >
                Lihat detail proyek
                <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
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

export default function PetaPage() {
  const { data, error, memuat, muatUlang } = useProyekList()
  const [filter, setFilter] = useState<FilterProyek>(FILTER_AWAL)
  const [kata, setKata] = useState('')
  const [terpilihId, setTerpilihId] = useState<string | null>(null)
  const [fokus, setFokus] = useState<PermintaanFokus | null>(null)
  const desktop = useMediaQuery('(min-width: 1024px)')
  const refPeta = useRef<HTMLDivElement>(null)

  const semua = data ?? []
  const tersaringFilter = saringProyek(semua, filter)
  const tersaring = kata.trim() ? cariProyek(tersaringFilter, kata) : tersaringFilter
  const kecamatan = daftarKecamatan(semua)
  const jumlahRedFlag = tersaring.filter((p) => p.redFlag).length
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
        judul="Peta proyek Kota Bandung"
        deskripsi="Pilih titik di peta untuk melihat pagu, status, dan laporan warga. Semua proyek juga tersedia dalam bentuk daftar."
      />

      <form className="space-y-3" onSubmit={(e) => e.preventDefault()} aria-label="Saring proyek">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-h-11 flex-1 items-center gap-3 rounded-md border border-border bg-surface px-3.5 transition-colors hover:border-border-strong focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30">
            <Search className="size-5 shrink-0 text-ink-subtle" strokeWidth={1.5} aria-hidden />
            <span className="sr-only">Cari proyek</span>
            <input
              type="search"
              value={kata}
              onChange={(e) => setKata(e.target.value)}
              placeholder="Cari nama proyek, kelurahan, atau pelaksana…"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-ink-subtle"
            />
          </label>
          <Pilihan
            label="Kecamatan"
            labelTersembunyi
            nilai={filter.kecamatan}
            opsi={[{ nilai: 'semua', label: 'Semua kecamatan' }, ...kecamatan.map((k) => ({ nilai: k, label: k }))]}
            onUbah={(k) => setFilter((f) => ({ ...f, kecamatan: k }))}
            className="sm:w-56"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Status proyek">
          <Chip aktif={filter.status === 'semua'} onClick={() => setFilter((f) => ({ ...f, status: 'semua' }))}>
            Semua status
          </Chip>
          {Constants.public.Enums.status_proyek.map((s) => (
            <Chip key={s} aktif={filter.status === s} onClick={() => setFilter((f) => ({ ...f, status: s }))}>
              {LABEL_STATUS_PROYEK[s]}
            </Chip>
          ))}
        </div>
      </form>

      {memuat && !data ? (
        <div role="status" className="grid gap-6 lg:grid-cols-3">
          <span className="sr-only">Memuat peta proyek…</span>
          <Skeleton className="h-[50vh] min-h-80 rounded-lg md:h-[60vh] lg:col-span-2" />
          <Skeleton className="hidden h-[60vh] rounded-lg lg:block" />
        </div>
      ) : error ? (
        <ErrorState pesan={error.pesan} onCobaLagi={muatUlang} />
      ) : semua.length === 0 ? (
        <EmptyState judul="Belum ada data proyek" pesan="Data proyek sedang dikurasi dari SiRUP dan LPSE Kota Bandung." />
      ) : (
        <>
          <p className="text-sm text-ink-muted" role="status">
            Menampilkan <span className="font-medium text-ink tabular-nums">{tersaring.length}</span> dari {semua.length} proyek
            {jumlahRedFlag > 0 && <>, {jumlahRedFlag} perlu perhatian</>}.
          </p>
          <div className="grid gap-6 lg:grid-cols-3">
            <div ref={refPeta} className="scroll-mt-20 lg:sticky lg:top-20 lg:col-span-2 lg:self-start">
              <PetaProyek
                proyek={tersaring}
                terpilihId={terpilih?.id ?? null}
                fokus={fokus}
                onPilih={setTerpilihId}
                denganPopup={desktop}
              />
            </div>
            <section aria-labelledby="judul-daftar" className="min-w-0">
              <h2 id="judul-daftar" className="mb-3 text-xl leading-[1.25] font-semibold tracking-[-0.005em]">
                Daftar proyek
              </h2>
              {tersaring.length === 0 ? (
                <EmptyState
                  judul="Tidak ada proyek yang cocok"
                  pesan="Coba ubah kata kunci atau hapus saringan status dan kecamatan."
                  aksi={
                    <Button varian="kedua" onClick={hapusSaringan}>
                      Hapus saringan
                    </Button>
                  }
                />
              ) : (
                <div className="lg:max-h-[60vh] lg:overflow-y-auto lg:p-1">
                  <DaftarProyek
                    proyek={tersaring}
                    terpilihId={terpilih?.id ?? null}
                    onPilih={pilihDariDaftar}
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
