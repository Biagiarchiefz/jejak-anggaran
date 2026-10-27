import { useEffect, type RefObject } from 'react'

const PILIHAN = '[data-muncul=""], [data-muncul-anak=""]'

/**
 * Memantau elemen `data-muncul` / `data-muncul-anak` di dalam `akar` (termasuk yang baru dirender setelah data dimuat)
 * dan menandainya "tampil" saat masuk layar, sehingga animasi muncul di index.css berjalan sekali.
 * Tidak melakukan apa pun jika kelas `animasi-muncul` tidak dipasang (lihat main.tsx).
 */
export function useAnimasiMuncul(akar: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = akar.current
    if (!el || !document.documentElement.classList.contains('animasi-muncul')) return

    const io = new IntersectionObserver(
      (entri) => {
        for (const e of entri) {
          if (!e.isIntersecting) continue
          const t = e.target
          if (t.hasAttribute('data-muncul')) t.setAttribute('data-muncul', 'tampil')
          if (t.hasAttribute('data-muncul-anak')) t.setAttribute('data-muncul-anak', 'tampil')
          io.unobserve(t)
        }
      },
      // Mulai sedikit sebelum elemen benar-benar terlihat penuh.
      { rootMargin: '0px 0px -6% 0px' },
    )
    const amati = () => el.querySelectorAll(PILIHAN).forEach((t) => io.observe(t))

    amati()
    // Konten yang dirender belakangan (setelah fetch, pindah halaman) ikut dipantau.
    const mo = new MutationObserver(amati)
    mo.observe(el, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [akar])
}
