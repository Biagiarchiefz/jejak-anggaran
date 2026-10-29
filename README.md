# Jejak Anggaran

Website tempat warga Kota Bandung melacak uang publik: **anggaran → proyek di peta → kondisi nyata yang diverifikasi warga.**
Dibuat untuk lomba WIA MIA 2026 (tema: *Designing Digital Futures – Powering Public Transparency*) sebagai pelengkap [LAPOR!](https://www.lapor.go.id/), bukan pengganti.

## Tech stack

| Bagian | Teknologi |
| --- | --- |
| Bahasa | TypeScript (strict) |
| Frontend | React 19 + Vite, React Router 7 |
| Styling | Tailwind CSS 4, font Inter (`@fontsource-variable/inter`), ikon lucide-react |
| Grafik & peta | Recharts, Leaflet + react-leaflet (tile OpenStreetMap) |
| Backend | Supabase (Postgres + Row Level Security, Auth email + kata sandi, Storage foto) |
| Validasi & data | zod (form + CSV), papaparse (skrip seed) |
| Test & kualitas | Vitest + React Testing Library, ESLint |
| Deploy | Vercel |

## Cara menjalankan

Butuh **Node.js ≥ 22.18**. Untuk database lokal, butuh juga **Docker** dan [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).

```bash
# 1. Clone
git clone https://github.com/Biagiarchiefz/jejak-anggaran.git
cd jejak-anggaran

# 2. Install
npm install
cp .env.example .env.local          # isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY

# 3. Siapkan database lokal
supabase start                      # catat API URL + anon key yang dicetak, masukkan ke .env.local
supabase db reset                   # terapkan migrasi + supabase/seed.sql

# 4. Run
npm run dev                         # buka http://localhost:5173
```

Catatan:

- Tanpa `.env.local` aplikasi tetap terbuka, tetapi setiap data tampil dalam state error "Coba lagi".
- Selama data APBD resmi belum diisi, set `VITE_DATA_DEMO_ANGGARAN=true` agar dashboard anggaran memakai data demo fiktif.
- Masuk memakai **email + kata sandi** di `/masuk`. Warga bisa mendaftar sendiri di halaman yang sama.
- Selama masa lomba, matikan **Authentication → Sign In / Providers → Email → Confirm email** di Supabase agar akun baru langsung aktif tanpa menunggu email (email bawaan Supabase dibatasi beberapa kiriman per jam).

### Peran dan akun demo untuk juri

| Peran | Bisa apa | Cara membuat |
| --- | --- | --- |
| `warga` | Melapor dan mengonfirmasi laporan | Daftar sendiri di `/masuk` |
| `admin_demo` | Membuka panel admin, mengubah status **laporan demo saja** (dijaga RLS) | Akun demo untuk juri, kredensialnya publik |
| `admin` | Mengubah status semua laporan | Hanya untuk tim. **Jangan pernah** membagikan kredensialnya |

Menyiapkan akun demo (sekali saja per project Supabase):

1. Supabase → **Authentication → Users → Add user → Create new user**, centang *Auto Confirm User*. Buat dua akun, misalnya `warga.demo@jejakanggaran.id` dan `admin.demo@jejakanggaran.id`.
2. Jalankan di SQL Editor:

   ```sql
   update public.profiles set peran = 'admin_demo'   -- BUKAN 'admin': kredensial ini dibagikan ke juri
   where id = (select id from auth.users where email = 'admin.demo@jejakanggaran.id');
   ```

3. Isi `VITE_DEMO_WARGA_EMAIL`/`_PASSWORD` dan `VITE_DEMO_ADMIN_EMAIL`/`_PASSWORD` di `.env.local` dan di env Vercel. Halaman masuk lalu menampilkan tombol **Masuk sebagai warga demo / admin demo** (satu klik, tanpa mengetik).
4. Cantumkan kredensial yang sama di dokumen submisi lomba.

Akun `admin` sungguhan untuk tim dibuat dengan cara yang sama, dengan `peran = 'admin'`.

Perintah lain:

```bash
npm run build                                   # build produksi ke dist/
npm run typecheck && npm run lint && npm run test   # wajib lulus sebelum commit
npm run data:seed                               # validasi data/raw/*.csv → tulis supabase/seed.sql
```

## Progress saat ini

**Sudah jadi (semua halaman dan fitur prioritas 1–2 di [PRD.md](PRD.md)):**

- **Beranda**: hero peta Kota Bandung dengan pin proyek, pita statistik, ringkasan anggaran, proyek sorotan, dan penjelasan cara kerja.
- **Anggaran (F1)**: total APBD, pembagian per urusan, tren antar tahun, dan anggaran per warga. Setiap angka disertai sumber dan tanggal akses.
- **Peta proyek (F2)**: peta Leaflet + daftar proyek, filter status/kecamatan, dan pencarian cepat.
- **Detail proyek (F3)**: pagu, kontrak, pelaksana, sumber SiRUP/LPSE, linimasa foto, dan daftar laporan warga.
- **Lapor kondisi (F4)**: form untuk warga yang sudah masuk, validasi zod, dan kompresi foto di browser (EXIF/GPS dibuang).
- **Tentang Data (F5)**: sumber tiap dataset, cara kurasi, aturan red flag, dan keterbatasan data.
- **Konfirmasi warga (F6), red flag otomatis (F7), status + audit trail (F8), teruskan ke LAPOR! (F9).**
- **Masuk/daftar** dengan email + kata sandi, tombol akun demo untuk juri, dan **panel admin** dengan layout dan sidebar sendiri (`/admin` dashboard, `/admin/laporan` daftar laporan) berisi dashboard (jumlah laporan per status, proyek red flag, rata-rata waktu respons, antrean prioritas) serta verifikasi dan ubah status laporan.
- Pipeline data CSV → `seed.sql` dengan validasi, serta 142 test (logika, komponen kunci, dan sinkronisasi aturan TypeScript ↔ SQL).

**Belum selesai:**

- Data nyata belum dikurasi: `anggaran_daerah.csv` masih kosong, dan `proyek.csv` baru berisi 9 proyek **demo** fiktif (target 10–20 proyek nyata).
- Belum di-deploy ke Vercel dan Supabase remote.
- Fitur prioritas 3 (F10 rapor per kecamatan/dinas, F11 mode bahasa awam) belum dikerjakan.

## Data

Data dikurasi **manual** di `data/raw/` (tanpa scraping), lalu `npm run data:seed` memvalidasinya dan menulis `supabase/seed.sql` (jangan diedit manual).

- Angka ditulis polos (`1250000000`), tanggal `YYYY-MM-DD`, koordinat desimal dengan titik.
- Proyek nyata (`is_demo=false`) wajib punya `sumber_rup_url` dan `diakses_pada`. Jika `nilai_kontrak` diisi, `sumber_lpse_url` juga wajib.
- `kecamatan` harus salah satu dari 30 kecamatan Kota Bandung (`src/utils/wilayah.ts`).
- Laporan demo **hanya** boleh untuk proyek `is_demo=true`. Skrip menolak data yang melanggar.
- `foto_path` (opsional): simpan foto di `public/foto-proyek/`, lalu isi `/foto-proyek/nama-berkas.webp`.

Untuk project remote, jalankan isi `supabase/seed.sql` di SQL editor. Seed aman diulang: data resmi di-upsert, dan hanya laporan demo yang dibuat ulang.

## Deploy (Vercel)

1. `supabase link --project-ref <ref>` lalu `supabase db push`, kemudian jalankan `supabase/seed.sql` di project remote.
2. Di Supabase → Authentication → URL Configuration, tambahkan domain Vercel ke *Site URL* dan *Redirect URLs*.
3. Di Vercel, isi env `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`. **Jangan** pernah memakai service role key.

`vercel.json` sudah mengarahkan semua route ke `index.html` (SPA).

## Dokumentasi lain

- [PRD.md](PRD.md): scope dan daftar fitur
- [Architecture.md](Architecture.md): arsitektur, struktur folder, model data, aturan akses
- [DESIGN.md](DESIGN.md): panduan gaya visual
- [CLAUDE.md](CLAUDE.md): aturan kerja dan konvensi kode
