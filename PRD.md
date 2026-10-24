# PRD — Jejak Anggaran

## Tujuan

Jejak Anggaran membantu warga **Kota Bandung** melacak uang publik dari anggaran, ke proyek fisik di peta, sampai kondisi nyatanya di lapangan yang diverifikasi warga.

Masalah yang diselesaikan: data anggaran dan pengadaan sudah terbuka, tetapi tersebar (DJPK, SiRUP, LPSE), berbentuk tabel, dan tidak terhubung ke kondisi lapangan. Kanal pengaduan (LAPOR!, JAGA) mengelola laporan satu per satu, tanpa mengikatnya ke proyek beranggaran yang bisa dilihat publik secara kolektif.

**Posisi:** pelengkap LAPOR!, bukan pengganti. Tindak lanjut resmi tetap diarahkan ke LAPOR!.

Subtema lomba yang dicakup: Open Government Data, Civic Reporting & Accountability, Data-Driven Decision Support.

## Pengguna

| Peran | Kebutuhan |
| --- | --- |
| Pengunjung (tanpa login) | Melihat anggaran, peta proyek, detail, laporan, dan red flag |
| Warga (login) | Melapor kondisi proyek dengan foto, mengonfirmasi laporan warga lain |
| Admin (simulasi instansi) | Memverifikasi laporan, mengubah status tindak lanjut |

## Alur utama (skenario demo)

1. Warga membuka peta dan memilih proyek jalan di dekat rumahnya.
2. Halaman detail menampilkan pagu, nilai kontrak, pelaksana, status, dan sumber datanya.
3. Warga melihat jalan berstatus "selesai" ternyata sudah rusak, lalu mengunggah foto.
4. Warga lain mengonfirmasi laporan tersebut.
5. Ambang terpenuhi, proyek mendapat red flag.
6. Admin memverifikasi dan memperbarui status. Riwayatnya terlihat publik.
7. Warga menekan "Teruskan ke LAPOR!" untuk tindak lanjut resmi.

Alur ini harus berjalan tanpa error di HP maupun desktop.

## Fitur

### Prioritas 1 — wajib selesai dulu (must-have)

| ID | Fitur | Kriteria selesai |
| --- | --- | --- |
| F1 | Dashboard anggaran | Total APBD Kota Bandung, pembagian per urusan, tren antar tahun (Recharts). Setiap angka ada `<SumberData>`. |
| F2 | Peta proyek | 10–20 proyek nyata sebagai pin Leaflet. Popup berisi nama, pagu, status. Filter status dan kecamatan. |
| F3 | Detail proyek | Pagu, nilai kontrak, pelaksana, satker, tahun anggaran, status, sumber (link SiRUP/LPSE), linimasa foto, daftar laporan. |
| F4 | Lapor kondisi proyek | Login warga, form (kategori, deskripsi, foto wajib), terikat ke satu proyek, validasi zod, kompresi foto. |
| F5 | Halaman "Tentang Data" | Sumber tiap dataset, tanggal akses, cara kurasi, aturan red flag, keterbatasan data, penjelasan label "data demo". |

### Prioritas 2 — dikerjakan setelah P1 stabil

| ID | Fitur | Kriteria selesai |
| --- | --- | --- |
| F6 | Konfirmasi warga | Satu warga satu konfirmasi per laporan. Pelapor tidak bisa mengonfirmasi laporannya sendiri. |
| F7 | Red flag otomatis | Proyek berstatus `selesai` dengan ≥ 3 laporan kategori `kerusakan` berstatus `diverifikasi` atau lebih, dalam 90 hari terakhir. Ditandai di peta dan detail, dengan penjelasan alasannya. |
| F8 | Status + audit trail | Status laporan: diterima → diverifikasi → ditindaklanjuti → selesai (atau ditolak). Setiap perubahan tercatat (siapa, kapan, catatan) dan tampil publik. |
| F9 | Teruskan ke LAPOR! | Tombol membuka lapor.go.id di tab baru, dengan ringkasan laporan siap disalin. |

### Prioritas 3 — hanya jika waktu cukup

| ID | Fitur |
| --- | --- |
| F10 | Rapor per kecamatan / per dinas: jumlah proyek, total pagu, jumlah laporan, rata-rata waktu respons |
| F11 | Mode bahasa awam: angka besar diterjemahkan ke padanan sehari-hari, dengan asumsi yang ditulis jelas |

## Data

- **Asli:** APBD Kota Bandung (DJPK Kemenkeu / Open Data Kota Bandung), paket proyek (SiRUP LKPP), nilai kontrak dan pemenang (LPSE Kota Bandung / Opentender). Dikurasi manual ke `data/raw/`.
- **Dikumpulkan tim:** koordinat (Google Maps), foto lapangan hasil kunjungan.
- **Simulasi:** laporan dan konfirmasi warga untuk demo, `is_demo = true`, berlabel "Data demo".
- Laporan negatif simulasi hanya pada proyek fiktif ber-`is_demo = true`.

## Kebutuhan non-fungsional

- Responsif mulai lebar 375px. Lighthouse mobile: Performance ≥ 80, Accessibility ≥ 90.
- Halaman utama tampil < 3 detik di koneksi 4G.
- Kontras warna memenuhi WCAG AA. Peta punya alternatif daftar proyek untuk pembaca layar.
- Identitas pelapor tidak tampil publik. Metadata GPS foto dibuang.

## Di luar scope tahap awal (out of scope)

- Integrasi API langsung ke LAPOR!, JAGA, SiRUP, atau LPSE. Hanya link keluar.
- Scraping atau sinkronisasi data otomatis/real-time.
- Wilayah selain Kota Bandung.
- Verifikasi laporan berbasis AI atau deteksi gambar otomatis.
- Dashboard instansi nyata dan akun resmi pemerintah. Admin hanya simulasi.
- Notifikasi email, push, atau WhatsApp.
- Aplikasi mobile native atau PWA offline.
- Data bantuan sosial atau data pribadi penerima.
- Pelaporan anonim tanpa login.
- Komentar, chat, atau forum diskusi.
- Multi-bahasa (hanya bahasa Indonesia).
- Klaim otomatis "korupsi" atau "penyimpangan". Red flag hanya berarti "perlu perhatian".