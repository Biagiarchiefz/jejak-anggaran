import { useId, useMemo, useState, type FormEvent } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, CircleCheck, Flag, ImageOff, Lock, SlidersHorizontal, ThumbsUp, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { Badge } from '../../../components/common/Badge'
import { BadgeStatusLaporan } from '../../../components/common/BadgeStatus'
import { Button } from '../../../components/common/Button'
import { EmptyState } from '../../../components/common/EmptyState'
import { KELAS_GALAT, KELAS_INPUT, KELAS_LABEL } from '../../../components/common/gayaForm'
import { KolomCari } from '../../../components/common/KolomCari'
import { Laci } from '../../../components/common/Laci'
import { LinimasaStatus } from '../../../components/common/LinimasaStatus'
import { Pilihan } from '../../../components/common/Pilihan'
import { useAuth } from '../../../hooks/useAuth'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { pesanError } from '../../../utils/errors'
import { formatTanggalJam, formatWaktuRelatif } from '../../../utils/format'
import { bisaUbahLaporan } from '../../../utils/peran'
import { LABEL_KATEGORI, LABEL_STATUS_LAPORAN, LABEL_STATUS_PROYEK } from '../../../utils/label'
import { antreanPrioritas } from '../../../utils/ringkasanAdmin'
import {
  FILTER_LAPORAN_AWAL,
  JENIS_DATA,
  URUTAN_LAPORAN,
  filterLaporanDariParams,
  filterLaporanKeParams,
  hitungPerStatus,
  jumlahSaringanAktif,
  saringLaporanAdmin,
  type FilterLaporanAdmin,
  type JenisData,
  type UrutanLaporan,
} from '../../../utils/saringLaporanAdmin'
import { errorPerField, ubahStatusSchema } from '../../../utils/schemas'
import { statusBerikutnya, type StatusLaporan } from '../../../utils/statusLaporan'
import { ubahStatusLaporan, type LaporanAdmin } from '../../../services/adminService'
import { Constants } from '../../../types/database'

/** Baris yang tampil sekaligus; sisanya lewat tombol "Tampilkan lagi" agar daftar panjang tetap ringan. */
const PER_HALAMAN = 20

const LABEL_URUTAN: Record<UrutanLaporan, string> = {
  prioritas: 'Urut: prioritas',
  terbaru: 'Urut: terbaru',
  terlama: 'Urut: terlama',
  konfirmasi: 'Urut: konfirmasi terbanyak',
}
const LABEL_URUTAN_PENDEK: Record<UrutanLaporan, string> = {
  prioritas: 'Prioritas',
  terbaru: 'Terbaru',
  terlama: 'Terlama',
  konfirmasi: 'Konfirmasi terbanyak',
}
const LABEL_JENIS: Record<JenisData, string> = { semua: 'Semua data', nyata: 'Data nyata', demo: 'Data demo' }

/** Penanda laporan yang bila diverifikasi membuat proyeknya terkena tanda "perlu perhatian". */
function TandaPrioritas() {
  return (
    <Badge nada="bahaya" ringkas title="Bila diverifikasi, proyek ini mencapai ambang tanda perlu perhatian">
      <Flag className="size-3" strokeWidth={1.5} aria-hidden />
      Prioritas
    </Badge>
  )
}

function FotoMini({ url, className }: { url: string | null; className?: string }) {
  return url ? (
    <img src={url} alt="" loading="lazy" decoding="async" className={`shrink-0 rounded-md bg-recessed object-cover ${className ?? ''}`} />
  ) : (
    <span className={`grid shrink-0 place-items-center rounded-md bg-recessed text-ink-subtle ${className ?? ''}`} aria-hidden>
      <ImageOff className="size-4" strokeWidth={1.5} />
    </span>
  )
}

