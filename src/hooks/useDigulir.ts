import { useSyncExternalStore } from 'react'

function langganan(berubah: () => void) {
  window.addEventListener('scroll', berubah, { passive: true })
  return () => window.removeEventListener('scroll', berubah)
}

/** `true` jika halaman sudah digulir lebih dari `batas` piksel dari atas. */
export function useDigulir(batas = 8): boolean {
  return useSyncExternalStore(
    langganan,
    () => window.scrollY > batas,
    () => false,
  )
}
