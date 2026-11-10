import {
  Building2,
  Bus,
  Coins,
  Construction,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  Leaf,
  ShieldCheck,
  Store,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'

/** Ikon garis (lucide) untuk setiap bidang APBD (nama fungsi DJPK atau urusan), dicocokkan lewat kata kunci nama urusan. */
const IKON: { cocok: RegExp; ikon: LucideIcon }[] = [
  { cocok: /pendidikan/i, ikon: GraduationCap },
  { cocok: /kesehatan/i, ikon: HeartPulse },
  { cocok: /pemerintahan|pelayanan umum/i, ikon: Building2 },
  { cocok: /pekerjaan umum/i, ikon: Construction },
  { cocok: /perumahan|permukiman/i, ikon: House },
  { cocok: /lingkungan/i, ikon: Leaf },
  { cocok: /perhubungan/i, ikon: Bus },
  { cocok: /ketertiban|ketenteraman|keamanan/i, ikon: ShieldCheck },
  { cocok: /sosial/i, ikon: UsersRound },
  { cocok: /ekonomi/i, ikon: Store },
  { cocok: /pariwisata|budaya/i, ikon: Landmark },
]

export function IkonUrusan({ urusan, className }: { urusan: string; className?: string }) {
  const Ikon = IKON.find((i) => i.cocok.test(urusan))?.ikon ?? Coins
  return <Ikon className={className} strokeWidth={1.5} aria-hidden />
}
