import { useId, useState, type FormEvent } from 'react'
import { ChevronRight, X } from 'lucide-react'
import { Link } from 'react-router'
import { BadgeStatusLaporan } from '../components/BadgeStatus'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { KELAS_GALAT, KELAS_INPUT, KELAS_LABEL } from '../components/ui/gayaForm'
import { KepalaHalaman } from '../components/ui/KepalaHalaman'
import { Laci } from '../components/ui/Laci'
import { Pilihan } from '../components/ui/Pilihan'
import { SkeletonHalaman } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'
import { useLaporanAdmin } from '../hooks/useLaporanAdmin'
import { pesanError } from '../lib/errors'
import { formatTanggal } from '../lib/format'
import { LABEL_KATEGORI, LABEL_STATUS_LAPORAN } from '../lib/label'
import { errorPerField, ubahStatusSchema } from '../lib/schemas'
import { statusBerikutnya, type StatusLaporan } from '../lib/statusLaporan'
import { ubahStatusLaporan, type LaporanAdmin } from '../services/adminService'
import { Constants } from '../types/database'

function FormUbahStatus({ laporan, onBerhasil }: { laporan: LaporanAdmin; onBerhasil: () => void }) {
  const pilihan = statusBerikutnya(laporan.status)
  const id = useId()
  const [status, setStatus] = useState<StatusLaporan | ''>(pilihan[0] ?? '')
  const [catatan, setCatatan] = useState('')
  const [errorField, setErrorField] = useState<Record<string, string>>({})
  const [errorKirim, setErrorKirim] = useState<string | null>(null)
  const [mengirim, setMengirim] = useState(false)

  if (pilihan.length === 0) return <p className="text-sm text-ink-muted">Status akhir, tidak bisa diubah lagi.</p>

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
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium efek-tekan ${
        aktif ? 'bg-action text-white' : 'border border-border bg-surface text-ink hover:border-border-strong'
      }`}
    >
      {label}
      <span className={`tabular-nums ${aktif ? 'text-white/70' : 'text-ink-subtle'}`}>{jumlah}</span>
    </button>
  )
}

function AntreanLaporan() {
  const { data, error, memuat, muatUlang } = useLaporanAdmin()
  const [saring, setSaring] = useState<StatusLaporan | 'semua'>('diterima')
  const [dipilihId, setDipilihId] = useState<string | null>(null)
  // Terpisah dari dipilihId agar isi panel tetap tampil selama animasi tutup.
  const [panelTerbuka, setPanelTerbuka] = useState(false)

  if (memuat && !data) return <SkeletonHalaman />
  if (error) return <ErrorState halaman pesan={error.pesan} onCobaLagi={muatUlang} />

  const semua = data ?? []
  const tampil = saring === 'semua' ? semua : semua.filter((l) => l.status === saring)
  // Dicari di semua laporan: setelah statusnya diubah, laporan tetap terbuka di panel walau keluar dari saringan.
  const dipilih = semua.find((l) => l.id === dipilihId) ?? null

  function buka(id: string) {
    setDipilihId(id)
    setPanelTerbuka(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Saring status laporan">
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
          <div className="hidden overflow-hidden rounded-lg border border-border bg-surface md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-canvas-soft text-xs tracking-[0.04em] text-ink-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Laporan</th>
                  <th className="px-4 py-3">Proyek</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Konfirmasi</th>
                  <th className="w-10 px-4 py-3">
                    <span className="sr-only">Buka</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tampil.map((l) => (
                  <tr
                    key={l.id}
                    className={`relative border-b border-border-soft last:border-0 hover:bg-brand-soft/60 ${panelTerbuka && dipilihId === l.id ? 'bg-brand-soft/60' : ''}`}
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
                      <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ponsel: daftar kartu, bukan tabel bergulir horizontal. */}
          <ul className="space-y-3 md:hidden">
            {tampil.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => buka(l.id)}
                  aria-haspopup="dialog"
                  className="block w-full rounded-lg border border-border bg-surface p-4 text-left efek-tekan hover:border-border-strong"
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

      <Laci
        terbuka={panelTerbuka && dipilih !== null}
        onTutup={() => setPanelTerbuka(false)}
        label="Detail laporan"
        arah="kanan"
        className="fixed inset-y-0 right-0 left-auto h-dvh w-[min(28rem,100vw)] border-l border-border"
      >
        {dipilih && <PanelLaporan laporan={dipilih} onTutup={() => setPanelTerbuka(false)} onBerhasil={muatUlang} />}
      </Laci>
    </div>
  )
}

export default function AdminPage() {
  const { pengguna, memuat } = useAuth()

  if (memuat) return <SkeletonHalaman baris={2} />

  return (
    <div className="space-y-8">
      <title>Admin — Jejak Anggaran</title>
      <KepalaHalaman
        judul="Verifikasi laporan"
        deskripsi={
          <>
            Admin di sini adalah <strong>simulasi instansi</strong> untuk demo, bukan akun resmi pemerintah. Setiap perubahan
            status dicatat dan tampil publik.
          </>
        }
      />
      {pengguna?.peran === 'admin' ? (
        <AntreanLaporan />
      ) : (
        <EmptyState
          judul="Halaman ini khusus admin"
          pesan={pengguna ? 'Akun Anda tidak memiliki peran admin.' : 'Silakan masuk dengan akun admin.'}
        />
      )}
    </div>
  )
}
