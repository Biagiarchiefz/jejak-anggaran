import { useId, useState, type FormEvent } from 'react'
import { ChevronRight, Lock, X } from 'lucide-react'
import { Link } from 'react-router'
import { BadgeStatusLaporan } from '../../../components/common/BadgeStatus'
import { Button } from '../../../components/common/Button'
import { EmptyState } from '../../../components/common/EmptyState'
import { KELAS_GALAT, KELAS_INPUT, KELAS_LABEL } from '../../../components/common/gayaForm'
import { Laci } from '../../../components/common/Laci'
import { Pilihan } from '../../../components/common/Pilihan'
import { useAuth } from '../../../hooks/useAuth'
import { pesanError } from '../../../utils/errors'
import { formatTanggal } from '../../../utils/format'
import { bisaUbahLaporan } from '../../../utils/peran'
import { LABEL_KATEGORI, LABEL_STATUS_LAPORAN } from '../../../utils/label'
import { errorPerField, ubahStatusSchema } from '../../../utils/schemas'
import { statusBerikutnya, type StatusLaporan } from '../../../utils/statusLaporan'
import { ubahStatusLaporan, type LaporanAdmin } from '../../../services/adminService'
import { Constants } from '../../../types/database'

function FormUbahStatus({ laporan, onBerhasil }: { laporan: LaporanAdmin; onBerhasil: () => void }) {
  const peran = useAuth().pengguna?.peran
  const pilihan = statusBerikutnya(laporan.status)
  const id = useId()
  const [status, setStatus] = useState<StatusLaporan | ''>(pilihan[0] ?? '')
  const [catatan, setCatatan] = useState('')
  const [errorField, setErrorField] = useState<Record<string, string>>({})
  const [errorKirim, setErrorKirim] = useState<string | null>(null)
  const [mengirim, setMengirim] = useState(false)

  if (pilihan.length === 0) return <p className="text-sm text-ink-muted">Status akhir, tidak bisa diubah lagi.</p>
  if (!bisaUbahLaporan(peran, laporan)) {
    return (
      <p className="flex items-start gap-2 rounded-md bg-canvas-soft px-3.5 py-3 text-sm text-ink-muted">
        <Lock className="mt-0.5 size-4 shrink-0 text-ink-subtle" strokeWidth={1.5} aria-hidden />
        Ini laporan warga sungguhan. Akun admin demo hanya bisa mengubah status laporan demo.
      </p>
    )
  }

  async function simpan(e: FormEvent) {
    e.preventDefault()
    setErrorKirim(null)
    const hasil = ubahStatusSchema.safeParse({ status: status || undefined, catatan })
    if (!hasil.success) {
      setErrorField(errorPerField(hasil.error))
      return
    }
    setErrorField({})
    setMengirim(true)
    try {
      await ubahStatusLaporan(laporan.id, hasil.data.status, hasil.data.catatan)
      setCatatan('')
      onBerhasil()
    } catch (err) {
      setErrorKirim(pesanError(err))
    } finally {
      setMengirim(false)
    }
  }

  return (
    <form onSubmit={simpan} noValidate className="space-y-4">
      <Pilihan
        label="Status baru"
        nilai={status}
        opsi={pilihan.map((s) => ({ nilai: s, label: LABEL_STATUS_LAPORAN[s] }))}
        onUbah={setStatus}
      />
      <label className="block">
        <span className={KELAS_LABEL}>
          Catatan untuk publik {status === 'ditolak' ? <span className="text-ink-subtle">*</span> : <span className="font-normal text-ink-subtle">(opsional)</span>}
        </span>
        <textarea
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          rows={3}
          placeholder="Tampil di riwayat status laporan. Wajib jika ditolak."
          aria-invalid={!!errorField.catatan}
          aria-describedby={errorField.catatan ? `${id}-catatan` : undefined}
          className={`mt-1.5 ${KELAS_INPUT}`}
        />
      </label>
      {errorField.catatan && (
        <p id={`${id}-catatan`} className={KELAS_GALAT}>
          {errorField.catatan}
        </p>
      )}
      {errorKirim && (
        <p role="alert" className="text-sm text-danger">
          {errorKirim}
        </p>
      )}
      {/* Ubah status = varian utama, tolak = varian bahaya (DESIGN.md §8 Panel Admin). */}
      <Button type="submit" varian={status === 'ditolak' ? 'bahaya' : 'utama'} memuat={mengirim} className="w-full">
        {status === 'ditolak' ? 'Tolak laporan' : `Ubah ke ${status ? LABEL_STATUS_LAPORAN[status].toLowerCase() : '…'}`}
      </Button>
    </form>
  )
}

