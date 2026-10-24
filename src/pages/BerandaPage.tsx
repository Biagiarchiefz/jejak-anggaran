import { useState } from 'react'
import { GrafikTren, GrafikUrusan } from '../components/GrafikAnggaran'
import { HeroBanner, type FotoLatar } from '../components/HeroBanner'
import { SeksiProyek } from '../components/SeksiProyek'
import { SeksiPengantar } from '../components/SeksiPengantar'
import { JudulSeksi } from '../components/ui/JudulSeksi'
import { LabelSeksi } from '../components/ui/LabelSeksi'
import { SumberData } from '../components/SumberData'
import { TautanTombol } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Skeleton } from '../components/ui/Skeleton'
import { useAnggaran } from '../hooks/useAnggaran'
import { totalPerTahun, unikBerdasarkanId, urusanPadaTahun } from '../lib/anggaran'
import { formatPersen, formatRupiah, formatRupiahRingkas } from '../lib/format'
import type { AnggaranDaerah, SumberData as TipeSumberData } from '../services/anggaranService'

// Petugas penyapu jalan di Bandung. Abdul Ridwan (@abdulridwanrr), Unsplash License.
const ID_FOTO_HERO = '1744343933200-c858f07e6407'
const urlFotoHero = (lebar: number) => `https://images.unsplash.com/photo-${ID_FOTO_HERO}?auto=format&fit=crop&q=70&w=${lebar}`
const FOTO_HERO: FotoLatar = {
  src: urlFotoHero(1280),
  srcSet: [828, 1280, 1920].map((w) => `${urlFotoHero(w)} ${w}w`).join(', '),
}

function DaftarSumber({ sumber }: { sumber: TipeSumberData[] }) {
  return (
    <div className="mt-2 space-y-0.5">
      {sumber.map((s) => (
        <SumberData key={s.id} nama={s.nama} url={s.url} diaksesPada={s.diakses_pada} />
      ))}
    </div>
  )
}

function DashboardAnggaran({ data }: { data: AnggaranDaerah[] }) {
  const tren = totalPerTahun(data)
  const tahunTerbaru = tren[tren.length - 1].tahun
  const [tahunDipilih, setTahunDipilih] = useState(tahunTerbaru)
  const ringkasan = tren[tren.length - 1]
  const barisTerbaru = urusanPadaTahun(data, tahunTerbaru)
  const barisDipilih = urusanPadaTahun(data, tahunDipilih)

  return (
    <div className="space-y-6">
      <section aria-labelledby="judul-total" className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 id="judul-total" className="text-sm font-medium tracking-normal text-slate-600">
            Total APBD Kota Bandung {tahunTerbaru}
          </h2>
          <p className="mt-1 text-3xl font-medium text-slate-900">{formatRupiahRingkas(ringkasan.anggaran)}</p>
          <p className="text-sm text-slate-600">{formatRupiah(ringkasan.anggaran)}</p>
          <DaftarSumber sumber={unikBerdasarkanId(barisTerbaru.map((b) => b.sumber))} />
        </Card>
        <Card>
          <h2 className="text-sm font-medium tracking-normal text-slate-600">Realisasi {tahunTerbaru}</h2>
          {ringkasan.realisasi === null ? (
            <p className="mt-1 text-sm text-slate-600">Data realisasi tahun ini belum tersedia lengkap.</p>
          ) : (
            <>
              <p className="mt-1 text-3xl font-medium text-slate-900">{formatRupiahRingkas(ringkasan.realisasi)}</p>
              <p className="text-sm text-slate-600">
                {formatPersen(ringkasan.realisasi / ringkasan.anggaran)} dari anggaran terpakai
              </p>
              <DaftarSumber sumber={unikBerdasarkanId(barisTerbaru.map((b) => b.sumber))} />
            </>
          )}
        </Card>
      </section>

      <Card>
        <section aria-labelledby="judul-urusan">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="judul-urusan" className="text-lg font-medium">
                Untuk apa anggarannya?
              </h2>
              <p className="text-sm text-slate-600">Pembagian anggaran per urusan pemerintahan.</p>
            </div>
            {tren.length > 1 && (
              <label className="text-sm">
                <span className="mr-2 text-slate-700">Tahun</span>
                <select
                  value={tahunDipilih}
                  onChange={(e) => setTahunDipilih(Number(e.target.value))}
                  className="rounded-ui border border-slate-200 bg-white shadow-sm px-4 py-1.5"
                >
                  {tren.map((t) => (
                    <option key={t.tahun} value={t.tahun}>
                      {t.tahun}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <GrafikUrusan data={barisDipilih} />
          <DaftarSumber sumber={unikBerdasarkanId(barisDipilih.map((b) => b.sumber))} />
        </section>
      </Card>

      {tren.length > 1 && (
        <Card>
          <section aria-labelledby="judul-tren">
            <h2 id="judul-tren" className="text-lg font-medium">
              Tren antar tahun
            </h2>
            <p className="mb-4 text-sm text-slate-600">Total anggaran dibandingkan realisasinya setiap tahun.</p>
            <GrafikTren data={tren} />
            <DaftarSumber sumber={unikBerdasarkanId(data.map((b) => b.sumber))} />
          </section>
        </Card>
      )}
    </div>
  )
}

export default function BerandaPage() {
  const { data, error, memuat, muatUlang } = useAnggaran()

  return (
    <div>
      <title>Jejak Anggaran — Kota Bandung</title>
      {/* Hero lebih lebar dari kontainer standar: maks 86rem (sejajar Navbar), jarak 1rem dari tepi layar.
          Margin negatif = selisih lebar; 100cqw = lebar halaman tanpa scrollbar (@container di Layout). */}
      <div className="mx-[calc((100%_-_min(100cqw_-_2rem,86rem))/2)]">
        <HeroBanner
          judul="Uang Publik Kota Bandung: Terbuka, Terlacak, & Diawasi Warga"
          deskripsi="Lacak anggaran daerah, temukan proyeknya di peta, lalu lihat kondisi nyatanya di lapangan berdasarkan laporan warga."
          aksi={
            <>
              <TautanTombol to="/peta" varian="terang">
                Buka peta proyek
              </TautanTombol>
              <TautanTombol to="/tentang-data" varian="garisTerang">
                Tentang data
              </TautanTombol>
            </>
          }
          remah={[{ label: 'Beranda', ke: '/' }, { label: 'Dashboard Anggaran' }]}
          foto={FOTO_HERO}
        />
      </div>

      {/* Jarak antar seksi lega (pt-20 s.d. pt-28) agar halaman terasa lapang. */}
      <div className="pt-20 lg:pt-28">
        <SeksiPengantar />
      </div>

      <div className="pt-20 lg:pt-28">
        <SeksiProyek />
      </div>

      <div className="pt-20 lg:pt-28">
        <div id="anggaran" className="scroll-mt-6 space-y-6">
          <div>
            <LabelSeksi>Dashboard anggaran</LabelSeksi>
            <JudulSeksi
              className="mt-3"
              utama="Anggaran Kota Bandung."
              pelengkap="Total APBD, pembagian per urusan, dan trennya dari tahun ke tahun."
            />
          </div>
          {memuat && !data ? (
            <div role="status" className="grid gap-4 sm:grid-cols-2">
              <span className="sr-only">Memuat data anggaran…</span>
              <Skeleton className="h-36" />
              <Skeleton className="h-36" />
              <Skeleton className="h-72 sm:col-span-2" />
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
      </div>
    </div>
  )
}
