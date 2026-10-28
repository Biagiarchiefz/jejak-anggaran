import { useState, type ReactNode } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, UsersRound } from 'lucide-react'
import { GrafikTren } from '../components/GrafikAnggaran'
import { GrafikUrusan } from '../components/GrafikUrusan'
import { SumberAnggaran } from '../components/SumberAnggaran'
import { SumberData } from '../components/SumberData'
import { TautanTombol } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { KepalaHalaman } from '../components/ui/KepalaHalaman'
import { Pilihan } from '../components/ui/Pilihan'
import { Skeleton } from '../components/ui/Skeleton'
import { PENDUDUK_KOTA_BANDUNG } from '../data/pendudukKotaBandung'
import { useAnggaran } from '../hooks/useAnggaran'
import { anggaranPerWarga, bandingkanTahunSebelumnya, realisasiTerakhir, totalPerTahun, urusanPadaTahun } from '../lib/anggaran'
import { formatPersen, formatRupiah, formatRupiahRingkas } from '../lib/format'
import type { AnggaranDaerah } from '../services/anggaranService'

// Kartu bereaksi halus saat disorot: bayangan menebal dan border sedikit menggelap.
const KELAS_KARTU_HIDUP = 'transition-[box-shadow,border-color] duration-300 hover:border-border-strong hover:shadow-card'
const KELAS_JUDUL_KARTU = 'text-lg leading-tight font-semibold tracking-[-0.005em] text-ink-strong'

/** Satu sel metrik di panel ringkasan: label kecil → angka besar → keterangan/visual mini. */
function Metrik({ label, angka, children }: { label: string; angka: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col bg-surface p-4 sm:p-5">
      <dt className="text-xs font-medium text-ink-muted">{label}</dt>
      <dd className="mt-2 text-2xl leading-none font-semibold tracking-[-0.02em] text-ink-strong tabular-nums sm:text-3xl">{angka}</dd>
      {children && <dd className="mt-2 text-xs text-ink-subtle tabular-nums">{children}</dd>}
    </div>
  )
}

