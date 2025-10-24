// src/types/database.ts

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string;
          role: "student" | "company" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password: string;
          role: "student" | "company" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password?: string;
          role?: "student" | "company" | "admin";
          updated_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T];
export type Row<T extends keyof Database["public"]["Tables"]> = Tables<T>["Row"];
export type Insert<T extends keyof Database["public"]["Tables"]> = Tables<T>["Insert"];
export type Update<T extends keyof Database["public"]["Tables"]> = Tables<T>["Update"];
