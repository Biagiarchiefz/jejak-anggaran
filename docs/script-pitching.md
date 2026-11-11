# Script Video Pitching — Jejak Anggaran

**Lomba:** WIA MIA 2026 — *Designing Digital Futures – Powering Public Transparency*
**Durasi target:** ±4 menit 30 detik (batas maksimal 5 menit, sisakan ruang untuk jeda)
**Panjang narasi:** ±620 kata (tempo bicara santai ±140 kata per menit)

## Cara memakai script ini

- **[LAYAR]** = yang ditampilkan atau direkam di layar. **NARASI** = yang Anda ucapkan.
- Teks di dalam *[kurung miring]* jangan dibaca; itu catatan untuk Anda.
- Rekam layar dari situs yang sudah di-deploy (https://jejak-anggaran.vercel.app), **setelah** `VITE_DATA_DEMO_ANGGARAN` di Vercel diubah ke `false` dan di-redeploy, supaya angka APBD yang tampil adalah data resmi beserta sumbernya.
- Siapkan dua tab browser yang sudah masuk: satu sebagai **Warga demo**, satu sebagai **Admin juri**, agar tidak membuang waktu di halaman login.
- Bagian demo lebih enak direkam terpisah (layar saja), lalu narasinya diisi suara (*voice-over*). Bagian pembuka dan penutup bisa memakai wajah Anda di kamera.
- Angka per warga di halaman Anggaran dibaca langsung dari layar; jangan dihafal dari script.

---

## Bagian 1 — Pembuka: masalahnya (0:00 – 0:35)

**[LAYAR]** Wajah Anda di kamera, atau foto jalan berlubang / proyek mangkrak di Bandung. Lalu potongan tabel Excel DJPK dan halaman SiRUP yang padat.

**NARASI:**

> Pernahkah Anda melewati jalan yang baru diperbaiki, lalu beberapa bulan kemudian rusak lagi, dan bertanya: sebenarnya berapa anggarannya, dan siapa yang mengerjakan?
>
> Data itu sebenarnya terbuka. APBD ada di situs Kementerian Keuangan, paket proyek ada di SiRUP. Tapi bentuknya tabel teknis, tersebar di banyak situs, dan tidak pernah tersambung dengan kondisi nyata di lapangan. Akibatnya warga sulit mengawasi, dan kanal pengaduan sering menerima laporan tanpa konteks anggaran.

---

## Bagian 2 — Solusinya dalam satu kalimat (0:35 – 0:55)

**[LAYAR]** Beranda Jejak Anggaran: hero peta Kota Bandung dengan pin proyek. Gulir pelan ke pita "Dalam angka".

**NARASI:**

> Karena itu kami membuat **Jejak Anggaran**: website untuk mengikuti uang publik Kota Bandung, dari anggaran, ke proyek di peta, sampai kondisi nyatanya yang dilaporkan dan dikonfirmasi warga.
>
> Tiga pertanyaan sederhana: berapa anggarannya, dipakai untuk apa, dan bagaimana kondisinya sekarang.

---

## Bagian 3 — Demo: Anggaran (0:55 – 1:35)

**[LAYAR]** Buka halaman **Anggaran**. Tunjukkan total APBD, grafik per bidang, tren antartahun, lalu arahkan kursor ke baris *Sumber: DJPK Kemenkeu … diakses …*. Klik tombol **Unduh CSV** sekilas.

**NARASI:**

> Kita mulai dari uangnya. Halaman Anggaran menampilkan APBD resmi Kota Bandung tahun 2023 sampai 2026 dari DJPK Kementerian Keuangan: totalnya, pembagian per bidang seperti pendidikan dan kesehatan, tren dari tahun ke tahun, dan berapa yang benar-benar terserap.
>
> Supaya mudah dibayangkan, angkanya juga kami terjemahkan menjadi *[baca angka di layar]* per warga per hari.
>
> Yang paling penting: **setiap angka punya sumber**. Ada nama sumbernya, tanggal diakses, dan tautannya, jadi siapa pun bisa mengecek ulang. Datanya juga bisa diunduh sebagai CSV.

---

## Bagian 4 — Demo: Peta dan detail proyek (1:35 – 2:15)

**[LAYAR]** Buka **Peta proyek**. Saring per kecamatan, klik satu pin proyek nyata, lalu buka halaman detailnya. Tunjukkan pagu, kode RUP, dan klik tautan ke SiRUP sebentar.

**NARASI:**

> Dari anggaran, kita turun ke proyek. Di peta ini ada paket pekerjaan konstruksi tahun 2025 yang kami kurasi langsung dari SiRUP. Warga bisa mencari dan menyaring per kecamatan, lalu memilih proyek di dekat rumahnya.
>
> Di halaman detail ada pagu, satuan kerja pelaksana, lokasi, dan kode RUP yang tersambung langsung ke halaman resminya di SiRUP. Kami tidak meminta warga percaya pada kami; kami menunjukkan sumber aslinya.

---

## Bagian 5 — Demo: Warga melapor dan mengonfirmasi (2:15 – 3:05)

**[LAYAR]** Tab **Warga demo**. Buka salah satu proyek yang namanya bertanda *(fiktif)*, tekan **Laporkan kondisi**, pilih jenis masalah, tulis singkat, unggah foto, kirim. Lalu tunjukkan tombol **Saya juga melihat** pada laporan warga lain, dan tombol **Teruskan ke LAPOR!**.

**NARASI:**

> Sekarang bagian yang membuat data ini hidup: suara warga.
>
> Warga yang melihat masalah cukup menekan "Laporkan kondisi", memilih jenis masalah, bercerita singkat, dan mengunggah foto. Foto dikompres di ponsel, dan data lokasi GPS di dalamnya dihapus sebelum dikirim, demi privasi pelapor.
>
> Warga lain yang melihat hal yang sama bisa menekan "Saya juga melihat". Semakin banyak konfirmasi, semakin kuat laporannya. Untuk mencegah spam, setiap akun dibatasi lima laporan sehari, dan aturan ini dijaga langsung di database.
>
> Dan Jejak Anggaran bukan pengganti LAPOR!, melainkan pelengkapnya. Dengan satu tombol, ringkasan laporan beserta konteks anggarannya siap dikirim ke kanal resmi pemerintah.
>
> *[Opsional, ucapkan cepat:]* Proyek bertanda fiktif ini adalah data demo; kami tidak pernah menempelkan laporan simulasi pada proyek nyata.

---

## Bagian 6 — Demo: Tindak lanjut yang terbuka (3:05 – 3:40)

**[LAYAR]** Tab **Admin juri**. Tunjukkan dashboard admin (jumlah per status, waktu respons, antrean prioritas). Ubah status satu laporan menjadi *Diverifikasi*. Kembali ke halaman proyek: riwayat status muncul. Tunjukkan juga tanda **Perlu perhatian** pada proyek demo.

**NARASI:**

> Laporan tidak berhenti sebagai keluhan. Admin memverifikasi dan menindaklanjutinya dari panel ini: diverifikasi, ditindaklanjuti, sampai selesai, atau ditolak dengan alasan yang jelas.
>
> Setiap perubahan status tercatat dan terlihat publik, lengkap dengan waktunya. Jadi warga tahu laporannya ditanggapi atau tidak.
>
> Jika proyek tercatat selesai tetapi menerima beberapa laporan kerusakan yang terverifikasi, sistem otomatis memberi tanda "perlu perhatian". Ini bukan tuduhan, hanya sinyal agar proyek itu diperhatikan.

---

## Bagian 7 — Demo: Rapor wilayah untuk jurnalis dan pegiat (3:40 – 4:05)

**[LAYAR]** Buka **Rapor**. Ganti *Per kecamatan* ke *Per dinas*, saring *Data nyata saja*, klik **Rapor (CSV)** dan **Cetak / PDF** sekilas.

**NARASI:**

> Untuk jurnalis dan organisasi pegiat transparansi, ada halaman Rapor: jumlah proyek, total pagu, laporan warga, dan rata-rata waktu respons, per kecamatan atau per dinas. Semuanya bisa diunduh sebagai CSV atau dicetak menjadi PDF untuk analisis lanjutan.

---

## Bagian 8 — Penutup: nilai dan langkah berikutnya (4:05 – 4:35)

**[LAYAR]** Kembali ke wajah Anda di kamera, atau Beranda dengan logo. Tampilkan alamat situs di layar.

**NARASI:**

> Jejak Anggaran kami bangun dengan prinsip sederhana: setiap angka punya sumber, jujur soal batas data, dan privasi warga dijaga. Desainnya dimulai dari layar ponsel, dengan bahasa yang mudah dipahami siapa saja.
>
> Langkah berikutnya, kami ingin menambah lebih banyak proyek nyata, melengkapi nilai kontrak dari LPSE, dan survei lapangan untuk lokasi yang lebih tepat.
>
> Karena transparansi bukan hanya membuka data, tetapi memastikan setiap rupiah bisa diikuti jejaknya sampai ke lapangan. Saya *[nama Anda]*, dan ini **Jejak Anggaran**. Terima kasih.

---

## Daftar periksa sebelum merekam

- [ ] Variabel `VITE_DATA_DEMO_ANGGARAN` di Vercel sudah `false` dan situs sudah di-redeploy (baris "Sumber: DJPK Kemenkeu" muncul di Beranda dan Anggaran).
- [ ] Migrasi batas laporan harian sudah diterapkan, dan akun warga demo belum mencapai kuota hari itu (kalau perlu, tolak laporan uji lama lewat panel admin).
- [ ] Laporan untuk demo dibuat pada proyek bertanda *(fiktif)*, bukan proyek nyata.
- [ ] Siapkan satu foto contoh di laptop/ponsel untuk diunggah saat demo lapor.
- [ ] Notifikasi laptop dimatikan, zoom browser 100–110%, jendela browser bersih (tanpa bookmark bar).
- [ ] Latih membaca narasi sekali dengan stopwatch. Jika lewat 4:45, pangkas Bagian 7 atau kalimat opsional di Bagian 5.
- [ ] Jangan tampilkan email/kata sandi akun di layar, dan jangan mengklaim fitur "real-time" atau "AI".
