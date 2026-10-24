import { useId, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { Button, TautanTombol } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SkeletonHalaman } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'
import { pesanError } from '../lib/errors'
import { errorPerField, masukSchema } from '../lib/schemas'
import { kirimTautanMasuk } from '../services/authService'

/** Hanya izinkan path internal agar parameter `kembali` tidak bisa dipakai untuk redirect ke situs lain. */
function pathKembaliAman(nilai: string | null): string {
  return nilai && nilai.startsWith('/') && !nilai.startsWith('//') ? nilai : '/peta'
}

export default function MasukPage() {
  const [params] = useSearchParams()
  const kembali = pathKembaliAman(params.get('kembali'))
  const { pengguna, memuat } = useAuth()
  const idEmail = useId()
  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState<string | null>(null)
  const [errorKirim, setErrorKirim] = useState<string | null>(null)
  const [mengirim, setMengirim] = useState(false)
  const [terkirim, setTerkirim] = useState(false)

  async function kirim(e: FormEvent) {
    e.preventDefault()
    setErrorKirim(null)
    const hasil = masukSchema.safeParse({ email: email.trim() })
    if (!hasil.success) {
      setErrorEmail(errorPerField(hasil.error).email ?? null)
      return
    }
    setErrorEmail(null)
    setMengirim(true)
    try {
      await kirimTautanMasuk(hasil.data.email, kembali)
      setTerkirim(true)
    } catch (err) {
      setErrorKirim(pesanError(err))
    } finally {
      setMengirim(false)
    }
  }

  if (memuat) return <SkeletonHalaman baris={1} />

  return (
    <div className="mx-auto max-w-md space-y-4">
      <title>Masuk — Jejak Anggaran</title>
      <h1 className="text-2xl font-medium">Masuk</h1>

      {pengguna ? (
        <Card className="space-y-3">
          <p>
            Anda sudah masuk sebagai <strong>{pengguna.email}</strong>.
          </p>
          <TautanTombol to={kembali}>Lanjutkan</TautanTombol>
        </Card>
      ) : terkirim ? (
        <Card className="space-y-2" role="status">
          <p className="font-medium">Cek email Anda</p>
          <p className="text-sm text-slate-600">
            Kami mengirim tautan masuk ke <strong>{email}</strong>. Buka email tersebut lalu tekan tautannya. Tidak perlu kata
            sandi.
          </p>
          <Button varian="tipis" ukuran="sm" onClick={() => setTerkirim(false)}>
            Ganti email atau kirim ulang
          </Button>
        </Card>
      ) : (
        <Card>
          <form onSubmit={kirim} noValidate className="space-y-4">
            <p className="text-sm text-slate-600">
              Masuk diperlukan untuk melapor dan mengonfirmasi laporan. Kami akan mengirim tautan masuk ke email Anda. Email
              Anda tidak ditampilkan ke publik.
            </p>
            <div>
              <label htmlFor={idEmail} className="font-medium">
                Email
              </label>
              <input
                id={idEmail}
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errorEmail}
                aria-describedby={errorEmail ? `${idEmail}-error` : undefined}
                className="mt-1 min-h-11 w-full rounded-ui border border-slate-300 bg-white px-3"
              />
              {errorEmail && (
                <p id={`${idEmail}-error`} className="mt-1 text-sm text-redflag">
                  {errorEmail}
                </p>
              )}
            </div>
            {errorKirim && (
              <p role="alert" className="text-sm text-redflag">
                {errorKirim}
              </p>
            )}
            <Button type="submit" memuat={mengirim} className="w-full">
              Kirim tautan masuk
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}
