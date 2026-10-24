import { createContext } from 'react'
import type { Pengguna } from '../services/authService'

export type NilaiAuth = {
  pengguna: Pengguna | null
  /** true sampai status masuk pertama kali diketahui. */
  memuat: boolean
}

export const AuthContext = createContext<NilaiAuth | null>(null)
