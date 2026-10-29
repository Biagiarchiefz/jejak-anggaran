import { useId, useState } from 'react'
import { ChevronDown, Send, ThumbsUp } from 'lucide-react'
import { BadgeStatusLaporan } from '../../../components/common/BadgeStatus'
import { LinimasaStatus } from './LinimasaStatus'
import { PanelTeruskanLapor } from './TeruskanKeLapor'
import { Lipatan } from '../../../components/common/Lipatan'
import { TombolLipat } from '../../../components/common/TombolLipat'
import { formatTanggal } from '../../../utils/format'
import { LABEL_KATEGORI } from '../../../utils/label'
import type { LaporanDenganRiwayat } from '../../../services/proyekService'

export type StatusKonfirmasi = 'tamu' | 'memuat' | 'milik-saya' | 'sudah' | 'bisa'

type TombolKonfirmasiProps = {
  status: StatusKonfirmasi
  jumlah: number
  ditolak: boolean
  mengonfirmasi: boolean
  onKonfirmasi: () => void
}

/**
 * Satu tombol pil "jempol + jumlah" pengganti badge jumlah dan tombol teks panjang.
 * Tamu tetap bisa menekannya: halaman lalu menampilkan dialog ajakan masuk (bukan tombol login di dalam kartu).
 */
function TombolKonfirmasi({ status, jumlah, ditolak, mengonfirmasi, onKonfirmasi }: TombolKonfirmasiProps) {
  const sudah = status === 'sudah'
  const label = ditolak
    ? 'Konfirmasi'
    : sudah
      ? 'Dikonfirmasi'
      : status === 'milik-saya'
        ? 'Laporan Anda'
        : 'Saya juga melihat'
  const nonaktif = ditolak || mengonfirmasi || status === 'memuat' || status === 'milik-saya' || sudah
  const keterangan = ditolak
    ? 'Laporan yang ditolak tidak bisa dikonfirmasi'
    : status === 'milik-saya'
      ? 'Anda tidak bisa mengonfirmasi laporan sendiri'
      : sudah
        ? 'Anda sudah mengonfirmasi laporan ini'
        : 'Konfirmasi bahwa Anda juga melihat kondisi ini'

  return (
    <button
      type="button"
      onClick={onKonfirmasi}
      disabled={nonaktif}
      aria-pressed={sudah}
      aria-busy={mengonfirmasi || undefined}
      title={keterangan}
      aria-label={`${label}. ${jumlah} warga sudah mengonfirmasi. ${keterangan}.`}
      className={`group inline-flex min-h-10 items-center gap-1.5 rounded-full border pr-1.5 pl-3 text-sm font-medium efek-tekan disabled:cursor-default ${
        sudah
          ? 'border-brand/30 bg-brand-soft text-action'
          : nonaktif
            ? 'border-border bg-surface text-ink-subtle'
            : 'border-border-strong bg-surface text-ink hover:border-brand/50 hover:bg-brand-soft/50 hover:text-action'
      }`}
    >
      {mengonfirmasi ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      ) : (
        <ThumbsUp
          className={`size-4 transition-transform duration-150 group-enabled:group-hover:-rotate-12 motion-reduce:transition-none ${sudah ? 'fill-current' : ''}`}
          strokeWidth={1.5}
          aria-hidden
        />
      )}
      {label}
      <span
        className={`min-w-7 rounded-full px-1.5 py-0.5 text-center text-xs tabular-nums ${sudah ? 'bg-surface/80 text-action' : 'bg-recessed text-ink-muted'}`}
        aria-hidden
      >
        {jumlah}
      </span>
    </button>
  )
}

type KartuLaporanProps = {
  laporan: LaporanDenganRiwayat
  ringkasanLapor: string
  statusKonfirmasi: StatusKonfirmasi
  mengonfirmasi: boolean
  pesanKonfirmasi?: string
  /** Dipanggil juga untuk tamu: halaman yang memutuskan (konfirmasi langsung atau dialog ajakan masuk). */
  onKonfirmasi: () => void
}

/**
 * Kartu laporan warga ringkas: kepala (kategori + status + tanggal) → foto & deskripsi → satu baris aksi
 * (konfirmasi, riwayat status, teruskan ke LAPOR!) → panel yang dibuka dari baris aksi.
 */
