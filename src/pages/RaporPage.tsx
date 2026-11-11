import { useState, type ReactNode } from 'react'
import { Download, FileSpreadsheet, Info, Printer, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { Button } from '../components/common/Button'
import { Chip } from '../components/common/Chip'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { KepalaHalaman } from '../components/common/KepalaHalaman'
import { Laci } from '../components/common/Laci'
import { Pilihan } from '../components/common/Pilihan'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { SumberData } from '../components/common/SumberData'
import { SkeletonIsiRapor } from '../features/rapor/components/SkeletonRapor'
import { TabelRapor } from '../features/rapor/components/TabelRapor'
import { useRapor } from '../features/rapor/hooks/useRapor'
import { tanggalBerkas } from '../utils/csv'
import { formatDurasiJam, formatRupiahRingkas } from '../utils/format'
import {
  hitungRapor,
  OPSI_RAPOR_AWAL,
  opsiRaporDariParams,
  opsiRaporKeParams,
  proyekKeCsv,
  raporKeCsv,
  ringkasRapor,
  type JenisDataRapor,
  type KelompokRapor,
  type OpsiRapor,
  type UrutanRapor,
} from '../utils/rapor'
import { unduhBerkas } from '../utils/unduh'

const URL_SIRUP = 'https://sirup.inaproc.id/sirup/'

const LABEL_KELOMPOK: Record<KelompokRapor, string> = { kecamatan: 'Per kecamatan', satker: 'Per dinas' }
const OPSI_JENIS: { nilai: JenisDataRapor; label: string }[] = [
  { nilai: 'semua', label: 'Semua data' },
  { nilai: 'nyata', label: 'Data nyata saja' },
]
const OPSI_URUT: { nilai: UrutanRapor; label: string }[] = [
  { nilai: 'pagu', label: 'Pagu terbesar' },
  { nilai: 'laporan', label: 'Laporan terbanyak' },
  { nilai: 'nama', label: 'Urut abjad' },
]

/** Satu sel panel ringkasan: label kecil → angka besar → keterangan (pola yang sama dengan halaman Anggaran). */
function Metrik({ label, angka, children }: { label: string; angka: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col bg-surface p-4 sm:p-5">
      <dt className="text-xs font-medium text-ink-muted">{label}</dt>
      <dd className="mt-2 text-2xl leading-none font-semibold tracking-[-0.02em] text-ink-strong tabular-nums sm:text-3xl">{angka}</dd>
      {children && <dd className="mt-2 text-xs text-ink-subtle">{children}</dd>}
    </div>
  )
}

/** Rapor wilayah (F10): proyek, pagu, dan laporan warga per kecamatan atau per dinas, bisa diunduh sebagai CSV atau dicetak. */
export default function RaporPage() {
  const { data, error, memuat, muatUlang } = useRapor()
  const [params, setParams] = useSearchParams()
  const opsi = opsiRaporDariParams(params)
  const ubah = (ubahan: Partial<OpsiRapor>) => setParams(opsiRaporKeParams({ ...opsi, ...ubahan }), { replace: true })
  const [lembarSaringan, setLembarSaringan] = useState(false)
  // Mulai `sm` saringan tampil langsung di bilah alat, jadi lembar saringan ditutup bila layar melebar.
  const layarSm = useMediaQuery('(min-width: 640px)')
  // Pengalih kecamatan/dinas selalu terlihat, jadi tidak dihitung sebagai saringan.
  const jumlahAktif = Number(opsi.jenis !== OPSI_RAPOR_AWAL.jenis) + Number(opsi.urut !== OPSI_RAPOR_AWAL.urut)

  const baris = data ? hitungRapor(data.proyek, data.laporan, opsi) : []
  const ringkasan = data ? ringkasRapor(data.proyek, data.laporan, opsi) : null
  const proyekTampil = data ? data.proyek.filter((p) => opsi.jenis === 'semua' || !p.is_demo) : []
  const proyekNyata = proyekTampil.filter((p) => !p.is_demo)
  // Tanggal akses terbaru dari proyek nyata yang ikut dihitung; tanpa proyek nyata → angkanya demo, tanpa baris sumber.
  const diaksesPada = proyekNyata.flatMap((p) => (p.diakses_pada ? [p.diakses_pada] : [])).sort().at(-1) ?? null
  const namaKelompok = opsi.kelompok === 'kecamatan' ? 'kecamatan' : 'dinas'

  function unduhRapor() {
    unduhBerkas(`rapor-${namaKelompok}${opsi.jenis === 'nyata' ? '-data-nyata' : ''}-jejak-anggaran-${tanggalBerkas()}.csv`, raporKeCsv(baris, opsi.kelompok))
  }
  function unduhProyek() {
    if (!data) return
    unduhBerkas(`daftar-proyek${opsi.jenis === 'nyata' ? '-data-nyata' : ''}-jejak-anggaran-${tanggalBerkas()}.csv`, proyekKeCsv(proyekTampil, data.laporan))
  }

  const siap = !!data && baris.length > 0

  return (
    <div className="space-y-6">
      <title>Rapor Wilayah — Jejak Anggaran</title>
      <KepalaHalaman
        eyebrow="Rapor wilayah"
        judul="Rapor per kecamatan dan dinas"
        deskripsi="Berapa proyek dan pagu di setiap kecamatan atau dinas, berapa laporan warga yang masuk, dan seberapa cepat ditanggapi. Unduh datanya untuk analisis lanjutan."
      />

      {/* Ponsel: pengalih + ikon saringan (membuka lembar bawah, seperti halaman Peta), 2 tombol unduh, lalu Cetak
          selebar penuh. Mulai sm saringan tampil langsung; mulai xl semuanya satu baris (tombol di kanan). */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center print:hidden">
        <div className="col-span-2 flex gap-2 sm:contents">
          <div className="relative grid flex-1 grid-cols-2 rounded-full bg-recessed p-1 sm:inline-grid sm:flex-none" role="group" aria-label="Kelompokkan rapor">
            {/* Penanda pilihan meluncur ke tombol yang aktif (lebar = setengah wadah dikurangi padding). */}
            <span
              aria-hidden
              className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-surface shadow-edge transition-[translate] duration-300 ease-(--ease-standard) motion-reduce:transition-none ${
                opsi.kelompok === 'satker' ? 'translate-x-full' : ''
              }`}
            />
            {(['kecamatan', 'satker'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => ubah({ kelompok: k })}
                aria-pressed={opsi.kelompok === k}
                className={`relative min-h-9 rounded-full px-4 text-sm font-medium efek-tekan ${
                  opsi.kelompok === k ? 'text-ink-strong' : 'text-ink-muted hover:text-ink-strong'
                }`}
              >
                {LABEL_KELOMPOK[k]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLembarSaringan(true)}
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
        </div>
        <Pilihan label="Jenis data" labelTersembunyi nilai={opsi.jenis} opsi={OPSI_JENIS} onUbah={(jenis) => ubah({ jenis })} className="hidden sm:block sm:w-40" />
        <Pilihan label="Urutan" labelTersembunyi nilai={opsi.urut} opsi={OPSI_URUT} onUbah={(urut) => ubah({ urut })} className="hidden sm:block sm:w-52" />
        <div className="col-span-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:ml-auto">
          <Button varian="kedua" ukuran="sm" onClick={unduhRapor} disabled={!siap} title="Unduh rapor (CSV)" className="px-3 sm:px-4">
            <Download className="size-4" strokeWidth={1.5} aria-hidden />
            Rapor (CSV)
          </Button>
          <Button varian="kedua" ukuran="sm" onClick={unduhProyek} disabled={!siap} title="Unduh daftar proyek (CSV)" className="px-3 sm:px-4">
            <FileSpreadsheet className="size-4" strokeWidth={1.5} aria-hidden />
            Proyek (CSV)
          </Button>
          <Button varian="kedua" ukuran="sm" onClick={() => window.print()} disabled={!siap} title="Cetak atau simpan sebagai PDF" className="col-span-2 px-3 sm:px-4">
            <Printer className="size-4" strokeWidth={1.5} aria-hidden />
            Cetak / PDF
          </Button>
        </div>
      </div>

      <Laci
        terbuka={lembarSaringan && !layarSm}
        onTutup={() => setLembarSaringan(false)}
        label="Saringan rapor"
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
            <legend className="text-sm font-medium text-ink">Jenis data</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {OPSI_JENIS.map((o) => (
                <Chip key={o.nilai} aktif={opsi.jenis === o.nilai} onClick={() => ubah({ jenis: o.nilai })}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-ink">Urutan</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {OPSI_URUT.map((o) => (
                <Chip key={o.nilai} aktif={opsi.urut === o.nilai} onClick={() => ubah({ urut: o.nilai })}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            <Button
              varian="tipis"
              className="px-4 whitespace-nowrap"
              onClick={() => ubah({ jenis: OPSI_RAPOR_AWAL.jenis, urut: OPSI_RAPOR_AWAL.urut })}
              disabled={jumlahAktif === 0}
            >
              Atur ulang
            </Button>
            <Button className="flex-1 whitespace-nowrap" onClick={() => setLembarSaringan(false)}>
              Tampilkan {baris.length} {namaKelompok}
            </Button>
          </div>
        </div>
      </Laci>

      {memuat && !data ? (
        <SkeletonIsiRapor />
      ) : error ? (
        <ErrorState halaman pesan={error.pesan} onCobaLagi={muatUlang} />
      ) : !data || !ringkasan || baris.length === 0 ? (
        <EmptyState
          judul={opsi.jenis === 'nyata' ? 'Belum ada proyek nyata' : 'Belum ada data proyek'}
          pesan="Rapor muncul setelah data proyek dari SiRUP dikurasi."
          aksi={
            opsi.jenis === 'nyata' ? (
              <Button varian="kedua" onClick={() => ubah({ jenis: 'semua' })}>
                Tampilkan semua data
              </Button>
            ) : undefined
          }
        />
      ) : (
        // Kunci = opsi aktif: tiap ganti pengalih/saringan, isi rapor dipasang ulang dan memudar masuk.
        <div key={`${opsi.kelompok}-${opsi.jenis}-${opsi.urut}`} className="space-y-5 motion-safe:animate-ganti-mode">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-edge lg:grid-cols-4">
            <Metrik label={opsi.kelompok === 'kecamatan' ? 'Kecamatan tercakup' : 'Dinas tercakup'} angka={ringkasan.jumlahKelompok}>
              {opsi.kelompok === 'kecamatan' ? 'dari 30 kecamatan di Kota Bandung' : 'satuan kerja pelaksana proyek'}
            </Metrik>
            <Metrik label="Proyek dipantau" angka={ringkasan.jumlahProyek}>
              {ringkasan.jumlahProyekDemo > 0 ? `termasuk ${ringkasan.jumlahProyekDemo} proyek demo` : 'semuanya proyek nyata'}
            </Metrik>
            <Metrik label="Total pagu" angka={formatRupiahRingkas(ringkasan.totalPagu)}>
              <SumberData nama="SiRUP LKPP" url={URL_SIRUP} diaksesPada={diaksesPada} demo={proyekNyata.length === 0} />
            </Metrik>
            <Metrik label="Laporan warga" angka={ringkasan.jumlahLaporan}>
              {ringkasan.rataRataResponJam === null ? 'belum ada yang ditanggapi' : `ditanggapi rata-rata ${formatDurasiJam(ringkasan.rataRataResponJam)}`}
            </Metrik>
          </dl>

          <p className="flex gap-2.5 rounded-lg bg-canvas-blue px-4 py-3 text-sm text-ink-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-action" strokeWidth={1.5} aria-hidden />
            <span>
              Rapor dihitung dari pagu proyek di SiRUP dan laporan warga di Jejak Anggaran. Realisasi anggaran per wilayah tidak
              diterbitkan DJPK, jadi tidak ditampilkan di sini. Waktu respons = dari laporan masuk sampai pertama kali ditanggapi admin.
            </span>
          </p>

          <TabelRapor baris={baris} kelompok={opsi.kelompok} totalPagu={ringkasan.totalPagu} />

          <SumberData
            nama="SiRUP LKPP (paket dan pagu proyek) dan laporan warga Jejak Anggaran"
            url={URL_SIRUP}
            diaksesPada={diaksesPada}
            demo={proyekNyata.length === 0}
          />
        </div>
      )}
    </div>
  )
}
