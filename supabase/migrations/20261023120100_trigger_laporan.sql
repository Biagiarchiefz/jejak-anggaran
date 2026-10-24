-- Aturan laporan: demo hanya di proyek demo, transisi status yang sah,
-- dan audit trail otomatis ke riwayat_status.
-- Transisi harus sinkron dengan src/lib/statusLaporan.ts.

create function public.transisi_status_valid(
  lama public.status_laporan,
  baru public.status_laporan
)
returns boolean
language sql
immutable
as $$
  select case lama
    when 'diterima' then baru in ('diverifikasi', 'ditolak')
    when 'diverifikasi' then baru in ('ditindaklanjuti', 'ditolak')
    when 'ditindaklanjuti' then baru = 'selesai'
    else false
  end;
$$;

create function public.laporan_sebelum_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.is_demo and not exists (
    select 1 from public.proyek where id = new.proyek_id and is_demo
  ) then
    raise exception 'Laporan demo hanya boleh menempel ke proyek demo'
      using errcode = 'check_violation';
  end if;

  -- Laporan warga selalu mulai dari status 'diterima'.
  if not new.is_demo then
    new.status := 'diterima';
    new.catatan_status := null;
    new.created_at := now();
  end if;
  new.updated_at := new.created_at;
  return new;
end;
$$;

create trigger laporan_sebelum_insert
  before insert on public.laporan
  for each row execute function public.laporan_sebelum_insert();

create function public.laporan_setelah_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Riwayat laporan demo ditulis langsung oleh seed agar tanggalnya realistis.
  if not new.is_demo then
    insert into public.riwayat_status (laporan_id, status_lama, status_baru, diubah_oleh, catatan)
    values (new.id, null, new.status, null, 'Laporan diterima sistem');
  end if;
  return new;
end;
$$;

create trigger laporan_setelah_insert
  after insert on public.laporan
  for each row execute function public.laporan_setelah_insert();

create function public.laporan_sebelum_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    if not public.transisi_status_valid(old.status, new.status) then
      raise exception 'Perubahan status dari % ke % tidak diizinkan', old.status, new.status
        using errcode = 'check_violation';
    end if;
    new.updated_at := now();
  end if;
  return new;
end;
$$;

create trigger laporan_sebelum_update
  before update on public.laporan
  for each row execute function public.laporan_sebelum_update();

create function public.laporan_setelah_update_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.riwayat_status (laporan_id, status_lama, status_baru, diubah_oleh, catatan)
  values (new.id, old.status, new.status, (select auth.uid()), new.catatan_status);
  return new;
end;
$$;

create trigger laporan_setelah_update_status
  after update of status on public.laporan
  for each row
  when (old.status is distinct from new.status)
  execute function public.laporan_setelah_update_status();
