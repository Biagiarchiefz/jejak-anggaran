import { useState, type ReactNode } from 'react'
import { CalendarDays, ChevronRight, CircleCheck, MapPin, MessageSquareText } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'
import { BadgeRedFlag, IkonBendera } from '../components/BadgeRedFlag'
import { BadgeStatusProyek } from '../components/BadgeStatus'
import { CuplikanPeta } from '../components/CuplikanPeta'
import { DialogPerluMasuk } from '../components/DialogPerluMasuk'
import { KartuLaporan, type StatusKonfirmasi } from '../components/KartuLaporan'
import { LinimasaFoto } from '../components/LinimasaFoto'
import { SumberData } from '../components/SumberData'
import { TautanLuarTombol, TautanTombol } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { SkeletonHalaman } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'
import { useProyekDetail } from '../hooks/useProyekDetail'
import { useStatusPengguna } from '../hooks/useStatusPengguna'
import { pesanError } from '../lib/errors'
import { formatPersen, formatRupiah } from '../lib/format'
import { buatRingkasanLapor, URL_LAPOR } from '../lib/ringkasanLapor'
import { konfirmasiLaporan } from '../services/laporanService'
import type { DetailProyek } from '../services/proyekService'

/** Satu sel grid metadata: label kapital kecil di atas nilai yang tajam. */
function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 bg-surface px-4 py-3">
      <dt className="text-[11px] font-medium tracking-[0.04em] text-ink-subtle uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-medium break-words text-ink-strong">{children}</dd>
    </div>
  )
}

function JudulBagian({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-lg leading-tight font-semibold tracking-[-0.005em] text-ink-strong md:text-xl">
      {children}
    </h2>
  )
}

const KELAS_LABEL_ANGKA = 'text-xs font-medium tracking-[0.04em] text-ink-subtle uppercase'
const KELAS_ANGKA = 'mt-1.5 text-[26px] leading-none font-semibold tracking-[-0.02em] text-ink-strong tabular-nums'

