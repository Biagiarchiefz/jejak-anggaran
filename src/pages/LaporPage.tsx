import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { BadgeDemo } from '../components/BadgeDemo'
import { Button, TautanTombol } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ErrorState } from '../components/ui/ErrorState'
import { SkeletonHalaman } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'
import { useProyekDetail } from '../hooks/useProyekDetail'
import { pesanError } from '../lib/errors'
import { kompresFoto, type FotoTerkompres } from '../lib/kompresFoto'
import { LABEL_KATEGORI, PENJELASAN_KATEGORI } from '../lib/label'
import { DESKRIPSI_MAKS, errorPerField, laporanFormSchema } from '../lib/schemas'
import { buatLaporan } from '../services/laporanService'
import { Constants, type Enums } from '../types/database'

type Tahap = 'isi' | 'mengompres' | 'mengirim'

function PesanField({ id, pesan }: { id: string; pesan?: string }) {
  if (!pesan) return null
  return (
    <p id={id} className="mt-1 text-sm text-redflag">
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

  const urlPratinjau = useRef<string | null>(null)

  useEffect(() => () => {
    if (urlPratinjau.current) URL.revokeObjectURL(urlPratinjau.current)
  }, [])

  function pilihFoto(file: File | null) {
    if (urlPratinjau.current) URL.revokeObjectURL(urlPratinjau.current)
    urlPratinjau.current = file ? URL.createObjectURL(file) : null
    setFoto(file)
    setPratinjau(urlPratinjau.current)
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
    <form onSubmit={kirim} noValidate className="space-y-6">
      <fieldset aria-describedby={errorField.kategori ? idError('kategori') : undefined}>
        <legend className="font-medium">Apa yang Anda lihat?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {Constants.public.Enums.kategori_laporan.map((k) => (
            <label
              key={k}
              className={`flex cursor-pointer gap-3 rounded-ui border p-3 ${
                kategori === k ? 'border-merek-700 bg-merek-50' : 'border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="kategori"
                value={k}
                checked={kategori === k}
                onChange={() => setKategori(k)}
                className="mt-1 accent-merek-800"
              />
              <span>
                <span className="block font-medium">{LABEL_KATEGORI[k]}</span>
                <span className="block text-sm text-slate-600">{PENJELASAN_KATEGORI[k]}</span>
              </span>
            </label>
          ))}
        </div>
        <PesanField id={idError('kategori')} pesan={errorField.kategori} />
      </fieldset>

      <div>
        <label htmlFor={`${idForm}-deskripsi`} className="font-medium">
          Ceritakan kondisinya
        </label>
        <p className="text-sm text-slate-600">Sebutkan lokasi persisnya dan apa yang terlihat. Hindari menyebut nama orang.</p>
        <textarea
          id={`${idForm}-deskripsi`}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={5}
          maxLength={DESKRIPSI_MAKS}
          aria-invalid={!!errorField.deskripsi}
          aria-describedby={errorField.deskripsi ? idError('deskripsi') : undefined}
          className="mt-2 w-full rounded-ui border border-slate-300 bg-white p-3"
        />
        <p className="text-right text-xs text-slate-600">
          {deskripsi.trim().length}/{DESKRIPSI_MAKS}
        </p>
        <PesanField id={idError('deskripsi')} pesan={errorField.deskripsi} />
      </div>

      <div>
        <label htmlFor={`${idForm}-foto`} className="font-medium">
          Foto kondisi (wajib)
        </label>
        <p className="text-sm text-slate-600">
          Foto dikompres otomatis sebelum dikirim. Data lokasi GPS di dalam foto dihapus.
        </p>
        <input
          id={`${idForm}-foto`}
          type="file"
          accept="image/*"
          onChange={(e) => pilihFoto(e.target.files?.[0] ?? null)}
          aria-invalid={!!errorField.foto}
          aria-describedby={errorField.foto ? idError('foto') : undefined}
          className="mt-2 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-ui file:border-0 file:bg-merek-50 file:px-4 file:font-medium file:text-merek-900"
        />
        <PesanField id={idError('foto')} pesan={errorField.foto} />
        {foto && pratinjau && (
          <img src={pratinjau} alt="Pratinjau foto yang akan dikirim" className="mt-3 max-h-64 rounded-ui border border-slate-200" />
        )}
      </div>

      {errorKirim && (
        <div role="alert" className="rounded-ui border border-red-200 bg-redflag-bg p-3 text-sm">
          <p className="font-medium text-redflag">Laporan belum terkirim</p>
          <p className="text-slate-600">{errorKirim}</p>
          <p className="mt-1 text-slate-600">Isian Anda masih tersimpan. Tekan "Kirim laporan" untuk mencoba lagi.</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" memuat={sibuk}>
          {tahap === 'mengompres' ? 'Memproses foto…' : tahap === 'mengirim' ? 'Mengirim…' : 'Kirim laporan'}
        </Button>
        <Link to={`/proyek/${proyekId}`} className="text-sm font-medium text-slate-700 underline">
          Batal
        </Link>
      </div>
    </form>
  )
}

export default function LaporPage() {
  const { id = '' } = useParams()
  const { pengguna, memuat: memuatAuth } = useAuth()
  const { data, error, memuat, muatUlang } = useProyekDetail(id)

  if (memuatAuth || (memuat && !data)) return <SkeletonHalaman baris={3} />
  if (error) return <ErrorState pesan={error.pesan} onCobaLagi={error.code === 'TIDAK_DITEMUKAN' ? undefined : muatUlang} />
  if (!data) return null

  const { proyek } = data

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <title>{`Lapor kondisi — ${proyek.nama_paket}`}</title>
      <Link to={`/proyek/${proyek.id}`} className="inline-block text-sm font-medium text-merek-800 underline-offset-2 hover:underline">
        ← Kembali ke detail proyek
      </Link>
      <header>
        <h1 className="text-2xl font-medium">Laporkan kondisi proyek</h1>
        <p className="mt-1 text-slate-600">
          Untuk: <strong>{proyek.nama_paket}</strong> (Kec. {proyek.kecamatan}) {proyek.is_demo && <BadgeDemo />}
        </p>
      </header>

      {!pengguna ? (
        <Card className="space-y-3">
          <p className="font-medium">Masuk dulu untuk melapor</p>
          <p className="text-sm text-slate-600">
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
      <p className="text-xs text-slate-600">
        Laporan di Jejak Anggaran bersifat publik dan menjadi pelengkap LAPOR!. Untuk tindak lanjut resmi, gunakan tombol
        "Teruskan ke LAPOR!" setelah laporan terkirim.
      </p>
    </div>
  )
}
