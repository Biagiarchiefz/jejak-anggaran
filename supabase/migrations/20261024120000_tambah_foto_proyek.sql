-- Foto lapangan proyek hasil kunjungan tim. Berkasnya disimpan di public/foto-proyek/.
-- Kosong (null) = kartu proyek menampilkan cuplikan peta lokasi sebagai gantinya.
alter table public.proyek
  add column foto_path text
  constraint proyek_foto_path_valid check (foto_path is null or foto_path like '/foto-proyek/%');
