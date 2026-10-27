import { useSyncExternalStore } from 'react'
import { adaDataDemo, langgananDataDemo } from '../lib/penandaDemo'

/** `true` jika halaman ini sudah menampilkan setidaknya satu data demo (fiktif). */
export function useAdaDataDemo(): boolean {
  return useSyncExternalStore(langgananDataDemo, adaDataDemo, () => false)
}
