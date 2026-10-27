import { useState, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { GrafikTren } from '../components/GrafikAnggaran'
import { GrafikUrusan } from '../components/GrafikUrusan'
import { SumberAnggaran } from '../components/SumberAnggaran'
import { TautanTombol } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { KepalaHalaman } from '../components/ui/KepalaHalaman'
import { Pilihan } from '../components/ui/Pilihan'
import { Skeleton } from '../components/ui/Skeleton'
import { useAnggaran } from '../hooks/useAnggaran'
import { bandingkanTahunSebelumnya, realisasiTerakhir, totalPerTahun, urusanPadaTahun } from '../lib/anggaran'
import { formatPersen, formatRupiah, formatRupiahRingkas } from '../lib/format'
import type { AnggaranDaerah } from '../services/anggaranService'

/** Statistik besar dengan label kecil (DESIGN.md §2 prinsip 4). */
function KartuAngka({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <Card className="flex flex-col">
      <h2 className="text-sm font-medium tracking-normal text-ink-muted">{judul}</h2>
      {children}
    </Card>
  )
}

const KELAS_ANGKA = 'mt-3 text-[36px] leading-none font-semibold tracking-[-0.02em] text-ink-strong tabular-nums md:text-5xl'

function DashboardAnggaran({ data }: { data: AnggaranDaerah[] }) {
  const tren = totalPerTahun(data)
  const [tahun, setTahun] = useState(tren[tren.length - 1].tahun)
  const banding = bandingkanTahunSebelumnya(tren, tahun)
  const realisasi = realisasiTerakhir(tren, tahun)
  const barisTahun = urusanPadaTahun(data, tahun)
  const barisRealisasi = realisasi ? urusanPadaTahun(data, realisasi.tahun) : []
  const selisih = banding?.sebelumnya ? banding.saatIni.anggaran - banding.sebelumnya.anggaran : null
  const urusanTerbesar = barisTahun[0]
  const awal = tren[0]
  const akhir = tren[tren.length - 1]

  return (
    <div className="space-y-6">
      {tren.length > 1 && (
        <Pilihan
          label="Tahun anggaran"
          nilai={tahun}
          opsi={[...tren].reverse().map((t) => ({ nilai: t.tahun, label: String(t.tahun) }))}
          onUbah={setTahun}
          className="w-40"
        />
      )}

      <section data-muncul-anak="" aria-label={`Ringkasan anggaran ${tahun}`} className="grid gap-6 md:grid-cols-3">
        <KartuAngka judul={`Total APBD ${tahun}`}>
          <p className={KELAS_ANGKA}>{formatRupiahRingkas(banding?.saatIni.anggaran ?? 0)}</p>
          <p className="mt-2 text-sm text-ink-subtle tabular-nums">{formatRupiah(banding?.saatIni.anggaran ?? 0)}</p>
          <SumberAnggaran baris={barisTahun} dalamKartu className="mt-auto" />
        </KartuAngka>

        <KartuAngka judul={banding?.sebelumnya ? `Dibanding ${banding.sebelumnya.tahun}` : 'Dibanding tahun lalu'}>
          {selisih === null || !banding?.sebelumnya ? (
            <p className="mt-3 text-sm text-ink-muted">Belum ada data tahun sebelumnya untuk dibandingkan.</p>
          ) : (
            <>
              <p className={KELAS_ANGKA}>
                {selisih >= 0 ? '+' : '−'}
                {formatPersen(Math.abs(selisih) / banding.sebelumnya.anggaran)}
              </p>
              <p className="mt-2 text-sm text-ink-subtle tabular-nums">
                {selisih >= 0 ? 'Bertambah' : 'Berkurang'} {formatRupiahRingkas(Math.abs(selisih))}
              </p>
              <SumberAnggaran
                baris={data.filter((b) => b.tahun === tahun || b.tahun === banding.sebelumnya?.tahun)}
                dalamKartu
                className="mt-auto"
              />
            </>
          )}
        </KartuAngka>

        <KartuAngka judul={realisasi ? `Realisasi ${realisasi.tahun}` : `Realisasi ${tahun}`}>
          {realisasi === null ? (
            <p className="mt-3 text-sm text-ink-muted">Data realisasi belum tersedia.</p>
          ) : (
            <>
              <p className={KELAS_ANGKA}>{formatRupiahRingkas(realisasi.realisasi)}</p>
              <p className="mt-2 text-sm text-ink-subtle tabular-nums">
                {formatPersen(realisasi.realisasi / realisasi.anggaran)} dari anggaran terpakai
                {realisasi.tahun !== tahun && <> · realisasi {tahun} belum lengkap</>}
              </p>
              <SumberAnggaran baris={barisRealisasi} dalamKartu className="mt-auto" />
            </>
          )}
        </KartuAngka>
      </section>

      {/* items-start: tiap kartu setinggi isinya sendiri, jadi membuka tabel/daftar tidak meregangkan kartu sebelahnya. */}
      <div data-muncul-anak="" className="grid gap-6 lg:grid-cols-5 lg:items-start">
        <Card className="lg:col-span-3">
          <section aria-labelledby="judul-urusan">
            {/* Judul grafik menyatakan temuan (DESIGN.md §7.11). */}
            <h2 id="judul-urusan" className="text-xl leading-[1.25] font-semibold tracking-[-0.005em] md:text-2xl">
              {urusanTerbesar ? `Belanja ${urusanTerbesar.urusan.toLowerCase()} terbesar di ${tahun}` : `Belanja per urusan ${tahun}`}
            </h2>
            <p className="mt-2 mb-6 text-sm text-ink-muted">Pembagian anggaran {tahun} per urusan pemerintahan, dari yang terbesar.</p>
            <GrafikUrusan data={barisTahun} />
            <SumberAnggaran baris={barisTahun} dalamKartu />
          </section>
        </Card>

        {tren.length > 1 && (
          <Card className="min-w-0 lg:col-span-2">
            <section aria-labelledby="judul-tren">
              <h2 id="judul-tren" className="text-xl leading-[1.25] font-semibold tracking-[-0.005em] md:text-2xl">
                APBD {akhir.anggaran >= awal.anggaran ? 'tumbuh' : 'menyusut'}{' '}
                {formatPersen(Math.abs(akhir.anggaran - awal.anggaran) / awal.anggaran)} sejak {awal.tahun}
              </h2>
              <p className="mt-2 mb-4 text-sm text-ink-muted">Total anggaran dibandingkan realisasinya setiap tahun.</p>
              <GrafikTren data={tren} />
              <SumberAnggaran baris={data} dalamKartu />
            </section>
          </Card>
        )}
      </div>

      {/* Jembatan ke langkah berikutnya: anggaran → proyek di lapangan. */}
      <div data-muncul="" className="flex flex-col gap-4 rounded-lg border border-border bg-canvas-blue p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl leading-[1.25] font-semibold tracking-[-0.005em]">Anggaran ini menjadi proyek apa saja?</h2>
          <p className="mt-1 text-sm text-ink-muted">Lihat proyek beranggaran di peta, lalu cek kondisinya di lapangan.</p>
        </div>
        <TautanTombol to="/peta" className="shrink-0">
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
    <div className="space-y-10">
      <title>Anggaran Kota Bandung — Jejak Anggaran</title>
      <KepalaHalaman
        eyebrow="APBD Kota Bandung"
        judul="Anggaran Kota Bandung"
        deskripsi="Berapa total APBD, untuk urusan apa saja uangnya dipakai, dan bagaimana perkembangannya dari tahun ke tahun."
      />

      {memuat && !data ? (
        <div role="status" className="space-y-6">
          <span className="sr-only">Memuat data anggaran…</span>
          <Skeleton className="h-11 w-40" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-44 rounded-lg" />
            <Skeleton className="h-44 rounded-lg" />
            <Skeleton className="h-44 rounded-lg" />
          </div>
          <div className="grid gap-6 lg:grid-cols-5">
            <Skeleton className="h-96 rounded-lg lg:col-span-3" />
            <Skeleton className="h-96 rounded-lg lg:col-span-2" />
          </div>
        </div>
      ) : error ? (
        <ErrorState pesan={error.pesan} onCobaLagi={muatUlang} />
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
