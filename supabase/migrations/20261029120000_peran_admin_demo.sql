-- Peran admin demo untuk juri/pengunjung lomba. Kredensialnya dibagikan terbuka,
-- jadi aksesnya dibatasi ke laporan demo (lihat migrasi berikutnya).
-- Dipisah dari migrasi yang memakainya: nilai enum baru belum boleh dipakai
-- di transaksi yang sama dengan penambahannya.
alter type public.peran_pengguna add value if not exists 'admin_demo';
