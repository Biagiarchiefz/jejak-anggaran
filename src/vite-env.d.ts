/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** "true" = dashboard anggaran memakai data demo fiktif (berlabel), bukan database. */
  readonly VITE_DATA_DEMO_ANGGARAN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
