# CLAUDE.md — Jejak Anggaran

Website lomba WIA MIA 2026 (tema: Designing Digital Futures – Powering Public Transparency).
Warga Kota Bandung melacak uang publik: anggaran → proyek di peta → kondisi nyata yang diverifikasi warga.
Baca `PRD.md` untuk scope dan `Architecture.md` untuk struktur sebelum mengubah apa pun.

## Perintah utama

```bash
npm install                 # pasang dependensi
npm run dev                 # dev server Vite di http://localhost:5173
npm run build               # tsc -b && vite build → dist/
npm run preview             # sajikan hasil build secara lokal
npm run lint                # ESLint
npm run typecheck           # tsc -b (app, vite.config, scripts; semua noEmit)
npm run test                # vitest run (sekali jalan)
npm run test:watch          # vitest mode watch
npm run data:seed           # validasi data/raw/*.csv → generate supabase/seed.sql

# Database (Supabase CLI, butuh Docker untuk lokal)
supabase start                              # jalankan Supabase lokal
supabase migration new <nama_snake_case>    # buat file migrasi baru
supabase db reset                           # terapkan ulang semua migrasi + seed.sql (LOKAL saja)
supabase db push                            # terapkan migrasi ke project remote
supabase gen types typescript --local > src/types/database.ts   # regenerate tipe setelah migrasi
```

Sebelum menganggap tugas selesai: `npm run typecheck && npm run lint && npm run test` harus lulus.

## Tech stack

| Bagian | Pilihan | Versi minimum |
| --- | --- | --- |
| Bahasa | TypeScript (strict) | 5.x |
| Frontend | React + Vite | React 19, Vite 7 |
| Routing | react-router | 7.x |
| Styling | Tailwind CSS | 4.x |
| Font | Inter, di-host sendiri via `@fontsource-variable/inter` (tanpa Google Fonts) | 5.x |
| Grafik | Recharts | 3.x |
| Ikon | lucide-react (stroke 1.5, satu-satunya set ikon) | 1.x |
| Peta | Leaflet + react-leaflet, tile OpenStreetMap | Leaflet 1.9, react-leaflet 5 |
| Backend | Supabase (Postgres, Auth, Storage) via `@supabase/supabase-js` | 2.x |
| Validasi | zod (form + validasi CSV) | 3.x |
| Parsing CSV | papaparse (hanya di `scripts/`) | 5.x |
| Test | Vitest + React Testing Library | Vitest 3.x |
| Deploy | Vercel (SPA rewrite di `vercel.json`) | — |

Jangan menambah dependensi baru tanpa alasan jelas. Tidak ada Redux, TanStack Query, UI kit, atau library AI.

## Environment

