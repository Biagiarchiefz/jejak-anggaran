import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Camera, CircleAlert, Lock, X } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { Button, TautanTombol } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { ErrorState } from '../components/common/ErrorState'
import { KELAS_GALAT, KELAS_INPUT, KELAS_LABEL } from '../components/common/gayaForm'
import { KepalaHalaman } from '../components/common/KepalaHalaman'
import { SkeletonHalaman } from '../components/common/Skeleton'
import { useAuth } from '../hooks/useAuth'
import { useProyekDetail } from '../features/proyek/hooks/useProyekDetail'
import { pesanError } from '../utils/errors'
import { kompresFoto, type FotoTerkompres } from '../utils/kompresFoto'
import { LABEL_KATEGORI, PENJELASAN_KATEGORI } from '../utils/label'
import { errorPerField, laporanFormSchema } from '../utils/schemas'
import { DESKRIPSI_MAKS, panjangKarakter } from '../utils/batasLaporan'
import { buatLaporan } from '../services/laporanService'
import { Constants, type Enums } from '../types/database'

type Tahap = 'isi' | 'mengompres' | 'mengirim'

function PesanField({ id, pesan }: { id: string; pesan?: string }) {
  if (!pesan) return null
  return (
    <p id={id} className={`flex items-center gap-1.5 ${KELAS_GALAT}`}>
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
      {pesan}
    </p>
  )
}

