# Jejak Anggaran

**Ikuti uang publik Kota Bandung, dari anggaran sampai ke lapangan.**

Jejak Anggaran membantu warga menjawab tiga pertanyaan sederhana: *berapa anggarannya, dipakai untuk proyek apa, dan bagaimana kondisinya sekarang?*
Angka APBD dan paket proyek dari sumber resmi disajikan dalam bahasa awam, setiap proyek ditandai di peta, lalu warga melaporkan dan mengonfirmasi kondisi nyatanya di lapangan.

Dibuat untuk lomba **WIA MIA 2026** dengan tema *Designing Digital Futures – Powering Public Transparency*.
Jejak Anggaran adalah **pelengkap [LAPOR!](https://www.lapor.go.id/)**, bukan penggantinya: setiap laporan bisa diteruskan ke kanal resmi pemerintah dengan satu tombol.

---

## Akses untuk juri

Buka halaman **Masuk** (`/masuk`). Tersedia tombol satu klik **Warga demo** dan **Admin juri**, atau ketik kredensial berikut:

| Akun | Email | Kata sandi | Yang bisa dicoba |
| --- | --- | --- | --- |
| **Warga demo** | `warga.demo@jejakanggaran.id` | `Warga-HPVi7398-wkfV!` | Melapor kondisi proyek dengan foto, dan mengonfirmasi laporan warga lain |
| **Admin juri** | `admin.juri@jejakanggaran.id` | `Juri-CHwY9777-YgKk!` | Panel admin: dashboard tindak lanjut, verifikasi, dan mengubah status **semua** laporan |

Tanpa masuk pun, semua data anggaran, peta, dan detail proyek bisa dibuka.

### Panduan mencoba dalam 5 menit

1. **Sebagai pengunjung (tanpa masuk)**
   - **Beranda**: peta Kota Bandung dengan pin proyek, angka ringkas APBD, dan proyek yang perlu perhatian.
   - **Anggaran**: total APBD, pembagian per urusan, tren antartahun, dan artinya per warga ("setara Rp … per warga per hari").
   - **Peta proyek**: cari dan saring proyek per kecamatan atau status, lalu klik pin untuk melihat ringkasannya.
   - **Detail proyek**: pagu, nilai kontrak, pelaksana, tautan ke SiRUP/LPSE, linimasa foto, dan laporan warga.
2. **Sebagai warga demo**
   - Di halaman detail proyek, tekan **Laporkan kondisi**, pilih jenis masalah, ceritakan kondisinya, lalu unggah foto.
   - Pada laporan warga lain, tekan **Saya juga melihat** untuk mengonfirmasi.
3. **Sebagai admin juri**
   - Setelah masuk, Anda langsung dibawa ke **panel admin**: jumlah laporan per status, rata-rata waktu respons, dan antrean prioritas.
   - Buka **Laporan warga**, pilih satu laporan, lalu ubah statusnya: *Diverifikasi → Ditindaklanjuti → Selesai*, atau *Ditolak* dengan catatan.
   - Kembali ke halaman proyeknya: riwayat perubahan status langsung tampil untuk publik.

> Untuk saat ini, proyek, laporan, dan angka anggaran yang tampil adalah **data demo (fiktif)** untuk memperlihatkan alur aplikasi; nama proyek demo selalu diberi tanda "(fiktif)". Selama data demo tampil, catatan di bagian bawah halaman memberitahukannya. Laporan negatif simulasi hanya ditempelkan pada proyek fiktif, tidak pernah pada proyek nyata.

---

## Masalah yang ingin diselesaikan

Data anggaran daerah sebenarnya terbuka (DJPK Kemenkeu, SiRUP LKPP, LPSE), tetapi tersebar di banyak situs, berbentuk tabel teknis, dan tidak terhubung dengan kondisi nyata di lapangan. Akibatnya warga sulit tahu proyek apa yang dibiayai di sekitar rumahnya, dan kanal pengaduan resmi kerap menerima laporan tanpa konteks anggaran.

Jejak Anggaran menyambungkan ketiganya dalam satu alur:

```
Anggaran (APBD)  →  Proyek di peta (SiRUP/LPSE)  →  Kondisi nyata (laporan + konfirmasi warga)
```

## Fitur utama

| Fitur | Penjelasan singkat |
| --- | --- |
| **Dashboard anggaran** | Total APBD, pembagian per urusan, tren antartahun, realisasi, dan konteks per warga. |
| **Peta proyek** | Semua proyek di peta Kota Bandung, dengan pencarian dan saringan status/kecamatan, tersinkron dengan daftar di sampingnya. |
| **Detail proyek** | Pagu, nilai kontrak, pelaksana, kode RUP, linimasa foto lapangan, dan semua laporan warga. |
| **Lapor kondisi** | Form sederhana dengan foto. Foto dikompres di perangkat dan data lokasi GPS di dalamnya dihapus sebelum dikirim. |
| **Konfirmasi warga** | Warga lain bisa menekan "Saya juga melihat", sehingga laporan yang banyak dikonfirmasi lebih menonjol. |
| **Tanda "perlu perhatian"** | Proyek yang tercatat selesai tetapi menerima beberapa laporan kerusakan terverifikasi ditandai otomatis. Ini **bukan tuduhan**, hanya sinyal untuk diperhatikan. |
| **Status dan riwayat terbuka** | Setiap perubahan status laporan tercatat (kapan dan catatannya) dan bisa dilihat publik. |
| **Teruskan ke LAPOR!** | Ringkasan laporan siap disalin untuk dikirim ke kanal resmi pemerintah. |
| **Panel admin** | Dashboard tindak lanjut, antrean prioritas verifikasi, dan pengubahan status laporan. |
| **Halaman Tentang Data** | Dari mana setiap angka berasal, cara kurasi, aturan tanda "perlu perhatian", dan keterbatasan data. |

## Prinsip yang kami pegang

- **Setiap angka punya sumber.** Angka anggaran, pagu, dan kontrak selalu disertai nama sumber, tanggal akses, dan tautannya.
- **Jujur soal data demo.** Data fiktif selalu diberitahukan, dan tidak pernah dicampur dengan tuduhan pada proyek nyata.
- **Privasi pelapor.** Nama dan email pelapor tidak pernah tampil di halaman publik. Tidak ada NIK atau data penerima bantuan.
- **Tanpa klaim berlebihan.** Data dikurasi manual dari situs resmi (tanpa scraping), tidak diklaim *real-time*, dan tidak diklaim "terverifikasi AI".
- **Untuk semua warga.** Bahasa awam, dirancang mulai dari layar ponsel 375px, bisa dipakai dengan keyboard dan pembaca layar, dan menghormati pengaturan "kurangi gerak".

## Tampilan dan pengalaman

- Desain bersih dengan aksen biru langit, mobile-first, dengan navigasi bawah di ponsel.
- Hero Beranda berupa peta Kota Bandung dengan pin proyek dan kartu ringkasan.
- **Loading skeleton yang meniru bentuk asli** setiap halaman (bukan kotak polos), sehingga tata letak tidak meloncat saat data datang.
- Setiap data punya tiga keadaan yang jelas: sedang dimuat, kosong (dengan saran tindakan), dan gagal (dengan tombol "Coba lagi").

---

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Bahasa | TypeScript (strict) |
| Frontend | React 19 + Vite, React Router 7 |
| Styling | Tailwind CSS 4, font Inter, ikon lucide-react |
| Grafik dan peta | Recharts, Leaflet + react-leaflet (peta OpenStreetMap) |
| Backend | Supabase: Postgres dengan Row Level Security, Auth email + kata sandi, Storage foto |
| Validasi | zod (form dan data CSV) |
| Kualitas | Vitest + React Testing Library (189 test), ESLint, TypeScript strict |
| Deploy | Vercel |

Keamanan data dijaga di database, bukan hanya di tampilan: aturan siapa boleh membuat laporan, mengonfirmasi, dan mengubah status ditegakkan oleh Row Level Security di Postgres.

## Menjalankan secara lokal

Butuh **Node.js 22.18 atau lebih baru**. Untuk database lokal, butuh juga **Docker** dan [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).

```bash
git clone https://github.com/Biagiarchiefz/jejak-anggaran.git
cd jejak-anggaran
npm install
cp .env.example .env.local     # isi alamat dan anon key Supabase

supabase start                 # jalankan Supabase lokal
supabase db reset              # siapkan tabel dan data awal

npm run dev                    # buka http://localhost:5173
```

Perintah lain:

```bash
npm run build                                       # build produksi
npm run typecheck && npm run lint && npm run test   # pemeriksaan kualitas
npm run data:seed                                   # validasi data CSV lalu buat data awal database
```

## Data

Data dikurasi **manual** di folder `data/raw/` dari situs resmi, lalu divalidasi otomatis sebelum masuk database: tipe angka, koordinat harus berada di dalam Kota Bandung, kecamatan harus salah satu dari 30 kecamatan, dan proyek nyata wajib punya tautan sumber serta tanggal akses.

| Data | Sumber |
| --- | --- |
| APBD Kota Bandung | DJPK Kementerian Keuangan, Open Data Kota Bandung |
| Paket proyek, pagu | SiRUP LKPP |
| Nilai kontrak, pelaksana | LPSE Kota Bandung / Opentender |
| Lokasi dan foto awal | Dikumpulkan tim |
| Jumlah penduduk (konteks per warga) | BPS Kota Bandung |

## Status pengembangan

**Sudah berjalan:** semua halaman dan fitur prioritas di atas, termasuk masuk/daftar, panel admin, tanda "perlu perhatian" otomatis, riwayat status, teruskan ke LAPOR!, dan loading skeleton di setiap halaman.

**Rencana berikutnya:**

- Mengisi data APBD resmi dan 10–20 proyek nyata hasil kurasi dari SiRUP/LPSE (saat ini seluruh data masih data demo; alur dan validasinya sudah siap).
- Rapor per kecamatan dan per dinas.
- Mode bahasa yang lebih awam lagi untuk istilah anggaran.

## Dokumentasi lain

- [PRD.md](PRD.md): ruang lingkup dan daftar fitur
- [Architecture.md](Architecture.md): arsitektur, struktur folder, model data, aturan akses
- [DESIGN.md](DESIGN.md): panduan gaya visual