- `.env.local` berisi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`. Contoh di `.env.example`.
- **Jangan pernah** memakai atau meng-commit service role key di kode frontend.

## Konvensi penamaan

- **Istilah domain memakai bahasa Indonesia**, sama dengan nama tabel: `proyek`, `laporan`, `konfirmasi`, `anggaranDaerah`, `riwayatStatus`. Jangan campur dengan `project`/`report`.
- Database: `snake_case`, nama tabel tunggal (`proyek`, `laporan`).
- Komponen: `PascalCase.tsx` (`PetaProyek.tsx`). Hooks: `useXxx.ts` (`useProyekList.ts`). Util dan service: `camelCase.ts`.
- Tipe data DB diambil dari `src/types/database.ts` (hasil generate). Jangan menulis ulang tipe tabel secara manual.
- Semua teks UI dalam bahasa Indonesia yang mudah dipahami warga awam.

## Aturan penulisan kode

- Akses Supabase **hanya** lewat `src/services/*`. Komponen dan halaman tidak boleh mengimpor `supabase` langsung.
- Komponen fungsi + hooks. Logika murni (red flag, format rupiah, kalkulasi rapor) ada di `src/lib/` dan wajib punya unit test.
- Format uang selalu memakai `formatRupiah()` / `formatRupiahRingkas()` dari `src/lib/format.ts` (contoh: `Rp 1,2 M`).
- **Setiap angka anggaran, pagu, atau kontrak yang tampil wajib disertai komponen `<SumberData>`** (nama sumber + tanggal akses + link). Ini fitur inti, bukan hiasan.
- **Data demo wajib diberitahukan, tetapi tidak per item.** Service memanggil `tandaiDataDemo()` (`src/lib/penandaDemo.ts`) saat memuat data; begitu ada baris `is_demo = true`, `useAdaDataDemo()` menampilkan satu catatan di bagian bawah footer. Tidak ada badge "Data demo", dan angka demo tidak diberi baris `<SumberData>` (komponennya mengembalikan `null` untuk `demo`).
- **Laporan negatif simulasi hanya boleh menempel ke proyek `is_demo = true`.** Jangan membuat laporan palsu pada proyek nyata. `scripts/build-seed.ts` menolak data yang melanggar aturan ini.
- Ambang red flag hanya didefinisikan di `src/lib/redFlag.ts` dan view SQL `v_red_flag_proyek`. Keduanya harus sinkron.
- Mobile-first: setiap halaman dicek di lebar 375px. Peta dan grafik tidak boleh menyebabkan scroll horizontal.
- Jangan menampilkan data pribadi: nama/ID pelapor tidak tampil di halaman publik, tidak ada NIK atau data penerima bantuan.
- Foto dikompres di klien (canvas → WebP, maks 1600px, maks 5 MB) sebelum upload. Proses ini sekaligus membuang metadata EXIF/GPS.

## Gaya visual

**Sumber kebenaran gaya visual adalah `DESIGN.md`** (gaya ala cloudflare.com dengan aksen biru langit). Baca sebelum mengubah UI. Ringkasan penerapannya di kode:

- Token warna, radius, bayangan, dan easing ada di `@theme` pada `src/index.css` (Tailwind v4, tanpa `tailwind.config.js`). Komponen hanya memakai token (`bg-canvas`, `bg-surface`, `text-ink-muted`, `bg-action`, `border-border`, …), bukan palet bawaan Tailwind atau hex. Pustaka yang butuh hex (Recharts, Leaflet) memakai `src/lib/warna.ts`.
- Kontainer halaman: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (di `Layout`, `Navbar`, `Footer`). Section dengan latar selebar layar memakai `<PitaPenuh>` (`src/components/ui/PitaPenuh.tsx`, margin negatif + unit `cqw` dari `@container` di `Layout`).
- Header putih menempel (logo kiri, tautan di desktop, ikon cari yang membuka `<PencarianCepat>`, Masuk). Di Beranda sebelum digulir header transparan dan hero ditarik ke belakangnya (`-mt-16`), sehingga peta latar terlihat sampai atas layar. Di bawah `lg`: tombol menu (laci kiri) + bottom navigation 5 item. Tidak ada pita di atas header: status "bukan situs resmi", tautan LAPOR!, dan catatan data demo ada di footer. Animasi laci/dialog ada di `index.css` (`dialog[data-laci]`).
- Beranda mengikuti urutan DESIGN.md §8, dengan hero `<FlatProjectMap>` (teks kiri di atas latar peta OSM grayscale berpusat di Kota Bandung, memakai tile statis tanpa Leaflet (`susunanTile` di `src/lib/petaTile.ts`) dan gradien `canvas`; garis batas kota dari `src/data/batasKotaBandung.ts`; seluruh wilayah kota diperkecil lewat `skalaAgarMuat` agar muat di wadah, pin tetap berukuran penuh; pin proyek + kartu melayang; satu tombol utama, tanpa bar pencarian) → `<PitaStatistik>` (band) → `<SeksiAnggaran>` → `<SeksiProyek>` → `<SeksiCaraKerja>` → `<CtaPenutup>` (band). Pita gelap maksimal dua per halaman.
- Komponen bersama: `<KepalaHalaman>` (H1 halaman), `<JudulSeksi>` (H2 section), `<LabelSeksi>` (eyebrow), `gayaForm.ts` (kelas input/select/label/galat), `Button`/`TautanTombol` (pil).
- Ikon hanya dari `lucide-react`, stroke 1.5.
- Animasi (DESIGN.md §10): pindah halaman = fade di `Layout` (`animate-halaman-masuk`, hanya opacity). Muncul saat digulir = beri atribut `data-muncul=""` (elemen itu) atau `data-muncul-anak=""` (anak-anaknya bergantian); `useAnimasiMuncul` di `Layout` yang memicunya. Jangan pasang di elemen `sticky`/hero. Tombol, chip, dan ikon memakai utilitas `efek-tekan` (bukan `transition-colors`). Semua mati saat "kurangi gerak".
- Foto Unsplash tidak diberi keterangan sumber di halaman (lisensinya tidak mewajibkan atribusi). Sumber tiap foto dicatat sebagai data/komentar di komponennya.

## Standar error handling

- Service tidak pernah mengembalikan `{ data, error }` mentah ke UI. Jika `error` ada, lempar `AppError` (`src/lib/errors.ts`) dengan `code` dan `pesan` bahasa Indonesia.
- Kode `AppError`: `JARINGAN`, `TIDAK_DITEMUKAN`, `TIDAK_BERWENANG`, `VALIDASI`, `UPLOAD_GAGAL`, `TIDAK_DIKETAHUI`.
- Jangan pernah menampilkan pesan error Supabase/Postgres asli ke pengguna. Log detailnya dengan `logger.error()` (aktif hanya di dev).
- Setiap halaman berada di dalam `<ErrorBoundary>` route-level dengan tombol "Coba lagi".
- Setiap fetch punya tiga state yang terlihat: memuat (skeleton), kosong (pesan + aksi), error (pesan + coba lagi).
- Form divalidasi dengan zod sebelum dikirim. Pesan error tampil di bawah field terkait.
- Upload foto gagal: data form tetap tersimpan di state, dan pengguna bisa mengulang tanpa mengisi ulang.

## Yang tidak boleh dilakukan

- Tidak membuat fitur di luar `PRD.md` tanpa diminta.
- Tidak melakukan scraping SiRUP/LPSE secara otomatis. Data proyek dikurasi manual di `data/raw/`.
- Tidak mengklaim "real-time" atau "terverifikasi AI" di UI.
- Tidak mengedit migrasi yang sudah di-push. Buat migrasi baru.