import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type NilaiAuth } from './authContext'
import { pantauPengguna } from '../services/authService'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [nilai, setNilai] = useState<NilaiAuth>({ pengguna: null, memuat: true })

  useEffect(() => pantauPengguna((pengguna) => setNilai({ pengguna, memuat: false })), [])

  return <AuthContext value={nilai}>{children}</AuthContext>
}
