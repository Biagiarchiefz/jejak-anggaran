# Jejak Anggaran

Warga Kota Bandung melacak uang publik: **anggaran → proyek di peta → kondisi nyata yang diverifikasi warga.**
Website untuk lomba WIA MIA 2026 (tema: *Designing Digital Futures – Powering Public Transparency*).

Pelengkap [LAPOR!](https://www.lapor.go.id/), bukan pengganti. Scope ada di [PRD.md](PRD.md), struktur di [Architecture.md](Architecture.md), aturan kerja di [CLAUDE.md](CLAUDE.md).

## Menjalankan secara lokal

Butuh Node.js ≥ 22.18 (skrip seed dijalankan langsung oleh Node tanpa build) dan, untuk database lokal, Docker + [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).

```bash
npm install
cp .env.example .env.local          # isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY

supabase start                      # Supabase lokal (Docker). Catat API URL + anon key yang dicetak
supabase db reset                   # terapkan migrasi + supabase/seed.sql
supabase gen types typescript --local > src/types/database.ts

npm run dev                         # http://localhost:5173
```

Tanpa `.env.local` aplikasi tetap terbuka, tetapi setiap data tampil dalam state error "Coba lagi".

Masuk memakai **magic link email** (tanpa kata sandi). Di Supabase lokal, email bisa dibuka di Inbucket: http://127.0.0.1:54324.

### Menjadikan akun sebagai admin (simulasi instansi)

Admin tidak bisa dibuat dari aplikasi. Setelah akun masuk sekali, jalankan di SQL editor Supabase:

```sql
update public.profiles set peran = 'admin'
where id = (select id from auth.users where email = 'admin@contoh.id');
```

## Data

Data dikurasi **manual** (tanpa scraping) di `data/raw/`:

| File | Isi | Status sekarang |
| --- | --- | --- |
| `anggaran_daerah.csv` | APBD per tahun & urusan dari DJPK / Open Data Bandung | **Kosong**, perlu diisi tim |
| `proyek.csv` | Paket dari SiRUP + kontrak dari LPSE, dengan lat/lng | 3 proyek **demo** fiktif; perlu 10–20 proyek nyata |
| `laporan_demo.csv` | Laporan simulasi untuk alur demo | 5 laporan demo (memicu 1 red flag) |

Aturan pengisian:

- Angka ditulis polos tanpa titik/koma/"Rp" (`1250000000`). Tanggal `YYYY-MM-DD`. Koordinat desimal dengan titik.
- Proyek nyata (`is_demo=false`) wajib punya `sumber_rup_url` dan `diakses_pada`; jika `nilai_kontrak` diisi, wajib `sumber_lpse_url`.
- `kecamatan` harus salah satu dari 30 kecamatan Kota Bandung (lihat `src/lib/wilayah.ts`).
- Laporan demo **hanya** boleh untuk proyek `is_demo=true`. Skrip menolak data yang melanggar.
- `hari_lalu` di laporan demo dihitung dari waktu seed dijalankan, jadi red flag demo tidak "kedaluwarsa".
- `foto_path` (opsional) di `proyek.csv`: foto lapangan tim, simpan berkasnya di `public/foto-proyek/` lalu isi `/foto-proyek/nama-berkas.webp`. Kosong = kartu proyek menampilkan cuplikan peta lokasi. Skrip menolak path di luar folder itu atau berkas yang tidak ada.
- Proyek demo sengaja tanpa foto (memakai cuplikan peta) agar tidak ada foto yang disangka foto proyek nyata.

Lalu:

```bash
npm run data:seed     # validasi + tulis supabase/seed.sql (jangan edit seed.sql manual)
supabase db reset     # LOKAL: muat ulang semuanya
```

Untuk project remote, jalankan isi `supabase/seed.sql` di SQL editor. Aman diulang: data resmi di-upsert dan hanya laporan demo yang dibuat ulang; laporan warga sungguhan tidak tersentuh.

## Pemeriksaan sebelum selesai

```bash
npm run typecheck && npm run lint && npm run test
```

Test mencakup logika `src/lib/`, validasi seed, komponen kunci, dan **sinkronisasi aturan red flag & transisi status antara TypeScript dan SQL migrasi** (`scripts/sinkronAturan.test.ts`).

## Deploy (Vercel)

1. `supabase link --project-ref <ref>` lalu `supabase db push`.
2. Jalankan `supabase/seed.sql` di project remote.
3. Di Supabase → Authentication → URL Configuration, tambahkan domain Vercel ke *Site URL* dan *Redirect URLs*.
4. Di Vercel, isi env `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`. **Jangan** pernah memakai service role key.

`vercel.json` sudah mengarahkan semua route ke `index.html` (SPA).
