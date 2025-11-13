export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      jobs: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          company_id: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          company_id: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          company_id?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      job_categories: {
        Row: {
          id: number;
          job_id: number;
          category_id: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          job_id: number;
          category_id: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          job_id?: number;
          category_id?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "job_categories_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "job_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "company_types";
            referencedColumns: ["id"];
          }
        ];
      };
      companies: {
        Row: {
          background: string | null;
          created_at: string | null;
          description: string | null;
          email: string | null;
          employee_count: number | null;
          external_id: number | null;
          id: number;
          images: string[] | null;
          logo: string | null;
          name: string;
          phone: string | null;
          socials: Json | null;
          tech_stack: string[] | null;
          updated_at: string | null;
          website_url: string | null;
        };
        Insert: {
          background?: string | null;
          created_at?: string | null;
          description?: string | null;
          email?: string | null;
          employee_count?: number | null;
          external_id?: number | null;
          id?: number;
          images?: string[] | null;
          logo?: string | null;
          name: string;
          phone?: string | null;
          socials?: Json | null;
          tech_stack?: string[] | null;
          updated_at?: string | null;
          website_url?: string | null;
        };
        Update: {
          background?: string | null;
          created_at?: string | null;
          description?: string | null;
          email?: string | null;
          employee_count?: number | null;
          external_id?: number | null;
          id?: number;
          images?: string[] | null;
          logo?: string | null;
          name?: string;
          phone?: string | null;
          socials?: Json | null;
          tech_stack?: string[] | null;
          updated_at?: string | null;
          website_url?: string | null;
        };
        Relationships: [];
      };
      company_branches: {
        Row: {
          address: string | null;
          company_id: number | null;
          country_id: number | null;
          created_at: string | null;
          id: number;
          name: string;
          province_id: number | null;
          updated_at: string | null;
          ward_id: number | null;
        };
        Insert: {
          address?: string | null;
          company_id?: number | null;
          country_id?: number | null;
          created_at?: string | null;
          id?: number;
          name: string;
          province_id?: number | null;
          updated_at?: string | null;
          ward_id?: number | null;
        };
        Update: {
          address?: string | null;
          company_id?: number | null;
          country_id?: number | null;
          created_at?: string | null;
          id?: number;
          name?: string;
          province_id?: number | null;
          updated_at?: string | null;
          ward_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "company_branches_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_branches_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_branches_province_id_fkey";
            columns: ["province_id"];
            isOneToOne: false;
            referencedRelation: "provinces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_branches_ward_id_fkey";
            columns: ["ward_id"];
            isOneToOne: false;
            referencedRelation: "wards";
            referencedColumns: ["id"];
          }
        ];
      };
      company_company_types: {
        Row: {
          company_id: number;
          company_type_id: number;
        };
        Insert: {
          company_id: number;
          company_type_id: number;
        };
        Update: {
          company_id?: number;
          company_type_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "company_company_types_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_company_types_company_type_id_fkey";
            columns: ["company_type_id"];
            isOneToOne: false;
            referencedRelation: "company_types";
            referencedColumns: ["id"];
          }
        ];
      };
      company_types: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      countries: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      provinces: {
        Row: {
          country_id: number | null;
          created_at: string | null;
          id: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          country_id?: number | null;
          created_at?: string | null;
          id?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          country_id?: number | null;
          created_at?: string | null;
          id?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "provinces_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar: string | null;
          created_at: string | null;
          email: string;
          first_name: string;
          is_verified: boolean | null;
          last_name: string;
          password: string;
          role: string;
          updated_at: string | null;
          user_id: number;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string | null;
          email: string;
          first_name: string;
          is_verified?: boolean | null;
          last_name: string;
          password: string;
          role: string;
          updated_at?: string | null;
          user_id?: number;
        };
        Update: {
          avatar?: string | null;
          created_at?: string | null;
          email?: string;
          first_name?: string;
          is_verified?: boolean | null;
          last_name?: string;
          password?: string;
          role?: string;
          updated_at?: string | null;
          user_id?: number;
        };
        Relationships: [];
      };
      wards: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
          province_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
          province_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
          province_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "wards_province_id_fkey";
            columns: ["province_id"];
            isOneToOne: false;
            referencedRelation: "provinces";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      Role: "student" | "employer" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
