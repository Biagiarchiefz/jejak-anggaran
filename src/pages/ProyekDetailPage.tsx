import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { BadgeDemo } from '../components/BadgeDemo'
import { BadgeRedFlag, IkonBendera } from '../components/BadgeRedFlag'
import { BadgeStatusProyek } from '../components/BadgeStatus'
import { KartuLaporan, type StatusKonfirmasi } from '../components/KartuLaporan'
import { LinimasaFoto } from '../components/LinimasaFoto'
import { SumberData } from '../components/SumberData'
import { TautanTombol } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { SkeletonHalaman } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'
import { useProyekDetail } from '../hooks/useProyekDetail'
import { useStatusPengguna } from '../hooks/useStatusPengguna'
import { pesanError } from '../lib/errors'
import { formatRupiah } from '../lib/format'
import { buatRingkasanLapor } from '../lib/ringkasanLapor'
import { konfirmasiLaporan } from '../services/laporanService'
import type { DetailProyek } from '../services/proyekService'

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium tracking-wide text-slate-600 uppercase">{label}</dt>
      <dd className="mt-0.5 break-words text-slate-900">{children}</dd>
    </div>
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
    <div className="space-y-6">
      <title>{`${proyek.nama_paket} — Jejak Anggaran`}</title>
      <Link to="/peta" className="inline-block text-sm font-medium text-merek-800 underline-offset-2 hover:underline">
        ← Kembali ke peta
      </Link>

      {laporanBaru && (
        <div role="status" className="rounded-ui border border-merek-200 bg-merek-50 p-4 text-sm text-merek-900">
          <strong>Terima kasih, laporan Anda sudah diterima.</strong> Admin akan memverifikasinya. Status dan riwayatnya
          bisa dipantau di halaman ini.
        </div>
      )}

      <header className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <BadgeStatusProyek status={proyek.status_proyek} />
          {proyek.redFlag && <BadgeRedFlag />}
          {proyek.is_demo && <BadgeDemo />}
        </div>
        <h1 className="text-2xl font-medium text-balance sm:text-3xl">{proyek.nama_paket}</h1>
        <p className="text-slate-600">
          {[proyek.kelurahan, `Kec. ${proyek.kecamatan}`].filter(Boolean).join(', ')} · Tahun anggaran {proyek.tahun_anggaran}
        </p>
      </header>

      {proyek.redFlag && (
        <section aria-labelledby="judul-redflag" className="rounded-ui border border-red-200 bg-redflag-bg p-4">
          <h2 id="judul-redflag" className="flex items-center gap-2 font-medium text-redflag">
            <IkonBendera className="size-4" />
            Proyek ini perlu perhatian
          </h2>
          <p className="mt-1 text-sm text-slate-600">{proyek.redFlag.alasan}</p>
          <p className="mt-2 text-xs text-slate-600">
            Tanda ini dihitung otomatis dari laporan warga dan <strong>bukan tuduhan</strong> korupsi atau penyimpangan.{' '}
            <Link to="/tentang-data#red-flag" className="underline">
              Pelajari aturannya
            </Link>
          </p>
        </section>
      )}

      <Card>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Info label="Pagu anggaran">
            <span className="text-lg font-medium">{formatRupiah(proyek.pagu)}</span>
            <SumberData nama="SiRUP LKPP" url={proyek.sumber_rup_url} diaksesPada={proyek.diakses_pada} demo={proyek.is_demo} />
          </Info>
          <Info label="Nilai kontrak">
            {proyek.nilai_kontrak === null ? (
              <span className="text-slate-600">Belum ada data kontrak</span>
            ) : (
              <>
                <span className="text-lg font-medium">{formatRupiah(proyek.nilai_kontrak)}</span>
                <SumberData
                  nama="LPSE Kota Bandung"
                  url={proyek.sumber_lpse_url}
                  diaksesPada={proyek.diakses_pada}
                  demo={proyek.is_demo}
                />
              </>
            )}
          </Info>
          <Info label="Pelaksana">{proyek.pelaksana ?? <span className="text-slate-600">Belum diketahui</span>}</Info>
          <Info label="Satuan kerja">{proyek.satker}</Info>
          <Info label="Tahun anggaran">{proyek.tahun_anggaran}</Info>
          <Info label="Kode RUP">
            {proyek.kode_rup ? (
              proyek.sumber_rup_url ? (
                <a href={proyek.sumber_rup_url} target="_blank" rel="noopener noreferrer" className="text-merek-800 underline">
                  {proyek.kode_rup}
                  <span className="sr-only"> (membuka SiRUP di tab baru)</span>
                </a>
              ) : (
                proyek.kode_rup
              )
            ) : (
              <span className="text-slate-600">—</span>
            )}
          </Info>
        </dl>
      </Card>

      <div className="flex flex-col gap-2 rounded-ui bg-merek-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-merek-900">Melihat kondisi proyek ini di lapangan? Laporkan dengan foto.</p>
        <TautanTombol to={pathLapor} className="shrink-0">
          Laporkan kondisi
        </TautanTombol>
      </div>

      <section aria-labelledby="judul-foto" className="space-y-3">
        <h2 id="judul-foto" className="text-lg font-medium">
          Linimasa foto lapangan
        </h2>
        <LinimasaFoto laporan={laporan} />
      </section>

      <section aria-labelledby="judul-laporan" className="space-y-3">
        <h2 id="judul-laporan" className="text-lg font-medium">
          Laporan warga ({laporan.length})
        </h2>
        <p className="text-sm text-slate-600">Identitas pelapor tidak ditampilkan ke publik.</p>
        {statusPengguna.error && (
          <p role="alert" className="text-sm text-redflag">
            Status konfirmasi Anda gagal dimuat.{' '}
            <button type="button" className="underline" onClick={statusPengguna.muatUlang}>
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
          <div className="space-y-3">
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
