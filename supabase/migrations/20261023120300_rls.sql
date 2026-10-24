-- Row Level Security. Lihat tabel "Aturan akses" di Architecture.md.

alter table public.sumber_data enable row level security;
alter table public.anggaran_daerah enable row level security;
alter table public.proyek enable row level security;
alter table public.profiles enable row level security;
alter table public.laporan enable row level security;
alter table public.konfirmasi enable row level security;
alter table public.riwayat_status enable row level security;

-- Data resmi: baca publik, tulis hanya lewat migrasi/seed.
create policy "sumber_data_baca_publik" on public.sumber_data
  for select to anon, authenticated using (true);
create policy "anggaran_daerah_baca_publik" on public.anggaran_daerah
  for select to anon, authenticated using (true);
create policy "proyek_baca_publik" on public.proyek
  for select to anon, authenticated using (true);
create policy "riwayat_status_baca_publik" on public.riwayat_status
  for select to anon, authenticated using (true);

revoke insert, update, delete, truncate on public.sumber_data, public.anggaran_daerah,
  public.proyek, public.riwayat_status from anon, authenticated;

-- Profil: hanya pemiliknya yang bisa membaca. Peran tidak bisa diubah sendiri.
create policy "profiles_baca_sendiri" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles_ubah_sendiri" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke insert, update, delete, truncate on public.profiles from anon, authenticated;
grant update (nama_tampilan) on public.profiles to authenticated;

-- Laporan: publik membaca lewat v_laporan_publik. Tabel aslinya hanya
-- terbaca oleh pelapornya sendiri dan admin.
create policy "laporan_baca_sendiri_atau_admin" on public.laporan
  for select to authenticated
  using (pelapor_id = (select auth.uid()) or (select public.is_admin()));

create policy "laporan_insert_warga" on public.laporan
  for insert to authenticated
  with check (
    pelapor_id = (select auth.uid())
    and is_demo = false
    and foto_path like (select auth.uid())::text || '/%'
  );

create policy "laporan_ubah_status_admin" on public.laporan
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

revoke insert, update, delete, truncate on public.laporan from anon, authenticated;
grant insert (proyek_id, pelapor_id, kategori, deskripsi, foto_path) on public.laporan to authenticated;
grant update (status, catatan_status) on public.laporan to authenticated;

-- Konfirmasi: satu warga satu konfirmasi (primary key), bukan pelapor laporannya.
create function public.adalah_pelapor(id_laporan uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.laporan
    where id = id_laporan and pelapor_id = (select auth.uid())
  );
$$;

create policy "konfirmasi_baca_sendiri" on public.konfirmasi
  for select to authenticated using (warga_id = (select auth.uid()));

create policy "konfirmasi_insert_warga" on public.konfirmasi
  for insert to authenticated
  with check (
    warga_id = (select auth.uid())
    and not public.adalah_pelapor(laporan_id)
  );

revoke update, delete, truncate on public.konfirmasi from anon, authenticated;
revoke insert on public.konfirmasi from anon;

-- View publik: hanya baca.
revoke insert, update, delete, truncate on public.v_laporan_publik, public.v_red_flag_proyek
  from anon, authenticated;
grant select on public.v_laporan_publik, public.v_red_flag_proyek to anon, authenticated;
