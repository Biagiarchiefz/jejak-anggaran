export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      anggaran_daerah: {
        Row: {
          anggaran: number
          id: number
          realisasi: number | null
          sumber_id: number
          tahun: number
          urusan: string
        }
        Insert: {
          anggaran: number
          id?: never
          realisasi?: number | null
          sumber_id: number
          tahun: number
          urusan: string
        }
        Update: {
          anggaran?: number
          id?: never
          realisasi?: number | null
          sumber_id?: number
          tahun?: number
          urusan?: string
        }
        Relationships: [
          {
            foreignKeyName: "anggaran_daerah_sumber_id_fkey"
            columns: ["sumber_id"]
            isOneToOne: false
            referencedRelation: "sumber_data"
            referencedColumns: ["id"]
          },
        ]
      }
      konfirmasi: {
        Row: {
          created_at: string
          laporan_id: string
          warga_id: string
        }
        Insert: {
          created_at?: string
          laporan_id: string
          warga_id: string
        }
        Update: {
          created_at?: string
          laporan_id?: string
          warga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "konfirmasi_laporan_id_fkey"
            columns: ["laporan_id"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "konfirmasi_laporan_id_fkey"
            columns: ["laporan_id"]
            isOneToOne: false
            referencedRelation: "v_laporan_publik"
            referencedColumns: ["id"]
          },
        ]
      }
      laporan: {
        Row: {
          catatan_status: string | null
          created_at: string
          deskripsi: string
          foto_path: string | null
          id: string
          is_demo: boolean
          kategori: Database["public"]["Enums"]["kategori_laporan"]
          pelapor_id: string | null
          proyek_id: string
          status: Database["public"]["Enums"]["status_laporan"]
          updated_at: string
        }
        Insert: {
          catatan_status?: string | null
          created_at?: string
          deskripsi: string
          foto_path?: string | null
          id?: string
          is_demo?: boolean
          kategori: Database["public"]["Enums"]["kategori_laporan"]
          pelapor_id?: string | null
          proyek_id: string
          status?: Database["public"]["Enums"]["status_laporan"]
          updated_at?: string
        }
        Update: {
          catatan_status?: string | null
          created_at?: string
          deskripsi?: string
          foto_path?: string | null
          id?: string
          is_demo?: boolean
          kategori?: Database["public"]["Enums"]["kategori_laporan"]
          pelapor_id?: string | null
          proyek_id?: string
          status?: Database["public"]["Enums"]["status_laporan"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "laporan_proyek_id_fkey"
            columns: ["proyek_id"]
            isOneToOne: false
            referencedRelation: "proyek"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laporan_proyek_id_fkey"
            columns: ["proyek_id"]
            isOneToOne: false
            referencedRelation: "v_red_flag_proyek"
            referencedColumns: ["proyek_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nama_tampilan: string | null
          peran: Database["public"]["Enums"]["peran_pengguna"]
        }
        Insert: {
          created_at?: string
          id: string
          nama_tampilan?: string | null
          peran?: Database["public"]["Enums"]["peran_pengguna"]
        }
        Update: {
          created_at?: string
          id?: string
          nama_tampilan?: string | null
          peran?: Database["public"]["Enums"]["peran_pengguna"]
        }
        Relationships: []
      }
      proyek: {
        Row: {
          diakses_pada: string | null
          foto_path: string | null
          id: string
          is_demo: boolean
          kecamatan: string
          kelurahan: string | null
          kode_rup: string | null
          lat: number
          lng: number
          nama_paket: string
          nilai_kontrak: number | null
          pagu: number
          pelaksana: string | null
          satker: string
          status_proyek: Database["public"]["Enums"]["status_proyek"]
          sumber_lpse_url: string | null
          sumber_rup_url: string | null
          tahun_anggaran: number
        }
        Insert: {
          diakses_pada?: string | null
          foto_path?: string | null
          id: string
          is_demo?: boolean
          kecamatan: string
          kelurahan?: string | null
          kode_rup?: string | null
          lat: number
          lng: number
          nama_paket: string
          nilai_kontrak?: number | null
          pagu: number
          pelaksana?: string | null
          satker: string
          status_proyek: Database["public"]["Enums"]["status_proyek"]
          sumber_lpse_url?: string | null
          sumber_rup_url?: string | null
          tahun_anggaran: number
        }
        Update: {
          diakses_pada?: string | null
          foto_path?: string | null
          id?: string
          is_demo?: boolean
          kecamatan?: string
          kelurahan?: string | null
          kode_rup?: string | null
          lat?: number
          lng?: number
          nama_paket?: string
          nilai_kontrak?: number | null
          pagu?: number
          pelaksana?: string | null
          satker?: string
          status_proyek?: Database["public"]["Enums"]["status_proyek"]
          sumber_lpse_url?: string | null
          sumber_rup_url?: string | null
          tahun_anggaran?: number
        }
        Relationships: []
      }
      riwayat_status: {
        Row: {
          catatan: string | null
          created_at: string
          diubah_oleh: string | null
          id: number
          laporan_id: string
          oleh_admin: boolean
          status_baru: Database["public"]["Enums"]["status_laporan"]
          status_lama: Database["public"]["Enums"]["status_laporan"] | null
        }
        Insert: {
          catatan?: string | null
          created_at?: string
          diubah_oleh?: string | null
          id?: never
          laporan_id: string
          oleh_admin?: never
          status_baru: Database["public"]["Enums"]["status_laporan"]
          status_lama?: Database["public"]["Enums"]["status_laporan"] | null
        }
        Update: {
          catatan?: string | null
          created_at?: string
          diubah_oleh?: string | null
          id?: never
          laporan_id?: string
          oleh_admin?: never
          status_baru?: Database["public"]["Enums"]["status_laporan"]
          status_lama?: Database["public"]["Enums"]["status_laporan"] | null
        }
        Relationships: [
          {
            foreignKeyName: "riwayat_status_laporan_id_fkey"
            columns: ["laporan_id"]
            isOneToOne: false
            referencedRelation: "laporan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "riwayat_status_laporan_id_fkey"
            columns: ["laporan_id"]
            isOneToOne: false
            referencedRelation: "v_laporan_publik"
            referencedColumns: ["id"]
          },
        ]
      }
      sumber_data: {
        Row: {
          diakses_pada: string
          id: number
          nama: string
          url: string
        }
        Insert: {
          diakses_pada: string
          id?: never
          nama: string
          url: string
        }
        Update: {
          diakses_pada?: string
          id?: never
          nama?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_laporan_publik: {
        Row: {
          catatan_status: string | null
          created_at: string | null
          deskripsi: string | null
          foto_path: string | null
          id: string | null
          is_demo: boolean | null
          jumlah_konfirmasi: number | null
          kategori: Database["public"]["Enums"]["kategori_laporan"] | null
          proyek_id: string | null
          status: Database["public"]["Enums"]["status_laporan"] | null
          updated_at: string | null
        }
        Insert: {
          catatan_status?: string | null
          created_at?: string | null
          deskripsi?: string | null
          foto_path?: string | null
          id?: string | null
          is_demo?: boolean | null
          jumlah_konfirmasi?: never
          kategori?: Database["public"]["Enums"]["kategori_laporan"] | null
          proyek_id?: string | null
          status?: Database["public"]["Enums"]["status_laporan"] | null
          updated_at?: string | null
        }
        Update: {
          catatan_status?: string | null
          created_at?: string | null
          deskripsi?: string | null
          foto_path?: string | null
          id?: string | null
          is_demo?: boolean | null
          jumlah_konfirmasi?: never
          kategori?: Database["public"]["Enums"]["kategori_laporan"] | null
          proyek_id?: string | null
          status?: Database["public"]["Enums"]["status_laporan"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "laporan_proyek_id_fkey"
            columns: ["proyek_id"]
            isOneToOne: false
            referencedRelation: "proyek"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laporan_proyek_id_fkey"
            columns: ["proyek_id"]
            isOneToOne: false
            referencedRelation: "v_red_flag_proyek"
            referencedColumns: ["proyek_id"]
          },
        ]
      }
      v_red_flag_proyek: {
        Row: {
          alasan: string | null
          jumlah_laporan: number | null
          proyek_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      adalah_pelapor: { Args: { id_laporan: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_admin_demo: { Args: never; Returns: boolean }
      laporan_bisa_dikonfirmasi: {
        Args: { id_laporan: string }
        Returns: boolean
      }
      transisi_status_valid: {
        Args: {
          baru: Database["public"]["Enums"]["status_laporan"]
          lama: Database["public"]["Enums"]["status_laporan"]
        }
        Returns: boolean
      }
    }
    Enums: {
      kategori_laporan:
        | "kerusakan"
        | "belum_dikerjakan"
        | "tidak_sesuai"
        | "lainnya"
      peran_pengguna: "warga" | "admin" | "admin_demo"
      status_laporan:
        | "diterima"
        | "diverifikasi"
        | "ditindaklanjuti"
        | "selesai"
        | "ditolak"
      status_proyek: "direncanakan" | "berjalan" | "selesai"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      kategori_laporan: [
        "kerusakan",
        "belum_dikerjakan",
        "tidak_sesuai",
        "lainnya",
      ],
      peran_pengguna: ["warga", "admin", "admin_demo"],
      status_laporan: [
        "diterima",
        "diverifikasi",
        "ditindaklanjuti",
        "selesai",
        "ditolak",
      ],
      status_proyek: ["direncanakan", "berjalan", "selesai"],
    },
  },
} as const
