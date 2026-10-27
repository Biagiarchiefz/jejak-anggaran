import { useState, type ReactNode } from 'react'
import { ChevronRight, CircleCheck } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { BadgeRedFlag, IkonBendera } from '../components/BadgeRedFlag'
import { BadgeStatusProyek } from '../components/BadgeStatus'
import { KartuLaporan, type StatusKonfirmasi } from '../components/KartuLaporan'
import { LinimasaFoto } from '../components/LinimasaFoto'
import { SumberData } from '../components/SumberData'
import { TautanLuarTombol, TautanTombol } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { SkeletonHalaman } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'
import { useProyekDetail } from '../hooks/useProyekDetail'
import { useStatusPengguna } from '../hooks/useStatusPengguna'
import { pesanError } from '../lib/errors'
import { formatRupiah } from '../lib/format'
import { buatRingkasanLapor, URL_LAPOR } from '../lib/ringkasanLapor'
import { konfirmasiLaporan } from '../services/laporanService'
import type { DetailProyek } from '../services/proyekService'

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-ink-subtle">{label}</dt>
      <dd className="mt-0.5 break-words text-ink">{children}</dd>
    </div>
  )
}

function JudulBagian({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-xl leading-[1.25] font-semibold tracking-[-0.005em] md:text-2xl">
      {children}
    </h2>
  )
}

