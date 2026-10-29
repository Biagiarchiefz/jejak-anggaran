import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, MailCheck, ShieldCheck, UserCheck, UserRound } from 'lucide-react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { Button, TautanTombol } from '../components/common/Button'
import { KELAS_GALAT, KELAS_INPUT, KELAS_LABEL } from '../components/common/gayaForm'
import { SkeletonHalaman } from '../components/common/Skeleton'
import { env, type AkunDemo } from '../config/env'
import { useAuth } from '../hooks/useAuth'
import { pesanError } from '../utils/errors'
import { FOTO_ILUSTRASI_BAWAAN, urlFotoUnsplash } from '../utils/fotoIlustrasi'
import { halamanSetelahMasuk } from '../utils/peran'
import { daftarSchema, errorPerField, masukSchema } from '../utils/schemas'
import { daftar, masuk } from '../services/authService'

type Mode = 'masuk' | 'daftar'

function Logo({ terang }: { terang?: boolean }) {
  return (
    <Link to="/" className="inline-flex min-h-11 items-center gap-2.5 rounded-md">
      <img src="/favicon.svg" alt="" className="size-7" />
      <span className={`text-lg font-medium ${terang ? 'text-on-dark' : 'text-ink-strong'}`}>Jejak Anggaran</span>
    </Link>
  )
}

// Foto Kota Bandung dari ketinggian (Unsplash, Abdul Ridwan); sumbernya dicatat di src/utils/fotoIlustrasi.ts.
const FOTO = FOTO_ILUSTRASI_BAWAAN
const SRCSET_FOTO = [800, 1200, 1600].map((w) => `${urlFotoUnsplash(FOTO.id, w)} ${w}w`).join(', ')

/** Foto kota dengan gradien `band-deep` agar teks di atasnya tetap terbaca. */
function FotoKota({ sizes }: { sizes: string }) {
  return (
    <>
      <img src={urlFotoUnsplash(FOTO.id, 1200)} srcSet={SRCSET_FOTO} sizes={sizes} alt="" className="absolute inset-0 size-full object-cover" />
      <span className="absolute inset-0 bg-linear-to-t from-band-deep via-band-deep/55 to-band-deep/25" aria-hidden />
    </>
  )
}

/** Panel kiri (desktop): foto Kota Bandung dengan logo dan pesan utama. */
function PanelFoto() {
  return (
    <aside className="relative hidden overflow-hidden bg-band-deep lg:block">
      <FotoKota sizes="50vw" />
      <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
        <Logo terang />
        <div>
          <p className="max-w-md text-[28px] leading-[1.2] font-medium tracking-[-0.015em] text-balance text-on-dark">
            Lacak uang publik, dari anggaran sampai kondisi nyata di lapangan.
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-on-dark-muted">
            Laporan dan konfirmasi warga membantu memastikan proyek berbayar pajak benar-benar bermanfaat.
          </p>
        </div>
      </div>
    </aside>
  )
}

/** Judul ringkas di atas form. */
function Kepala({ ikon, judul, deskripsi, animasi }: { ikon?: ReactNode; judul: string; deskripsi: ReactNode; animasi?: boolean }) {
  return (
    <header className={animasi ? 'animate-ganti-mode motion-reduce:animate-none' : undefined}>
      {ikon && (
        <span className="mb-4 grid size-11 place-items-center rounded-lg bg-brand-soft text-action" aria-hidden>
          {ikon}
        </span>
      )}
      <h1 className="text-2xl leading-tight font-medium tracking-[-0.015em] text-ink-strong">{judul}</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{deskripsi}</p>
    </header>
  )
}

