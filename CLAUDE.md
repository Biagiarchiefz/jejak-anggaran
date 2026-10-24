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
- **Data demo wajib berlabel.** Baris dengan `is_demo = true` selalu menampilkan `<BadgeDemo>`.
- **Laporan negatif simulasi hanya boleh menempel ke proyek `is_demo = true`.** Jangan membuat laporan palsu pada proyek nyata. `scripts/build-seed.ts` menolak data yang melanggar aturan ini.
- Ambang red flag hanya didefinisikan di `src/lib/redFlag.ts` dan view SQL `v_red_flag_proyek`. Keduanya harus sinkron.
- Mobile-first: setiap halaman dicek di lebar 375px. Peta dan grafik tidak boleh menyebabkan scroll horizontal.
- Jangan menampilkan data pribadi: nama/ID pelapor tidak tampil di halaman publik, tidak ada NIK atau data penerima bantuan.
- Foto dikompres di klien (canvas → WebP, maks 1600px, maks 5 MB) sebelum upload. Proses ini sekaligus membuang metadata EXIF/GPS.

## Gaya visual (design language ala Stripe)

- Kontainer halaman: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (sudah ada di `Layout` dan `Footer`). Pengecualian: `Navbar` dan hero Beranda selebar maks 86rem dan saling sejajar (Navbar `max-w-[88rem] px-4`; hero memakai margin negatif + unit `cqw` dari `@container` di `Layout`).
- Sudut: satu ukuran untuk semua elemen (gambar, tombol, kartu, badge, input, hero, popup peta) = `rounded-ui` (token `--radius-ui: 7px` di `index.css`). Jangan pakai `rounded-sm`…`rounded-3xl`. `rounded-full` hanya untuk bentuk yang memang lingkaran/garis: titik status, spinner, legenda peta, batang grafik.
- Foto Unsplash tidak diberi keterangan sumber di halaman (lisensinya tidak mewajibkan atribusi). Sumber tiap foto dicatat sebagai data/komentar di komponennya.
- Border tipis `border-slate-200/80`, bayangan lembut `shadow-sm`; kartu yang bisa diklik memakai `hover:shadow-xl transition-all duration-300`.
- Di atas judul seksi boleh ada label kecil `<LabelSeksi>` (`text-sm font-medium text-merek-700`, tanpa bingkai/ikon). Jangan kembali memakai badge berbingkai untuk label seksi.
- Judul seksi dan paragraf pengantar memakai `<JudulSeksi utama pelengkap>` (`src/components/ui/JudulSeksi.tsx`): `text-2xl sm:text-3xl font-medium`, kalimat utama `slate-900` + pelengkap `slate-500`, huruf kapital hanya di awal kalimat.
- Tipografi satu keluarga (Inter, self-host). Konfigurasi ada di `@theme` pada `src/index.css` (Tailwind v4, tanpa `tailwind.config.js`). Heading `h1`–`h3`: medium + `tracking-tight` (aturan dasar di `index.css`; heading `text-sm` pakai `tracking-normal`). Paragraf/deskripsi: regular + `text-slate-600`.
- Bobot huruf: teks paling tebal adalah `font-medium` (500). Jangan pakai `font-semibold`, `font-bold`, atau `font-extrabold`; `<strong>`, `<b>`, dan `<th>` juga diset 500 di `index.css`. Hierarki dibangun lewat ukuran dan warna, bukan ketebalan.
- Warna: abu-abu memakai palet `slate`. Judul `text-slate-900`, deskripsi `text-slate-600`. Aksen merek navy (`merek-*`) untuk tombol utama dan tautan, emas (`aksen`) hanya untuk dekorasi.
- Jarak antar seksi di Beranda lega: `pt-20 lg:pt-28`.

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