import type { ReactNode } from 'react'

/** Teks kecil di atas judul seksi (eyebrow) agar pengunjung tahu sedang di seksi apa. Tanpa bingkai/ikon. */
export function LabelSeksi({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium text-merek-700">{children}</p>
}
