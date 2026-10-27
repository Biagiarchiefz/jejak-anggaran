import { useState, type ReactNode } from 'react'
import { BadgeDemo } from '../components/BadgeDemo'
import { GrafikTren } from '../components/GrafikAnggaran'
import { GrafikUrusan } from '../components/GrafikUrusan'
import { SumberAnggaran } from '../components/SumberAnggaran'
import { TautanTombol } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Skeleton } from '../components/ui/Skeleton'
import { useAnggaran } from '../hooks/useAnggaran'
import { bandingkanTahunSebelumnya, realisasiTerakhir, totalPerTahun, urusanPadaTahun } from '../lib/anggaran'
import { formatPersen, formatRupiah, formatRupiahRingkas } from '../lib/format'
import type { AnggaranDaerah } from '../services/anggaranService'

function KartuAngka({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="text-sm font-medium tracking-normal text-slate-600">{judul}</h2>
      {children}
    </Card>
  )
}

function DashboardAnggaran({ data }: { data: AnggaranDaerah[] }) {
  const tren = totalPerTahun(data)
  const [tahun, setTahun] = useState(tren[tren.length - 1].tahun)
  const banding = bandingkanTahunSebelumnya(tren, tahun)
  const realisasi = realisasiTerakhir(tren, tahun)
  const barisTahun = urusanPadaTahun(data, tahun)
  const barisRealisasi = realisasi ? urusanPadaTahun(data, realisasi.tahun) : []
  const selisih = banding?.sebelumnya ? banding.saatIni.anggaran - banding.sebelumnya.anggaran : null

  return (
    <div className="space-y-6">
      {tren.length > 1 && (
        <label className="flex w-fit flex-col text-sm">
          <span className="mb-1 font-medium text-slate-700">Tahun anggaran</span>
          <select
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            className="min-h-11 rounded-ui border border-slate-200 bg-white px-4 shadow-sm"
          >
            {[...tren].reverse().map((t) => (
              <option key={t.tahun} value={t.tahun}>
                {t.tahun}
              </option>
            ))}
          </select>
        </label>
      )}

      <section aria-label={`Ringkasan anggaran ${tahun}`} className="grid gap-4 md:grid-cols-3">
        <KartuAngka judul={`Total APBD ${tahun}`}>
          <p className="mt-1 text-3xl font-medium text-slate-900">{formatRupiahRingkas(banding?.saatIni.anggaran ?? 0)}</p>
          <p className="text-sm text-slate-600">{formatRupiah(banding?.saatIni.anggaran ?? 0)}</p>
          <SumberAnggaran baris={barisTahun} />
        </KartuAngka>

        <KartuAngka judul={banding?.sebelumnya ? `Dibanding ${banding.sebelumnya.tahun}` : 'Dibanding tahun lalu'}>
          {selisih === null || !banding?.sebelumnya ? (
            <p className="mt-1 text-sm text-slate-600">Belum ada data tahun sebelumnya untuk dibandingkan.</p>
          ) : (
            <>
              <p className="mt-1 text-3xl font-medium text-slate-900">
                {selisih >= 0 ? 'Naik' : 'Turun'} {formatPersen(Math.abs(selisih) / banding.sebelumnya.anggaran)}
              </p>
              <p className="text-sm text-slate-600">
                {selisih >= 0 ? 'Bertambah' : 'Berkurang'} {formatRupiahRingkas(Math.abs(selisih))}
              </p>
              <SumberAnggaran baris={data.filter((b) => b.tahun === tahun || b.tahun === banding.sebelumnya?.tahun)} />
            </>
          )}
        </KartuAngka>

        <KartuAngka judul={realisasi ? `Realisasi ${realisasi.tahun}` : `Realisasi ${tahun}`}>
          {realisasi === null ? (
            <p className="mt-1 text-sm text-slate-600">Data realisasi belum tersedia.</p>
          ) : (
            <>
              <p className="mt-1 text-3xl font-medium text-slate-900">{formatRupiahRingkas(realisasi.realisasi)}</p>
              <p className="text-sm text-slate-600">
                {formatPersen(realisasi.realisasi / realisasi.anggaran)} dari anggaran terpakai
                {realisasi.tahun !== tahun && <> · realisasi {tahun} belum lengkap</>}
              </p>
              <SumberAnggaran baris={barisRealisasi} />
            </>
          )}
        </KartuAngka>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <section aria-labelledby="judul-urusan">
            <h2 id="judul-urusan" className="text-lg font-medium">
              Untuk apa anggarannya?
            </h2>
            <p className="mb-4 text-sm text-slate-600">Pembagian anggaran {tahun} per urusan pemerintahan, dari yang terbesar.</p>
            <GrafikUrusan data={barisTahun} />
            <SumberAnggaran baris={barisTahun} className="mt-4" />
          </section>
        </Card>

        {tren.length > 1 && (
          <Card className="min-w-0 lg:col-span-2">
            <section aria-labelledby="judul-tren">
              <h2 id="judul-tren" className="text-lg font-medium">
                Tren antar tahun
              </h2>
              <p className="mb-4 text-sm text-slate-600">Total anggaran dibandingkan realisasinya setiap tahun.</p>
              <GrafikTren data={tren} />
              <SumberAnggaran baris={data} className="mt-4" />
            </section>
          </Card>
        )}
      </div>

      {/* Jembatan ke langkah berikutnya: anggaran → proyek di lapangan. */}
      <div className="flex flex-col gap-4 rounded-ui border border-merek-100 bg-merek-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-medium">Anggaran ini menjadi proyek apa saja?</h2>
          <p className="text-sm text-slate-600">Lihat proyek beranggaran di peta, lalu cek kondisinya di lapangan.</p>
        </div>
        <TautanTombol to="/peta" className="shrink-0">
          Buka peta proyek
        </TautanTombol>
      </div>
    </div>
  )
}

export default function AnggaranPage() {
  const { data, error, memuat, muatUlang } = useAnggaran()
  const demo = data?.some((b) => b.is_demo) ?? false

  return (
    <div className="space-y-6">
      <title>Anggaran Kota Bandung — Jejak Anggaran</title>
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-medium sm:text-3xl">Anggaran Kota Bandung</h1>
          {demo && <BadgeDemo />}
        </div>
        <p className="mt-1 max-w-2xl text-slate-600">
          Berapa total APBD, untuk urusan apa saja uangnya dipakai, dan bagaimana perkembangannya dari tahun ke tahun.
        </p>
      </header>

      {memuat && !data ? (
        <div role="status" className="space-y-6">
          <span className="sr-only">Memuat data anggaran…</span>
          <Skeleton className="h-11 w-32" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
          <div className="grid gap-6 lg:grid-cols-5">
            <Skeleton className="h-96 lg:col-span-3" />
            <Skeleton className="h-96 lg:col-span-2" />
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
