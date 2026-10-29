import { useEffect, useState } from 'react'
import { bagianAktif } from '../utils/bagianAktif'

/**
 * Scroll-spy untuk daftar isi: id bagian (elemen ber-`id`) yang sedang dibaca.
 * `batas` = garis baca dalam px dari atas layar; default sedikit di bawah header yang menempel (64px).
 * Event scroll browser sudah dikirim paling banyak sekali per frame, jadi perhitungan (beberapa elemen) dilakukan langsung.
 */
export function useBagianAktif(ids: readonly string[], batas = 120): string | null {
  const [aktif, setAktif] = useState<string | null>(ids[0] ?? null)
  const kunci = ids.join('|')

  useEffect(() => {
    const daftarId = kunci.split('|')
    function hitung() {
      const posisi = daftarId.flatMap((id) => {
        const el = document.getElementById(id)
        return el ? [{ id, atas: el.getBoundingClientRect().top }] : []
      })
      const diDasar = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      setAktif(bagianAktif(posisi, batas, diDasar))
    }
    hitung()
    window.addEventListener('scroll', hitung, { passive: true })
    window.addEventListener('resize', hitung)
    return () => {
      window.removeEventListener('scroll', hitung)
      window.removeEventListener('resize', hitung)
    }
  }, [kunci, batas])

  return aktif
}
