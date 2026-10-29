-- Admin demo boleh membaca dan mengubah status laporan demo saja.
-- Laporan warga sungguhan tetap hanya bisa diubah peran 'admin' (is_admin()).
-- Harus sinkron dengan bisaUbahLaporan() di src/utils/peran.ts.

create function public.is_admin_demo()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and peran = 'admin_demo'
  );
$$;

-- UPDATE ... WHERE id = … juga memerlukan izin SELECT atas baris yang sama.
create policy "laporan_baca_admin_demo" on public.laporan
  for select to authenticated
  using (is_demo and (select public.is_admin_demo()));

create policy "laporan_ubah_status_admin_demo" on public.laporan
  for update to authenticated
  using (is_demo and (select public.is_admin_demo()))
  with check (is_demo and (select public.is_admin_demo()));