/** Tombol satu klik untuk juri. Hanya tampil jika akun demo diatur di env. */
function AksesJuri({ sibuk, onMasuk }: { sibuk: boolean; onMasuk: (akun: AkunDemo) => void }) {
  const { warga, admin } = env.akunDemo
  if (!warga && !admin) return null
  return (
    <section aria-labelledby="judul-akses-juri" className="mt-6">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" aria-hidden />
        <h2 id="judul-akses-juri" className="text-xs font-medium text-ink-subtle">
          Coba sebagai juri, tanpa mendaftar
        </h2>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {warga && (
          <Button type="button" varian="kedua" ukuran="sm" disabled={sibuk} onClick={() => onMasuk(warga)} className={admin ? '' : 'col-span-2'}>
            <UserRound className="size-4" strokeWidth={1.5} aria-hidden />
            Warga demo
          </Button>
        )}
        {admin && (
          <Button type="button" varian="kedua" ukuran="sm" disabled={sibuk} onClick={() => onMasuk(admin)} className={warga ? '' : 'col-span-2'}>
            <ShieldCheck className="size-4" strokeWidth={1.5} aria-hidden />
            Admin demo
          </Button>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-ink-subtle">Admin demo hanya bisa mengubah laporan demo.</p>
    </section>
  )
}

export default function MasukPage() {
  const [params] = useSearchParams()
  const kembali = params.get('kembali')
  const { pengguna, memuat } = useAuth()
  const idForm = useId()
  const [mode, setMode] = useState<Mode>('masuk')
  const [email, setEmail] = useState('')
  const [kataSandi, setKataSandi] = useState('')
  const [lihatSandi, setLihatSandi] = useState(false)
  const [errorField, setErrorField] = useState<Record<string, string>>({})
  const [errorKirim, setErrorKirim] = useState<string | null>(null)
  const [mengirim, setMengirim] = useState(false)
  const [perluKonfirmasi, setPerluKonfirmasi] = useState(false)
  // Diisi setelah berhasil masuk; pindah halaman menunggu konteks auth ikut terisi agar halaman tujuan tidak berkedip.
  const [tujuan, setTujuan] = useState<string | null>(null)

  async function masukDengan(akun: { email: string; kataSandi: string }) {
    setErrorKirim(null)
    setMengirim(true)
    try {
      const p = await masuk(akun.email, akun.kataSandi)
      setTujuan(halamanSetelahMasuk(p.peran, kembali))
    } catch (err) {
      setErrorKirim(pesanError(err))
    } finally {
      setMengirim(false)
    }
  }

  async function kirim(e: FormEvent) {
    e.preventDefault()
    setErrorKirim(null)
    const hasil = (mode === 'masuk' ? masukSchema : daftarSchema).safeParse({ email: email.trim(), kataSandi })
    if (!hasil.success) {
      setErrorField(errorPerField(hasil.error))
      return
    }
    setErrorField({})
    if (mode === 'masuk') return masukDengan(hasil.data)

    setMengirim(true)
    try {
      const p = await daftar(hasil.data.email, hasil.data.kataSandi, halamanSetelahMasuk('warga', kembali))
      if (p) setTujuan(halamanSetelahMasuk(p.peran, kembali))
      else setPerluKonfirmasi(true)
    } catch (err) {
      setErrorKirim(pesanError(err))
    } finally {
      setMengirim(false)
    }
  }

  function gantiMode(m: Mode) {
    setMode(m)
    setErrorField({})
    setErrorKirim(null)
  }

  if (pengguna && tujuan) return <Navigate to={tujuan} replace />

  const idError = (f: string) => `${idForm}-${f}-error`

  let isi: ReactNode
  if (memuat) {
    isi = <SkeletonHalaman baris={1} />
  } else if (pengguna) {
    isi = (
      <>
        <Kepala
          ikon={<UserCheck className="size-5" strokeWidth={1.5} />}
          judul="Anda sudah masuk"
          deskripsi={
            <>
              Masuk sebagai <strong className="font-medium break-all text-ink">{pengguna.email}</strong>.
            </>
          }
        />
        <TautanTombol to={halamanSetelahMasuk(pengguna.peran, kembali)} className="mt-6 w-full">
          Lanjutkan
          <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
        </TautanTombol>
      </>
    )
  } else if (perluKonfirmasi) {
    isi = (
      <div role="status">
        <Kepala
          ikon={<MailCheck className="size-5" strokeWidth={1.5} />}
          judul="Konfirmasi email Anda"
          deskripsi={
            <>
              Akun dibuat. Buka email yang kami kirim ke <strong className="font-medium break-all text-ink">{email.trim()}</strong> lalu
              tekan tautan konfirmasinya. Belum ada? Periksa folder spam.
            </>
          }
        />
        <Button
          varian="kedua"
          ukuran="sm"
          className="mt-6 w-full"
          onClick={() => {
            setPerluKonfirmasi(false)
            gantiMode('masuk')
          }}
        >
          Kembali ke halaman masuk
        </Button>
      </div>
    )
  } else {
    isi = (
      <>
        <Kepala
          key={mode}
          animasi
          judul={mode === 'masuk' ? 'Selamat datang' : 'Buat akun warga'}
          deskripsi={
            mode === 'masuk'
              ? 'Masuk untuk melapor dan mengonfirmasi kondisi proyek.'
              : 'Gratis. Email Anda tidak pernah ditampilkan ke publik.'
          }
        />

        {/* Pengalih mode berbentuk segmen; latar putih bergeser ke pilihan aktif. */}
        <div className="relative mt-6 grid grid-cols-2 rounded-full bg-recessed p-1" role="group" aria-label="Pilih masuk atau daftar">
          <span
            aria-hidden
            className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-surface shadow-edge transition-transform duration-300 ease-(--ease-out-soft) motion-reduce:transition-none ${
              mode === 'daftar' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
          {(['masuk', 'daftar'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => gantiMode(m)}
              aria-pressed={mode === m}
              className={`relative min-h-9 rounded-full text-sm font-medium efek-tekan ${
                mode === m ? 'text-ink-strong' : 'text-ink-muted hover:text-ink-strong'
              }`}
            >
              {m === 'masuk' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>

        <form onSubmit={kirim} noValidate className="mt-5 space-y-4">
          <div>
            <label htmlFor={`${idForm}-email`} className={KELAS_LABEL}>
              Email
            </label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle" strokeWidth={1.5} aria-hidden />
              <input
                id={`${idForm}-email`}
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errorField.email}
                aria-describedby={errorField.email ? idError('email') : undefined}
                className={`min-h-11 pl-10 ${KELAS_INPUT}`}
              />
            </div>
            {errorField.email && (
              <p id={idError('email')} className={KELAS_GALAT}>
                {errorField.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${idForm}-sandi`} className={KELAS_LABEL}>
              Kata sandi
            </label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle" strokeWidth={1.5} aria-hidden />
              <input
                id={`${idForm}-sandi`}
                type={lihatSandi ? 'text' : 'password'}
                autoComplete={mode === 'masuk' ? 'current-password' : 'new-password'}
                placeholder="Masukkan kata sandi"
                value={kataSandi}
                onChange={(e) => setKataSandi(e.target.value)}
                aria-invalid={!!errorField.kataSandi}
                aria-describedby={errorField.kataSandi ? idError('kataSandi') : undefined}
                className={`min-h-11 pr-12 pl-10 ${KELAS_INPUT}`}
              />
              <button
                type="button"
                onClick={() => setLihatSandi((v) => !v)}
                aria-label={lihatSandi ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-pressed={lihatSandi}
                className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-md text-ink-subtle efek-tekan hover:text-ink"
              >
                {lihatSandi ? <EyeOff className="size-4" strokeWidth={1.5} aria-hidden /> : <Eye className="size-4" strokeWidth={1.5} aria-hidden />}
              </button>
            </div>
            {errorField.kataSandi && (
              <p id={idError('kataSandi')} className={KELAS_GALAT}>
                {errorField.kataSandi}
              </p>
            )}
          </div>

          {errorKirim && (
            <p role="alert" className="rounded-md bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
              {errorKirim}
            </p>
          )}
          <Button type="submit" memuat={mengirim} className="w-full">
            <span key={mode} className="animate-ganti-mode motion-reduce:animate-none">
              {mode === 'masuk' ? 'Masuk' : 'Buat akun'}
            </span>
            {!mengirim && <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />}
          </Button>
        </form>

        <AksesJuri sibuk={mengirim} onMasuk={masukDengan} />
      </>
    )
  }

  return (
    <div className="grid min-h-dvh bg-surface lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <title>{mode === 'masuk' ? 'Masuk' : 'Daftar'} — Jejak Anggaran</title>
      <PanelFoto />

      <main id="konten" className="flex flex-col px-4 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-3">
          <span className="lg:hidden">
            <Logo />
          </span>
          <Link
            to="/"
            className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-medium text-ink-muted hover:text-ink-strong"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />
            Beranda
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8">
          {/* Ponsel & tablet: foto ringkas di atas form. */}
          <div className="relative mb-8 flex h-36 items-end overflow-hidden rounded-xl bg-band-deep p-4 lg:hidden">
            <FotoKota sizes="(min-width: 640px) 384px, 100vw" />
            <p className="relative text-sm leading-snug font-medium text-on-dark">Lacak uang publik, dari anggaran sampai kondisi nyata.</p>
          </div>
          {isi}
          <p className="mt-8 text-center text-sm text-ink-muted">
            Hanya ingin melihat data?{' '}
            <Link to="/peta" className="font-medium text-link hover:underline">
              Jelajahi tanpa masuk
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
