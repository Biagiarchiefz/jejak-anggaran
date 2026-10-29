import { useCallback, useEffect, useEffectEvent, useState } from 'react'
import { AppError } from '../utils/errors'

export type StateMuat<T> = {
  data: T | undefined
  error: AppError | null
  memuat: boolean
  muatUlang: () => void
}

type Hasil<T> = { kunci: string; data?: T; error?: AppError }

/**
 * Hook dasar untuk mengambil data dari service. Memberi tiga state yang
 * wajib ditampilkan: memuat, error, dan data (kosong ditangani pemanggil).
 * `kunci` berubah → data dimuat ulang.
 */
export function useMuat<T>(muat: () => Promise<T>, kunci: string): StateMuat<T> {
  const [versi, setVersi] = useState(0)
  const [hasil, setHasil] = useState<Hasil<T> | null>(null)
  const kunciAktif = `${kunci}#${versi}`
  const muatEvent = useEffectEvent(muat)

  useEffect(() => {
    let batal = false
    muatEvent().then(
      (data) => {
        if (!batal) setHasil({ kunci: kunciAktif, data })
      },
      (e: unknown) => {
        if (batal) return
        const error = e instanceof AppError ? e : new AppError('TIDAK_DIKETAHUI', undefined, { cause: e })
        setHasil({ kunci: kunciAktif, error })
      },
    )
    return () => {
      batal = true
    }
  }, [kunciAktif])

  const muatUlang = useCallback(() => setVersi((v) => v + 1), [])
  const terbaru = hasil?.kunci === kunciAktif

  return {
    // Saat memuat ulang, data lama tetap ditampilkan agar layar tidak berkedip.
    data: hasil?.data,
    error: terbaru ? (hasil.error ?? null) : null,
    memuat: !terbaru,
    muatUlang,
  }
}