function FormUbahStatus({ laporan, onBerhasil }: { laporan: LaporanAdmin; onBerhasil: (status: StatusLaporan) => void }) {
  const peran = useAuth().pengguna?.peran
  const pilihan = statusBerikutnya(laporan.status)
  const id = useId()
  const [status, setStatus] = useState<StatusLaporan | ''>(pilihan[0] ?? '')
  const [catatan, setCatatan] = useState('')
  const [errorField, setErrorField] = useState<Record<string, string>>({})
  const [errorKirim, setErrorKirim] = useState<string | null>(null)
  const [mengirim, setMengirim] = useState(false)

  if (pilihan.length === 0) return <p className="text-sm text-ink-muted">Status akhir, tidak bisa diubah lagi.</p>
  if (!bisaUbahLaporan(peran, laporan)) {
    return (
      <p className="flex items-start gap-2 rounded-md bg-canvas-soft px-3.5 py-3 text-sm text-ink-muted">
        <Lock className="mt-0.5 size-4 shrink-0 text-ink-subtle" strokeWidth={1.5} aria-hidden />
        Ini laporan warga sungguhan. Akun admin demo hanya bisa mengubah status laporan demo.
      </p>
    )
  }

  async function simpan(e: FormEvent) {
    e.preventDefault()
    setErrorKirim(null)
    const hasil = ubahStatusSchema.safeParse({ status: status || undefined, catatan })
    if (!hasil.success) {
      setErrorField(errorPerField(hasil.error))
      return
    }
    setErrorField({})
    setMengirim(true)
    try {
      await ubahStatusLaporan(laporan.id, hasil.data.status, hasil.data.catatan)
      onBerhasil(hasil.data.status)
    } catch (err) {
      setErrorKirim(pesanError(err))
      setMengirim(false)
    }
  }

  return (
    <form onSubmit={simpan} noValidate className="space-y-3">
      {/* Pilihan status berikutnya hanya 1–2, jadi cukup chip radio: satu klik, tanpa membuka dropdown. */}
      <fieldset>
        <legend className={KELAS_LABEL}>Status baru</legend>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {pilihan.map((s) => (
            <label
              key={s}
              className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium efek-tekan has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                status === s
                  ? s === 'ditolak'
                    ? 'border-danger bg-danger-soft text-danger'
                    : 'border-action bg-brand-soft text-action'
                  : 'border-border bg-surface text-ink hover:border-border-strong'
              }`}
            >
              <input type="radio" name={`${id}-status`} value={s} checked={status === s} onChange={() => setStatus(s)} className="sr-only" />
              {LABEL_STATUS_LAPORAN[s]}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className={KELAS_LABEL}>
          Catatan untuk publik{' '}
          {status === 'ditolak' ? <span className="text-ink-subtle">*</span> : <span className="font-normal text-ink-subtle">(opsional)</span>}
        </span>
        <textarea
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          rows={3}
          placeholder={status === 'ditolak' ? 'Jelaskan alasan penolakan untuk pelapor dan publik.' : 'Mis. "Sudah diteruskan ke dinas terkait."'}
          aria-invalid={!!errorField.catatan}
          aria-describedby={errorField.catatan ? `${id}-catatan` : undefined}
          className={`mt-1.5 ${KELAS_INPUT}`}
        />
      </label>
      {errorField.catatan && (
        <p id={`${id}-catatan`} className={KELAS_GALAT}>
          {errorField.catatan}
        </p>
      )}
      {errorKirim && (
        <p role="alert" className="text-sm text-danger">
          {errorKirim}
        </p>
      )}
      {/* Ubah status = varian utama, tolak = varian bahaya (DESIGN.md §8 Panel Admin). */}
      <Button type="submit" varian={status === 'ditolak' ? 'bahaya' : 'utama'} memuat={mengirim} className="w-full">
        {status === 'ditolak' ? 'Tolak laporan' : `Ubah ke ${status ? LABEL_STATUS_LAPORAN[status].toLowerCase() : '…'}`}
      </Button>
    </form>
  )
}

type Posisi = { teks: string | null; sebelumnya: string | null; berikutnya: string | null }

type PanelLaporanProps = {
  laporan: LaporanAdmin
  prioritas: boolean
  posisi: Posisi
  onPindah: (id: string) => void
  onTutup: () => void
  onBerubah: () => void
}

/** Panel samping: navigasi antrean, detail satu laporan, form ubah status, dan riwayat status. */
function PanelLaporan({ laporan: l, prioritas, posisi, onPindah, onTutup, onBerubah }: PanelLaporanProps) {
  const [berhasil, setBerhasil] = useState<StatusLaporan | null>(null)
  const tombolIkon = 'grid size-9 place-items-center rounded-lg text-ink efek-tekan hover:bg-recessed disabled:pointer-events-none disabled:opacity-35'

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 pt-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button type="button" className={tombolIkon} onClick={() => posisi.sebelumnya && onPindah(posisi.sebelumnya)} disabled={!posisi.sebelumnya} aria-label="Laporan sebelumnya">
              <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden />
            </button>
            <button type="button" className={tombolIkon} onClick={() => posisi.berikutnya && onPindah(posisi.berikutnya)} disabled={!posisi.berikutnya} aria-label="Laporan berikutnya">
              <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden />
            </button>
            {posisi.teks && <span className="ml-1 text-xs text-ink-subtle tabular-nums">{posisi.teks}</span>}
          </div>
          <button type="button" onClick={onTutup} aria-label="Tutup panel" className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ink efek-tekan hover:bg-recessed">
            <X className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <h2 className="mr-1 text-xl leading-tight font-semibold tracking-[-0.005em] text-ink-strong">{LABEL_KATEGORI[l.kategori]}</h2>
          <BadgeStatusLaporan status={l.status} />
          {prioritas && <TandaPrioritas />}
        </div>
        <p className="mt-1 text-xs text-ink-subtle">
          <span title={formatTanggalJam(l.created_at)}>Masuk {formatWaktuRelatif(l.created_at)}</span> · ID{' '}
          <span className="font-mono">{l.id.slice(0, 8)}</span>
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
        {berhasil && (
          <p role="status" className="flex items-center gap-2 rounded-md bg-success-soft px-3.5 py-2.5 text-sm text-ink">
            <CircleCheck className="size-4 shrink-0 text-success" strokeWidth={1.5} aria-hidden />
            Status diubah ke <strong className="font-medium">{LABEL_STATUS_LAPORAN[berhasil].toLowerCase()}</strong>.
          </p>
        )}

        <div className="space-y-3">
          {l.fotoUrl && (
            <a href={l.fotoUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg">
              <img src={l.fotoUrl} alt="Foto laporan" loading="lazy" className="aspect-16/10 w-full bg-recessed object-cover" />
              <span className="sr-only"> (buka ukuran penuh di tab baru)</span>
            </a>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-line text-ink">{l.deskripsi}</p>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border text-sm">
          <div className="bg-surface px-3 py-2">
            <dt className="text-[11px] text-ink-subtle">Dilaporkan</dt>
            <dd className="mt-0.5 text-ink">{formatTanggalJam(l.created_at)}</dd>
          </div>
          <div className="bg-surface px-3 py-2">
            <dt className="text-[11px] text-ink-subtle">Konfirmasi warga</dt>
            <dd className="mt-0.5 flex items-center gap-1 text-ink tabular-nums">
              <ThumbsUp className="size-3.5 text-ink-subtle" strokeWidth={1.5} aria-hidden />
              {l.jumlah_konfirmasi}
            </dd>
          </div>
          <div className="col-span-2 bg-surface px-3 py-2">
            <dt className="text-[11px] text-ink-subtle">Proyek</dt>
            <dd className="mt-0.5">
              {l.proyek ? (
                <>
                  <Link to={`/proyek/${l.proyek.id}`} className="group inline-flex items-start gap-1 font-medium text-link hover:underline">
                    {l.proyek.nama_paket}
                    <ArrowUpRight className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                  </Link>
                  <span className="block text-xs text-ink-subtle">
                    Kec. {l.proyek.kecamatan} · {LABEL_STATUS_PROYEK[l.proyek.status_proyek]}
                  </span>
                </>
              ) : (
                <span className="text-ink-subtle">Proyek tidak ditemukan</span>
              )}
            </dd>
          </div>
        </dl>

        <section aria-labelledby="judul-ubah-status" className="space-y-3 border-t border-border-soft pt-4">
          <h3 id="judul-ubah-status" className="text-sm font-semibold text-ink-strong">
            Ubah status
          </h3>
          {/* key = status: form kembali ke pilihan awal setelah status berubah. */}
          <FormUbahStatus
            key={l.status}
            laporan={l}
            onBerhasil={(s) => {
              setBerhasil(s)
              onBerubah()
            }}
          />
        </section>

        <section aria-labelledby="judul-riwayat" className="space-y-3 border-t border-border-soft pt-4">
          <h3 id="judul-riwayat" className="text-sm font-semibold text-ink-strong">
            Riwayat status <span className="font-normal text-ink-subtle">(tampil publik)</span>
          </h3>
          {/* pl-1 + pt-1: ruang untuk titik linimasa yang menjorok keluar garis. */}
          <div className="pt-1 pl-1">
            <LinimasaStatus riwayat={l.riwayat} />
          </div>
        </section>
      </div>
    </div>
  )
}

/** Chip pilihan di lembar saringan ponsel (DESIGN.md §7.6, sama dengan halaman Peta). */
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

/** Tab status bergaris bawah dengan jumlah (DESIGN.md §7.6). */
function TabStatus({ aktif, onClick, label, jumlah }: { aktif: boolean; onClick: () => void; label: string; jumlah: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      className={`relative inline-flex min-h-11 shrink-0 items-center gap-1.5 px-3 text-sm font-medium efek-tekan after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full ${
        aktif ? 'text-ink-strong after:bg-action' : 'text-ink-muted after:bg-transparent hover:text-ink-strong'
      }`}
    >
      {label}
      <span
        className={`min-w-5 rounded-md px-1 text-center text-[11px] leading-[18px] font-semibold tabular-nums ${
          aktif ? 'bg-action text-white' : 'bg-recessed text-ink-subtle'
        }`}
      >
        {jumlah}
      </span>
    </button>
  )
}

type AntreanLaporanProps = {
  laporan: LaporanAdmin[]
  /** ID proyek yang sedang terkena red flag, untuk menghitung laporan prioritas. */
  proyekRedFlag: string[]
  onBerubah: () => void
  /** Laporan yang langsung dibuka di panel, mis. dari antrean prioritas di dashboard (`?buka=<id>`). */
  idAwal?: string | null
}

/**
 * Antrean laporan admin: pencarian, saringan (status, kategori, jenis data), urutan, dan daftar padat
 * (tabel di layar lebar, daftar di ponsel). Saringan tersimpan di URL. Detail dan ubah status di panel samping.
 */
export function AntreanLaporan({ laporan: semua, proyekRedFlag, onBerubah, idAwal = null }: AntreanLaporanProps) {
  const [params, setParams] = useSearchParams()
  const filter = filterLaporanDariParams(params)
  const [batas, setBatas] = useState(PER_HALAMAN)
  const [dipilihId, setDipilihId] = useState<string | null>(idAwal)
  // Terpisah dari dipilihId agar isi panel tetap tampil selama animasi tutup.
  const [panelTerbuka, setPanelTerbuka] = useState(idAwal !== null)
  // Posisi terakhir di daftar: bila laporan yang dibuka keluar dari saringan (statusnya diubah), "berikutnya" tetap tersedia.
  const [indeksTerakhir, setIndeksTerakhir] = useState(0)
  // Ponsel: kategori, jenis data, dan urutan dipindah ke lembar bawah (pola yang sama dengan halaman Peta).
  const [lembarSaringan, setLembarSaringan] = useState(false)
  const layarSm = useMediaQuery('(min-width: 640px)')

  const prioritas = useMemo(
    () => new Set(antreanPrioritas(semua, proyekRedFlag).flatMap((p) => (p.alasan.potensiRedFlag ? [p.laporan.id] : []))),
    [semua, proyekRedFlag],
  )
  const tampil = saringLaporanAdmin(semua, filter, prioritas)
  const perStatus = hitungPerStatus(semua, filter)
  const saringanAktif = jumlahSaringanAktif(filter)
  const terlihat = tampil.slice(0, batas)
  const jumlahPrioritas = tampil.filter((l) => prioritas.has(l.id)).length

  // Dicari di semua laporan: setelah statusnya diubah, laporan tetap terbuka di panel walau keluar dari saringan.
  const dipilih = semua.find((l) => l.id === dipilihId) ?? null
  const indeks = dipilih ? tampil.findIndex((l) => l.id === dipilih.id) : -1
  const posisi: Posisi =
    indeks >= 0
      ? { teks: `${indeks + 1} dari ${tampil.length}`, sebelumnya: tampil[indeks - 1]?.id ?? null, berikutnya: tampil[indeks + 1]?.id ?? null }
      : { teks: 'Di luar saringan', sebelumnya: tampil[indeksTerakhir - 1]?.id ?? null, berikutnya: tampil[indeksTerakhir]?.id ?? null }

  function ubah(ubahan: Partial<FilterLaporanAdmin>) {
    setParams((lama) => filterLaporanKeParams({ ...filterLaporanDariParams(lama), ...ubahan }, lama), { replace: true })
    setBatas(PER_HALAMAN)
  }

  function buka(id: string) {
    const i = tampil.findIndex((l) => l.id === id)
    if (i >= 0) setIndeksTerakhir(i)
    // Pastikan baris yang dibuka lewat navigasi panel ikut terlihat di daftar.
    if (i >= batas) setBatas(Math.ceil((i + 1) / PER_HALAMAN) * PER_HALAMAN)
    setDipilihId(id)
    setPanelTerbuka(true)
  }

  const hapusSaringan = () => ubah({ kata: '', kategori: 'semua', jenis: 'semua' })
  // Angka pada tombol saringan ponsel: isi lembar yang berbeda dari bawaan (pencarian tetap terlihat di kolomnya sendiri).
  const saringanLembar =
    Number(filter.kategori !== 'semua') + Number(filter.jenis !== 'semua') + Number(filter.urut !== FILTER_LAPORAN_AWAL.urut)
  const aktifDiPanel = (id: string) => panelTerbuka && dipilihId === id

  return (
    <div>
      <section aria-label="Daftar laporan" className="overflow-hidden rounded-xl border border-border bg-surface">
        {/* Bilah alat: cari + saringan + urutan. Ponsel: saringan di lembar bawah lewat satu ikon. */}
        <div className="flex flex-wrap gap-2 p-3">
          <KolomCari
            label="Cari laporan"
            nilai={filter.kata}
            onUbah={(kata) => ubah({ kata })}
            placeholder="Cari laporan, proyek, kecamatan…"
            className="min-h-11 flex-1 basis-60"
          />
          <button
            type="button"
            onClick={() => setLembarSaringan(true)}
            aria-haspopup="dialog"
            aria-label={`Saringan dan urutan${saringanLembar > 0 ? `, ${saringanLembar} aktif` : ''}`}
            className={`relative grid size-11 shrink-0 place-items-center rounded-md border efek-tekan sm:hidden ${
              saringanLembar > 0 ? 'border-brand bg-brand-soft text-action' : 'border-border bg-surface text-ink hover:border-border-strong'
            }`}
          >
            <SlidersHorizontal className="size-5" strokeWidth={1.5} aria-hidden />
            {saringanLembar > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-action text-[11px] font-medium text-white tabular-nums ring-2 ring-surface"
                aria-hidden
              >
                {saringanLembar}
              </span>
            )}
          </button>
          <div className="hidden gap-2 sm:flex">
            <Pilihan
              label="Kategori"
              labelTersembunyi
              nilai={filter.kategori}
              opsi={[
                { nilai: 'semua', label: 'Semua kategori' },
                ...Constants.public.Enums.kategori_laporan.map((k) => ({ nilai: k, label: LABEL_KATEGORI[k] })),
              ]}
              onUbah={(kategori) => ubah({ kategori })}
              className="sm:w-48"
            />
            <Pilihan
              label="Jenis data"
              labelTersembunyi
              nilai={filter.jenis}
              opsi={JENIS_DATA.map((j) => ({ nilai: j, label: LABEL_JENIS[j] }))}
              onUbah={(jenis) => ubah({ jenis })}
              className="sm:w-40"
            />
            <Pilihan
              label="Urutan"
              labelTersembunyi
              nilai={filter.urut}
              opsi={URUTAN_LAPORAN.map((u) => ({ nilai: u, label: LABEL_URUTAN[u] }))}
              onUbah={(urut) => ubah({ urut })}
              className="sm:w-60"
            />
          </div>
        </div>

        {/* Tab status: angka ikut menyesuaikan pencarian dan saringan lain. */}
        {/* Ponsel: satu baris yang bisa digeser (scrollbar disembunyikan); layar lebar: membungkus. */}
        <div
          className="flex overflow-x-auto border-y border-border px-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Saring status laporan"
        >
          <TabStatus aktif={filter.status === 'semua'} onClick={() => ubah({ status: 'semua' })} label="Semua" jumlah={perStatus.semua} />
          {Constants.public.Enums.status_laporan.map((s) => (
            <TabStatus key={s} aktif={filter.status === s} onClick={() => ubah({ status: s })} label={LABEL_STATUS_LAPORAN[s]} jumlah={perStatus[s]} />
          ))}
        </div>

        <div className="flex min-h-10 flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-canvas-soft px-4 py-2 text-xs text-ink-muted" role="status">
          <span>
            <strong className="font-semibold text-ink-strong tabular-nums">{tampil.length}</strong> laporan
            {jumlahPrioritas > 0 && (
              <>
                {' · '}
                <span className="font-medium text-danger tabular-nums">{jumlahPrioritas} prioritas</span>
              </>
            )}
            {filter.kata.trim() && <> untuk “{filter.kata.trim()}”</>}
          </span>
          {saringanAktif > 0 && (
            <button type="button" onClick={hapusSaringan} className="inline-flex min-h-8 items-center font-medium text-link hover:underline">
              Hapus saringan ({saringanAktif})
            </button>
          )}
        </div>

        {tampil.length === 0 ? (
          <div className="border-t border-border p-4">
            {semua.length === 0 ? (
              <EmptyState judul="Belum ada laporan masuk" pesan="Laporan warga akan muncul di sini begitu dikirim." />
            ) : saringanAktif > 0 ? (
              <EmptyState
                judul="Tidak ada laporan yang cocok"
                pesan="Coba kata kunci lain, atau hapus saringan kategori dan jenis data."
                aksi={
                  <Button varian="kedua" ukuran="sm" onClick={hapusSaringan}>
                    Hapus saringan
                  </Button>
                }
              />
            ) : (
              <EmptyState
                judul={filter.status === 'semua' ? 'Tidak ada laporan' : `Tidak ada laporan berstatus ${LABEL_STATUS_LAPORAN[filter.status].toLowerCase()}`}
                pesan="Pilih status lain untuk melihat laporan lainnya."
              />
            )}
          </div>
        ) : (
          <>
            {/* Tablet & desktop: tabel padat (DESIGN.md §7.9). */}
            <table className="hidden w-full table-fixed border-t border-border text-left text-sm md:table">
              <colgroup>
                <col />
                <col className="w-[28%]" />
                <col className="w-36" />
                <col className="w-32" />
                <col className="w-20" />
                <col className="w-10" />
              </colgroup>
              <thead className="text-[11px] font-semibold tracking-[0.05em] text-ink-subtle uppercase">
                <tr className="border-b border-border">
                  <th className="px-4 py-2">Laporan</th>
                  <th className="px-3 py-2">Proyek</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Masuk</th>
                  <th className="px-3 py-2 text-right">Konfirmasi</th>
                  <th className="px-2 py-2">
                    <span className="sr-only">Buka</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {terlihat.map((l) => (
                  <tr
                    key={l.id}
                    className={`group relative transition-colors duration-150 motion-reduce:transition-none ${aktifDiPanel(l.id) ? 'bg-brand-soft/60' : 'hover:bg-canvas-soft'}`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <FotoMini url={l.fotoUrl} className="size-10" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            {/* Tombol diregangkan menutupi seluruh baris. */}
                            <button
                              type="button"
                              onClick={() => buka(l.id)}
                              aria-haspopup="dialog"
                              className="truncate text-left font-medium text-ink-strong after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-brand"
                            >
                              {LABEL_KATEGORI[l.kategori]}
                            </button>
                            {prioritas.has(l.id) && <TandaPrioritas />}
                          </div>
                          <p className="truncate text-xs text-ink-muted">{l.deskripsi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="truncate text-ink" title={l.proyek?.nama_paket}>
                        {l.proyek?.nama_paket ?? '—'}
                      </p>
                      {l.proyek && <p className="truncate text-xs text-ink-subtle">Kec. {l.proyek.kecamatan}</p>}
                    </td>
                    <td className="px-3 py-2.5">
                      <BadgeStatusLaporan status={l.status} />
                    </td>
                    <td className="px-3 py-2.5 text-xs whitespace-nowrap text-ink-muted" title={formatTanggalJam(l.created_at)}>
                      {formatWaktuRelatif(l.created_at)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-ink tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="size-3.5 text-ink-subtle" strokeWidth={1.5} aria-hidden />
                        {l.jumlah_konfirmasi}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-ink-subtle">
                      <ChevronRight
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-action motion-reduce:transition-none"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Ponsel: daftar padat, bukan tabel bergulir horizontal. */}
            <ul className="divide-y divide-border-soft border-t border-border md:hidden">
              {terlihat.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => buka(l.id)}
                    aria-haspopup="dialog"
                    className={`flex w-full gap-3 px-3.5 py-3 text-left efek-tekan ${aktifDiPanel(l.id) ? 'bg-brand-soft/60' : 'hover:bg-canvas-soft'}`}
                  >
                    <FotoMini url={l.fotoUrl} className="size-12" />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="mr-0.5 font-semibold text-ink-strong">{LABEL_KATEGORI[l.kategori]}</span>
                        <BadgeStatusLaporan status={l.status} />
                        {prioritas.has(l.id) && <TandaPrioritas />}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-ink-muted">{l.proyek?.nama_paket ?? '—'}</span>
                      <span className="mt-0.5 flex items-center gap-1 text-xs text-ink-subtle">
                        {formatWaktuRelatif(l.created_at)} ·
                        <ThumbsUp className="size-3" strokeWidth={1.5} aria-hidden />
                        <span className="tabular-nums">{l.jumlah_konfirmasi}</span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {tampil.length > batas && (
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-border px-4 py-3 text-xs text-ink-subtle">
                <span className="tabular-nums">
                  Menampilkan {terlihat.length} dari {tampil.length}
                </span>
                <Button varian="kedua" ukuran="sm" onClick={() => setBatas((b) => b + PER_HALAMAN)}>
                  Tampilkan {Math.min(PER_HALAMAN, tampil.length - batas)} lagi
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      <Laci
        terbuka={lembarSaringan && !layarSm}
        onTutup={() => setLembarSaringan(false)}
        label="Saringan laporan"
        arah="bawah"
        className="mx-0 mt-auto mb-0 max-h-[85dvh]! w-full overflow-y-auto rounded-t-xl p-0"
      >
        <div className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto h-1 w-10 rounded-full bg-border-strong" aria-hidden />
          <div className="mt-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-normal">Saringan</h2>
            <button
              type="button"
              onClick={() => setLembarSaringan(false)}
              aria-label="Tutup saringan"
              className="-mr-2 grid size-11 place-items-center rounded-full text-ink hover:bg-recessed"
            >
              <X className="size-5" strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          <fieldset className="mt-3">
            <legend className="text-sm font-medium text-ink">Kategori</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip aktif={filter.kategori === 'semua'} onClick={() => ubah({ kategori: 'semua' })}>
                Semua kategori
              </Chip>
              {Constants.public.Enums.kategori_laporan.map((k) => (
                <Chip key={k} aktif={filter.kategori === k} onClick={() => ubah({ kategori: k })}>
                  {LABEL_KATEGORI[k]}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-ink">Jenis data</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {JENIS_DATA.map((j) => (
                <Chip key={j} aktif={filter.jenis === j} onClick={() => ubah({ jenis: j })}>
                  {LABEL_JENIS[j]}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-ink">Urutkan</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {URUTAN_LAPORAN.map((u) => (
                <Chip key={u} aktif={filter.urut === u} onClick={() => ubah({ urut: u })}>
                  {LABEL_URUTAN_PENDEK[u]}
                </Chip>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            <Button
              varian="tipis"
              className="px-4"
              onClick={() => ubah({ kategori: 'semua', jenis: 'semua', urut: FILTER_LAPORAN_AWAL.urut })}
              disabled={saringanLembar === 0}
            >
              Atur ulang
            </Button>
            <Button className="flex-1 whitespace-nowrap" onClick={() => setLembarSaringan(false)}>
              Tampilkan {tampil.length} laporan
            </Button>
          </div>
        </div>
      </Laci>

      <Laci
        terbuka={panelTerbuka && dipilih !== null}
        onTutup={() => setPanelTerbuka(false)}
        label="Detail laporan"
        arah="kanan"
        className="fixed inset-y-0 right-0 left-auto h-dvh w-[min(28rem,100vw)] border-l border-border"
      >
        {dipilih && (
          // key = id: pesan "status diubah" tidak terbawa ke laporan lain saat berpindah lewat navigasi panel.
          <PanelLaporan
            key={dipilih.id}
            laporan={dipilih}
            prioritas={prioritas.has(dipilih.id)}
            posisi={posisi}
            onPindah={buka}
            onTutup={() => setPanelTerbuka(false)}
            onBerubah={onBerubah}
          />
        )}
      </Laci>
    </div>
  )
}