export function KartuLaporan({
  laporan,
  ringkasanLapor,
  statusKonfirmasi,
  mengonfirmasi,
  pesanKonfirmasi,
  onKonfirmasi,
}: KartuLaporanProps) {
  const ditolak = laporan.status === 'ditolak'
  const idRiwayat = useId()
  const idLapor = useId()
  const [riwayatTerbuka, setRiwayatTerbuka] = useState(false)
  const [laporTerbuka, setLaporTerbuka] = useState(false)

  return (
    <article
      className="rounded-lg border border-border bg-surface p-4 shadow-edge transition-[border-color,box-shadow] duration-300 hover:border-border-strong hover:shadow-card sm:p-5"
      aria-labelledby={`laporan-${laporan.id}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 id={`laporan-${laporan.id}`} className="mr-1 text-base font-semibold text-ink-strong">
            {LABEL_KATEGORI[laporan.kategori]}
          </h3>
          <BadgeStatusLaporan status={laporan.status} />
        </div>
        <p className="text-xs text-ink-subtle">
          Dilaporkan warga · <time dateTime={laporan.created_at}>{formatTanggal(laporan.created_at)}</time>
        </p>
      </header>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        {laporan.fotoUrl && (
          <a href={laporan.fotoUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 sm:w-32">
            <img
              src={laporan.fotoUrl}
              alt={`Foto kondisi yang dilaporkan, ${formatTanggal(laporan.created_at)}`}
              loading="lazy"
              decoding="async"
              className="aspect-4/3 w-full rounded-md bg-recessed object-cover"
            />
          </a>
        )}
        <p className="min-w-0 text-sm leading-relaxed whitespace-pre-line text-ink">{laporan.deskripsi}</p>
      </div>

      {/* Baris aksi tunggal: konfirmasi di kiri, riwayat dan LAPOR! sebagai tombol teks. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-soft pt-3">
        <TombolKonfirmasi
          status={statusKonfirmasi}
          jumlah={laporan.jumlah_konfirmasi}
          ditolak={ditolak}
          mengonfirmasi={mengonfirmasi}
          onKonfirmasi={onKonfirmasi}
        />
        {/* Dua tombol teks dikelompokkan agar di ponsel tetap satu baris di bawah tombol konfirmasi. */}
        <div className="flex flex-1 items-center justify-between gap-x-4">
          <TombolLipat terbuka={riwayatTerbuka} onClick={() => setRiwayatTerbuka((t) => !t)} aria-controls={idRiwayat}>
            Riwayat status ({laporan.riwayat.length})
          </TombolLipat>
          {!ditolak && (
            <button
              type="button"
              onClick={() => setLaporTerbuka((t) => !t)}
              aria-expanded={laporTerbuka}
              aria-controls={idLapor}
              aria-label="Teruskan ke LAPOR!"
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-medium text-link hover:underline"
            >
              <Send className="size-4" strokeWidth={1.5} aria-hidden />
              <span>
                <span className="hidden sm:inline">Teruskan ke </span>LAPOR!
              </span>
              <ChevronDown
                className={`size-4 transition-transform duration-300 motion-reduce:transition-none ${laporTerbuka ? 'rotate-180' : ''}`}
                strokeWidth={1.5}
                aria-hidden
              />
            </button>
          )}
        </div>
      </div>
      {pesanKonfirmasi && (
        <p role="alert" className="mt-1 text-sm text-danger">
          {pesanKonfirmasi}
        </p>
      )}

      <Lipatan terbuka={riwayatTerbuka} id={idRiwayat}>
        {/* pl-1 + pt-2: ruang untuk titik linimasa yang menjorok keluar garis, agar tidak terpotong overflow. */}
        <div className="pt-2 pb-1 pl-1">
          <LinimasaStatus riwayat={laporan.riwayat} />
          {laporan.catatan_status && laporan.riwayat.length === 0 && (
            <p className="mt-2 text-sm text-ink-muted">Catatan: {laporan.catatan_status}</p>
          )}
        </div>
      </Lipatan>

      {!ditolak && (
        <Lipatan terbuka={laporTerbuka} id={idLapor}>
          <PanelTeruskanLapor ringkasan={ringkasanLapor} className="mt-2" />
        </Lipatan>
      )}
    </article>
  )
}
