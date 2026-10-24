import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { BadgeDemo } from '../components/BadgeDemo'
import { BadgeStatusLaporan } from '../components/BadgeStatus'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
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

  if (pilihan.length === 0) return <p className="text-sm text-slate-600">Status akhir, tidak bisa diubah lagi.</p>

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
    <form onSubmit={simpan} noValidate className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="text-sm">
          <span className="sr-only">Status baru</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusLaporan)}
            className="min-h-11 w-full rounded-ui border border-slate-200 bg-white shadow-sm px-4 sm:w-56"
          >
            {pilihan.map((s) => (
              <option key={s} value={s}>
                Ubah ke: {LABEL_STATUS_LAPORAN[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1 text-sm">
          <span className="sr-only">Catatan (tampil publik)</span>
          <input
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Catatan untuk publik (wajib jika ditolak)"
            aria-invalid={!!errorField.catatan}
            aria-describedby={errorField.catatan ? `${id}-catatan` : undefined}
            className="min-h-11 w-full rounded-ui border border-slate-300 bg-white px-3"
          />
        </label>
        <Button type="submit" ukuran="md" memuat={mengirim}>
          Simpan
        </Button>
      </div>
      {errorField.catatan && (
        <p id={`${id}-catatan`} className="text-sm text-redflag">
          {errorField.catatan}
        </p>
      )}
      {errorKirim && (
        <p role="alert" className="text-sm text-redflag">
          {errorKirim}
        </p>
      )}
    </form>
  )
}

function AntreanLaporan() {
  const { data, error, memuat, muatUlang } = useLaporanAdmin()
  const [saring, setSaring] = useState<StatusLaporan | 'semua'>('diterima')

  if (memuat && !data) return <SkeletonHalaman />
  if (error) return <ErrorState pesan={error.pesan} onCobaLagi={muatUlang} />

  const semua = data ?? []
  const tampil = saring === 'semua' ? semua : semua.filter((l) => l.status === saring)

  return (
    <div className="space-y-4">
      <label className="flex flex-col text-sm sm:flex-row sm:items-center sm:gap-2">
        <span className="font-medium text-slate-700">Tampilkan</span>
        <select
          value={saring}
          onChange={(e) => setSaring(e.target.value as StatusLaporan | 'semua')}
          className="min-h-11 rounded-ui border border-slate-200 bg-white shadow-sm px-4"
        >
          <option value="semua">Semua status ({semua.length})</option>
          {Constants.public.Enums.status_laporan.map((s) => (
            <option key={s} value={s}>
              {LABEL_STATUS_LAPORAN[s]} ({semua.filter((l) => l.status === s).length})
            </option>
          ))}
        </select>
      </label>

      {tampil.length === 0 ? (
        <EmptyState judul="Tidak ada laporan di antrean ini" pesan="Pilih status lain untuk melihat laporan lainnya." />
      ) : (
        <ul className="space-y-3">
          {tampil.map((l) => (
            <li key={l.id}>
              <Card className="space-y-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium">{LABEL_KATEGORI[l.kategori]}</span>
                  <BadgeStatusLaporan status={l.status} />
                  {l.is_demo && <BadgeDemo />}
                  <span className="text-xs text-slate-600">
                    · {formatTanggal(l.created_at)} · {l.jumlah_konfirmasi} konfirmasi
                  </span>
                </div>
                {l.proyek && (
                  <Link to={`/proyek/${l.proyek.id}`} className="block text-sm font-medium text-merek-800 underline">
                    {l.proyek.nama_paket} (Kec. {l.proyek.kecamatan})
                  </Link>
                )}
                <div className="flex gap-3">
                  {l.fotoUrl && (
                    <a href={l.fotoUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <img src={l.fotoUrl} alt="Foto laporan" loading="lazy" className="size-20 rounded-ui object-cover" />
                    </a>
                  )}
                  <p className="min-w-0 text-sm whitespace-pre-line text-slate-600">{l.deskripsi}</p>
                </div>
                <FormUbahStatus key={l.status} laporan={l} onBerhasil={muatUlang} />
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function AdminPage() {
  const { pengguna, memuat } = useAuth()

  if (memuat) return <SkeletonHalaman baris={2} />

  return (
    <div className="space-y-5">
      <title>Admin — Jejak Anggaran</title>
      <header>
        <h1 className="text-2xl font-medium">Verifikasi laporan</h1>
        <p className="mt-1 text-sm text-slate-600">
          Admin di sini adalah <strong>simulasi instansi</strong> untuk demo, bukan akun resmi pemerintah. Setiap perubahan
          status dicatat dan tampil publik.
        </p>
      </header>
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
