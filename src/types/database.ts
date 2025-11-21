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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          background: string | null
          created_at: string | null
          description: string | null
          email: string | null
          employee_count: number | null
          external_id: number | null
          id: number
          images: string[] | null
          is_verified: boolean | null
          logo: string | null
          name: string
          phone: string | null
          socials: Json | null
          tech_stack: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          background?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          employee_count?: number | null
          external_id?: number | null
          id?: number
          images?: string[] | null
          is_verified?: boolean | null
          logo?: string | null
          name: string
          phone?: string | null
          socials?: Json | null
          tech_stack?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          background?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          employee_count?: number | null
          external_id?: number | null
          id?: number
          images?: string[] | null
          is_verified?: boolean | null
          logo?: string | null
          name?: string
          phone?: string | null
          socials?: Json | null
          tech_stack?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      company_branches: {
        Row: {
          address: string | null
          company_id: number | null
          country_id: number | null
          created_at: string | null
          district_id: number | null
          id: number
          name: string
          province_id: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_id?: number | null
          country_id?: number | null
          created_at?: string | null
          district_id?: number | null
          id?: number
          name: string
          province_id?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_id?: number | null
          country_id?: number | null
          created_at?: string | null
          district_id?: number | null
          id?: number
          name?: string
          province_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_branches_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_branches_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_branches_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      company_company_types: {
        Row: {
          company_id: number
          company_type_id: number
        }
        Insert: {
          company_id: number
          company_type_id: number
        }
        Update: {
          company_id?: number
          company_type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_company_types_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_company_types_company_type_id_fkey"
            columns: ["company_type_id"]
            isOneToOne: false
            referencedRelation: "company_types"
            referencedColumns: ["id"]
          },
        ]
      }
      company_types: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      districts: {
        Row: {
          created_at: string | null
          id: number
          name: string
          province_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          province_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          province_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "districts_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      employment_types: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_categories: {
        Row: {
          category_id: number
          job_id: number
        }
        Insert: {
          category_id: number
          job_id: number
        }
        Update: {
          category_id?: number
          job_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_categories_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_employment_types: {
        Row: {
          employment_type_id: number
          job_id: number
        }
        Insert: {
          employment_type_id: number
          job_id: number
        }
        Update: {
          employment_type_id?: number
          job_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_employment_types_employment_type_id_fkey"
            columns: ["employment_type_id"]
            isOneToOne: false
            referencedRelation: "employment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_employment_types_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_levels: {
        Row: {
          job_id: number
          level_id: number
        }
        Insert: {
          job_id: number
          level_id: number
        }
        Update: {
          job_id?: number
          level_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_levels_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_levels_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      job_media: {
        Row: {
          id: number
          job_id: number | null
          link: string | null
          type: string | null
        }
        Insert: {
          id?: never
          job_id?: number | null
          link?: string | null
          type?: string | null
        }
        Update: {
          id?: never
          job_id?: number | null
          link?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_media_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_skills: {
        Row: {
          job_id: number
          skill_id: number
        }
        Insert: {
          job_id: number
          skill_id: number
        }
        Update: {
          job_id?: number
          skill_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          apply_guide: string | null
          apply_reasons: string[] | null
          benefit: Json | null
          company_branches_id: number | null
          company_id: number | null
          created_at: string | null
          description: string | null
          external_id: number | null
          id: number
          is_diamond: boolean | null
          is_hot: boolean | null
          is_job_flash_active: boolean | null
          job_deadline: string | null
          job_posted_at: string | null
          nice_to_haves: string[] | null
          requirement: string[] | null
          responsibilities: string[] | null
          salary_currency: string | null
          salary_from: number | null
          salary_text: string | null
          salary_to: number | null
          status: string | null
          title: string
          updated_at: string | null
          website_url: string | null
          working_time: string | null
        }
        Insert: {
          apply_guide?: string | null
          apply_reasons?: string[] | null
          benefit?: Json | null
          company_branches_id?: number | null
          company_id?: number | null
          created_at?: string | null
          description?: string | null
          external_id?: number | null
          id?: never
          is_diamond?: boolean | null
          is_hot?: boolean | null
          is_job_flash_active?: boolean | null
          job_deadline?: string | null
          job_posted_at?: string | null
          nice_to_haves?: string[] | null
          requirement?: string[] | null
          responsibilities?: string[] | null
          salary_currency?: string | null
          salary_from?: number | null
          salary_text?: string | null
          salary_to?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          website_url?: string | null
          working_time?: string | null
        }
        Update: {
          apply_guide?: string | null
          apply_reasons?: string[] | null
          benefit?: Json | null
          company_branches_id?: number | null
          company_id?: number | null
          created_at?: string | null
          description?: string | null
          external_id?: number | null
          id?: never
          is_diamond?: boolean | null
          is_hot?: boolean | null
          is_job_flash_active?: boolean | null
          job_deadline?: string | null
          job_posted_at?: string | null
          nice_to_haves?: string[] | null
          requirement?: string[] | null
          responsibilities?: string[] | null
          salary_currency?: string | null
          salary_from?: number | null
          salary_text?: string | null
          salary_to?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          website_url?: string | null
          working_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_branches_id_fkey"
            columns: ["company_branches_id"]
            isOneToOne: false
            referencedRelation: "company_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      provinces: {
        Row: {
          country_id: number | null
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          country_id?: number | null
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          country_id?: number | null
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provinces_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          first_name: string
          is_verified: boolean | null
          last_name: string
          password: string
          role: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          first_name: string
          is_verified?: boolean | null
          last_name: string
          password: string
          role: string
          updated_at?: string | null
          user_id?: number
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          is_verified?: boolean | null
          last_name?: string
          password?: string
          role?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      wards: {
        Row: {
          created_at: string | null
          id: number
          name: string
          province_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          province_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          province_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wards_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      jobstatus: "Pending" | "Approved" | "Rejected" | "Expired"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      jobstatus: ["Pending", "Approved", "Rejected", "Expired"],
    },
  },
} as const
