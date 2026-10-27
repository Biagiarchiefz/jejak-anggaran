import {
  Building2,
  Bus,
  Coins,
  Construction,
  GraduationCap,
  HeartPulse,
  House,
  Leaf,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'

/** Ikon garis (lucide) untuk setiap urusan APBD, dicocokkan lewat kata kunci nama urusan. */
const IKON: { cocok: RegExp; ikon: LucideIcon }[] = [
  { cocok: /pendidikan/i, ikon: GraduationCap },
  { cocok: /kesehatan/i, ikon: HeartPulse },
  { cocok: /pemerintahan/i, ikon: Building2 },
  { cocok: /pekerjaan umum/i, ikon: Construction },
  { cocok: /perumahan|permukiman/i, ikon: House },
  { cocok: /lingkungan/i, ikon: Leaf },
  { cocok: /perhubungan/i, ikon: Bus },
  { cocok: /ketertiban|ketenteraman/i, ikon: ShieldCheck },
  { cocok: /sosial/i, ikon: UsersRound },
]

export function IkonUrusan({ urusan, className }: { urusan: string; className?: string }) {
  const Ikon = IKON.find((i) => i.cocok.test(urusan))?.ikon ?? Coins
  return <Ikon className={className} strokeWidth={1.5} aria-hidden />
}
