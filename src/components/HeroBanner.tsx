import type { ReactNode } from 'react'
import { Link } from 'react-router'

export type Remah = { label: string; ke?: string }

type HeroBannerProps = {
  judul: ReactNode
  deskripsi?: ReactNode
  aksi?: ReactNode
  /** Breadcrumb di lekukan kanan bawah. Item terakhir = halaman saat ini. */
  remah: Remah[]
  /** Foto latar dekoratif. Tanpa foto, tampil pola navy. */
  foto?: FotoLatar
}

export type FotoLatar = {
  src: string
  srcSet?: string
}

// Sudut cekung kecil di kiri dan atas lekukan, warnanya sama dengan latar halaman.
// Jari-jarinya mengikuti --radius-ui agar menyambung dengan sudut hero.
const SUDUT_CEKUNG = {
  background:
    'radial-gradient(circle at 0 0, transparent var(--radius-ui), var(--color-slate-50) calc(var(--radius-ui) + 0.5px))',
}

export function HeroBanner({ judul, deskripsi, aksi, remah, foto }: HeroBannerProps) {
  return (
    // Sudut kanan bawah tidak dibulatkan: tertutup lekukan breadcrumb, dan sudut bulat akan menyisakan garis tipis.
    <section className="relative isolate overflow-hidden rounded-ui rounded-br-none bg-merek-900 text-white">
      {foto ? (
        <>
          <img
            src={foto.src}
            srcSet={foto.srcSet}
            sizes="(min-width: 1408px) 1376px, 100vw"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          {/* Overlay navy: cukup tipis agar foto terlihat, cukup gelap di tengah agar teks putih kontras. */}
          <div className="absolute inset-0 -z-10 bg-merek-900/75" aria-hidden />
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(11_33_73/0.55),transparent_70%)]"
            aria-hidden
          />
        </>
      ) : (
        <>
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-merek-900/95 via-merek-800/85 to-merek-900/75" aria-hidden />
          {/* Ornamen: pola titik + cahaya lembut, hanya dekorasi. */}
          <div
            className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(rgb(255_255_255/0.5)_1px,transparent_1px)] [background-size:22px_22px]"
            aria-hidden
          />
          <div className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-sky-400/25 blur-3xl" aria-hidden />
        </>
      )}


      <div className="mx-auto max-w-3xl px-6 pt-14 pb-24 text-center sm:px-10 sm:pt-20 sm:pb-28">
        <h1 className="text-3xl leading-tight font-medium text-balance sm:text-5xl">{judul}</h1>
        {deskripsi && <p className="mx-auto mt-4 max-w-2xl text-base text-merek-100 sm:text-lg">{deskripsi}</p>}
        {aksi && <div className="mt-8 flex flex-wrap justify-center gap-3">{aksi}</div>}
      </div>

      <nav aria-label="Breadcrumb" className="absolute right-0 bottom-0 rounded-tl-ui bg-slate-50 px-5 pt-3 pb-2 sm:px-7 sm:pt-4">
        <span className="absolute right-0 -top-(--radius-ui) size-(--radius-ui)" style={SUDUT_CEKUNG} aria-hidden />
        <span className="absolute bottom-0 -left-(--radius-ui) size-(--radius-ui)" style={SUDUT_CEKUNG} aria-hidden />
        <ol className="flex items-center gap-2 text-sm font-medium">
          {remah.map((r, i) => {
            const terakhir = i === remah.length - 1
            return (
              <li key={r.label} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-aksen" aria-hidden>
                    →
                  </span>
                )}
                {terakhir || !r.ke ? (
                  <span className="text-slate-900" aria-current={terakhir ? 'page' : undefined}>
                    {r.label}
                  </span>
                ) : (
                  <Link to={r.ke} className="text-slate-600 transition-colors hover:text-slate-900">
                    {r.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </section>
  )
}
