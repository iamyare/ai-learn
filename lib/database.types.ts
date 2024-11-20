export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          gemini_key: string | null
          id: string
          user_id: string
        }
        Insert: {
          gemini_key?: string | null
          id?: string
          user_id: string
        }
        Update: {
          gemini_key?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          content: Json | null
          created_at: string
          message_id: string
          sender_type: string
        }
        Insert: {
          chat_id?: string
          content?: Json | null
          created_at?: string
          message_id?: string
          sender_type?: string
        }
        Update: {
          chat_id?: string
          content?: Json | null
          created_at?: string
          message_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["chat_id"]
          },
        ]
      }
      chats: {
        Row: {
          chat_id: string
          content: Json | null
          created_at: string
          notebook_id: string
          title: string | null
        }
        Insert: {
          chat_id?: string
          content?: Json | null
          created_at?: string
          notebook_id: string
          title?: string | null
        }
        Update: {
          chat_id?: string
          content?: Json | null
          created_at?: string
          notebook_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: true
            referencedRelation: "notebooks"
            referencedColumns: ["notebook_id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string
          folder_color: string | null
          folder_icon: string | null
          folder_id: string
          folder_name: string
          parent_folder_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          folder_color?: string | null
          folder_icon?: string | null
          folder_id?: string
          folder_name: string
          parent_folder_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          folder_color?: string | null
          folder_icon?: string | null
          folder_id?: string
          folder_name?: string
          parent_folder_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_id_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["folder_id"]
          },
        ]
      }
      notebooks: {
        Row: {
          created_at: string
          folder_id: string | null
          notebook_id: string
          notebook_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          folder_id?: string | null
          notebook_id?: string
          notebook_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          folder_id?: string | null
          notebook_id?: string
          notebook_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notebooks_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["folder_id"]
          },
          {
            foreignKeyName: "notebooks_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_documents: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: string
          notebook_id: string
          pdf_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: string
          notebook_id: string
          pdf_id?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: string
          notebook_id?: string
          pdf_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_documents_id_notebook_fkey"
            columns: ["notebook_id"]
            isOneToOne: true
            referencedRelation: "notebooks"
            referencedColumns: ["notebook_id"]
          },
        ]
      }
      tbl_folders: {
        Row: {
          created_at: string
          folder_name: string
          id: string
          id_user: string
        }
        Insert: {
          created_at?: string
          folder_name: string
          id?: string
          id_user: string
        }
        Update: {
          created_at?: string
          folder_name?: string
          id?: string
          id_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "tbl_folders_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transcriptions: {
        Row: {
          content: Json
          created_at: string
          id: string
          notebook_id: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          notebook_id: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          notebook_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcriptions_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: true
            referencedRelation: "notebooks"
            referencedColumns: ["notebook_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_username: {
        Args: {
          p_username: string
          p_email: string
        }
        Returns: string
      }
      get_folders: {
        Args: {
          p_user_id: string
          p_parent_folder_id?: string
        }
        Returns: {
          folder_id: string
          folder_name: string
          parent_folder_id: string
          folder_icon: string
          folder_color: string
          subfolder_count: number
          notebook_count: number
        }[]
      }
      get_folders_and_notebooks: {
        Args: {
          p_user_id: string
          p_parent_folder_id?: string
        }
        Returns: {
          item_id: string
          item_name: string
          item_type: string
          parent_folder_id: string
          icon: string
          color: string
          subfolder_count: number
          notebook_count: number
          created_at: string
          updated_at: string
        }[]
      }
      search_by_name: {
        Args: {
          search_text: string
        }
        Returns: {
          id: string
          name: string
          type: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
