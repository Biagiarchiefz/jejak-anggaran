// Satu-satunya tempat membaca variabel lingkungan Vite. Contoh nilainya ada di .env.example.
// Hanya anon key yang boleh ada di frontend. Service role key TIDAK PERNAH dipakai di sini.
export type AkunDemo = { email: string; kataSandi: string }

function akun(email: unknown, kataSandi: unknown): AkunDemo | null {
  return typeof email === 'string' && email && typeof kataSandi === 'string' && kataSandi ? { email, kataSandi } : null
}

export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  /** Selama data APBD resmi belum dikurasi, `true` menampilkan data anggaran fiktif. */
  pakaiDataDemoAnggaran: import.meta.env.VITE_DATA_DEMO_ANGGARAN === 'true',
  /**
   * Akun demo untuk juri, ditampilkan sebagai tombol "Masuk sebagai …" di halaman masuk.
   * Kredensial ini SENGAJA publik: akun admin demo wajib berperan 'admin_demo' (bukan 'admin')
   * agar hanya bisa mengubah laporan demo. Kosong = tombolnya tidak tampil.
   */
  akunDemo: {
    warga: akun(import.meta.env.VITE_DEMO_WARGA_EMAIL, import.meta.env.VITE_DEMO_WARGA_PASSWORD),
    admin: akun(import.meta.env.VITE_DEMO_ADMIN_EMAIL, import.meta.env.VITE_DEMO_ADMIN_PASSWORD),
  },
}
