import { useState, type CSSProperties } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { GrafikTrenMini } from '../../anggaran/components/GrafikTrenMini'
import { IkonUrusan } from '../../anggaran/components/IkonUrusan'
import { KonteksWarga } from '../../anggaran/components/KonteksWarga'
import { SumberAnggaran } from '../../anggaran/components/SumberAnggaran'
import { Card } from '../../../components/common/Card'
import { EmptyState } from '../../../components/common/EmptyState'
import { ErrorState } from '../../../components/common/ErrorState'
import { JudulSeksi } from '../../../components/common/JudulSeksi'
import { LabelSeksi } from '../../../components/common/LabelSeksi'
import { Skeleton } from '../../../components/common/Skeleton'
import { PENDUDUK_KOTA_BANDUNG } from '../../../data/pendudukKotaBandung'
import type { StateMuat } from '../../../hooks/useMuat'
import { anggaranPerWarga, bandingkanTahunSebelumnya, realisasiTerakhir, totalPerTahun, urusanPadaTahun } from '../../../utils/anggaran'
import { formatPersen, formatRupiahRingkas } from '../../../utils/format'
import type { AnggaranDaerah } from '../../../services/anggaranService'

const JUMLAH_URUSAN = 5
// Kartu bereaksi halus saat disorot: bayangan menebal dan border sedikit menggelap.
const KELAS_KARTU_HIDUP = 'transition-[box-shadow,border-color] duration-300 hover:border-border-strong hover:shadow-card'

