import { Link } from 'react-router'
import { BadgeDemo } from './BadgeDemo'
import { GrafikUrusan } from './GrafikUrusan'
import { SumberAnggaran } from './SumberAnggaran'
import { Card } from './ui/Card'
import { EmptyState } from './ui/EmptyState'
import { ErrorState } from './ui/ErrorState'
import { JudulSeksi } from './ui/JudulSeksi'
import { LabelSeksi } from './ui/LabelSeksi'
import { Skeleton } from './ui/Skeleton'
import { useAnggaran } from '../hooks/useAnggaran'
import { bandingkanTahunSebelumnya, totalPerTahun, urusanPadaTahun } from '../lib/anggaran'
import { formatPersen, formatRupiah, formatRupiahRingkas } from '../lib/format'
import type { AnggaranDaerah } from '../services/anggaranService'

const JUMLAH_URUSAN = 5

function TautanDashboard() {
  return (
    <Link to="/anggaran" className="group inline-flex items-center gap-1.5 text-sm font-medium text-merek-800 hover:text-merek-900">
      <span className="underline decoration-merek-200 underline-offset-4 transition-colors group-hover:decoration-merek-800">
        Buka dashboard anggaran lengkap
      </span>
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
        →
      </span>
    </Link>
  )
}

function RingkasanAnggaran({ data }: { data: AnggaranDaerah[] }) {
  const tren = totalPerTahun(data)
  const tahun = tren[tren.length - 1].tahun
  const banding = bandingkanTahunSebelumnya(tren, tahun)
  const barisTahun = urusanPadaTahun(data, tahun)
  const sebelumnya = banding?.sebelumnya
  const selisih = banding && sebelumnya ? banding.saatIni.anggaran - sebelumnya.anggaran : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="flex flex-col lg:col-span-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium tracking-normal text-slate-600">Total APBD {tahun}</h3>
          {data.some((b) => b.is_demo) && <BadgeDemo />}
        </div>
        <p className="mt-2 text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
          {formatRupiahRingkas(banding?.saatIni.anggaran ?? 0)}
        </p>
        <p className="mt-1 text-sm text-slate-600">{formatRupiah(banding?.saatIni.anggaran ?? 0)}</p>
        {selisih !== null && sebelumnya && (
          <p className="mt-4 text-sm text-slate-700">
            {selisih >= 0 ? 'Naik' : 'Turun'} {formatPersen(Math.abs(selisih) / sebelumnya.anggaran)} (
            {formatRupiahRingkas(Math.abs(selisih))}) dibanding {sebelumnya.tahun}.
          </p>
        )}
        <SumberAnggaran baris={barisTahun} className="mt-4" />
        <div className="mt-auto pt-6">
          <TautanDashboard />
        </div>
      </Card>

      <Card className="lg:col-span-3">
        <h3 className="text-lg font-medium">{JUMLAH_URUSAN} urusan dengan anggaran terbesar</h3>
        <p className="mb-4 text-sm text-slate-600">Ke mana sebagian besar uang publik {tahun} dibelanjakan.</p>
        <GrafikUrusan data={barisTahun} jumlahAwal={JUMLAH_URUSAN} dapatDiperluas={false} />
        <SumberAnggaran baris={barisTahun} className="mt-4" />
      </Card>
    </div>
  )
}

/** Ringkasan anggaran di Beranda. Dashboard lengkap (pilih tahun, semua urusan, tren) ada di /anggaran. */
export function SeksiAnggaran() {
  const { data, error, memuat, muatUlang } = useAnggaran()

  return (
    <section id="anggaran" aria-labelledby="judul-anggaran" className="scroll-mt-6">
      <div className="max-w-2xl">
        <LabelSeksi>Anggaran daerah</LabelSeksi>
        <JudulSeksi
          id="judul-anggaran"
          className="mt-3"
          utama="Anggaran Kota Bandung."
          pelengkap="Berapa uang publik tahun ini, dan untuk urusan apa saja dipakai."
        />
      </div>

      <div className="mt-10">
        {memuat && !data ? (
          <div role="status" className="grid gap-6 lg:grid-cols-5">
            <span className="sr-only">Memuat ringkasan anggaran…</span>
            <Skeleton className="h-72 lg:col-span-2" />
            <Skeleton className="h-72 lg:col-span-3" />
          </div>
        ) : error ? (
          <ErrorState pesan={error.pesan} onCobaLagi={muatUlang} />
        ) : !data || data.length === 0 ? (
          <EmptyState
            judul="Data anggaran belum tersedia"
            pesan="Tim sedang mengkurasi data APBD Kota Bandung dari DJPK Kemenkeu."
          />
        ) : (
          <RingkasanAnggaran data={data} />
        )}
      </div>
    </section>
  )
}