function DashboardAnggaran({ data }: { data: AnggaranDaerah[] }) {
  const tren = totalPerTahun(data)
  const [tahun, setTahun] = useState(tren[tren.length - 1].tahun)
  const banding = bandingkanTahunSebelumnya(tren, tahun)
  const realisasi = realisasiTerakhir(tren, tahun)
  const barisTahun = urusanPadaTahun(data, tahun)
  const selisih = banding?.sebelumnya ? banding.saatIni.anggaran - banding.sebelumnya.anggaran : null
  const naik = selisih !== null && selisih >= 0
  const IkonArah = naik ? ArrowUpRight : ArrowDownRight
  const perWarga = banding ? anggaranPerWarga(banding.saatIni.anggaran, PENDUDUK_KOTA_BANDUNG.jumlah) : null
  const urusanTerbesar = barisTahun[0]
  const awal = tren[0]
  const akhir = tren[tren.length - 1]
  const persenRealisasi = realisasi ? realisasi.realisasi / realisasi.anggaran : null

  return (
    <div className="space-y-5">
      {/* Panel ringkasan: 4 metrik dalam satu kartu (dipisah garis 1px), pemilih tahun di kepala panel. */}
      <Card data-muncul="" className="p-0! sm:p-0!">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold tracking-normal text-ink-strong">Ringkasan APBD {tahun}</h2>
          {tren.length > 1 && (
            <Pilihan
              label="Tahun anggaran"
              labelTersembunyi
              nilai={tahun}
              opsi={[...tren].reverse().map((t) => ({ nilai: t.tahun, label: String(t.tahun) }))}
              onUbah={setTahun}
              className="w-28"
            />
          )}
        </div>

        <dl className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
          <Metrik label={`Total APBD ${tahun}`} angka={formatRupiahRingkas(banding?.saatIni.anggaran ?? 0)}>
            {formatRupiah(banding?.saatIni.anggaran ?? 0)}
          </Metrik>

          <Metrik
            label={banding?.sebelumnya ? `Dibanding ${banding.sebelumnya.tahun}` : 'Dibanding tahun lalu'}
            angka={
              selisih === null || !banding?.sebelumnya ? (
                <span className="text-ink-subtle">–</span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <IkonArah className="size-5 shrink-0 text-action sm:size-6" strokeWidth={1.5} aria-hidden />
                  {naik ? '+' : '−'}
                  {formatPersen(Math.abs(selisih) / banding.sebelumnya.anggaran)}
                </span>
              )
            }
          >
            {selisih === null ? 'Belum ada data tahun sebelumnya' : `${naik ? 'Bertambah' : 'Berkurang'} ${formatRupiahRingkas(Math.abs(selisih))}`}
          </Metrik>

          <Metrik
            label={realisasi ? `Realisasi ${realisasi.tahun}` : `Realisasi ${tahun}`}
            angka={realisasi ? formatRupiahRingkas(realisasi.realisasi) : <span className="text-ink-subtle">–</span>}
          >
            {realisasi && persenRealisasi !== null ? (
              <>
                <span className="mb-1.5 block h-1.5 rounded-full bg-recessed" aria-hidden>
                  <span className="animasi-batang block h-full rounded-full bg-seri-realisasi" style={{ width: `${persenRealisasi * 100}%` }} />
                </span>
                {formatPersen(persenRealisasi)} terpakai
                {realisasi.tahun !== tahun && <> · {tahun} belum lengkap</>}
              </>
            ) : (
              'Data realisasi belum tersedia'
            )}
          </Metrik>

          <Metrik
            label="Jika dibagi rata per warga"
            angka={
              perWarga ? (
                <span className="inline-flex items-center gap-1.5">
                  <UsersRound className="size-5 shrink-0 text-action sm:size-6" strokeWidth={1.5} aria-hidden />
                  {formatRupiahRingkas(perWarga.perTahun)}
                </span>
              ) : (
                <span className="text-ink-subtle">–</span>
              )
            }
          >
            {perWarga && <>setahun · ≈ {formatRupiah(Math.round(perWarga.perHari / 100) * 100)} per hari</>}
          </Metrik>
        </dl>

        {/* Kaki panel: sumber APBD + catatan dan sumber angka per warga. */}
        <div className="space-y-1 rounded-b-lg border-t border-border bg-canvas-soft px-4 py-2.5 text-xs text-ink-subtle sm:px-5">
          <SumberAnggaran baris={barisTahun} className="" />
          <p>
            Angka per warga hanya ilustrasi skala, bukan uang yang diterima tiap warga. Dihitung dari{' '}
            <span className="tabular-nums">{(PENDUDUK_KOTA_BANDUNG.jumlah / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 2 })} juta</span>{' '}
            penduduk ({PENDUDUK_KOTA_BANDUNG.tahun}).
          </p>
          <SumberData
            nama={PENDUDUK_KOTA_BANDUNG.sumber.nama}
            url={PENDUDUK_KOTA_BANDUNG.sumber.url}
            diaksesPada={PENDUDUK_KOTA_BANDUNG.sumber.diakses_pada}
          />
        </div>
      </Card>

      {/* items-start: tiap kartu setinggi isinya sendiri, jadi membuka tabel/daftar tidak meregangkan kartu sebelahnya. */}
      <div data-muncul-anak="" className="grid gap-5 lg:grid-cols-5 lg:items-start">
        <Card className={`p-4 sm:p-5 lg:col-span-3 ${KELAS_KARTU_HIDUP}`}>
          <section aria-labelledby="judul-urusan">
            {/* Judul grafik menyatakan temuan (DESIGN.md §7.11). */}
            <h2 id="judul-urusan" className={KELAS_JUDUL_KARTU}>
              {urusanTerbesar ? `Belanja ${urusanTerbesar.urusan.toLowerCase()} terbesar di ${tahun}` : `Belanja per urusan ${tahun}`}
            </h2>
            <p className="mt-1 mb-3 text-sm text-ink-muted">
              {barisTahun.length} urusan pemerintahan, dari yang terbesar. Persen = porsi dari total APBD.
            </p>
            <GrafikUrusan data={barisTahun} jumlahAwal={6} />
            <SumberAnggaran baris={barisTahun} dalamKartu />
          </section>
        </Card>

        {tren.length > 1 && (
          <Card className={`min-w-0 p-4 sm:p-5 lg:col-span-2 ${KELAS_KARTU_HIDUP}`}>
            <section aria-labelledby="judul-tren">
              <h2 id="judul-tren" className={KELAS_JUDUL_KARTU}>
                APBD {akhir.anggaran >= awal.anggaran ? 'tumbuh' : 'menyusut'}{' '}
                {formatPersen(Math.abs(akhir.anggaran - awal.anggaran) / awal.anggaran)} sejak {awal.tahun}
              </h2>
              <p className="mt-1 mb-3 text-sm text-ink-muted">Total anggaran dibandingkan realisasinya setiap tahun.</p>
              <GrafikTren data={tren} />
              <SumberAnggaran baris={data} dalamKartu />
            </section>
          </Card>
        )}
      </div>

      {/* Jembatan ke langkah berikutnya: anggaran → proyek di lapangan. */}
      <div data-muncul="" className="flex flex-col gap-3 rounded-lg border border-border bg-canvas-blue px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={KELAS_JUDUL_KARTU}>Anggaran ini menjadi proyek apa saja?</h2>
          <p className="mt-0.5 text-sm text-ink-muted">Lihat proyek beranggaran di peta, lalu cek kondisinya di lapangan.</p>
        </div>
        <TautanTombol to="/peta" ukuran="sm" className="shrink-0">
          Buka peta proyek
          <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
        </TautanTombol>
      </div>
    </div>
  )
}

export default function AnggaranPage() {
  const { data, error, memuat, muatUlang } = useAnggaran()

  return (
    <div className="space-y-8">
      <title>Anggaran Kota Bandung — Jejak Anggaran</title>
      <KepalaHalaman
        eyebrow="APBD Kota Bandung"
        judul="Anggaran Kota Bandung"
        deskripsi="Berapa total APBD, untuk urusan apa saja uangnya dipakai, dan bagaimana perkembangannya dari tahun ke tahun."
      />

      {memuat && !data ? (
        <div role="status" className="space-y-5">
          <span className="sr-only">Memuat data anggaran…</span>
          <Skeleton className="h-52 rounded-lg" />
          <div className="grid gap-5 lg:grid-cols-5">
            <Skeleton className="h-96 rounded-lg lg:col-span-3" />
            <Skeleton className="h-96 rounded-lg lg:col-span-2" />
          </div>
        </div>
      ) : error ? (
        <ErrorState halaman pesan={error.pesan} onCobaLagi={muatUlang} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          judul="Data anggaran belum tersedia"
          pesan="Tim sedang mengkurasi data APBD Kota Bandung dari DJPK Kemenkeu. Sementara itu, Anda bisa menjelajahi peta proyek."
          aksi={<TautanTombol to="/peta">Buka peta proyek</TautanTombol>}
        />
      ) : (
        <DashboardAnggaran data={data} />
      )}
    </div>
  )
}
