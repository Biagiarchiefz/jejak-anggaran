import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, EyeOff, KeyRound, LogIn, Mail, MailCheck, UserCheck } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { Button, TautanTombol } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { KELAS_GALAT, KELAS_INPUT, KELAS_LABEL } from '../components/ui/gayaForm'
import { SkeletonHalaman } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'
import { pesanError } from '../lib/errors'
import { errorPerField, masukSchema } from '../lib/schemas'
import { kirimTautanMasuk } from '../services/authService'

/** Hanya izinkan path internal agar parameter `kembali` tidak bisa dipakai untuk redirect ke situs lain. */
function pathKembaliAman(nilai: string | null): string {
  return nilai && nilai.startsWith('/') && !nilai.startsWith('//') ? nilai : '/peta'
}

type KepalaKartuProps = { ikon: ReactNode; judul: ReactNode; deskripsi: ReactNode }

/** Ikon + H1 + satu kalimat pengantar di bagian atas kartu masuk. */
function KepalaKartu({ ikon, judul, deskripsi }: KepalaKartuProps) {
  return (
    <header>
      <span className="grid size-11 place-items-center rounded-lg bg-brand-soft text-action" aria-hidden>
        {ikon}
      </span>
      <h1 className="mt-5 text-2xl leading-tight font-medium tracking-[-0.015em] text-ink-strong">{judul}</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{deskripsi}</p>
    </header>
  )
}

const KELAS_IKON = 'size-5'

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
    <div className="mx-auto max-w-sm py-4 sm:py-10">
      <title>Masuk — Jejak Anggaran</title>

      <Card className="sm:p-8">
        {pengguna ? (
          <>
            <KepalaKartu
              ikon={<UserCheck className={KELAS_IKON} strokeWidth={1.5} />}
              judul="Anda sudah masuk"
              deskripsi={
                <>
                  Masuk sebagai <strong className="font-medium break-all text-ink">{pengguna.email}</strong>.
                </>
              }
            />
            <TautanTombol to={kembali} className="mt-6 w-full">
              Lanjutkan
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
            </TautanTombol>
          </>
        ) : terkirim ? (
          <div role="status">
            <KepalaKartu
              ikon={<MailCheck className={KELAS_IKON} strokeWidth={1.5} />}
              judul="Cek email Anda"
              deskripsi={
                <>
                  Tautan masuk sudah dikirim ke <strong className="font-medium break-all text-ink">{email.trim()}</strong>. Buka
                  emailnya lalu tekan tautan tersebut.
                </>
              }
            />
            <p className="mt-4 rounded-md bg-canvas-soft px-3.5 py-3 text-xs leading-relaxed text-ink-muted">
              Belum masuk dalam beberapa menit? Periksa folder spam atau promosi.
            </p>
            <Button varian="kedua" ukuran="sm" className="mt-6 w-full" onClick={() => setTerkirim(false)}>
              Ganti email atau kirim ulang
            </Button>
          </div>
        ) : (
          <>
            <KepalaKartu
              ikon={<LogIn className={KELAS_IKON} strokeWidth={1.5} />}
              judul="Masuk ke Jejak Anggaran"
              deskripsi="Diperlukan untuk melapor dan mengonfirmasi laporan warga."
            />

            <form onSubmit={kirim} noValidate className="mt-6">
              <label htmlFor={idEmail} className={KELAS_LABEL}>
                Email
              </label>
              <div className="relative mt-1.5">
                <Mail
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <input
                  id={idEmail}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errorEmail}
                  aria-describedby={errorEmail ? `${idEmail}-error` : undefined}
                  className={`min-h-11 pl-10 ${KELAS_INPUT}`}
                />
              </div>
              {errorEmail && (
                <p id={`${idEmail}-error`} className={KELAS_GALAT}>
                  {errorEmail}
                </p>
              )}
              {errorKirim && (
                <p role="alert" className="mt-3 text-sm text-danger">
                  {errorKirim}
                </p>
              )}
              <Button type="submit" memuat={mengirim} className="mt-4 w-full">
                Kirim tautan masuk
                {!mengirim && <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />}
              </Button>
            </form>

            <ul className="mt-6 space-y-2.5 border-t border-border pt-5 text-sm text-ink-muted">
              <li className="flex gap-2.5">
                <KeyRound className="mt-0.5 size-4 shrink-0 text-ink-subtle" strokeWidth={1.5} aria-hidden />
                Tanpa kata sandi. Akun dibuat otomatis saat pertama masuk.
              </li>
              <li className="flex gap-2.5">
                <EyeOff className="mt-0.5 size-4 shrink-0 text-ink-subtle" strokeWidth={1.5} aria-hidden />
                Email Anda tidak pernah ditampilkan ke publik.
              </li>
            </ul>
          </>
        )}
      </Card>

      <p className="mt-5 text-center text-sm text-ink-muted">
        Hanya ingin melihat data?{' '}
        <Link to="/peta" className="font-medium text-link hover:underline">
          Jelajahi tanpa masuk
        </Link>
      </p>
    </div>
  )
}