function KartuUrusan({ baris, tahun }: { baris: AnggaranDaerah[]; tahun: number }) {
  const [aktif, setAktif] = useState<string | null>(null)
  const total = baris.reduce((s, b) => s + b.anggaran, 0) || 1
  const teratas = baris.slice(0, JUMLAH_URUSAN)
  const sisa = baris.slice(JUMLAH_URUSAN).reduce((s, b) => s + b.anggaran, 0)
  const porsiTeratas = teratas.reduce((s, b) => s + b.anggaran, 0) / total
  const barisAktif = teratas.find((b) => b.urusan === aktif)

  return (
    <Card className={`flex min-w-0 flex-col lg:col-span-7 ${KELAS_KARTU_HIDUP}`}>
      <h3 className="text-xl leading-tight font-semibold text-ink-strong md:text-2xl">
        {teratas[0] ? `${teratas[0].urusan} menyerap anggaran terbesar di ${tahun}` : `Belanja per urusan ${tahun}`}
      </h3>
      <p className="mt-2 text-sm text-ink-muted">
        {JUMLAH_URUSAN} urusan terbesar memakai{' '}
        <span className="rounded-sm bg-brand-soft px-1 font-semibold text-action tabular-nums">{formatPersen(porsiTeratas)}</span> dari APBD{' '}
        {tahun}.
      </p>

      {/* Batang distribusi: tiap segmen = porsi satu urusan. Sorot sinkron dengan daftar di bawah. */}
      <div
        className="animasi-batang mt-5 flex h-3 gap-0.5 overflow-hidden rounded-full"
        role="img"
        aria-label={`Porsi ${JUMLAH_URUSAN} urusan terbesar terhadap total APBD ${tahun}: ${formatPersen(porsiTeratas)}`}
      >
        {teratas.map((b) => (
          <div
            key={b.urusan}
            onPointerEnter={() => setAktif(b.urusan)}
            onPointerLeave={() => setAktif(null)}
            className={`h-full bg-seri-anggaran transition-opacity duration-150 ${aktif && aktif !== b.urusan ? 'opacity-30' : ''}`}
            style={{ width: `${(b.anggaran / total) * 100}%` }}
          />
        ))}
        {sisa > 0 && <div className="h-full flex-1 bg-border-strong" />}
      </div>
      {/* Keterangan batang: berganti mengikuti urusan yang disorot. */}
      <p className="mt-2 min-h-5 text-xs text-ink-subtle" aria-live="polite">
        {barisAktif ? (
          <>
            <span className="font-medium text-ink">{barisAktif.urusan}</span> ·{' '}
            <span className="tabular-nums">
              {formatPersen(barisAktif.anggaran / total)} · {formatRupiahRingkas(barisAktif.anggaran)}
            </span>
          </>
        ) : (
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-seri-anggaran" aria-hidden />
              {JUMLAH_URUSAN} urusan terbesar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-border-strong" aria-hidden />
              Urusan lainnya
            </span>
          </span>
        )}
      </p>

      <ol className="-mx-2 mt-4 space-y-1">
        {teratas.map((b, i) => {
          const porsi = b.anggaran / total
          const perWarga = anggaranPerWarga(b.anggaran, PENDUDUK_KOTA_BANDUNG.jumlah)
          const disorot = aktif === b.urusan
          return (
            <li
              key={b.urusan}
              onPointerEnter={() => setAktif(b.urusan)}
              onPointerLeave={() => setAktif(null)}
              className={`group flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors duration-200 ${disorot ? 'bg-brand-soft/60' : ''}`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-md transition-colors duration-200 ${
                  disorot ? 'bg-action text-white' : 'bg-brand-soft text-action'
                }`}
              >
                <IkonUrusan urusan={b.urusan} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  {/* Nama urusan boleh 2 baris di ponsel agar tidak terpotong ("Pekerjaan Umum dan P…"). */}
                  <span className="line-clamp-2 min-w-0 text-sm font-medium text-ink" title={b.urusan}>
                    {b.urusan}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-ink-strong tabular-nums">{formatRupiahRingkas(b.anggaran)}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-recessed" aria-hidden>
                  <div
                    className="animasi-batang h-full rounded-full bg-seri-anggaran"
                    style={{ width: `${Math.max(porsi * 100, 1)}%`, '--tunda': `${i * 90}ms` } as CSSProperties}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between gap-3 text-xs text-ink-subtle tabular-nums">
                  <span>{perWarga && <>≈ {formatRupiahRingkas(perWarga.perTahun)} per warga</>}</span>
                  <span className="rounded-full bg-recessed px-1.5 font-medium text-ink-muted">{formatPersen(porsi)}</span>
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
  const IkonArah = naik ? ArrowUpRight : ArrowDownRight

  return (
    <Card className={`flex min-w-0 flex-col lg:col-span-5 ${KELAS_KARTU_HIDUP}`}>
      <h3 className="text-xl leading-tight font-semibold text-ink-strong md:text-2xl">
        {selisih !== null && sebelumnya
          ? `APBD ${tahun} ${naik ? 'naik' : 'turun'} ${formatPersen(Math.abs(selisih) / sebelumnya.anggaran)} dari ${sebelumnya.tahun}`
          : `Total APBD per tahun`}
      </h3>

      {banding && (
        <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
          <p>
            <span className="block text-xs text-ink-subtle">Total APBD {tahun}</span>
            <span className="text-3xl leading-none font-semibold tracking-[-0.02em] text-ink-strong tabular-nums">
              {formatRupiahRingkas(banding.saatIni.anggaran)}
            </span>
          </p>
          {selisih !== null && sebelumnya && (
            <span className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-action tabular-nums">
              <IkonArah className="size-3.5" strokeWidth={1.5} aria-hidden />
              {naik ? '+' : '−'}
              {formatRupiahRingkas(Math.abs(selisih))} dari {sebelumnya.tahun}
            </span>
          )}
        </div>
      )}

      {tren.length > 1 && (
        <div className="mt-5">
          <GrafikTrenMini tren={tren} />
        </div>
      )}

      {banding && <KonteksWarga anggaran={banding.saatIni.anggaran} tahun={tahun} className="mt-5" />}

      {realisasi && (
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-ink-muted">Terealisasi {realisasi.tahun}</span>
            <span className="font-semibold text-ink-strong tabular-nums">
              {formatPersen(realisasi.realisasi / realisasi.anggaran)}{' '}
              <span className="font-normal text-ink-subtle">dari {formatRupiahRingkas(realisasi.anggaran)}</span>
            </span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-recessed" aria-hidden>
            <div
              className="animasi-batang h-full rounded-full bg-seri-realisasi"
              style={{ width: `${(realisasi.realisasi / realisasi.anggaran) * 100}%` }}
            />
          </div>
        </div>
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
          pelengkap="Per urusan, dari tahun ke tahun, dan artinya bagi warga."
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
