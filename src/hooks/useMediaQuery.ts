import { useCallback, useSyncExternalStore } from 'react'

/** `true` selama media query cocok, mis. `useMediaQuery('(min-width: 1024px)')`. Di luar browser selalu `false`. */
export function useMediaQuery(query: string): boolean {
  const langganan = useCallback(
    (berubah: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', berubah)
      return () => mql.removeEventListener('change', berubah)
    },
    [query],
  )
  return useSyncExternalStore(
    langganan,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