function IsiDetail({ detail, muatUlang }: { detail: DetailProyek; muatUlang: () => void }) {
  const { proyek, laporan } = detail
  const { pengguna } = useAuth()
  const navigate = useNavigate()
  const lokasi = useLocation()
  const laporanBaru = (lokasi.state as { laporanTerkirim?: boolean } | null)?.laporanTerkirim

  const laporanIds = laporan.map((l) => l.id)
  const statusPengguna = useStatusPengguna(laporanIds, pengguna?.id ?? null)
  const [mengonfirmasi, setMengonfirmasi] = useState<string | null>(null)
  const [pesanKonfirmasi, setPesanKonfirmasi] = useState<Record<string, string>>({})

  const pathHalaman = `/proyek/${proyek.id}`
  const pathLapor = `${pathHalaman}/lapor`

  function statusKonfirmasi(id: string): StatusKonfirmasi {
    if (!pengguna) return 'tamu'
    if (!statusPengguna.data) return 'memuat'
    if (statusPengguna.data.milikSaya.has(id)) return 'milik-saya'
    if (statusPengguna.data.sudahDikonfirmasi.has(id)) return 'sudah'
    return 'bisa'
  }

  async function konfirmasi(id: string) {
    if (!pengguna) {
      navigate(`/masuk?kembali=${encodeURIComponent(pathHalaman)}`)
      return
    }
    setMengonfirmasi(id)
    setPesanKonfirmasi((p) => ({ ...p, [id]: '' }))
    try {
      await konfirmasiLaporan(id)
      muatUlang()
      statusPengguna.muatUlang()
    } catch (e) {
      setPesanKonfirmasi((p) => ({ ...p, [id]: pesanError(e) }))
    } finally {
      setMengonfirmasi(null)
    }
  }

  return (
    // pb-24 di ponsel: ruang untuk bar aksi yang menempel di bawah.
    <div className="space-y-8 pb-24 lg:pb-0">
      <title>{`${proyek.nama_paket} — Jejak Anggaran`}</title>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-subtle">
          <li>
            <Link to="/" className="hover:text-ink hover:underline">
              Beranda
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden />
            <Link to="/peta" className="hover:text-ink hover:underline">
              Peta proyek
            </Link>
          </li>
          <li className="flex min-w-0 items-center gap-1">
            <ChevronRight className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
            <span aria-current="page" className="max-w-[16rem] truncate text-ink-muted">
              {proyek.nama_paket}
            </span>
          </li>
        </ol>
      </nav>

      {laporanBaru && (
        <div role="status" className="flex gap-3 rounded-lg border border-success/20 bg-success-soft p-4 text-sm">
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" strokeWidth={1.5} aria-hidden />
          <p className="text-ink">
            <span className="font-medium text-success">Terima kasih, laporan Anda sudah diterima.</span> Admin akan
            memverifikasinya. Status dan riwayatnya bisa dipantau di halaman ini.
          </p>
        </div>
      )}

      <header className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <BadgeStatusProyek status={proyek.status_proyek} />
          {proyek.redFlag && <BadgeRedFlag />}
        </div>
        <h1 className="max-w-4xl text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-balance md:text-[48px]">
          {proyek.nama_paket}
        </h1>
        <p className="text-lg text-ink-muted">
          {[proyek.kelurahan, `Kec. ${proyek.kecamatan}`].filter(Boolean).join(', ')} · Tahun anggaran {proyek.tahun_anggaran}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div data-muncul-anak="" className="min-w-0 space-y-10 lg:col-span-2">
          {proyek.redFlag && (
            <section aria-labelledby="judul-redflag" className="rounded-lg border border-danger/20 bg-danger-soft p-4">
              <h2 id="judul-redflag" className="flex items-center gap-2 text-base font-medium tracking-normal text-danger">
                <IkonBendera className="size-4" />
                Perlu perhatian
              </h2>
              <p className="mt-1 text-sm text-ink-muted">{proyek.redFlag.alasan}</p>
              <p className="mt-2 text-xs text-ink-muted">
                Tanda ini dihitung otomatis dari laporan warga dan <strong>bukan tuduhan</strong> korupsi atau penyimpangan.{' '}
                <Link to="/tentang-data#red-flag" className="text-link hover:underline">
                  Pelajari aturannya
                </Link>
              </p>
            </section>
          )}

          <section aria-labelledby="judul-data" className="space-y-4">
            <JudulBagian id="judul-data">Data anggaran</JudulBagian>
            <Card>
              <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <Info label="Pelaksana">{proyek.pelaksana ?? <span className="text-ink-subtle">Belum diketahui</span>}</Info>
                <Info label="Satuan kerja">{proyek.satker}</Info>
                <Info label="Tahun anggaran">{proyek.tahun_anggaran}</Info>
                <Info label="Kode RUP">
                  {proyek.kode_rup ? (
                    proyek.sumber_rup_url ? (
                      <a href={proyek.sumber_rup_url} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                        {proyek.kode_rup} ↗<span className="sr-only"> (membuka SiRUP di tab baru)</span>
                      </a>
                    ) : (
                      proyek.kode_rup
                    )
                  ) : (
                    <span className="text-ink-subtle">—</span>
                  )}
                </Info>
              </dl>
            </Card>
          </section>

          <section aria-labelledby="judul-foto" className="space-y-4">
            <JudulBagian id="judul-foto">Linimasa foto lapangan</JudulBagian>
            <LinimasaFoto laporan={laporan} />
          </section>

          <section aria-labelledby="judul-laporan" className="space-y-4">
            <div>
              <JudulBagian id="judul-laporan">Laporan warga ({laporan.length})</JudulBagian>
              <p className="mt-1 text-sm text-ink-muted">Identitas pelapor tidak ditampilkan ke publik.</p>
            </div>
            {statusPengguna.error && (
              <p role="alert" className="text-sm text-danger">
                Status konfirmasi Anda gagal dimuat.{' '}
                <button type="button" className="font-medium underline" onClick={statusPengguna.muatUlang}>
                  Coba lagi
                </button>
              </p>
            )}
            {laporan.length === 0 ? (
              <EmptyState
                judul="Belum ada laporan untuk proyek ini"
                pesan="Jadilah yang pertama melaporkan kondisi proyek ini di lapangan."
                aksi={<TautanTombol to={pathLapor}>Laporkan kondisi</TautanTombol>}
              />
            ) : (
              <div className="space-y-4">
                {laporan.map((l) => (
                  <KartuLaporan
                    key={l.id}
                    laporan={l}
                    ringkasanLapor={buatRingkasanLapor({
                      proyek,
                      laporan: l,
                      urlHalaman: `${window.location.origin}${pathHalaman}`,
                    })}
                    statusKonfirmasi={statusKonfirmasi(l.id)}
                    mengonfirmasi={mengonfirmasi === l.id}
                    pesanKonfirmasi={pesanKonfirmasi[l.id]}
                    onKonfirmasi={() => konfirmasi(l.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Ringkasan angka + aksi: menempel di kanan (desktop). */}
        <aside aria-label="Ringkasan proyek" className="lg:sticky lg:top-24 lg:self-start">
          <Card className="space-y-5">
            <div>
              <p className="text-sm font-medium text-ink-muted">Pagu anggaran</p>
              <p className="mt-2 text-[28px] leading-none font-semibold tracking-[-0.02em] text-ink-strong tabular-nums">
                {formatRupiah(proyek.pagu)}
              </p>
              <SumberData nama="SiRUP LKPP" url={proyek.sumber_rup_url} diaksesPada={proyek.diakses_pada} demo={proyek.is_demo} className="mt-2" />
            </div>
            <div className="border-t border-border-soft pt-5">
              <p className="text-sm font-medium text-ink-muted">Nilai kontrak</p>
              {proyek.nilai_kontrak === null ? (
                <p className="mt-2 text-ink-subtle">Belum ada data kontrak</p>
              ) : (
                <>
                  <p className="mt-2 text-[28px] leading-none font-semibold tracking-[-0.02em] text-ink-strong tabular-nums">
                    {formatRupiah(proyek.nilai_kontrak)}
                  </p>
                  <SumberData
                    nama="LPSE Kota Bandung"
                    url={proyek.sumber_lpse_url}
                    diaksesPada={proyek.diakses_pada}
                    demo={proyek.is_demo}
                    className="mt-2"
                  />
                </>
              )}
            </div>
            <div className="hidden space-y-2 border-t border-border-soft pt-5 lg:block">
              <TautanTombol to={pathLapor} className="w-full">
                Laporkan kondisi
              </TautanTombol>
              <TautanLuarTombol href={URL_LAPOR} className="w-full">
                Teruskan ke LAPOR!
              </TautanLuarTombol>
            </div>
          </Card>
        </aside>
      </div>

      {/* Ponsel & tablet: tombol aksi menempel di atas bottom navigation. */}
      <div className="fixed inset-x-0 bottom-16 z-[1000] flex gap-2 border-t border-border bg-surface p-3 lg:hidden">
        <TautanTombol to={pathLapor} ukuran="sm" className="flex-1">
          Laporkan kondisi
        </TautanTombol>
        <TautanLuarTombol href={URL_LAPOR} ukuran="sm" className="flex-1">
          LAPOR!
        </TautanLuarTombol>
      </div>
    </div>
  )
}

export default function ProyekDetailPage() {
  const { id = '' } = useParams()
  const { data, error, memuat, muatUlang } = useProyekDetail(id)

  if (memuat && !data) return <SkeletonHalaman />
  if (error) {
    return (
      <ErrorState
        judul={error.code === 'TIDAK_DITEMUKAN' ? 'Proyek tidak ditemukan' : undefined}
        pesan={error.pesan}
        onCobaLagi={error.code === 'TIDAK_DITEMUKAN' ? undefined : muatUlang}
      />
    )
  }
  if (!data) return null
  return <IsiDetail detail={data} muatUlang={muatUlang} />
}
