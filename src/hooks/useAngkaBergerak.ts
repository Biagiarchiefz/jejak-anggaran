import { useEffect, useRef, useState } from 'react'
import { nilaiPadaWaktu } from '../utils/animasiAngka'

function tanpaAnimasi(): boolean {
  return (
    typeof window === 'undefined' ||
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Angka yang naik dari 0 ke `target` (ease-out) begitu elemen `ref` terlihat di layar, sekali saja.
 * Bila `target` berubah setelah itu (data selesai dimuat), angka bergerak lagi ke target baru.
 * Tanpa IntersectionObserver atau saat pengguna memilih "kurangi gerak", langsung menampilkan `target`.
 */
export function useAngkaBergerak<T extends HTMLElement>(target: number, durasiMs = 1800) {
  const ref = useRef<T>(null)
  const [statis] = useState(tanpaAnimasi)
  const [terlihat, setTerlihat] = useState(false)
  const [nilai, setNilai] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (statis || !el) return
    const pengamat = new IntersectionObserver(
      ([entri]) => {
        if (entri.isIntersecting) {
          setTerlihat(true)
          pengamat.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    pengamat.observe(el)
    return () => pengamat.disconnect()
  }, [statis])

  useEffect(() => {
    if (statis || !terlihat) return
    let bingkai = 0
    const mulai = performance.now()
    const langkah = (sekarang: number) => {
      const lewat = sekarang - mulai
      setNilai(nilaiPadaWaktu(target, lewat, durasiMs))
      if (lewat < durasiMs) bingkai = requestAnimationFrame(langkah)
    }
    bingkai = requestAnimationFrame(langkah)
    return () => cancelAnimationFrame(bingkai)
  }, [statis, terlihat, target, durasiMs])

  return { ref, nilai: statis ? target : nilai }
}