function IsiDetail({ detail, muatUlang }: { detail: DetailProyek; muatUlang: () => void }) {
  const { proyek, laporan } = detail
  const { pengguna } = useAuth()
  const lokasi = useLocation()
  const laporanBaru = (lokasi.state as { laporanTerkirim?: boolean } | null)?.laporanTerkirim

  const laporanIds = laporan.map((l) => l.id)
  const statusPengguna = useStatusPengguna(laporanIds, pengguna?.id ?? null)
  const [mengonfirmasi, setMengonfirmasi] = useState<string | null>(null)
  const [pesanKonfirmasi, setPesanKonfirmasi] = useState<Record<string, string>>({})
  const [mintaMasuk, setMintaMasuk] = useState(false)

  const pathHalaman = `/proyek/${proyek.id}`
  const pathLapor = `${pathHalaman}/lapor`
  const wilayah = [proyek.kelurahan, `Kec. ${proyek.kecamatan}`].filter(Boolean).join(', ')
  const rasioKontrak = proyek.nilai_kontrak !== null && proyek.pagu > 0 ? proyek.nilai_kontrak / proyek.pagu : null
  const laporanDipantau = laporan.filter((l) => l.status !== 'ditolak' && l.status !== 'selesai').length

  function statusKonfirmasi(id: string): StatusKonfirmasi {
    if (!pengguna) return 'tamu'
    if (!statusPengguna.data) return 'memuat'
    if (statusPengguna.data.milikSaya.has(id)) return 'milik-saya'
    if (statusPengguna.data.sudahDikonfirmasi.has(id)) return 'sudah'
    return 'bisa'
  }

  async function konfirmasi(id: string) {
    // Tamu: tampilkan dialog ajakan masuk, bukan langsung berpindah halaman.
    if (!pengguna) {
      setMintaMasuk(true)
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
    <div className="space-y-6 pb-24 lg:pb-0">
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

      {/* Kepala halaman ringkas: badge → judul → baris meta berikon. */}
      <header>
        <div className="flex flex-wrap gap-1.5">
          <BadgeStatusProyek status={proyek.status_proyek} />
          {proyek.redFlag && <BadgeRedFlag />}
        </div>
        <h1 className="mt-3 max-w-4xl text-[28px] leading-[1.12] font-medium tracking-[-0.018em] text-balance text-ink-strong md:text-[36px]">
          {proyek.nama_paket}
        </h1>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-muted">
          <li className="flex items-center gap-1.5">
            <MapPin className="size-4 text-ink-subtle" strokeWidth={1.5} aria-hidden />
            {wilayah}
          </li>
          <li className="flex items-center gap-1.5">
            <CalendarDays className="size-4 text-ink-subtle" strokeWidth={1.5} aria-hidden />
            Tahun anggaran {proyek.tahun_anggaran}
          </li>
          <li className="flex items-center gap-1.5">
            <MessageSquareText className="size-4 text-ink-subtle" strokeWidth={1.5} aria-hidden />
            {laporan.length} laporan warga
          </li>
        </ul>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        {/* Ponsel: ringkasan (aside) tampil lebih dulu agar pagu & kontrak langsung terlihat; desktop: kolom kanan. */}
        <div data-muncul-anak="" className="order-2 min-w-0 space-y-8 lg:order-1">
          {proyek.redFlag && (
            <section aria-labelledby="judul-redflag" className="flex gap-3 rounded-lg border border-danger/20 bg-danger-soft p-4">
              <IkonBendera className="mt-0.5 size-5 shrink-0 text-danger" />
              <div>
                <h2 id="judul-redflag" className="text-base font-semibold tracking-normal text-danger">
                  Perlu perhatian
                </h2>
                <p className="mt-0.5 text-sm text-ink">{proyek.redFlag.alasan}</p>
                <p className="mt-1.5 text-xs text-ink-muted">
                  Tanda ini dihitung otomatis dari laporan warga dan <strong>bukan tuduhan</strong> korupsi atau penyimpangan.{' '}
                  <Link to="/tentang-data#red-flag" className="text-link hover:underline">
                    Pelajari aturannya
                  </Link>
                </p>
              </div>
            </section>
          )}

          <section aria-labelledby="judul-data">
            <JudulBagian id="judul-data">Data anggaran</JudulBagian>
            {/* Grid metadata rapat: sel dipisah garis 1px (gap-px di atas latar border). */}
            <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-edge sm:grid-cols-4">
              <Info label="Pelaksana">{proyek.pelaksana ?? <span className="font-normal text-ink-subtle">Belum diketahui</span>}</Info>
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
                  <span className="font-normal text-ink-subtle">—</span>
                )}
              </Info>
            </dl>
          </section>

          <section aria-labelledby="judul-foto">
            <JudulBagian id="judul-foto">Linimasa foto lapangan</JudulBagian>
            <div className="mt-3">
              <LinimasaFoto laporan={laporan} />
            </div>
          </section>

          <section aria-labelledby="judul-laporan">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <JudulBagian id="judul-laporan">Laporan warga ({laporan.length})</JudulBagian>
              <p className="text-xs text-ink-subtle">Identitas pelapor tidak ditampilkan ke publik.</p>
            </div>
            {statusPengguna.error && (
              <p role="alert" className="mt-2 text-sm text-danger">
                Status konfirmasi Anda gagal dimuat.{' '}
                <button type="button" className="font-medium underline" onClick={statusPengguna.muatUlang}>
                  Coba lagi
                </button>
              </p>
            )}
            <div className="mt-3">
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
            </div>
          </section>
        </div>

        {/* Ringkasan menempel (desktop): lokasi → pagu & kontrak → angka laporan → aksi. Di ponsel aksi ada di bar bawah. */}
        <aside aria-label="Ringkasan proyek" className="order-1 lg:sticky lg:top-20 lg:order-2 lg:self-start">
          <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
            <div className="aspect-[16/7] border-b border-border">
              <CuplikanPeta lat={proyek.lat} lng={proyek.lng} label={`Peta lokasi proyek di ${wilayah}`} perluPerhatian={!!proyek.redFlag} />
            </div>

            <div className="p-4 sm:p-5">
              <p className={KELAS_LABEL_ANGKA}>Pagu anggaran</p>
              <p className={KELAS_ANGKA}>{formatRupiah(proyek.pagu)}</p>
              <SumberData nama="SiRUP LKPP" url={proyek.sumber_rup_url} diaksesPada={proyek.diakses_pada} demo={proyek.is_demo} className="mt-1.5" />

              <div className="mt-4 border-t border-border-soft pt-4">
                <p className={KELAS_LABEL_ANGKA}>Nilai kontrak</p>
                {proyek.nilai_kontrak === null ? (
                  <p className="mt-1.5 text-sm text-ink-muted">Belum ada data kontrak</p>
                ) : (
                  <>
                    <p className={KELAS_ANGKA}>{formatRupiah(proyek.nilai_kontrak)}</p>
                    <SumberData
                      nama="LPSE Kota Bandung"
                      url={proyek.sumber_lpse_url}
                      diaksesPada={proyek.diakses_pada}
                      demo={proyek.is_demo}
                      className="mt-1.5"
                    />
                  </>
                )}
                {rasioKontrak !== null && (
                  <div className="mt-3">
                    <div className="h-1.5 rounded-full bg-recessed" aria-hidden>
                      <div className="h-full rounded-full bg-action" style={{ width: `${Math.min(rasioKontrak, 1) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-ink-muted tabular-nums">Nilai kontrak = {formatPersen(rasioKontrak)} dari pagu</p>
                  </div>
                )}
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border-soft pt-4 text-center">
                <div className="rounded-md bg-canvas-soft px-2 py-2">
                  <dt className="text-[11px] text-ink-subtle">Laporan warga</dt>
                  <dd className="text-lg font-semibold text-ink-strong tabular-nums">{laporan.length}</dd>
                </div>
                <div className="rounded-md bg-canvas-soft px-2 py-2">
                  <dt className="text-[11px] text-ink-subtle">Sedang diproses</dt>
                  <dd className="text-lg font-semibold text-ink-strong tabular-nums">{laporanDipantau}</dd>
                </div>
              </dl>

              <div className="mt-4 hidden space-y-2 lg:block">
                <TautanTombol to={pathLapor} className="w-full">
                  Laporkan kondisi
                </TautanTombol>
                <TautanLuarTombol href={URL_LAPOR} className="w-full">
                  Teruskan ke LAPOR!
                </TautanLuarTombol>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <DialogPerluMasuk terbuka={mintaMasuk} onTutup={() => setMintaMasuk(false)} kembaliKe={pathHalaman} />

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
        halaman
        judul={error.code === 'TIDAK_DITEMUKAN' ? 'Proyek tidak ditemukan' : undefined}
        pesan={error.pesan}
        onCobaLagi={error.code === 'TIDAK_DITEMUKAN' ? undefined : muatUlang}
      />
    )
  }
  if (!data) return null
  return <IsiDetail detail={data} muatUlang={muatUlang} />
}
