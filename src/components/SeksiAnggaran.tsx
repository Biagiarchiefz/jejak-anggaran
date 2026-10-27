import { useState } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { GrafikTrenMini } from './GrafikTrenMini'
import { IkonUrusan } from './IkonUrusan'
import { SumberAnggaran } from './SumberAnggaran'
import { Card } from './ui/Card'
import { EmptyState } from './ui/EmptyState'
import { ErrorState } from './ui/ErrorState'
import { JudulSeksi } from './ui/JudulSeksi'
import { LabelSeksi } from './ui/LabelSeksi'
import { Skeleton } from './ui/Skeleton'
import type { StateMuat } from '../hooks/useMuat'
import { bandingkanTahunSebelumnya, realisasiTerakhir, totalPerTahun, urusanPadaTahun } from '../lib/anggaran'
import { formatPersen, formatRupiahRingkas } from '../lib/format'
import type { AnggaranDaerah } from '../services/anggaranService'

const JUMLAH_URUSAN = 5

function Legenda({ butir }: { butir: { label: string; warna: string }[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-subtle">
      {butir.map((b) => (
        <li key={b.label} className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${b.warna}`} aria-hidden />
          {b.label}
        </li>
      ))}
    </ul>
  )
}

function KartuUrusan({ baris, tahun }: { baris: AnggaranDaerah[]; tahun: number }) {
  const [aktif, setAktif] = useState<string | null>(null)
  const total = baris.reduce((s, b) => s + b.anggaran, 0) || 1
  const teratas = baris.slice(0, JUMLAH_URUSAN)
  const sisa = baris.slice(JUMLAH_URUSAN).reduce((s, b) => s + b.anggaran, 0)
  const porsiTeratas = teratas.reduce((s, b) => s + b.anggaran, 0) / total

  return (
    <Card className="flex min-w-0 flex-col lg:col-span-7">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl leading-[1.25] font-semibold md:text-2xl">
          {teratas[0] ? `${teratas[0].urusan} menyerap anggaran terbesar di ${tahun}` : `Belanja per urusan ${tahun}`}
        </h3>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        {JUMLAH_URUSAN} urusan terbesar memakai <span className="font-medium text-ink tabular-nums">{formatPersen(porsiTeratas)}</span>{' '}
        dari APBD {tahun}.
      </p>
      <Legenda
        butir={[
          { label: `${JUMLAH_URUSAN} urusan terbesar`, warna: 'bg-seri-anggaran' },
          { label: 'Urusan lainnya', warna: 'bg-border-strong' },
        ]}
      />

      {/* Batang distribusi: tiap segmen = porsi satu urusan. Sorot sinkron dengan daftar di bawah. */}
      <div
        className="mt-3 flex h-3 gap-0.5 overflow-hidden rounded-full"
        role="img"
        aria-label={`Porsi ${JUMLAH_URUSAN} urusan terbesar terhadap total APBD ${tahun}: ${formatPersen(porsiTeratas)}`}
      >
        {teratas.map((b) => (
          <div
            key={b.urusan}
            title={`${b.urusan}: ${formatPersen(b.anggaran / total)}`}
            onPointerEnter={() => setAktif(b.urusan)}
            onPointerLeave={() => setAktif(null)}
            className={`h-full bg-seri-anggaran transition-opacity duration-150 ${aktif && aktif !== b.urusan ? 'opacity-30' : ''}`}
            style={{ width: `${(b.anggaran / total) * 100}%` }}
          />
        ))}
        {sisa > 0 && <div title={`Urusan lainnya: ${formatPersen(sisa / total)}`} className="h-full flex-1 bg-border-strong" />}
      </div>

      <ol className="mt-5 -mx-2 divide-y divide-border-soft">
        {teratas.map((b) => {
          const porsi = b.anggaran / total
          return (
            <li
              key={b.urusan}
              onPointerEnter={() => setAktif(b.urusan)}
              onPointerLeave={() => setAktif(null)}
              className={`flex items-center gap-3 rounded-md px-2 py-3 transition-colors duration-150 ${aktif === b.urusan ? 'bg-brand-soft/60' : ''}`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-soft text-action">
                <IkonUrusan urusan={b.urusan} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-ink" title={b.urusan}>
                    {b.urusan}
                  </span>
                  <span className="shrink-0 font-medium text-ink-strong tabular-nums">{formatRupiahRingkas(b.anggaran)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-3">
                  <div className="h-1.5 flex-1 rounded-full bg-recessed" aria-hidden>
                    <div className="h-full rounded-full bg-seri-anggaran" style={{ width: `${Math.max(porsi * 100, 1)}%` }} />
                  </div>
                  <span className="w-10 shrink-0 text-right text-xs text-ink-subtle tabular-nums">{formatPersen(porsi)}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <SumberAnggaran baris={baris} dalamKartu className="mt-auto pt-2" />
    </Card>
  )
}

function KartuTren({ data, tahun }: { data: AnggaranDaerah[]; tahun: number }) {
  const tren = totalPerTahun(data)
  const banding = bandingkanTahunSebelumnya(tren, tahun)
  const sebelumnya = banding?.sebelumnya
  const selisih = banding && sebelumnya ? banding.saatIni.anggaran - sebelumnya.anggaran : null
  const realisasi = realisasiTerakhir(tren, tahun)
  const naik = selisih !== null && selisih >= 0

  return (
    <Card className="flex min-w-0 flex-col lg:col-span-5">
      <h3 className="text-xl leading-[1.25] font-semibold md:text-2xl">
        {selisih !== null && sebelumnya
          ? `APBD ${tahun} ${naik ? 'naik' : 'turun'} ${formatPersen(Math.abs(selisih) / sebelumnya.anggaran)} dari ${sebelumnya.tahun}`
          : `Total APBD per tahun`}
      </h3>
      <Legenda butir={[{ label: 'Total anggaran', warna: 'bg-seri-anggaran' }]} />

      {tren.length > 1 && (
        <div className="mt-6">
          <GrafikTrenMini tren={tren} />
        </div>
      )}

      {(selisih !== null || realisasi) && (
        <dl className="mt-6 grid grid-cols-2 divide-x divide-border border-y border-border py-4">
          {selisih !== null && sebelumnya && (
            <div className="pr-4">
              <dt className="text-xs text-ink-subtle">Dibanding {sebelumnya.tahun}</dt>
              <dd className="mt-1 flex items-center gap-1 text-lg font-semibold text-ink-strong tabular-nums">
                {naik ? (
                  <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                ) : (
                  <ArrowDownRight className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                )}
                {naik ? '+' : '−'}
                {formatRupiahRingkas(Math.abs(selisih))}
              </dd>
            </div>
          )}
          {realisasi && (
            <div className="pl-4">
              <dt className="text-xs text-ink-subtle">Terealisasi {realisasi.tahun}</dt>
              <dd className="mt-1 text-lg font-semibold text-ink-strong tabular-nums">
                {formatPersen(realisasi.realisasi / realisasi.anggaran)}
              </dd>
              <dd className="text-xs text-ink-subtle tabular-nums">dari {formatRupiahRingkas(realisasi.anggaran)}</dd>
            </div>
          )}
        </dl>
      )}

      <SumberAnggaran baris={data} dalamKartu />
      <div className="mt-auto pt-6">
        <Link to="/anggaran" className="group inline-flex items-center gap-1.5 text-sm font-medium text-link hover:underline">
          Buka dashboard anggaran lengkap
          <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
        </Link>
      </div>
    </Card>
  )
}

/** Ringkasan anggaran di Beranda: belanja per urusan + tren (2 kolom desktop). Dashboard lengkap ada di /anggaran. */
export function SeksiAnggaran({ anggaran }: { anggaran: StateMuat<AnggaranDaerah[]> }) {
  const { data, error, memuat, muatUlang } = anggaran
  const tahun = data && data.length > 0 ? totalPerTahun(data).at(-1)!.tahun : null

  return (
    <section id="anggaran" aria-labelledby="judul-anggaran" className="py-16 md:py-24">
      <div data-muncul="" className="max-w-[720px]">
        <LabelSeksi>Anggaran daerah</LabelSeksi>
        <JudulSeksi
          id="judul-anggaran"
          className="mt-3"
          utama="Untuk apa APBD Kota Bandung dipakai."
          pelengkap="Pembagian per urusan dan arahnya dari tahun ke tahun."
        />
      </div>

      <div className="mt-12">
        {memuat && !data ? (
          <div role="status" className="grid gap-6 lg:grid-cols-12">
            <span className="sr-only">Memuat ringkasan anggaran…</span>
            <Skeleton className="h-96 rounded-lg lg:col-span-7" />
            <Skeleton className="h-96 rounded-lg lg:col-span-5" />
          </div>
        ) : error ? (
          <ErrorState pesan={error.pesan} onCobaLagi={muatUlang} />
        ) : !data || tahun === null ? (
          <EmptyState
            judul="Data anggaran belum tersedia"
            pesan="Tim sedang mengkurasi data APBD Kota Bandung dari DJPK Kemenkeu."
          />
        ) : (
          <div data-muncul-anak="" className="grid gap-6 lg:grid-cols-12">
            <KartuUrusan baris={urusanPadaTahun(data, tahun)} tahun={tahun} />
            <KartuTren data={data} tahun={tahun} />
          </div>
        )}
      </div>
    </section>
  )
}