function FormLapor({ proyekId }: { proyekId: string }) {
  const navigate = useNavigate()
  const idForm = useId()
  const [kategori, setKategori] = useState<Enums<'kategori_laporan'> | ''>('')
  const [deskripsi, setDeskripsi] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [pratinjau, setPratinjau] = useState<string | null>(null)
  const [errorField, setErrorField] = useState<Record<string, string>>({})
  const [errorKirim, setErrorKirim] = useState<string | null>(null)
  const [tahap, setTahap] = useState<Tahap>('isi')
  // Simpan hasil kompres agar "coba lagi" tidak perlu mengompres ulang.
  const fotoTerkompres = useRef<{ sumber: File; hasil: FotoTerkompres } | null>(null)
  const inputFoto = useRef<HTMLInputElement>(null)

  const urlPratinjau = useRef<string | null>(null)

  useEffect(() => () => {
    if (urlPratinjau.current) URL.revokeObjectURL(urlPratinjau.current)
  }, [])

  function pilihFoto(file: File | null) {
    if (urlPratinjau.current) URL.revokeObjectURL(urlPratinjau.current)
    urlPratinjau.current = file ? URL.createObjectURL(file) : null
    setFoto(file)
    setPratinjau(urlPratinjau.current)
    // Kosongkan input agar file yang sama bisa dipilih lagi setelah dihapus.
    if (!file && inputFoto.current) inputFoto.current.value = ''
  }

  async function kirim(e: FormEvent) {
    e.preventDefault()
    setErrorKirim(null)
    const hasil = laporanFormSchema.safeParse({ kategori: kategori || undefined, deskripsi, foto: foto ?? undefined })
    if (!hasil.success) {
      setErrorField(errorPerField(hasil.error))
      return
    }
    setErrorField({})

    try {
      let siap = fotoTerkompres.current?.sumber === hasil.data.foto ? fotoTerkompres.current.hasil : null
      if (!siap) {
        setTahap('mengompres')
        siap = await kompresFoto(hasil.data.foto)
        fotoTerkompres.current = { sumber: hasil.data.foto, hasil: siap }
      }
      setTahap('mengirim')
      await buatLaporan({ proyekId, kategori: hasil.data.kategori, deskripsi: hasil.data.deskripsi, foto: siap })
      navigate(`/proyek/${proyekId}`, { state: { laporanTerkirim: true } })
    } catch (err) {
      // Isian form tetap tersimpan di state sehingga pengguna cukup menekan kirim lagi.
      setErrorKirim(pesanError(err))
      setTahap('isi')
    }
  }

  const sibuk = tahap !== 'isi'
  const idError = (f: string) => `${idForm}-${f}-error`

  return (
    <form onSubmit={kirim} noValidate className="space-y-8">
      <fieldset aria-describedby={errorField.kategori ? idError('kategori') : undefined}>
        <legend className={KELAS_LABEL}>
          Apa yang Anda lihat? <span className="text-ink-subtle">*</span>
        </legend>
        <div className="mt-2 grid gap-2">
          {Constants.public.Enums.kategori_laporan.map((k) => (
            <label
              key={k}
              className={`flex cursor-pointer gap-3 rounded-md border p-3.5 efek-tekan has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                kategori === k ? 'border-brand bg-brand-soft/60' : 'border-border bg-surface hover:border-border-strong'
              }`}
            >
              <input
                type="radio"
                name="kategori"
                value={k}
                checked={kategori === k}
                onChange={() => setKategori(k)}
                className="mt-1 accent-action focus-visible:outline-none"
              />
              <span>
                <span className="block font-medium text-ink-strong">{LABEL_KATEGORI[k]}</span>
                <span className="block text-sm text-ink-muted">{PENJELASAN_KATEGORI[k]}</span>
              </span>
            </label>
          ))}
        </div>
        <PesanField id={idError('kategori')} pesan={errorField.kategori} />
      </fieldset>

      <div>
        <label htmlFor={`${idForm}-deskripsi`} className={KELAS_LABEL}>
          Ceritakan kondisinya <span className="text-ink-subtle">*</span>
        </label>
        <p className="mt-0.5 text-sm text-ink-muted">Sebutkan lokasi persisnya dan apa yang terlihat. Hindari menyebut nama orang.</p>
        <textarea
          id={`${idForm}-deskripsi`}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={5}
          aria-invalid={!!errorField.deskripsi}
          aria-describedby={errorField.deskripsi ? idError('deskripsi') : undefined}
          className={`mt-2 ${KELAS_INPUT}`}
        />
        <p className="mt-1 text-right text-xs text-ink-subtle tabular-nums">
          {panjangKarakter(deskripsi.trim())}/{DESKRIPSI_MAKS}
        </p>
        <PesanField id={idError('deskripsi')} pesan={errorField.deskripsi} />
      </div>

      <div>
        <p className={KELAS_LABEL} id={`${idForm}-foto-label`}>
          Foto kondisi <span className="text-ink-subtle">*</span>
        </p>
        {foto && pratinjau ? (
          <div className="relative mt-2 overflow-hidden rounded-md border border-border">
            <img src={pratinjau} alt="Pratinjau foto yang akan dikirim" className="aspect-[4/3] w-full bg-recessed object-cover" />
            <button
              type="button"
              onClick={() => pilihFoto(null)}
              className="absolute top-2 right-2 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 text-sm font-medium text-ink efek-tekan hover:bg-canvas-soft"
            >
              <X className="size-4" strokeWidth={1.5} aria-hidden />
              Hapus foto
            </button>
          </div>
        ) : (
          <label
            htmlFor={`${idForm}-foto`}
            className="mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border-strong bg-canvas-soft px-4 py-8 text-center efek-tekan hover:bg-recessed has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
          >
            <Camera className="size-6 text-action" strokeWidth={1.5} aria-hidden />
            <span className="text-sm font-medium text-ink">Ambil foto atau pilih dari galeri (maks. 5 MB)</span>
            <span className="text-xs text-ink-subtle">Foto dikompres otomatis dan data lokasi GPS di dalamnya dihapus.</span>
          </label>
        )}
        <input
          ref={inputFoto}
          id={`${idForm}-foto`}
          type="file"
          accept="image/*"
          onChange={(e) => pilihFoto(e.target.files?.[0] ?? null)}
          aria-labelledby={`${idForm}-foto-label`}
          aria-invalid={!!errorField.foto}
          aria-describedby={errorField.foto ? idError('foto') : undefined}
          className="sr-only"
        />
        <PesanField id={idError('foto')} pesan={errorField.foto} />
      </div>

      {/* Kotak privasi. */}
      <div className="flex gap-3 rounded-lg bg-canvas-blue p-4">
        <Lock className="mt-0.5 size-5 shrink-0 text-action" strokeWidth={1.5} aria-hidden />
        <p className="text-sm text-ink-muted">
          Nama dan email Anda tidak pernah ditampilkan di halaman publik. Laporan bersifat publik dan menjadi pelengkap LAPOR!.
        </p>
      </div>

      {errorKirim && (
        <ErrorState
          judul="Laporan belum terkirim"
          pesan={`${errorKirim} Isian Anda masih tersimpan. Tekan "Kirim laporan" untuk mencoba lagi.`}
        />
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <TautanTombol to={`/proyek/${proyekId}`} varian="tipis" className="w-full sm:w-auto">
          Batal
        </TautanTombol>
        <Button type="submit" memuat={sibuk} className="w-full sm:w-auto">
          {tahap === 'mengompres' ? 'Memproses foto…' : tahap === 'mengirim' ? 'Mengirim…' : 'Kirim laporan'}
        </Button>
      </div>
    </form>
  )
}

export default function LaporPage() {
  const { id = '' } = useParams()
  const { pengguna, memuat: memuatAuth } = useAuth()
  const { data, error, memuat, muatUlang } = useProyekDetail(id)

  if (memuatAuth || (memuat && !data)) return <SkeletonHalaman baris={3} />
  if (error) return <ErrorState halaman pesan={error.pesan} onCobaLagi={error.code === 'TIDAK_DITEMUKAN' ? undefined : muatUlang} />
  if (!data) return null

  const { proyek } = data

  return (
    <div className="mx-auto max-w-[560px] space-y-6">
      <title>{`Lapor kondisi — ${proyek.nama_paket}`}</title>
      <Link to={`/proyek/${proyek.id}`} className="inline-block text-sm font-medium text-link hover:underline">
        ← Kembali ke detail proyek
      </Link>
      <KepalaHalaman judul="Laporkan kondisi proyek" />

      {/* Ringkasan proyek yang dilaporkan. */}
      <div className="rounded-lg border border-border bg-canvas-soft p-4">
        <p className="text-xs text-ink-subtle">Proyek</p>
        <p className="mt-0.5 font-semibold text-ink-strong">{proyek.nama_paket}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          Kec. {proyek.kecamatan} · {proyek.tahun_anggaran}
        </div>
      </div>

      {!pengguna ? (
        <Card className="space-y-3">
          <p className="font-medium text-ink-strong">Masuk dulu untuk melapor</p>
          <p className="text-sm text-ink-muted">
            Laporan memerlukan akun agar satu orang tidak bisa membanjiri laporan. Nama dan email Anda tidak ditampilkan ke
            publik.
          </p>
          <TautanTombol to={`/masuk?kembali=${encodeURIComponent(`/proyek/${proyek.id}/lapor`)}`}>Masuk dengan email</TautanTombol>
        </Card>
      ) : (
        <Card>
          <FormLapor proyekId={proyek.id} />
        </Card>
      )}
      <p className="text-xs text-ink-subtle">
        Untuk tindak lanjut resmi, gunakan tombol "Teruskan ke LAPOR!" setelah laporan terkirim.
      </p>
    </div>
  )
}
