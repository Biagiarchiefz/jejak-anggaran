-- Skema awal Jejak Anggaran: tipe enum, tabel inti, dan profil pengguna.

create type public.status_proyek as enum ('direncanakan', 'berjalan', 'selesai');
create type public.kategori_laporan as enum ('kerusakan', 'belum_dikerjakan', 'tidak_sesuai', 'lainnya');
create type public.status_laporan as enum ('diterima', 'diverifikasi', 'ditindaklanjuti', 'selesai', 'ditolak');
create type public.peran_pengguna as enum ('warga', 'admin');

-- Sumber data resmi (DJPK, SiRUP, LPSE, ...). Dirujuk oleh semua data resmi.
create table public.sumber_data (
  id bigint generated always as identity primary key,
  nama text not null,
  url text not null,
  diakses_pada date not null,
  unique (url, diakses_pada)
);

create table public.anggaran_daerah (
  id bigint generated always as identity primary key,
  tahun smallint not null check (tahun between 2000 and 2100),
  urusan text not null,
  anggaran bigint not null check (anggaran >= 0),
  realisasi bigint check (realisasi >= 0),
  sumber_id bigint not null references public.sumber_data (id),
  unique (tahun, urusan)
);

create table public.proyek (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  kode_rup text unique,
  nama_paket text not null,
  satker text not null,
  kecamatan text not null,
  kelurahan text,
  pagu bigint not null check (pagu >= 0),
  nilai_kontrak bigint check (nilai_kontrak >= 0),
  pelaksana text,
  tahun_anggaran smallint not null check (tahun_anggaran between 2000 and 2100),
  status_proyek public.status_proyek not null,
  lat double precision not null,
  lng double precision not null,
  sumber_rup_url text,
  sumber_lpse_url text,
  diakses_pada date,
  is_demo boolean not null default false,
  -- Data nyata wajib punya sumber dan tanggal akses.
  constraint proyek_sumber_wajib check (is_demo or (sumber_rup_url is not null and diakses_pada is not null))
);

create index proyek_kecamatan_idx on public.proyek (kecamatan);
create index proyek_status_idx on public.proyek (status_proyek);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nama_tampilan text,
  peran public.peran_pengguna not null default 'warga',
  created_at timestamptz not null default now()
);

-- Profil dibuat otomatis saat pengguna mendaftar. Peran selalu 'warga';
-- admin (simulasi instansi) diangkat manual lewat SQL.
create function public.buat_profil_pengguna_baru()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nama_tampilan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nama_tampilan', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger saat_pengguna_dibuat
  after insert on auth.users
  for each row execute function public.buat_profil_pengguna_baru();

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and peran = 'admin'
  );
$$;

create table public.laporan (
  id uuid primary key default gen_random_uuid(),
  proyek_id text not null references public.proyek (id) on delete cascade,
  pelapor_id uuid references auth.users (id) on delete set null,
  kategori public.kategori_laporan not null,
  deskripsi text not null check (char_length(deskripsi) between 20 and 1000),
  foto_path text,
  status public.status_laporan not null default 'diterima',
  catatan_status text check (char_length(catatan_status) <= 500),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Foto wajib untuk laporan warga sungguhan.
  constraint laporan_foto_wajib check (is_demo or foto_path is not null)
);

create index laporan_proyek_idx on public.laporan (proyek_id);
create index laporan_pelapor_idx on public.laporan (pelapor_id);
create index laporan_status_idx on public.laporan (status);

create table public.konfirmasi (
  laporan_id uuid not null references public.laporan (id) on delete cascade,
  warga_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (laporan_id, warga_id)
);

create index konfirmasi_warga_idx on public.konfirmasi (warga_id);

create table public.riwayat_status (
  id bigint generated always as identity primary key,
  laporan_id uuid not null references public.laporan (id) on delete cascade,
  status_lama public.status_laporan,
  status_baru public.status_laporan not null,
  -- Hanya terisi untuk perubahan oleh admin. Pelapor tidak pernah dicatat di sini.
  diubah_oleh uuid references auth.users (id) on delete set null,
  catatan text,
  created_at timestamptz not null default now()
);

create index riwayat_status_laporan_idx on public.riwayat_status (laporan_id, created_at);