/** Panel samping: detail satu laporan + form ubah status. */
function PanelLaporan({ laporan: l, onTutup, onBerhasil }: { laporan: LaporanAdmin; onTutup: () => void; onBerhasil: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-4">
        <div className="min-w-0">
          <p className="text-xs text-ink-subtle">Detail laporan</p>
          <h2 className="mt-0.5 text-xl leading-[1.25] font-semibold tracking-[-0.005em]">{LABEL_KATEGORI[l.kategori]}</h2>
        </div>
        <button
          type="button"
          onClick={onTutup}
          aria-label="Tutup panel"
          className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-recessed"
        >
          <X className="size-5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <BadgeStatusLaporan status={l.status} />
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs text-ink-subtle">Dilaporkan</dt>
            <dd className="mt-0.5 text-ink">{formatTanggal(l.created_at)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-subtle">Konfirmasi warga</dt>
            <dd className="mt-0.5 text-ink tabular-nums">{l.jumlah_konfirmasi}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-ink-subtle">Proyek</dt>
            <dd className="mt-0.5">
              {l.proyek ? (
                <Link to={`/proyek/${l.proyek.id}`} className="font-medium text-link hover:underline">
                  {l.proyek.nama_paket} (Kec. {l.proyek.kecamatan})
                </Link>
              ) : (
                <span className="text-ink-subtle">Proyek tidak ditemukan</span>
              )}
            </dd>
          </div>
        </dl>
        {l.fotoUrl && (
          <a href={l.fotoUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-md">
            <img src={l.fotoUrl} alt="Foto laporan" loading="lazy" className="aspect-[4/3] w-full bg-recessed object-cover" />
            <span className="sr-only"> (buka ukuran penuh di tab baru)</span>
          </a>
        )}
        <p className="text-sm whitespace-pre-line text-ink-muted">{l.deskripsi}</p>

        <section aria-labelledby="judul-ubah-status" className="space-y-3 border-t border-border-soft pt-5">
          <h3 id="judul-ubah-status" className="text-base font-semibold">
            Ubah status
          </h3>
          {/* key = status: form kembali ke pilihan awal setelah status berubah. */}
          <FormUbahStatus key={l.status} laporan={l} onBerhasil={onBerhasil} />
        </section>

        {l.proyek && (
          <p className="text-sm text-ink-muted">
            Riwayat status lengkap tampil publik di{' '}
            <Link to={`/proyek/${l.proyek.id}`} className="font-medium text-link hover:underline">
              halaman proyek
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  )
}

/** Chip filter status dengan jumlah (DESIGN.md §7.6). */
function ChipStatus({ aktif, onClick, label, jumlah }: { aktif: boolean; onClick: () => void; label: string; jumlah: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium efek-tekan ${
        aktif ? 'border-action bg-action text-white' : 'border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink-strong'
      }`}
    >
      {label}
      <span
        className={`min-w-5 rounded-md px-1 text-center text-[11px] leading-[18px] font-semibold tabular-nums ${
          aktif ? 'bg-white/20 text-white' : 'bg-recessed text-ink-subtle'
        }`}
      >
        {jumlah}
      </span>
    </button>
  )
}

type AntreanLaporanProps = {
  laporan: LaporanAdmin[]
  onBerubah: () => void
  /** Laporan yang langsung dibuka di panel, mis. dari antrean prioritas di dashboard (`?buka=<id>`). */
  idAwal?: string | null
}

/** Tabel semua laporan dengan saringan status, dan panel samping untuk mengubah status. */
export function AntreanLaporan({ laporan: semua, onBerubah, idAwal = null }: AntreanLaporanProps) {
  const [saring, setSaring] = useState<StatusLaporan | 'semua'>(() => semua.find((l) => l.id === idAwal)?.status ?? 'diterima')
  const [dipilihId, setDipilihId] = useState<string | null>(idAwal)
  // Terpisah dari dipilihId agar isi panel tetap tampil selama animasi tutup.
  const [panelTerbuka, setPanelTerbuka] = useState(idAwal !== null)

  const tampil = saring === 'semua' ? semua : semua.filter((l) => l.status === saring)
  // Dicari di semua laporan: setelah statusnya diubah, laporan tetap terbuka di panel walau keluar dari saringan.
  const dipilih = semua.find((l) => l.id === dipilihId) ?? null

  function buka(id: string) {
    setDipilihId(id)
    setPanelTerbuka(true)
  }

  return (
    <div>
      <section aria-label="Daftar laporan" className="space-y-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Saring status laporan">
          <ChipStatus aktif={saring === 'semua'} onClick={() => setSaring('semua')} label="Semua" jumlah={semua.length} />
          {Constants.public.Enums.status_laporan.map((s) => (
            <ChipStatus
              key={s}
              aktif={saring === s}
              onClick={() => setSaring(s)}
              label={LABEL_STATUS_LAPORAN[s]}
              jumlah={semua.filter((l) => l.status === s).length}
            />
          ))}
        </div>

        {tampil.length === 0 ? (
          <EmptyState judul="Tidak ada laporan di antrean ini" pesan="Pilih status lain untuk melihat laporan lainnya." />
        ) : (
          <>
            {/* Desktop/tablet: tabel (DESIGN.md §7.9). */}
            <div className="hidden overflow-hidden rounded-xl border border-border bg-surface md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-canvas-soft text-[11px] font-semibold tracking-[0.05em] text-ink-subtle uppercase">
                  <tr>
                    <th className="px-4 py-2.5">Laporan</th>
                    <th className="px-4 py-2.5">Proyek</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Tanggal</th>
                    <th className="px-4 py-2.5 text-right">Konfirmasi</th>
                    <th className="w-10 px-4 py-2.5">
                      <span className="sr-only">Buka</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {tampil.map((l) => (
                    <tr
                      key={l.id}
                      className={`group relative transition-colors duration-150 motion-reduce:transition-none ${
                        panelTerbuka && dipilihId === l.id ? 'bg-brand-soft/60' : 'hover:bg-canvas-soft'
                      }`}
                    >
                      <td className="px-4 py-3">
                        {/* Tombol diregangkan menutupi seluruh baris. */}
                        <button
                          type="button"
                          onClick={() => buka(l.id)}
                          aria-haspopup="dialog"
                          className="text-left font-medium text-ink-strong after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-brand"
                        >
                          {LABEL_KATEGORI[l.kategori]}
                        </button>
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-ink-muted">{l.proyek?.nama_paket ?? '—'}</td>
                      <td className="px-4 py-3">
                        <BadgeStatusLaporan status={l.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{formatTanggal(l.created_at)}</td>
                      <td className="px-4 py-3 text-right text-ink tabular-nums">{l.jumlah_konfirmasi}</td>
                      <td className="px-4 py-3 text-ink-subtle">
                        <ChevronRight
                          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-action motion-reduce:transition-none"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ponsel: daftar kartu, bukan tabel bergulir horizontal. */}
            <ul className="space-y-2 md:hidden">
              {tampil.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => buka(l.id)}
                    aria-haspopup="dialog"
                    className="block w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-left efek-tekan hover:border-border-strong"
                  >
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="mr-1 font-semibold text-ink-strong">{LABEL_KATEGORI[l.kategori]}</span>
                      <BadgeStatusLaporan status={l.status} />
                    </span>
                    <span className="mt-1 block truncate text-sm text-ink-muted">{l.proyek?.nama_paket ?? '—'}</span>
                    <span className="mt-1 block text-xs text-ink-subtle">
                      {formatTanggal(l.created_at)} · {l.jumlah_konfirmasi} konfirmasi
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

      </section>

      <Laci
        terbuka={panelTerbuka && dipilih !== null}
        onTutup={() => setPanelTerbuka(false)}
        label="Detail laporan"
        arah="kanan"
        className="fixed inset-y-0 right-0 left-auto h-dvh w-[min(28rem,100vw)] border-l border-border"
      >
        {dipilih && <PanelLaporan laporan={dipilih} onTutup={() => setPanelTerbuka(false)} onBerhasil={onBerubah} />}
      </Laci>
    </div>
  )
}
